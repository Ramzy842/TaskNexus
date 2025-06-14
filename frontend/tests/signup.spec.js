import { test , expect } from '@playwright/test';

test.beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:4000/api/testing/reset");
    await page.goto("http://localhost:5173/");
});


test("has title: TaskNexus | Signup", async ({ page }) => {
    await page.getByRole("link", { name: "Signup" }).click();
    await expect(page).toHaveTitle("TaskNexus | Signup");
});

test("Signup with valid credentials via signup form", async ({ page }) => {
    // TC-SIGNUP-001: Valid signup → show success message → redirect to login after 3s
    // await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "Signup" }).click();

    await page.getByPlaceholder("e.g. NoobMaster69").fill("Random User");
    await page.getByPlaceholder("e.g. Loki").fill("Random name");

    const date = new Date().getTime();
    await page
        .getByPlaceholder("e.g. asgard.ragnarok@gmail.com")
        .fill(`email${date}@gmail.com`);
    await page.getByPlaceholder("Your password").fill("password123456");

    await page.getByRole("button", { name: "Sign up" }).click();
    const successMsg = await page.getByText(
        "Registration completed successfully."
    );
    await expect(successMsg).toBeVisible();

    await expect(
        page.getByRole("button", { name: "Log in", exact: true })
    ).toBeVisible();
    await expect(page).toHaveTitle("TaskNexus | Login");
});

test("Signup with valid username length: 3, valid email, name and password via signup form.", async ({
    page,
}) => {
    // NB: a valid username length is between 3 and 16
    // await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "Signup" }).click();

    await page.getByPlaceholder("e.g. NoobMaster69").fill("Val");
    await page.getByPlaceholder("e.g. Loki").fill("Drax");
    await page
        .getByPlaceholder("e.g. asgard.ragnarok@gmail.com")
        .fill(`validemail@gmail.com`);
    await page.getByPlaceholder("Your password").fill("password123456");

    await page.getByRole("button", { name: "Sign up" }).click();
    const successMsg = await page.getByText(
        "Registration completed successfully."
    );
    await expect(successMsg).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Log in", exact: true })
    ).toBeVisible();
    await expect(page).toHaveTitle("TaskNexus | Login");
});
