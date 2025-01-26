const bcrypt = require("bcrypt");
const User = require("../models/User");
const createUser = async (username, name, email, passwordHash) => {
    const user = new User({
        username,
        name,
        email,
        passwordHash,
    });
    return user;
};

const getHashedPassword = async (password, googleId) => {
    if (!password && !googleId)
        return null;
    const saltRounds = 10;
    if (googleId) return null;
    return await bcrypt.hash(password, saltRounds);
};

const messages = {
    usedEmail: "The email you provided is already in use.",
    passwordOrGoogleRequired: "Either password or googleId is required.",
    successfullRegistration: "Registration completed successfully.",
    unauthorizedToUpdate: "You are not authorized to update user info.",
    userToUpdateNotFound: "The user you are trying to update is not found.",
    successfullUserUpdate: "User updated successfully.",
};

module.exports = { createUser, getHashedPassword, messages };
