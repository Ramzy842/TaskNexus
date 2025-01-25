const usersRouter = require("express").Router();
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { verifyToken } = require("../utils/middleware");
const {
    validateUsername,
    validateName,
    validateEmail,
    validatePassword,
    validateUsernameUpdate,
    validateEmailUpdate,
    validateNameUpdate,
} = require("../utils/validators");
const { getHashedPassword, createUser, messages } = require("../utils/users");

usersRouter.post(
    "/",
    [validateUsername, validateName, validateEmail, validatePassword],
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
                    error: messages.usedEmail,
                });
            }
            if (!password && !googleId) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    error: messages.passwordOrGoogleRequired,
                });
            }
            const passwordHash = await getHashedPassword(password, googleId);
            const savedUser = await createUser(
                username,
                name,
                email,
                passwordHash
            );
            savedUser.save();
            delete savedUser.passwordHash;
            res.status(201).json({
                success: true,
                statusCode: 201,
                data: savedUser,
                message: messages.successfullRegistration,
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
    [validateUsernameUpdate, validateEmailUpdate, validateNameUpdate],
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
                message: messages.unauthorizedToUpdate,
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
                    message: messages.userToUpdateNotFound,
                });
            }
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: updatedUser,
                message: messages.successfullUserUpdate,
            });
        } catch (err) {
            next(err);
        }
    }
);
module.exports = usersRouter;
