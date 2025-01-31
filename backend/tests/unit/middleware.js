const { validationResult } = require("express-validator");
const {
    validateUsername,
    validateName,
    validateEmail,
    validatePassword,
    validatePasswordLogin,
} = require("../../utils/validators");
const validateUser = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            errors: result.array().map((res) => res.msg),
        });
    }
    next();
};

let userValidationParams = [
    validateUsername,
    validateName,
    validateEmail,
    validatePassword,
];

let loginValidationParams = [validateEmail, validatePasswordLogin];

const runUsersMiddleWare = async (req, res, next) => {
    try {
        for (let middleware of userValidationParams) {
            await middleware(req, res, next);
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: "Internal server error.",
        });
    }
};

const runLoginMiddleWare = async (req, res, next) => {
    try {
        for (let middleware of loginValidationParams) {
            await middleware(req, res, next);
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            error: "Internal server error.",
        });
    }
};

module.exports = {
    validateUser,
    runUsersMiddleWare,
    runLoginMiddleWare,
    userValidationParams,
    loginValidationParams,
};
