const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/config");
mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        passwordHash: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: 8,
        },
        googleId: {
            type: String,
            required: function () {
                return !this.passwordHash;
            },
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
        refreshToken: { type: String },
    },
    {
        timestamps: true,
    }
);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

module.exports = mongoose.model("User", userSchema);
