const { PORT } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const { unknownEndpoint, logger, errorHandler } = require("./utils/middleware");
app.use(express.json());
const tasksRouter = require("./controllers/tasks");
const usersRouter = require("./controllers/users");
app.use(cors());
app.use(logger);
app.use("/api/tasks/", tasksRouter);
app.use("/api/users/", usersRouter);
app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
