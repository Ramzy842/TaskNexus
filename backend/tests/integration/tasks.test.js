const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../../models/User");
const app = require("../../app");
const Task = require("../../models/Task");
const api = supertest(app);
const jwt = require("jsonwebtoken");
const { responseMessages } = require("../../utils/responseMessages");

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

describe("GET /api/tasks", () => {
    test("Returns status 200 and empty array if no tasks exist", async () => {
        let res = await api.get("/api/tasks");
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });
    test("Returns status 200 and tasks array", async () => {
        let result = await api
            .post("/api/auth/login")
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
            .post("/api/auth/login")
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
        expect(res.body).toHaveProperty("error", "Internal Server Error.");
        jest.restoreAllMocks();
    });
});
describe("GET /api/tasks/:id", () => {
    const tempId = new mongoose.Types.ObjectId();
    test("Returns status 401 missing token error when token is missing", async () => {
        await api.post("/api/tasks").send({
            title: "Test Title",
            description: "Test Description",
            dueDate: "2025-05-30",
            status: "To Do",
        });
        let result = await api.get(`/api/tasks/${tempId}`);
        expect(result.status).toBe(401);
        expect(result.body.error).toBe("Missing JWT token.");
    });
    test("Returns status 404 and 'Task not found.' message if task does not exist", async () => {
        const tempId = new mongoose.Types.ObjectId();
        let result = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let res = await api
            .get(`/api/tasks/${tempId}`)
            .set("Authorization", `Bearer ${result.body.data.token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe(
            responseMessages.tasks.toRetrieveNotFound
        );
    });
    test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to access the task does not own it)", async () => {
        let result = await api
            .post("/api/auth/login")
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
        const randomToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, {
            expiresIn: 60 * 60,
        });
        let res = await api
            .get(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${randomToken}`);
        expect(res.status).toBe(403);
        expect(res.body.message).toBe(
            "You are not authorized to access this task."
        );
    });
    test("Returns status 200 and task object", async () => {
        let result = await api
            .post("/api/auth/login")
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
            .post("/api/auth/login")
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
        expect(res.body.error).toBe("Internal Server Error.");
        jest.restoreAllMocks();
    });
});
describe("POST /api/tasks", () => {
    test("Returns status 401 and missing token error when token is missing", async () => {
        let result = await api.post("/api/tasks").send({
            title: "Test Title",
            description: "Test Description",
            dueDate: "2025-05-30",
            status: "To Do",
        });
        expect(result.status).toBe(401);
        expect(result.body.error).toBe("Missing JWT token.");
    });
    test("Returns status 201 and created task object", async () => {
        let result = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let res = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(
            expect.objectContaining({
                title: "Test Title",
                description: "Test Description",
            })
        );
        expect(res.body.message).toBe("Task created successfully.");
    });
    test("Returns status 500 when internal server error occurs (DB error)", async () => {
        let result = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        jest.spyOn(User, "findById").mockImplementationOnce(() => {
            throw new Error("Internal Server Error");
        });
        let res = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${result.body.data.token}`)
            .send({
                title: "Test Title",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal Server Error.");
        jest.restoreAllMocks();
    });
});
describe("PUT /api/tasks/:id", () => {
    test("Returns status 401 and missing token error when token is missing", async () => {
        const tempId = new mongoose.Types.ObjectId();
        let result = await api.put(`/api/tasks/${tempId}`).send({
            title: "Test Title",
            description: "Test Description",
            dueDate: "2025-05-30",
            status: "To Do",
        });
        expect(result.status).toBe(401);
        expect(result.body.error).toBe("Missing JWT token.");
    });
    test("Returns status 400 when body is empty", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "Completed",
            });
        let result = await api
            .put(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({});
        expect(result.status).toBe(400);
        expect(result.body.message).toBe(
            "Request body cannot be empty when updating a task."
        );
    });
    test("Returns status 404 when the task to update is not found", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        const tempId = new mongoose.Types.ObjectId();
        let res = await api
            .put(`/api/tasks/${tempId}`)
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({ title: "Food" });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe(
            "The task you are trying to update is not found."
        );
    });
    test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to update the task does not own it)", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "Completed",
            });
        const userForToken = {
            username: "RandomUsername",
            email: "randomEmail@gmail.com",
            id: new mongoose.Types.ObjectId(),
        };
        const randomToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, {
            expiresIn: 60 * 60,
        });
        let result = await api
            .put(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${randomToken}`)
            .send({ description: "Watch Severance Ep 3" });
        expect(result.status).toBe(403);
        expect(result.body.message).toBe(
            "You are not authorized to update this task."
        );
    });
    test("Returns status 200 and updated task object", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "Completed",
            });
        let result = await api
            .put(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({ status: "In Progress" });
        expect(result.status).toBe(200);
        expect(result.body.data).toEqual(
            expect.objectContaining({ status: "In Progress" })
        );
        expect(result.body.message).toBe("Task updated successfully.");
    });
    test("Returns status 500 when internal server error occurs (DB error)", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "To Do",
            });
        jest.spyOn(Task, "findByIdAndUpdate").mockImplementationOnce(() => {
            throw new Error("Internal Server Error");
        });
        let res = await api
            .put(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: "Finish Frontend implementation",
            });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal Server Error.");
        jest.restoreAllMocks();
    });
});

describe("DELETE /api/tasks/:id", () => {
    test("Returns status 401 and missing token error when token is missing", async () => {
        const tempId = new mongoose.Types.ObjectId();
        let result = await api.delete(`/api/tasks/${tempId}`);
        expect(result.status).toBe(401);
        expect(result.body.error).toBe("Missing JWT token.");
    });
    test("Returns status 404 when the task to delete is not found", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        const tempId = new mongoose.Types.ObjectId();
        let res = await api
            .delete(`/api/tasks/${tempId}`)
            .set("Authorization", `Bearer ${user.body.data.token}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe(
            "The task you are trying to delete is not found."
        );
    });
    test("Returns status 403 and authorization error when task exists but authorization fails (the user trying to delete the task does not own it)", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "Completed",
            });
        const userForToken = {
            username: "RandomUsername",
            email: "randomEmail@gmail.com",
            id: new mongoose.Types.ObjectId(),
        };
        const randomToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, {
            expiresIn: 60 * 60,
        });
        let result = await api
            .delete(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${randomToken}`);
        expect(result.status).toBe(403);
        expect(result.body.message).toBe(
            "You are not authorized to delete this task."
        );
    });
    test("Returns status 500 when internal server error occurs (DB error)", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "To Do",
            });
        jest.spyOn(Task, "findByIdAndDelete").mockImplementationOnce(() => {
            throw new Error("Internal Server Error");
        });
        let res = await api
            .delete(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${user.body.data.token}`);
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal Server Error.");
        jest.restoreAllMocks();
    });
    test("Returns status 204 when deletion succeeds", async () => {
        let user = await api
            .post("/api/auth/login")
            .send({ email: "loki@gmail.com", password: "password123456" });
        let task = await api
            .post("/api/tasks")
            .set("Authorization", `Bearer ${user.body.data.token}`)
            .send({
                title: `Task ${Date.now}`,
                description: `Description ${Date.now}`,
                dueDate: "2025-05-30",
                status: "Completed",
            });

        let result = await api
            .delete(`/api/tasks/${task.body.data.id}`)
            .set("Authorization", `Bearer ${user.body.data.token}`);
        expect(result.status).toBe(204);
    });
});
