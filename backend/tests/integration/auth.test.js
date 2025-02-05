const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../../models/User");
const app = require("../../app");
const Task = require("../../models/Task");
const api = supertest(app);
const jwt = require("jsonwebtoken");
const { createUser } = require("../../utils/users");

beforeAll(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await Task.collection.drop();
    await User.collection.drop();
    await mongoose.disconnect();
    await mongoose.connection.close();
    const testDB_name = `test_db_${Date.now()}`;
    const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.qztos.mongodb.net/${testDB_name}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    await api.post("/api/users").send({
        username: "John",
        name: "John Doe",
        password: "password123456789",
        email: "johnDoe@gmail.com",
    });
    const newUser = new User({
        username: "Ada",
        name: "Lovelace",
        email: "ada@gmail.com",
        googleId: "googleIdN01",
    });
    await newUser.save();
});

afterEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await Task.collection.drop();
    await User.collection.drop();
});

afterAll(async () => {
    
    await mongoose.disconnect();
    await mongoose.connection.close();
});

test("Returns 401 with 'Invalid email or password.' if user doesn't exist", async () => {
    let res = await api
        .post("/api/auth/login")
        .send({ password: "password123456789", email: "johnDoes@gmail.com" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
});
test("Returns 400 with 'This email is registered with Google...' if user has googleId", async () => {
    let res = await api
        .post("/api/auth/login")
        .send({ email: "ada@gmail.com", password: "password123456789" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
        `This email is registered with Google. Please use 'Log in with Google'.`
    );
});
test("Returns 401 with 'Invalid email or password.' if password is incorrect", async () => {
    let res = await api
        .post("/api/auth/login")
        .send({ password: "anotherpassword", email: "johnDoes@gmail.com" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
});
test("Returns 200 with a valid JWT and user data if user logs in successfully", async () => {
    let res = await api
        .post("/api/auth/login")
        .send({ password: "password123456789", email: "johnDoe@gmail.com" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");
});

// Refresh Token tests

describe("POST /api/auth/login/refresh", () => {
    let loggedUser = null;
    beforeEach(async () => {
        loggedUser = await api.post("/api/auth/login").send({
            password: "password123456789",
            email: "johnDoe@gmail.com",
        });
    });
    test("Returns status 200 and access token when a valid refresh token is provided", async () => {
        let res = await api
            .post("/api/auth/login/refresh")
            .set("Cookie", `refreshToken=${loggedUser.body.data.refreshToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBeTruthy();
        expect(res.body).toHaveProperty("accessToken");
    });
    test("Returns status 401 and 'Missing refresh token.' when a refresh token is missing", async () => {
        let res = await api.post("/api/auth/login/refresh");
        expect(res.status).toBe(401);
        expect(res.body.success).toBeFalsy();
        expect(res.body).toHaveProperty("message", "Missing refresh token.");
    });
    test("Returns status 401 and 'Token expired.' when a refresh token is expired", async () => {
        const payload = {
            username: loggedUser.body.data.user.username,
            email: loggedUser.body.data.user.email,
            id: loggedUser.body.data.user.id,
        };
        const expiredToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
            expiresIn: "1s",
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let user = await createUser(
            loggedUser.body.data.user.username,
            "test",
            loggedUser.body.data.user.email,
            "testPass"
        );
        user.refreshToken = expiredToken;
        await user.save();
        let res = await api
            .post("/api/auth/login/refresh")
            .set("Cookie", `refreshToken=${expiredToken}`);
        expect(res.status).toBe(401);
        expect(res.body.success).toBeFalsy();
        expect(res.body).toHaveProperty("error", "Token expired");
    });
    test("Returns status 403 and 'Invalid refresh token.' when refresh token is blacklisted or not linked to a valid user", async () => {
        await api
            .post("/api/auth/logout")
            .set("Cookie", `refreshToken=${loggedUser.body.data.refreshToken}`);
        let test = await api
            .post("/api/auth/login/refresh")
            .set("Cookie", `refreshToken=${loggedUser.body.data.refreshToken}`);
        expect(test.status).toBe(403);
        expect(test.body.success).toBeFalsy();
        expect(test.body.message).toBe("Invalid refresh token.");
    });
});

// Logout Tests

// describe("POST /api/auth/logout", () => {
//     test("Returns status 200 when user successfully logs out with a valid refresh token", async () => {});
//     test("Returns status 200 when user successfully logs out and ensures refreshToken is blacklisted and removed", async () => {});
//     test("Returns status 401 and 'Missing refresh token.' when a refresh token is missing", async () => {});
//     test("Returns status 403 and 'Invalid refresh token.' when logging out with an already blacklisted refresh token", async () => {});
//     test("Returns status 403 and 'Invalid refresh token.' when refresh token is not associated with any user", async () => {});
//     test("Returns status 401 and 'Token expired.' when a refresh token is expired", async () => {});
//     test("Clears refreshToken cookie upon logout", async () => {});
// });
