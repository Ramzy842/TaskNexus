const authRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { responseMessages } = require("../utils/responseMessages");
const { validateEmail, validatePassword } = require("../utils/loginValidators");
const { generateAccessToken, generateRefreshToken } = require("../utils/users");

authRouter.post(
    "/login",
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
            const accessToken = generateAccessToken(userForToken);
            const refreshToken = generateRefreshToken(userForToken);

            user.refreshToken = refreshToken;
            await user.save();
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });
            res.status(200).json({
                success: true,
                statusCode: 200,
                data: {
                    token: accessToken,
                    refreshToken: user.refreshToken,
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

authRouter.post("/login/refresh", async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(401).json({
            success: false,
            statusCode: 401,
            error: "Missing refresh token.",
        });
    try {
        const user = await User.findOne({ refreshToken });
        if (!user || user.blacklistedTokens.includes(refreshToken)) {
            return res.status(403).json({
                success: false,
                statusCode: 403,
                error: "Invalid refresh token.",
            });
        }
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );
        if (!decodedToken.id)
            return res.status(403).json({
                success: false,
                statusCode: 403,
                error: "Invalid refresh token.",
            });
        const newAccessToken = generateAccessToken({
            username: decodedToken.username,
            email: decodedToken.email,
            id: user._id.toString(),
        });
        return res.status(200).json({
            success: true,
            statusCode: 200,
            accessToken: newAccessToken,
        });
    } catch (error) {
        next(error);
    }
});

authRouter.post("/logout", async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(401).json({
            success: false,
            statusCode: 401,
            error: "Missing refresh token.",
        });
    try {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.blacklistedTokens.push(refreshToken);
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie("refreshToken");
        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = authRouter;
