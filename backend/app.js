const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { unknownEndpoint, logger, errorHandler } = require("./utils/middleware");
const { limiter } = require("./utils/config");
const tasksRouter = require("./controllers/tasks");
const usersRouter = require("./controllers/users");
const googleRouter = require("./controllers/google");
const authRouter = require("./controllers/auth");

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(logger);

// Rate limiting
app.use('/api/auth/login', limiter.login);
app.use('/api/auth/login/refresh', limiter.refresh);
app.use('/api/auth/logout', limiter.logout);
app.use('/api/users/', limiter.users);
app.use('/api/tasks/', limiter.tasks);

// Routers
app.use("/api/tasks/", tasksRouter);
app.use("/api/users/", usersRouter);
app.use("/api/auth/", authRouter);
app.use("/api/auth/google/", googleRouter);
app.use(unknownEndpoint);
app.use(errorHandler);
module.exports = app;
