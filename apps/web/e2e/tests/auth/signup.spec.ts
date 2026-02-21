import { test, expect } from "@playwright/test";

const LOCALES = ["en", "th"] as const;

test.describe("Sign Up Page - Structure", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en/signup");
    });

    test("page renders without crashing", async ({ page }) => {
        await expect(page).toHaveURL(/\/signup/);
        await expect(page.locator("main")).toBeVisible();
    });

    test("email input is visible", async ({ page }) => {
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test("two password inputs are visible", async ({ page }) => {
        const passwordInputs = page.locator('input[type="password"]');
        await expect(passwordInputs).toHaveCount(2);
        await expect(passwordInputs.nth(0)).toBeVisible();
        await expect(passwordInputs.nth(1)).toBeVisible();
    });

    test("submit button with w-full class is visible", async ({ page }) => {
        const submitBtn = page.locator('button[type="submit"]');
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toHaveClass(/w-full/);
    });

    test("footer link has href='/login'", async ({ page }) => {
        const link = page.locator('a[href="/login"]');
        await expect(link).toBeVisible();
    });
});

test.describe("Sign Up Page - Labels", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en/signup");
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

    test("confirm password input is reachable via its label", async ({ page }) => {
        const confirmInput = page.getByLabel("Confirm Password");
        await expect(confirmInput).toBeVisible();
        await expect(confirmInput).toHaveAttribute("type", "password");
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

for (const locale of LOCALES) {
    test.describe(`Sign Up Page - i18n completeness (${locale})`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(`/${locale}/signup`);
        });

        test("card title is non-empty", async ({ page }) => {
            const title = page.locator("h1, h2, h3, [class*='CardTitle'], .text-2xl").first();
            await expect(title).not.toBeEmpty();
        });

        test("card description is non-empty", async ({ page }) => {
            const description = page
                .locator("p, [class*='CardDescription'], .text-sm.text-muted-foreground")
                .first();
            await expect(description).not.toBeEmpty();
        });

        test("email label is non-empty", async ({ page }) => {
            const label = page.locator('label[for="email"]');
            await expect(label).not.toBeEmpty();
        });

        test("password label is non-empty", async ({ page }) => {
            const label = page.locator('label[for="password"]');
            await expect(label).not.toBeEmpty();
        });

        test("confirm password label is non-empty", async ({ page }) => {
            const label = page.locator('label[for="confirmPassword"]');
            await expect(label).not.toBeEmpty();
        });

        test("submit button is non-empty", async ({ page }) => {
            const btn = page.locator('button[type="submit"]');
            await expect(btn).not.toBeEmpty();
        });

        test("footer 'already have account' text is non-empty", async ({ page }) => {
            const footer = page.locator("footer, [class*='CardFooter']").first();
            const text = await footer.innerText();
            expect(text.trim().length).toBeGreaterThan(0);
        });

        test("login link text is non-empty", async ({ page }) => {
            const link = page.locator('a[href="/login"]');
            await expect(link).not.toBeEmpty();
        });
    });
}
