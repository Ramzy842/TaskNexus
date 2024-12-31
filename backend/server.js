const { PORT } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const { unknownEndpoint, logger } = require("./utils/middleware");
app.use(express.json());
const tasksRouter = require("./controllers/tasks");
app.use(cors());
app.use(logger);
app.use("/api/tasks/", tasksRouter);
app.use(unknownEndpoint);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
