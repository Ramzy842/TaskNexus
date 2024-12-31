const tasksRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const formatTask = require("../utils/formatTask");
tasksRouter.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({});
        const formattedTasks = tasks.map(formatTask);
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

tasksRouter.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Task not found.",
            });
        const formattedTask = formatTask(task);
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

tasksRouter.post(
    "/",
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
            return res.status(400).json({
                success: false,
                statusCode: 400,
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
            const formattedTask = formatTask(task);
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

tasksRouter.put(
    "/:id",
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
            const formattedTask = formatTask(task);
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

tasksRouter.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
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

module.exports = tasksRouter;
