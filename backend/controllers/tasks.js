const tasksRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken } = require("../utils/middleware");
const { responseMessages } = require("../utils/responseMessages");

tasksRouter.get("/", async (req, res, next) => {
    try {
        const tasks = await Task.find({}).populate("userId");
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
});

tasksRouter.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: responseMessages.tasks.toRetrieveNotFound,
            });
        if (req.user.id !== task.userId.toString())
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: responseMessages.tasks.accessUnauthorized,
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
            .withMessage("Title is required.")
            .isString()
            .withMessage("Title is invalid.")
            .escape(),
        body("description")
            .notEmpty()
            .withMessage("Description is required.")
            .isString()
            .withMessage("Description is invalid.")
            .escape(),
        body("status")
            .notEmpty()
            .withMessage("Status is required.")
            .isIn(["To Do", "In Progress", "Completed"])
            .withMessage(
                "Invalid status value. Allowed values are: To Do, In Progress, Completed."
            ),
        body("dueDate")
            .notEmpty()
            .withMessage("DueDate is required")
            .isISO8601()
            .withMessage(
                "DueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."
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
                message: responseMessages.tasks.creationSuccess,
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
            .withMessage("Title must not be empty if provided.")
            .isString()
            .withMessage("Title is invalid.")
            .escape(),
        body("description")
            .optional()
            .notEmpty()
            .withMessage("Description must not be empty if provided.")
            .isString()
            .withMessage("Description is invalid.")
            .escape(),
        body("status")
            .optional()
            .notEmpty()
            .withMessage("Status must not be empty if provided.")
            .isIn(["To Do", "In Progress", "Completed"])
            .withMessage(
                "Invalid status value. Allowed values are: To Do, In Progress, Completed."
            ),
        body("dueDate")
            .optional()
            .notEmpty()
            .withMessage("DueDate must not be empty if provided.")
            .isISO8601()
            .withMessage(
                "DueDate must be in ISO8601 format (e.g., YYYY-MM-DD)."
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
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: responseMessages.tasks.emptyBody,
            });
        }
        try {
            const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: responseMessages.tasks.toUpdateNotFound,
                });
            }
            if (req.user.id !== task.userId.toString())
                return res.status(403).json({
                    success: false,
                    statusCode: 403,
                    message: responseMessages.tasks.updateUnauthorized,
                });
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: task,
                message: responseMessages.tasks.updateSuccess,
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
                message: responseMessages.tasks.toDeleteNotFound,
            });
        if (req.user.id === task.userId.toString())
            return res.status(204).end();
        else
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: responseMessages.tasks.deletionUnauthorized,
            });
    } catch (error) {
        next(error);
    }
});

module.exports = tasksRouter;