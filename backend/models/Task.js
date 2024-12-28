const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
    .connect(uri)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Database connection error:", error.message);
    });

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Validation: Title is mandatory
        trim: true, // Remove leading/trailing whitespace
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed"], // Restrict values
        default: "To Do", // Default value
    },
    dueDate: {
        type: Date,
        required: true, // Ensure a due date is provided
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
});

taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Task", taskSchema);
