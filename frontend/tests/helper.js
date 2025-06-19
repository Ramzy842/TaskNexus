const signupWith = async (page, username, name, email, password) => {
    await page.getByPlaceholder("e.g. NoobMaster69").fill(username);
    await page.getByPlaceholder("e.g. Loki").fill(name);
    await page.getByPlaceholder("e.g. asgard.ragnarok@gmail.com").fill(email);
    await page.getByPlaceholder("Your password").fill(password);
    await page.getByRole("button", { name: "Sign up" }).click();
};

export {signupWith}