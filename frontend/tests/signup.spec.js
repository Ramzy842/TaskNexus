import { test, expect } from "@playwright/test";
import { signupWith } from "./helper";
import { describe } from "node:test";

test.beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await page.goto("/");
    await page.getByRole("link", { name: "Signup" }).click();
});

test.afterEach(async ({ request }) => {
    await request.post("/api/testing/reset");
});

test.afterAll(async ({ request }) => {
    await request.post("/api/testing/reset", {
        data: { noCreate: true },
    });
});

describe("Validate signup with valid credentials", () => {
    test("has title: TaskNexus | Signup", async ({ page }) => {
        await expect(page).toHaveTitle("TaskNexus | Signup");
    });

    test("Signup with valid credentials via signup form", async ({ page }) => {
        const date = new Date().getTime();
        await signupWith(
            page,
            "Random User",
            "Random name",
            `email${date}@gmail.com`,
            "password123456"
        );
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
        await signupWith(
            page,
            "Val",
            "Drax",
            "validemail@gmail.com",
            "password123456"
        );
        const successMsg = await page.getByText(
            "Registration completed successfully."
        );
        await expect(successMsg).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Log in", exact: true })
        ).toBeVisible();
        await expect(page).toHaveTitle("TaskNexus | Login");
    });
});

describe("Validate signup with invalid credentials", () => {
    test("Signup with random invalid credential via signup form", async ({
        page,
    }) => {
        await signupWith(
            page,
            "RobertDoe",
            "Robert Doe",
            "robert-doe@gmail.com",
            ""
        );
        const errorMsg = await page.getByText("Password is required.");
        await expect(errorMsg).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Sign up", exact: true })
        ).toBeVisible();
        await expect(page).toHaveTitle("TaskNexus | Signup");
    });

    test("Signup with no credentials via signup form", async ({ page }) => {
        await signupWith(page, "", "", "", "");
        const usernameErrMsg = await page.getByText("Username is required.", {
            exact: true,
        });
        const nameErrMsg = await page.getByText("Name is required.", {
            exact: true,
        });
        const emailErrMsg = await page.getByText("Email is required.", {
            exact: true,
        });
        const passwordErrMsg = await page.getByText("Password is required.", {
            exact: true,
        });
        await expect(usernameErrMsg).toBeVisible();
        await expect(nameErrMsg).toBeVisible();
        await expect(emailErrMsg).toBeVisible();
        await expect(passwordErrMsg).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Sign up", exact: true })
        ).toBeVisible();
        await expect(page).toHaveTitle("TaskNexus | Signup");
    });

    test("Signup with a duplicate email via signup form.", async ({ page }) => {
        await signupWith(
            page,
            "Loki_GOS",
            "Loki Laufeyson",
            "loki_stories@gmail.com",
            "password12345"
        );
        await page.getByRole("link", { name: "Signup" }).click();
        await signupWith(
            page,
            "Loki_GOS",
            "Loki Laufeyson",
            "loki_stories@gmail.com",
            "password12345"
        );
        await expect(
            page.getByRole("button", { name: "Sign up", exact: true })
        ).toBeVisible();
        await expect(
            page.getByText("The email you provided is already in use.", {
                exact: true,
            })
        ).toBeVisible();
        await expect(page).toHaveTitle("TaskNexus | Signup");
    });

    test("Signup with a duplicate email that has different case sensitivity than the original email via signup form.", async ({
        page,
    }) => {
        await signupWith(
            page,
            "Loki_GOS",
            "Loki Laufeyson",
            "loki_stories@gmail.com",
            "password12345"
        );
        await page.getByRole("link", { name: "Signup" }).click();
        await signupWith(
            page,
            "Loki_GOS",
            "Loki Laufeyson",
            "LOKI_stories@gmail.com",
            "password12345"
        );
        await expect(
            page.getByRole("button", { name: "Sign up", exact: true })
        ).toBeVisible();
        await expect(
            page.getByText("The email you provided is already in use.", {
                exact: true,
            })
        ).toBeVisible();
        await expect(page).toHaveTitle("TaskNexus | Signup");
    });
});
