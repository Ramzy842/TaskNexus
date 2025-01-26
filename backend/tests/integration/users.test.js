const mongoose = require("mongoose");
const superset = require("supertest");
const app = require("app");
const api = superset(app);

describe("POST /api/users", () => {
    test("Returns status 400 and validation errors upon missing body properties", async () => {});
    test("Returns status 400 and all validation errors when body is empty", async () => {});
    test("Returns status 409 and used email message when email is already used", async () => {});
    test("Returns status 400 and 'password or googleId' error message when both are missing", async () => {});
    test("Returns status 201 and success message upon user registration", async () => {});
    test("Returns the user object when user is registered successfully", async () => {});
});

describe("GET /api/users", () => {});

describe("PUT /api/users/:id", () => {});
