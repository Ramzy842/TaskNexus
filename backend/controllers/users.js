const usersRouter = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../utils/middleware");

usersRouter.post(
    "/",
    [
        body("username")
            .notEmpty()
            .withMessage("Username is required.")
            .isString()
            .withMessage("Invalid username.")
            .trim()
            .escape(),
        body("name")
            .notEmpty()
            .withMessage("Name is required.")
            .isString()
            .withMessage("Invalid name.")
            .trim()
            .escape(),
        body("email")
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Invalid email format."),
        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isString()
            .withMessage("Invalid password.")
            .isLength({ min: 12, max: 24 })
            .withMessage(
                "Password should be at least 12 characters long and not exceeding 24 characters."
            )
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

usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({}).populate("tasks");
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: users,
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
            .notEmpty()
            .withMessage("Username is required.")
            .isString()
            .withMessage("Invalid username.")
            .trim()
            .escape(),
        body("email")
            .notEmpty()
            .withMessage("Email is required.")
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
        if (req.user.id !== req.params.id)
            return res.status(403).json({
                success: false,
                statusCode: 403,
                message: "You are not authorized to update user info.",
            });
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
