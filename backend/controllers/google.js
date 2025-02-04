const express = require("express");
const googleRouter = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { google, PORT } = require("../utils/config");

const oauth2Client = new OAuth2Client(
    google.Client_ID,
    google.Client_SECRET,
    `http://localhost:${PORT}/api/auth/google/callback`
);

googleRouter.get("/", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
    });
    res.redirect(authUrl);
});

googleRouter.get("/callback", async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: google.Client_ID,
        });
        const { name, email, sub: googleId } = ticket.getPayload();
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
        const token = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, {
            expiresIn: 60 * 60,
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: {
                token,
                user: {
                    id: user.id,
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
        return res.status(500).json({
            success: false,
            statusCode: 500,
            error: "Something went wrong.",
        });
    }
});

module.exports = googleRouter;
