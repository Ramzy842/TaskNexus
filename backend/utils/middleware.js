var morgan = require("morgan");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { responseMessages } = require("./responseMessages");
const logger = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.method(req, res) === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ");
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        success: false,
        statusCode: 404,
        error: "unknown endpoint",
    });
};

const errorHandler = (err, req, res, next) => {
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            error: "Malformatted Id",
        });
    } else if (err.name === "JsonWebTokenError")
        return res
            .status(401)
            .json({ success: false, statusCode: 401, error: "Token invalid" });
    else if (err.name === "TokenExpiredError")
        return res.status(401).json({
            success: false,
            statusCode: 401,
            error: "Token expired",
        });
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error.",
    });
};

const getTokenFrom = (req) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer "))
        return authorization.replace("Bearer ", "");
    return null;
};

const verifyToken = async (req, res, next) => {
    try {
        const token = getTokenFrom(req);
        if (!token)
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: "Missing JWT token.",
            });
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET);
        if (!decodedToken.id)
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: "Invalid JWT token.",
            });
        const user = await User.findById(decodedToken.id);
        if (process.env.NODE_ENV !== "test" && !user) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: responseMessages.users.toRetrieveNotFound,
            });
        }
        if (user && user.blacklistedAccessTokens.includes(token)) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: "Session expired. Please log in again.",
            });
        }
        req.user = decodedToken;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    logger,
    unknownEndpoint,
    errorHandler,
    verifyToken,
    getTokenFrom,
};
