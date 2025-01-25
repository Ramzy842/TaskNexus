const { body, validationResult } = require("express-validator");

// USER VALIDATION
describe("User validation middleware", () => {
    const userValidationParams = [
        body("username")
            .notEmpty()
            .withMessage("Username is required.")
            .isString()
            .withMessage("Invalid username.")
            .trim()
            .escape(),
        body("name")
            .notEmpty()
            .withMessage("Name is required.")
            .isString()
            .withMessage("Invalid name.")
            .trim()
            .escape(),
        body("email")
            .notEmpty()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Invalid email format."),
        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isString()
            .withMessage("Invalid password.")
            .isLength({ min: 12, max: 24 })
            .withMessage(
                "Password should be at least 12 characters long and not exceeding 24 characters."
            )
            .escape(),
    ];

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
        for (let middleware of userValidationParams) {
            await middleware(req, res, next);
        }
    };
    let res, next;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });
    test("Should return all error messages when body is empty", async () => {
        let req = {
            body: {},
        };
        await runMiddleWare(req, res, next);
        validateUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            statusCode: 400,
            errors: [
                "Username is required.",
                "Invalid username.",
                "Name is required.",
                "Invalid name.",
                "Email is required.",
                "Invalid email format.",
                "Password is required.",
                "Invalid password.",
                "Password should be at least 12 characters long and not exceeding 24 characters.",
            ],
        });
    });
    test("should return username is required when username field is empty", async () => {
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
            errors: ["Username is required."],
        });
    });
    test("Should return 'Invalid email format' for invalid email", async () => {
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
            errors: ["Invalid email format."],
        });
    });
    test("Should return 'Password should be at least 12 characters long and not exceeding 24 characters.' when password is less than 12 characters.", async () => {
        let req = {
            body: {
                username: "SomeRandomUsername",
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
            errors: [
                "Password should be at least 12 characters long and not exceeding 24 characters.",
            ],
        });
    });
    test("Should return 'Password should be at least 12 characters long and not exceeding 24 characters.' when password is greater than 24 characters.", async () => {
        let req = {
            body: {
                username: "SomeRandomUsername",
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
            errors: [
                "Password should be at least 12 characters long and not exceeding 24 characters.",
            ],
        });
    });
    test("Should call next upon validation success", async () => {
        let req = {
            body: {
                username: "SomeRandomUsername",
                name: "John Doe",
                email: "johnDoe@gmil.com",
                password: "12345678912345",
            },
        };
        await runMiddleWare(req, res, next);
        // next is called here 4 times because the valiation has (username, name, email, password)
        validateUser(req, res, next);
        // next gets called one more time because the user is valid ==> next called 5 times
        expect(next.mock.calls).toHaveLength(5);
    });
});
