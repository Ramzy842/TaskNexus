const mongoose= require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");

const testingRouter = require("express").Router();

testingRouter.post("/reset", async (req, res) => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Task.collection.drop();
    await User.collection.drop();
    await mongoose.disconnect();
    await mongoose.connection.close();
    const { noCreate } = req.body;
    if (!noCreate)
    {
        const testDB_name = `test_db_${Date.now()}`;
        const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.qztos.mongodb.net/${testDB_name}?retryWrites=true&w=majority&appName=Cluster0`;
        await mongoose.connect(mongoUri);
    }
    res.status(204).end();
});

module.exports = testingRouter;
