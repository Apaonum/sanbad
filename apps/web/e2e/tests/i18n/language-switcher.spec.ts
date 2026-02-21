import { test, expect } from "@playwright/test";

const locales = ["th", "en"] as const;
const localeLabels = { th: "ภาษาไทย", en: "English" } as const;

test.describe("LanguageSwitcher renders all locales", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en/login");
    });

    test("dropdown trigger is visible", async ({ page }) => {
        const trigger = page
            .locator('[data-testid="language-switcher"], button')
            .filter({ hasText: /EN|TH/i })
            .first();
        await expect(trigger).toBeVisible();
    });

    test("dropdown contains an option for each locale", async ({ page }) => {
        const trigger = page.locator("button").filter({ hasText: /EN|TH/i }).first();
        await trigger.click();

        for (const locale of locales) {
            const item = page.getByText(localeLabels[locale]);
            await expect(item).toBeVisible();
        }
    });
});

test.describe("Language switcher URL transformation", () => {
    test("switching from EN to TH navigates to /th equivalent", async ({ page }) => {
        await page.goto("/en/login");
        const trigger = page.locator("button").filter({ hasText: /EN/i }).first();
        await trigger.click();
        await page.getByText(localeLabels.th).click();
        await expect(page).toHaveURL(/\/th\/login/);
    });

    test("switching from TH to EN navigates to /en equivalent", async ({ page }) => {
        await page.goto("/th/login");
        const trigger = page.locator("button").filter({ hasText: /TH/i }).first();
        await trigger.click();
        await page.getByText(localeLabels.en).click();
        await expect(page).toHaveURL(/\/en\/login/);
    });
});
