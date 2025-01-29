const { validationResult } = require("express-validator");
const {
    validateUsername,
    validateName,
    validateEmail,
    validatePassword,
    messages,
} = require("../../../utils/validators");

describe("User validation middleware", () => {
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
    const runMiddleWare = async (req, res, next) => {
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
    let res, next, userValidationParams;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        userValidationParams = [
            validateUsername,
            validateName,
            validateEmail,
            validatePassword,
        ];
    });
    test("Returns all error messages when body is empty", async () => {
        let req = {
            body: {},
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: Object.values(messages),
        });
    });
    test("Returns error when username field is empty", async () => {
        let req = {
            body: {
                username: "",
                name: "Jon Doe",
                email: "johnDoe@gmail.com",
                password: "12345678912345",
            },
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [messages.usernameRequired, messages.inaccurateUsernameLength],
        });
    });
    test("Returns error for invalid email format", async () => {
        let req = {
            body: {
                username: "RandomUsername",
                name: "Jon Doe",
                email: "johnDoe.com",
                password: "12345678912345",
            },
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [messages.invalidEmail],
        });
    });
    test("Returns password length error when password is less than 12 characters.", async () => {
        let req = {
            body: {
                username: "SomeRandomUser",
                name: "John Doe",
                email: "johnDoe@gmil.com",
                password: "123456789",
            },
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [messages.inaccuratePasswordLength],
        });
    });
    test("Returns password length error when password is greater than 24 characters.", async () => {
        let req = {
            body: {
                username: "SomeRandomUser",
                name: "John Doe",
                email: "johnDoe@gmil.com",
                password: "123456789123456789123456789",
            },
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [messages.inaccuratePasswordLength],
        });
    });
    test("Calls next upon validation success", async () => {
        let req = {
            body: {
                username: "SomeRandomUser",
                name: "John Doe",
                email: "johnDoe@gmil.com",
                password: "12345678912345",
            },
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        // Expect one call for each middleware and an additional call for validateUser's next()
        expect(next.mock.calls).toHaveLength(userValidationParams.length + 1);
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    test("Handles errors in middleware chain gracefully", async () => {
        const req = {
            body: {
                username: "ValidUsername",
                name: "John Doe",
                email: "johndoe@gmail.com",
                password: "12345678912345",
            },
        };
        userValidationParams[0] = jest.fn(() => {
            throw new Error("Unexpected error");
        });
        await runMiddleWare(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 500,
            error: "Internal server error.",
        });
    });
});
