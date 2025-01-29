const mongoose = require("mongoose");
const superset = require("supertest");
const app = require("../../app");
const { messages } = require("../../utils/validators");
const { messages: dbMessages } = require("../../utils/users");
const User = require("../../models/User");
const api = superset(app);

describe("POST /api/users", () => {
    beforeEach(async () => {
        await User.deleteMany({}).exec();
    });
    afterEach(async () => {
        await User.deleteMany({}).exec();
    });

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
        const res01 = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password123456",
        });
        expect(res01.status).toBe(201);
        console.log(res01.body.data);
        const res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password123456",
        });
        expect(res.status).toBe(409);
        expect(res.body.error).toBe(dbMessages.usedEmail);
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
        expect(res.body.error).toBe(dbMessages.bodyPayloadLengthError);
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
        expect(res.body.error).toBe(dbMessages.usedEmail);
    });
});

describe("GET /api/users", () => {
    beforeEach(async () => {
        await User.deleteMany({}).exec();
    });
    afterEach(async () => {
        await User.deleteMany({}).exec();
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
            "Something went wrong while trying to retrieve users."
        );
        jest.restoreAllMocks();
    });
    test("returns list of users with tasks array populated for each user", async () => {
        await api.post("/api/users").send(users[0]);
        const result = await api
            .post("/api/login")
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

describe("PUT /api/users/:id", () => {});

afterAll(async () => {
    await mongoose.connection.close();
});
