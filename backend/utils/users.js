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

const getHashedPassword = async (password) => {
    if (!password)
        return null;
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = { createUser, getHashedPassword };
