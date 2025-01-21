const tasksRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken } = require("../utils/middleware");

tasksRouter.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({}).populate("userId");
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: error.message,
        });
    }
});

tasksRouter.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Task not found.",
            });
        if (req.user.id !== task.userId.toString())
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "You are not authorized to access this task.",
            });
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: task,
        });
    } catch (error) {
        next(error);
    }
});

tasksRouter.post(
    "/",
    [
        body("title")
            .notEmpty()
            .withMessage("title is required.")
            .isString()
            .escape(),
        body("description")
            .notEmpty()
            .withMessage("description is required.")
            .isString()
            .escape(),
        body("status")
            .notEmpty()
            .withMessage("status is required.")
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
    verifyToken,
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(400).json({
                success: false,
                statusCode: 400,
                errors: result.array().map((res) => res.msg),
            });
        try {
            const { title, description, status, dueDate } = req.body;
            const user = await User.findById(req.user.id);
            const newTask = new Task({
                title,
                description,
                status,
                dueDate,
                userId: user.id,
            });
            const task = await newTask.save();
            user.tasks = user.tasks.concat(task.id);
            await user.save();
            res.status(201).json({
                success: true,
                statusCode: 201,
                data: task,
            });
        } catch (error) {
            next(error);
        }
    }
);

tasksRouter.put(
    "/:id",
    [
        body("title")
            .optional()
            .notEmpty()
            .withMessage("title must not be empty if provided.")
            .isString()
            .escape(),
        body("description")
            .optional()
            .notEmpty()
            .withMessage("description must not be empty if provided.")
            .isString()
            .escape(),
        body("status")
            .optional()
            .notEmpty()
            .withMessage(
                "Invalid status value. Allowed values are: To Do, In Progress, Completed."
            )
            .isIn(["To Do", "In Progress", "Completed"]),
        body("dueDate")
            .optional()
            .notEmpty()
            .withMessage(
                "dueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."
            )
            .isISO8601(),
    ],
    verifyToken,
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.status(422).json({
                success: false,
                statusCode: 422,
                errors: result.array().map((res) => res.msg),
            });
        if (!Object.keys(req.body).length) return res.status(204).end();
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
            if (req.user.id !== task.userId.toString())
                return res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: "You are not authorized to update this task.",
                });
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: task,
                message: "Task updated successfully.",
            });
        } catch (error) {
            next(error);
        }
    }
);

tasksRouter.delete("/:id", verifyToken, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "The task you are trying to delete is not found.",
            });
        if (req.user.id === task.userId.toString()) return res.status(204).end();
        else
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "You are not authorized to delete this task.",
            });
    } catch (error) {
        next(error);
    }
});

module.exports = tasksRouter;

/*

{
    "title": "Test Title",
    "description": "Test Description",
    "dueDate": "2025-05-30",
    "status": "To Do"
}

{
    "email": "ramzychahbani@gmail.com",
    "password": "123456789"
}

{
    "username": "Paradox",
    "name": "Ramzi",
    "email": "ramzychahbani@gmail.com",
    "password": "123456789"
}


*/
