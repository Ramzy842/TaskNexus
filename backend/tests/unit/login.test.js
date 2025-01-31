const { messages } = require("../../utils/validators");
const {
    validateUser,
    runLoginMiddleWare,
    loginValidationParams,
} = require("./middleware");

// Validation Tests
let res, next;

beforeEach(() => {
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
});

test("Returns 400 with 'email is required.' and 'Invalid email format.' when email is missing", async () => {
    let req = { body: { password: "password123456789" } };
    await runLoginMiddleWare(req, res, next);
    validateUser(req, res, next);
    // next called only in the runLoginMiddleWare fn to run validators
    expect(next.mock.calls).toHaveLength(loginValidationParams.length);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        errors: [messages.emailRequired, messages.invalidEmail],
    });
});

test("Returns 400 with 'Invalid email format.' when email format is invalid", async () => {
    let req = { body: { email: "email.com", password: "password123456789" } };
    await runLoginMiddleWare(req, res, next);
    validateUser(req, res, next);
    // next called only in the runLoginMiddleWare fn to run validators
    expect(next.mock.calls).toHaveLength(loginValidationParams.length);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        errors: [messages.invalidEmail],
    });
});

test("Returns 400 with 'Password is required.' when password is missing", async () => {
    let req = { body: { email: "email@gmail.com", password: "" } };
    await runLoginMiddleWare(req, res, next);
    validateUser(req, res, next);
    // next called only in the runLoginMiddleWare fn to run validators
    expect(next.mock.calls).toHaveLength(loginValidationParams.length);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        statusCode: 400,
        errors: [messages.passwordRequired],
    });
});

test("Calls next when validation succeeds", async () => {
    let req = { body: { email: "email@gmail.com", password: "password123456789" } };
    await runLoginMiddleWare(req, res, next);
    validateUser(req, res, next);
    // next called in the runLoginMiddleWare fn to run validators and when validation succeeds
    expect(next.mock.calls).toHaveLength(loginValidationParams.length + 1);
})

test("Ignores unexpected fields and logs in successfully", async () => {
    let req = {
        body: {
            email: "email@gmail.com",
            password: "password123456789",
            extraField: "shouldBeIgnored",
        },
    };
    await runLoginMiddleWare(req, res, next);
    validateUser(req, res, next);
    expect(next.mock.calls).toHaveLength(loginValidationParams.length + 1);
});