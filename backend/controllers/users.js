const usersRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { format } = require("date-fns");
const { body, validationResult } = require("express-validator");
const formatTask = require("../utils/formatTask");
const { verifyToken } = require("../utils/middleware");

usersRouter.post(
    "/",
    [
        body("username")
            .notEmpty()
            .withMessage("username is required.")
            .isString()
            .trim()
            .escape(),
        body("name")
            .notEmpty()
            .withMessage("name is required.")
            .isString()
            .trim()
            .escape(),
        body("email")
            .notEmpty()
            .withMessage("email is required.")
            .isEmail()
            .withMessage("Invalid email format.")
            .normalizeEmail(),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isString()
            .escape(),
    ],
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                errors: result.array().map((res) => res.msg),
            });
        }
        try {
            const { username, name, email, password, googleId } = req.body;
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    statusCode: 409,
                    error: "The email you provided is already in use.",
                });
            }
            if (!password && !googleId) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    error: "Either password or googleId is required.",
                });
            }
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    error: "Password should be at least 8 characters long.",
                });
            }
            const saltRounds = 10;
            const passwordHash = googleId
                ? null
                : await bcrypt.hash(password, saltRounds);
            const user = new User({
                username,
                name,
                email,
                passwordHash,
            });
            const savedUser = await user.save();
            delete savedUser.passwordHash;
            res.status(201).json({
                success: true,
                statusCode: 201,
                data: savedUser,
                message: "Registration completed successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                statusCode: 500,
                error: error.message,
            });
        }
    }
);

const formatUser = (user) => ({
    ...user.toJSON(),
    tasks: user.tasks.map((task) => formatTask(task)),
    createdAt: {
        raw: user.createdAt,
        formatted: format(new Date(user.createdAt), "MM/dd/yyyy hh:mm a"),
    },
    updatedAt: {
        raw: user.updatedAt,
        formatted: format(new Date(user.updatedAt), "MM/dd/yyyy hh:mm a"),
    },
});

usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({}).populate("tasks");
        const formattedUsers = users.map(formatUser);
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: formattedUsers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: error.message,
        });
    }
});
usersRouter.put(
    "/:id",
    [
        body("username")
            .optional()
            .notEmpty()
            .withMessage("username must not be empty if provided.")
            .isString()
            .escape(),
        body("email")
            .optional()
            .notEmpty()
            .withMessage("email must not be empty if provided.")
            .isEmail()
            .withMessage("Invalid email format."),
    ],
    verifyToken,
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                errors: result.array().map((res) => res.msg),
            });
        }
        if (!Object.keys(req.body).length) return res.status(204).end();
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    message: "The user you are trying to update is not found.",
                });
            }
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: updatedUser,
                message: "User updated successfully",
            });
        } catch (err) {
            next(err);
        }
    }
);
module.exports = usersRouter;
