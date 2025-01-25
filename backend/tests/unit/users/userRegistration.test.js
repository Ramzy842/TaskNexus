const { getHashedPassword } = require("../../../utils/users");

test("Returns hashed password when google is null", async () => {
    const hashedPassword = await getHashedPassword("SimplePassword", null);
    expect(hashedPassword).toBeDefined()
    expect(hashedPassword).toBeTruthy()
});

test("Returns null when googleId is provided", async () => {
    const hashedPassword = await getHashedPassword(null, "googleId")
    expect(hashedPassword).toBe(null);
});

test("Returns null when password and googleId are both provided", async () => {
    const hashedPassword = await getHashedPassword("myPssword", "googleId")
    expect(hashedPassword).toBe(null);
});
