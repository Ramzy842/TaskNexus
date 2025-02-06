require("dotenv").config();
const { rateLimit } = require("express-rate-limit");
const MONGODB_URI =
    process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_MONGODB_URI
        : process.env.MONGODB_URI;

const PORT = process.env.PORT;
const google = {
    Client_ID: process.env.Client_ID,
    Client_SECRET: process.env.Client_SECRET,
};

const isTestEnv = process.env.NODE_ENV === "test";

const limiter = {
    login: rateLimit({
        message: {
            success: false,
            error: "Too many login attempts. Please try again later.",
        },
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: isTestEnv ? 1000 : 5, // each IP can make up to 5 requests per `windowsMs` (15 minutes)
        standardHeaders: true, // add the `RateLimit-*` headers to the response
        legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
    }),
    refresh: rateLimit({
        message: {
            success: false,
            error: "Too many refresh requests. Please try again later.",
        },
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: isTestEnv ? 1000 : 10,
        standardHeaders: true,
        legacyHeaders: false,
    }),
    logout: rateLimit({
        message: {
            success: false,
            error: "Too many logout attempts. Please try again later.",
        },
        windowMs: 30 * 60 * 1000, // 30 minutes
        limit: isTestEnv ? 1000 : 5,
        standardHeaders: true,
        legacyHeaders: false,
    }),
    users: rateLimit({
        message: {
            success: false,
            error: "Too many requests for user-related requests. Please try again later.",
        },
        windowMs: 60 * 60 * 1000, // 1h
        limit: isTestEnv ? 1000 : 20,
        standardHeaders: true,
        legacyHeaders: false,
    }),
    tasks: rateLimit({
        message: {
            success: false,
            error: "Too many task-related requests. Please try again later.",
        },
        windowMs: 60 * 60 * 1000, // 1h
        limit: isTestEnv ? 1000 : 30,
        standardHeaders: true,
        legacyHeaders: false,
    }),
};

module.exports = { MONGODB_URI, PORT, google, limiter };
