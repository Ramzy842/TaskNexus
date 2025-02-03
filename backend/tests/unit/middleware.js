const { validationResult } = require("express-validator");
const {
    validateUsername,
    validateName,
    validateEmail,
    validatePassword,
    validatePasswordLogin,
} = require("../../utils/usersValidators");
const {
    validateTitle,
    validateDescription,
    validateStatus,
    validateDate,
    validateTitleUpdate,
    validateDescriptionUpdate,
    validateStatusUpdate,
    validateDateUpdate,
} = require("../../utils/tasksValidators");
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

const validateTask = (req, res, next) => {
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

let tasksCreationValidationParams = [
    validateTitle,
    validateDescription,
    validateStatus,
    validateDate,
];

let tasksUpdateValidationParams = [
    validateTitleUpdate,
    validateDescriptionUpdate,
    validateStatusUpdate,
    validateDateUpdate,
];

const runUsersMiddleWare = async (req, res, next) => {
    try {
        for (let middleware of userValidationParams) {
            await middleware(req, res, next);
        }
    } catch (error) {
        next(error);
    }
};

const runLoginMiddleWare = async (req, res, next) => {
    try {
        for (let middleware of loginValidationParams) {
            await middleware(req, res, next);
        }
    } catch (error) {
        next(error);
    }
};

const runTaskCreationMiddleware = async (req, res, next) => {
    try {
        for (let middleware of tasksCreationValidationParams) {
            await middleware(req, res, next);
        }
    } catch (error) {
        next(error);
    }
};

const runTaskUpdateMiddleware = async (req, res, next) => {
    try {
        for (let middleware of tasksUpdateValidationParams) {
            await middleware(req, res, next);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateUser,
    runUsersMiddleWare,
    runLoginMiddleWare,
    runTaskCreationMiddleware,
    runTaskUpdateMiddleware,
    userValidationParams,
    loginValidationParams,
    tasksCreationValidationParams,
    tasksUpdateValidationParams,
    validateTask,
};
