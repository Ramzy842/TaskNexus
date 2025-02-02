const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../../models/User");
const app = require("../../app");
const Task = require("../../models/Task");
const api = supertest(app);
const jwt = require("jsonwebtoken");

beforeEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await api.post("/api/users").send({
        username: "Loki",
        name: "Loki Odinson",
        email: "loki@gmail.com",
        password: "password123456",
    });
    await api.post("/api/users").send({
        username: "Scarlet witch",
        name: "Wanda Maximoff",
        email: "wanda@gmail.com",
        password: "password123456",
    });
});
describe("GET /api/tasks", () => {
    test("Returns status 200 and empty array if no tasks exist", async () => {
        let res = await api.get("/api/tasks");
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });
    test("Returns status 200 and tasks array", async () => {
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        let res = await api.get("/api/tasks");
        expect(res.status).toBe(200);
        expect(res.body.data).toMatchObject([
            {
                status: "To Do",
                title: "Test Title",
                description: "Test Description",
            },
        ]);
    });
    test("Returns tasks array with userId property populated with task owner data", async () => {
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        let res = await api.get("/api/tasks");
        expect(res.status).toBe(200);
        expect(res.body.data).toMatchObject([
            {
                userId: {
                    name: "Loki Odinson",
                    email: "loki@gmail.com",
                },
            },
        ]);
    });
    test("Returns status 500 when internal server error occurs (DB error)", async () => {
        let findSpy = jest.spyOn(Task, "find");
        findSpy.mockImplementationOnce(() => {
            throw new Error("Internal server error");
        });
        let res = await api.get("/api/tasks");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Internal server error");
        jest.restoreAllMocks();
    });
});
describe("GET /api/tasks/:id", () => {
    const id = "somerandomid";
    test("Returns status 401 missing token error when token is missing", async () => {
        await api.post("/api/tasks").send({
            title: "Test Title",
            description: "Test Description",
            dueDate: "2025-05-30",
            status: "To Do",
        });
        let result = await api.get(`/api/tasks/${id}`);
        expect(result.status).toBe(401);
        expect(result.body.error).toBe("Missing JWT token.");
    });
    test("Returns status 404 and 'Task not found.' message if task does not exist", async () => {
        const tempId = new mongoose.Types.ObjectId();
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let res = await api
            .get(`/api/tasks/${tempId}`)
            .set("Authorization", `Bearer ${result.body.data.token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Task not found.");
    });
    test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to access the task does not own it)", async () => {
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        const userForToken = {
            username: "RandomUsername",
            email: "randomEmail@gmail.com",
            id: new mongoose.Types.ObjectId(),
        };
        const randomToken = jwt.sign(userForToken, process.env.SECRET, {
            expiresIn: 60 * 60,
        });
        let res = await api
            .get(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${randomToken}`);
        console.log(res.body);

        expect(res.status).toBe(403);
        expect(res.body.message).toBe(
            "You are not authorized to access this task."
        );
    });
    test("Returns status 200 and task object", async () => {
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        let res = await api
            .get(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(
            expect.objectContaining({
                title: "Test Title",
                description: "Test Description",
            })
        );
    });
    test("Returns status 500 when internal server error occurs (DB error)", async () => {
        let result = await api
            .post("/api/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        jest.spyOn(Task, "findById").mockImplementationOnce(() => {
            throw new Error("Internal Server Error");
        });
        let res = await api
            .get(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${result.body.data.token}`);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal Server Error")
    });
});
// describe("POST /api/tasks", () => {
//     test("Returns status 401 and missing token error when token is missing", async () => {});
//     test("Returns status 201 and created task object", async () => {});
//     test("Returns status 500 when internal server error occurs (DB error)", async () => {});
// });
// describe("PUT /api/tasks/:id", () => {
//     test("Returns status 401 and missing token error when token is missing", async () => {});
//     test("Returns status 400 when body is empty", async () => {});
//     test("Returns status 404 when the task to update is not found", async () => {});
//     test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to update the task does not own it)", async () => {});
//     test("Returns status 200 and updated task object", async () => {});
//     test("Returns status 500 when internal server error occurs (DB error)", async () => {});
// });

// describe("DELETE /api/tasks/:id", () => {
//     test("Returns status 401 and missing token error when token is missing", async () => {});
//     test("Returns status 404 when the task to delete is not found", async () => {});
//     test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to delete the task does not own it)", async () => {});
//     test("Returns status 500 when internal server error occurs (DB error)", async () => {});
// });

afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
});
