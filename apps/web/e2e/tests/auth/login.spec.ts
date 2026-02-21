import { test, expect } from "@playwright/test";

test.describe("Login Page - Structure", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en/login");
    });

    test("page renders without crashing", async ({ page }) => {
        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator("main")).toBeVisible();
    });

    test("renders an email input", async ({ page }) => {
        await expect(page.locator('input[type="email"]#email')).toBeVisible();
    });

    test("renders a password input", async ({ page }) => {
        await expect(page.locator('input[type="password"]#password')).toBeVisible();
    });

    test("renders a submit button with w-full class", async ({ page }) => {
        const btn = page.locator('button[type="submit"]');
        await expect(btn).toBeVisible();
        await expect(btn).toHaveClass(/w-full/);
    });

    test("renders footer link pointing to /signup", async ({ page }) => {
        await expect(page.locator('a[href="/signup"]')).toBeVisible();
    });

    test("CardTitle contains 'Welcome Back' and CardDescription is non-empty", async ({ page }) => {
        await expect(page.getByText("Welcome Back")).toBeVisible();
        await expect(page.getByText("Sign in to book your court")).toBeVisible();
    });

    test("'Or continue with' divider text is present", async ({ page }) => {
        await expect(page.getByText("Or continue with")).toBeVisible();
    });

    test("LINE and Google outline buttons are present", async ({ page }) => {
        const lineBtn = page.getByRole("button", { name: /LINE/i });
        const googleBtn = page.getByRole("button", { name: /Google/i });
        await expect(lineBtn).toBeVisible();
        await expect(googleBtn).toBeVisible();
        await expect(lineBtn).toHaveAttribute("class", /border/);
        await expect(googleBtn).toHaveAttribute("class", /border/);
    });

    test("sign-up link has href='/signup' and displays 'Sign up'", async ({ page }) => {
        const link = page.getByRole("link", { name: "Sign up" });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", "/signup");
    });
});

test.describe("Login Page - Labels", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en/login");
    });

    test("email input is reachable via its label", async ({ page }) => {
        const emailInput = page.getByLabel("Email");
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveAttribute("type", "email");
    });

    test("password input is reachable via its label", async ({ page }) => {
        const passwordInput = page.getByLabel("Password");
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("every input on the page has an associated label", async ({ page }) => {
        const inputs = page.locator("input");
        const count = await inputs.count();

        for (let i = 0; i < count; i++) {
            const input = inputs.nth(i);
            const inputId = await input.getAttribute("id");

            expect(inputId).toBeTruthy();

            const label = page.locator(`label[for="${inputId}"]`);
            await expect(label).toHaveCount(1);
        }
    });
});
