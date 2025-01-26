const bcrypt = require("bcrypt");
const { getHashedPassword } = require("../../../utils/users");

describe("Bcrypt Password hashing logic", () => {
    test("Returns null when password and google are null", async () => {
        const hashedPassword = await getHashedPassword(null, null);
        expect(hashedPassword).toBeFalsy();
        expect(hashedPassword).toBe(null);
    });

    test("Returns hashed password when google is null", async () => {
        const hashedPassword = await getHashedPassword("SimplePassword", null);
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).toBeTruthy();
    });

    test("Returns true when comparing hashed password with original password", async () => {
        const password = "SimplePassword";
        const hashedPassword = await getHashedPassword(password, null);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    test("Returns null when googleId is provided", async () => {
        const hashedPassword = await getHashedPassword(null, "googleId");
        expect(hashedPassword).toBe(null);
        expect(hashedPassword).toBeFalsy();
        expect(hashedPassword).toBe(null);
    });

    test("Returns null when password and googleId are both provided", async () => {
        const hashedPassword = await getHashedPassword("myPssword", "googleId");
        expect(hashedPassword).toBe(null);
        expect(hashedPassword).toBeFalsy();
        expect(hashedPassword).toBe(null);
    });
});
