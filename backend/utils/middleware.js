var morgan = require("morgan");
const jwt = require("jsonwebtoken");
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
        return res.status(401).json({ error: "token invalid" });
    else if (err.name === "TokenExpiredError")
        return res.status(401).json({
            error: "token expired",
        });
    next(err);
};

const getTokenFrom = (req) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer "))
        return authorization.replace("Bearer ", "");
    return null;
};

const verifyToken = (req, res, next) => {
    try {
        const token = getTokenFrom(req);
        if (!token)
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: "Missing authorization token.",
            });
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.id)
            return res.status(401).json({
                success: false,
                statusCode: 401,
                error: "Invalid token.",
            });
        req.user = decodedToken;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { logger, unknownEndpoint, errorHandler, verifyToken };
