const { messages } = require("./usersValidators");
const { body } = require("express-validator");

const validateEmail = body("email")
    .notEmpty()
    .withMessage(messages.emailRequired)
    .isEmail()
    .withMessage(messages.invalidEmail);
const validatePassword = body("password")
    .notEmpty()
    .withMessage(messages.passwordRequired)
    .isString()
    .escape();
module.exports = { validateEmail, validatePassword };
