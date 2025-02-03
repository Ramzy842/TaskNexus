const { messages } = require("../../utils/usersValidators");
const {
    runUsersMiddleWare,
    validateUser,
    userValidationParams,
} = require("./middleware");
const bcrypt = require("bcrypt");
const { getHashedPassword } = require("../../utils/users");

let res, next;
beforeEach(() => {
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
});

describe("User validation middleware", () => {
    test("Returns all error messages when body is empty", async () => {
        let req = {
            body: {},
        };
        await runUsersMiddleWare(req, res, next);
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
        await runUsersMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [
                messages.usernameRequired,
                messages.inaccurateUsernameLength,
            ],
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
        await runUsersMiddleWare(req, res, next);
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
        await runUsersMiddleWare(req, res, next);
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
        await runUsersMiddleWare(req, res, next);
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
        await runUsersMiddleWare(req, res, next);
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
        await runUsersMiddleWare(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe("Unexpected error");
    });
});

describe("Bcrypt Password hashing logic", () => {
    test("Returns null when password is null", async () => {
        const hashedPassword = await getHashedPassword(null);
        expect(hashedPassword).toBeFalsy();
        expect(hashedPassword).toBe(null);
    });
    test("Returns true when comparing hashed password with original password", async () => {
        const password = "SimplePassword";
        const hashedPassword = await getHashedPassword(password, null);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });
});
