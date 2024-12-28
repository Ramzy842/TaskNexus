const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose.connect(uri);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Ensures the name field is mandatory
            trim: true, // Removes leading and trailing whitespace
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures no duplicate emails
            lowercase: true, // Converts to lowercase before saving
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Email validation
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Password is required if Google ID is not present
            },
            minlength: 8, // Enforce minimum password length
        },
        googleId: {
            type: String,
            unique: true, // Ensures no duplicate Google IDs
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("User", userSchema);
