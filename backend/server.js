require("dotenv").config();
const express = require("express");
const app = express();
const Task = require("./models/Task");
app.use(express.json());
const { body, validationResult } = require("express-validator");
const { format } = require("date-fns");
var morgan = require("morgan");
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : "",
        ].join(" ");
    })
);

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        const formattedTasks = tasks.map((task) => ({
            ...task.toJSON(),
            dueDate: {
                raw: task.dueDate,
                formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
            },
            createdAt: {
                raw: task.createdAt,
                formatted: format(
                    new Date(task.createdAt),
                    "MM/dd/yyyy hh:mm a"
                ),
            },
        }));
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: formattedTasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: error.message,
        });
    }
});

app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Task not found.",
            });
        const formattedTask = {
            ...task.toJSON(),
            dueDate: {
                raw: task.dueDate,
                formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
            },
            createdAt: {
                raw: task.createdAt,
                formatted: format(
                    new Date(task.createdAt),
                    "MM/dd/yyyy hh:mm a"
                ),
            },
        };
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: formattedTask,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: error.message,
        });
    }
});

app.post(
    "/api/tasks",
    [
        body("title")
            .notEmpty()
            .withMessage("title is required and should be a string.")
            .isString()
            .escape(),
        body("description")
            .notEmpty()
            .withMessage("description is required and should be a string.")
            .isString()
            .escape(),
        body("status")
            .notEmpty()
            .withMessage("status is required and should be a string.")
            .isIn(["To Do", "In Progress", "Completed"])
            .withMessage(
                "Invalid status value. Allowed values are: To Do, In Progress, Completed."
            ),
        body("dueDate")
            .notEmpty()
            .withMessage("dueDate is required")
            .isISO8601()
            .withMessage(
                "dueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."
            ),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(422).json({
                success: false,
                statusCode: 422,
                errors: result.array(),
            });
        try {
            const { title, description, status, dueDate } = req.body;
            const newTask = new Task({
                title,
                description,
                status,
                dueDate,
            });
            const task = await newTask.save();
            const formattedTask = {
                ...task.toJSON(),
                dueDate: {
                    raw: task.dueDate,
                    formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
                },
                createdAt: {
                    raw: task.createdAt,
                    formatted: format(
                        new Date(task.createdAt),
                        "MM/dd/yyyy hh:mm a"
                    ),
                },
            };
            res.status(201).json({
                success: true,
                statusCode: 201,
                data: formattedTask,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                error: error.message,
            });
        }
    }
);

app.put(
    "/api/tasks/:id",
    [
        body("title")
            .optional()
            .isString()
            .withMessage("title is required and should be a string.")
            .escape(),
        body("description")
            .optional()
            .isString()
            .withMessage("description is required and should be a string.")
            .escape(),
        body("status")
            .optional()
            .isIn(["To Do", "In Progress", "Completed"])
            .withMessage(
                "Invalid status value. Allowed values are: To Do, In Progress, Completed."
            ),
        body("dueDate")
            .optional()
            .isISO8601()
            .withMessage(
                "dueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."
            ),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(422).json({
                success: false,
                statusCode: 422,
                errors: result.array(),
            });
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "The task you are trying to update is not found.",
                });
            }
            const formattedTask = {
                ...task.toJSON(),
                dueDate: {
                    raw: task.dueDate,
                    formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
                },
                createdAt: {
                    raw: task.createdAt,
                    formatted: format(
                        new Date(task.createdAt),
                        "MM/dd/yyyy hh:mm a"
                    ),
                },
            };
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: formattedTask,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                error: error.message,
            });
        }
    }
);

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).json({
                success: true,
                statusCode: 404,
                message: "The task you are trying to delete is not found.",
            });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: error.message,
        });
    }
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        success: false,
        statusCode: 404,
        error: "unknown endpoint",
    });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
