const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { responseMessages } = require("../utils/responseMessages");
const { validateEmail, validatePassword } = require("../utils/loginValidators");

loginRouter.post(
    "/",
    [validateEmail, validatePassword],
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                errors: result.array().map((res) => res.msg),
            });
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }).populate("tasks");
            if (!user) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: responseMessages.login.invalidEmailOrPass,
                });
            }
            if (user.googleId) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: responseMessages.login.registeredWithGoogle,
                });
            }
            const passwordCorrect = await bcrypt.compare(
                password,
                user.passwordHash
            );
            if (!passwordCorrect) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    message: responseMessages.login.invalidEmailOrPass,
                });
            }
            const userForToken = {
                username: user.username,
                email: user.email,
                id: user._id.toString(),
            };
            const token = jwt.sign(userForToken, process.env.SECRET, {
                expiresIn: 60 * 60,
            });
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: {
                    token,
                    user: {
                        id: user._id.toString(),
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        tasks: user.tasks,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = loginRouter;
