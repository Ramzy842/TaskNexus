const bcrypt = require("bcrypt");
const { getHashedPassword } = require("../../../utils/users");

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
