const mongoose = require("mongoose");
const superset = require("supertest");
const app = require("../../app");
const { messages } = require("../../utils/validators");
const { messages: dbMessages } = require("../../utils/users");
const User = require("../../models/User");
const api = superset(app);

describe("POST /api/users", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    let expectedMessages, res;
    test("Returns status 400 and validation errors upon missing body properties", async () => {
        res = await api.post("/api/users").send({
            username: "Random User",
            email: "email@gmail.com",
        });
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
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
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
        expectedMessages = [...Object.values(messages)];
        expect(res.body.errors).toHaveLength(expectedMessages.length);
        expect(res.body.errors).toEqual(
            expect.arrayContaining(expectedMessages)
        );
    });
    test("Returns status 400 and error message when email format is invalid", async () => {
        res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email.com",
            password: "password123456789",
        });
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.invalidEmail]);
    });
    test("Returns status 400 and error message when password length is shorter than 12 characters", async () => {
        res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password",
        });
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.inaccuratePasswordLength]);
    });
    test("Returns status 400 and error message when password length is more than 24 characters", async () => {
        res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email@gmail.com",
            password: "password123456789123456789",
        });
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
        expect(res.body.errors).toEqual([messages.inaccuratePasswordLength]);
    });
    test("Returns status 201 when password length is between 12 and 24 characters", async () => {
        res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email_random@gmail.com",
            password: "password123456",
        });
        expect(res.statusCode).toBe(201);
    });
    test("Returns status 409 and used email message when email is already used", async () => {
        await api
            .post("/api/users")
            .send({
                username: "Random User",
                name: "Random name",
                email: "email@gmail.com",
                password: "password123456",
            })
            .expect(201);
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe(dbMessages.usedEmail);
    });
    test("Returns the user object when user is registered successfully", async () => {
        res = await api.post("/api/users").send({
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
        res = await api.post("/api/users").send({
            username: "Random User",
            name: "Random name",
            email: "email1@gmail.com",
            password: "password123456",
            google: "hello",
        });
        expect(res.statusCode).toBe(400);
        expect(res.statusCode).toBe(res.status);
        expect(res.body.error).toBe(dbMessages.bodyPayloadLengthError);
    });
    // test("Returns case-insensitive email duplicates error upon case sensitivity issues", async () => {
    //     // await api
    //     //     .post("/api/users")
    //     //     .send({
    //     //         username: "Random User",
    //     //         name: "Random name",
    //     //         email: "email@gmail.com",
    //     //         password: "password123456",
    //     //     })
    //     //     .expect(201);
    //     res = await api.post("/api/users").send({
    //         username: "Random User",
    //         name: "Random name",
    //         email: "Email@gmail.com",
    //         password: "password123456",
    //     });
    //     expect(res.statusCode).toBe(409);
    //     expect(res.body.error).toBe(dbMessages.usedEmail);
    // });
});

describe("GET /api/users", () => {});

describe("PUT /api/users/:id", () => {});

afterAll(async () => {
    await mongoose.connection.close();
});
