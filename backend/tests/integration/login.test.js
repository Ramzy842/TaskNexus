const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../../models/User");
const app = require("../../app");
const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
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

test("Returns 401 with 'Invalid email or password.' if user doesn't exist", async () => {
    let res = await api
        .post("/api/login")
        .send({ password: "password123456789", email: "johnDoes@gmail.com" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
});
test("Returns 400 with 'This email is registered with Google...' if user has googleId", async () => {
    let res = await api
        .post("/api/login")
        .send({ email: "ada@gmail.com", password: "password123456789" });
    console.log(res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
        `This email is registered with Google. Please use 'Log in with Google'.`
    );
});
test("Returns 401 with 'Invalid email or password.' if password is incorrect", async () => {
    let res = await api
        .post("/api/login")
        .send({ password: "anotherpassword", email: "johnDoes@gmail.com" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
});
test("Returns 200 with a valid JWT and user data if user logs in successfully", async () => {
    let res = await api
        .post("/api/login")
        .send({ password: "password123456789", email: "johnDoe@gmail.com" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");
});

afterAll(async () => {
    await User.deleteMany({})
    await mongoose.connection.close();
});
