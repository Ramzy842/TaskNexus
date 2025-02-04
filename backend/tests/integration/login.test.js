const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../../models/User");
const app = require("../../app");
const Task = require("../../models/Task");
const api = supertest(app);

beforeAll(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
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
