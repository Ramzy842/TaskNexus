const express = require("express");
const googleRouter = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { google, PORT } = require("../utils/config");
const { generateAccessToken, generateRefreshToken } = require("../utils/users");

const oauth2Client = new OAuth2Client(
    google.Client_ID,
    google.Client_SECRET,
    `http://localhost:${PORT}/api/auth/google/callback`
);

googleRouter.get("/", (req, res) => {
    const { redirect } = req.query;
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
        state: JSON.stringify({redirect})
    });
    res.redirect(authUrl);
});

googleRouter.get("/callback", async (req, res, next) => {
    try {
        const { code, state } = req.query;
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: google.Client_ID,
        });
        const { name, email, sub: googleId, picture } = ticket.getPayload();
        let user = await User.findOne({ email }).populate("tasks");
        if (!user) {
            user = new User({
                username: email.split("@")[0],
                name,
                email,
                googleId,
            });
            await user.save();
        }
        if (!user)
            user.profilePicture = picture
        await user.save();
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
        const { redirect } = state ? JSON.parse(state) : {};
        if (redirect === "false")
            return res.status(200).json({
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
                        profilePicture: user.profilePicture
                    },
                },
            });
        res.redirect(
            `http://localhost:5173/auth/callback?id=${user._id.toString()}&username=${
                user.username
            }&accessToken=${accessToken}&profilePicture=${user.profilePicture}`
        );
    } catch (err) {
        next(err);
    }
});

module.exports = googleRouter;
