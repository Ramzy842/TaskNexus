const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

loginRouter.post(
    "/",
    [
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
    async (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                errors: result.array(),
            });
        }
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    statusCode: 401,
                    error: "Invalid email or password.",
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
                    error: "Invalid email or password.",
                });
            }
            const userForToken = {
                username: user.username,
                email: user.email,
                id: user._id,
            };
            const token = jwt.sign(userForToken, process.env.SECRET, {
                expiresIn: 60 * 60,
            });
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: {
                    token,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = loginRouter;
