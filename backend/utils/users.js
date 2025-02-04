const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    if (!password) return null;
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_SECRET, {
        expiresIn: "20m",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

module.exports = {
    createUser,
    getHashedPassword,
    generateAccessToken,
    generateRefreshToken,
};
