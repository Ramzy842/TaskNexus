const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");
const { messages } = require("../../utils/usersValidators");
const User = require("../../models/User");
const Task = require("../../models/Task");
const { responseMessages } = require("../../utils/responseMessages");
const api = supertest(app);

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

describe("POST /api/users", () => {
    let expectedMessages;
    test("Returns status 400 and validation errors upon missing body properties", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            email: "email@gmail.com",
        });
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expectedMessages = [
            messages.nameRequired,
            messages.invalidName,
            messages.inaccurateNameLength,
            messages.passwordRequired,
            messages.invalidPassword,
            messages.inaccuratePasswordLength,
        ];
        expect(res.body.errors).toHaveLength(expectedMessages.length);
        expect(res.body.errors).toEqual(
            expect.arrayContaining(expectedMessages)
        );
    });
    test("Returns status 400 and all validation errors when body is empty", async () => {
        res = await api.post("/api/users").send({});
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expectedMessages = [...Object.values(messages)];
        expect(res.body.errors).toHaveLength(expectedMessages.length);
        expect(res.body.errors).toEqual(
            expect.arrayContaining(expectedMessages)
        );
    });
    test("Returns status 400 and error message when email format is invalid", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email.com",
            password: "password123456789",
        });
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.invalidEmail]);
    });
    test("Returns status 400 and error message when password length is shorter than 12 characters", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password",
        });
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.inaccuratePasswordLength]);
    });
    test("Returns status 400 and error message when password length is more than 24 characters", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password123456789123456789",
        });
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.inaccuratePasswordLength]);
    });
    test("Returns status 201 when password length is between 12 and 24 characters", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email_random@gmail.com",
            password: "password123456",
        });
        expect(res.body.statusCode).toBe(201);
    });
    test("Returns status 409 and used email message when email is already used", async () => {
        let randomEmail = `email-${Date.now()}@gmail.com`;
        const res01 = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: randomEmail,
            password: "password123456",
        });
        expect(res01.status).toBe(201);
        const res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: randomEmail,
            password: "password123456",
        });
        expect(res.status).toBe(409);
        expect(res.body.message).toBe(responseMessages.users.usedEmail);
    });
    test("Returns the user object when user is registered successfully", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email123@gmail.com",
            password: "password123456",
        });
        expect(res.body.data).toHaveProperty("name", "Random name");
        expect(res.body.data).toHaveProperty("username", "Random User");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data).toHaveProperty("tasks", []);
        expect(res.body.data).not.toHaveProperty("password");
    });
    test("Returns body payload length error when properties other than (username, name, email, password) are present in the body", async () => {
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email1@gmail.com",
            password: "password123456",
            google: "hello",
        });
        expect(res.body.statusCode).toBe(400);
        expect(res.body.statusCode).toBe(res.status);
        expect(res.body.message).toBe(responseMessages.users.bodyPayloadLengthError);
    });
    test("Returns case-insensitive email duplicates error upon case sensitivity issues", async () => {
        let res01 = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password123456",
        });
        expect(res01.status).toBe(201);
        let res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "EMAIL@gmail.com",
            password: "password123456",
        });
        expect(res.body.statusCode).toBe(409);
        expect(res.body.message).toBe(responseMessages.users.usedEmail);
    });
});

const users = [
    {
        username: "Sorcerer supreme",
        name: "Doctor strange",
        email: "strange@gmail.com",
        password: "password123456",
    },
    {
        username: "Iron Man",
        name: "Tony Stark",
        email: "stark@gmail.com",
        password: "password123456",
    },
];

describe("GET /api/users", () => {
    test("returns empty array if there are no users are in the database", async () => {
        let res = await api.get("/api/users");
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toEqual([]);
    });
    test("returns a status code 200 and a list of all users with their tasks", async () => {
        await api.post("/api/users").send(users[0]);
        await api.post("/api/users").send(users[1]);
        let res = await api.get("/api/users");
        expect(res.body.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0] && res.body.data[1]).toHaveProperty("id");
        expect(res.body.data[0]).not.toHaveProperty("password");
        expect(res.body.data[0]).toHaveProperty("username", "Sorcerer supreme");
        expect(res.body.data[0]).toHaveProperty("name", "Doctor strange");
        expect(res.body.data[0]).toHaveProperty("email", "strange@gmail.com");
        expect(res.body.data[0]).toHaveProperty("tasks", []);
        expect(res.body.data[1]).toHaveProperty("tasks", []);
    });
    test("returns status code 500 if an error occurs while retrieving users", async () => {
        const spy = jest.spyOn(User, "find").mockImplementationOnce(() => {
            throw new Error(
                "Something went wrong while trying to retrieve users."
            );
        });
        let res = await api.get("/api/users");
        expect(spy).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.statusCode).toBe(500);
        expect(res.body.error).toBe(
            "Internal Server Error."
        );
        jest.restoreAllMocks();
    });
    test("returns list of users with tasks array populated for each user", async () => {
        await api.post("/api/users").send(users[0]);
        const result = await api
            .post("/api/auth/login")
            .send({ email: users[0].email, password: users[0].password });
        const task = {
            title: "Test Title",
            description: "Test Description",
            dueDate: "2025-05-30",
            status: "To Do",
        };
        await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send(task);
        const userData = await api.get(
            `/api/users/${result.body.data.user.id}`
        );
        expect(userData.body.data).toHaveProperty("tasks");
        expect(userData.body.data.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: task.title,
                    status: task.status,
                }),
            ])
        );
    });
});

describe("PUT /api/users/:id", () => {
    let user, result;
    beforeEach(async () => {
        await User.deleteMany({});
        user = await api.post("/api/users").send(users[0]);
        result = await api
            .post("/api/auth/login")
            .send({ email: users[0].email, password: users[0].password });
    });
    test("returns status code 204 when body is empty", async () => {
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({});
        expect(res.status).toBe(400);
    });
    test("returns status 400 if request body contains invalid fields", async () => {
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({ color: "Black" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Body contains invalid fields");
    });
    test("returns 401 if the request is missing an authorization token", async () => {
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .send({ username: "Black" });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Missing JWT token.");
    });
    test("returns authorization error message when id param doesn't match user id", async () => {
        const tempId = new mongoose.Types.ObjectId();
        let res = await api
            .put(`/api/users/${tempId}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({ username: "Black" });
        expect(res.status).toBe(403);
        expect(res.body.message).toBe(responseMessages.users.updateUnauthorized);
    });
    test("returns user not found error message when trying to update using invalid id", async () => {
        await api.delete(`/api/users/${user.body.data.id}`);
        const deletedUser = await api.get(`/api/users/${user.body.data.id}`);
        expect(deletedUser.body.message).toBe(responseMessages.users.toRetrieveNotFound);
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({ username: "Black" });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe(responseMessages.users.toUpdateNotFound);
    });
    test("returns updated user upon request success", async () => {
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({ username: "Black" });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(responseMessages.users.updateSuccess);
    });
    test("returns status code 200 and updates only provided fields", async () => {
        let res = await api
            .put(`/api/users/${user.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({ username: "Defender Strange" });
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe("Defender Strange");
        expect(res.body.data.name).toBe("Doctor strange");
    });
});
