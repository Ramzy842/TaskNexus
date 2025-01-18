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
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username: email.split("@")[0],
                name,
                email,
                googleId,
            });
            await user.save();
        }
        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({
            success: true,
            statusCode: 201,
            data: token,
            message: "Registration completed successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            error: err.message,
        });
    }
});

module.exports = googleRouter;
