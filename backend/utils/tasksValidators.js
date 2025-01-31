const { body } = require("express-validator");

const validateTitle = body("title")
    .notEmpty()
    .withMessage("Title is required.")
    .isString()
    .withMessage("Title is invalid.")
    .escape();
const validateDescription = body("description")
    .notEmpty()
    .withMessage("Description is required.")
    .isString()
    .withMessage("Description is invalid.")
    .escape();
const validateStatus = body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["To Do", "In Progress", "Completed"])
    .withMessage(
        "Invalid status value. Allowed values are: To Do, In Progress, Completed."
    );

const validateDate = body("dueDate")
    .notEmpty()
    .withMessage("DueDate is required")
    .isISO8601()
    .withMessage("DueDate must be in ISO8601 format (e.g., YYYY-MM-DD).");

const validateTitleUpdate = body("title")
    .optional()
    .notEmpty()
    .withMessage("Title must not be empty if provided.")
    .isString()
    .withMessage("Title is invalid.")
    .escape();
const validateDescriptionUpdate = body("description")
    .optional()
    .notEmpty()
    .withMessage("Description must not be empty if provided.")
    .isString()
    .withMessage("Description is invalid.")
    .escape();
const validateStatusUpdate = body("status")
    .optional()
    .notEmpty()
    .withMessage("Status must not be empty if provided.")
    .isIn(["To Do", "In Progress", "Completed"])
    .withMessage(
        "Invalid status value. Allowed values are: To Do, In Progress, Completed."
    );
const validateDateUpdate = body("dueDate")
    .optional()
    .notEmpty()
    .withMessage("DueDate must not be empty if provided.")
    .isISO8601()
    .withMessage("DueDate must be in ISO8601 format (e.g., YYYY-MM-DD).");

module.exports = {
    validateDate,
    validateDescription,
    validateStatus,
    validateTitle,
    validateTitleUpdate,
    validateDescriptionUpdate,
    validateStatusUpdate,
    validateDateUpdate,
};
