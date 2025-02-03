const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/config");
mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI);

const taskSchema = new mongoose.Schema(
    {
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

taskSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Task", taskSchema);
