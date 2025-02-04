const {
    runTaskCreationMiddleware,
    validateTask,
    runTaskUpdateMiddleware,
    tasksUpdateValidationParams,
} = require("./middleware");

const mongoose = require("mongoose");

let res, next;
beforeEach(() => {
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
});

describe("POST /api/tasks", () => {
    test("Returns status 400 and all error messages when body is empty", async () => {
        let req = {
            body: {},
        };
        await runTaskCreationMiddleware(req, res, next);

        validateTask(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [
                "Title is required.",
                "Title is invalid.",
                "Description is required.",
                "Description is invalid.",
                "Status is required.",
                "Invalid status value. Allowed values are: To Do, In Progress, Completed.",
                "DueDate is required",
                "DueDate must be in ISO8601 format (e.g., YYYY-MM-DD).",
            ],
        });
    });
    test("Returns status 400 and required error messages when body has empty properties", async () => {
        let req = {
            body: {
                title: "",
                description: "",
                dueDate: "",
                status: "",
            },
        };
        await runTaskCreationMiddleware(req, res, next);

        validateTask(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [
                "Title is required.",
                "Description is required.",
                "Status is required.",
                "Invalid status value. Allowed values are: To Do, In Progress, Completed.",
                "DueDate is required",
                "DueDate must be in ISO8601 format (e.g., YYYY-MM-DD).",
            ],
        });
    });
    test("Returns status 400 and error message when title field is empty", async () => {
        let req = {
            body: {
                title: "",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To Do",
            },
        };
        await runTaskCreationMiddleware(req, res, next);
        validateTask(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: ["Title is required."],
        });
    });
    test("Returns status 400 and error for invalid status value", async () => {
        let req = {
            body: {
                title: "To do task",
                description: "Test Description",
                dueDate: "2025-05-30",
                status: "To-Do",
            },
        };
        await runTaskCreationMiddleware(req, res, next);
        validateTask(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [
                "Invalid status value. Allowed values are: To Do, In Progress, Completed.",
            ],
        });
    });
    test("Returns status 400 and error for invalid dueDate value", async () => {
        let req = {
            body: {
                title: "To do task",
                description: "Test Description",
                dueDate: "25-05-30",
                status: "In Progress",
            },
        };
        await runTaskCreationMiddleware(req, res, next);
        validateTask(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: ["DueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."],
        });
    });
});

describe("PUT /api/tasks/:id", () => {
    test("Returns status 204 when body is empty", async () => {
        let req = {
            body: {},
        };
        await runTaskUpdateMiddleware(req, res, next);
        validateTask(req, res, next);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        // runTaskUpdateMiddleware calls next and validation success calls it one last time
        expect(next.mock.calls).toHaveLength(
            tasksUpdateValidationParams.length + 1
        );
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});
