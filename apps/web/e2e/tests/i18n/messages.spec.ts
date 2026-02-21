import { test, expect } from "@playwright/test";
import enMessages from "../../../messages/en.json";
import thMessages from "../../../messages/th.json";

const REQUIRED_LOGIN_KEYS = [
    "title",
    "description",
    "emailLabel",
    "emailPlaceholder",
    "passwordLabel",
    "passwordPlaceholder",
    "signInButton",
    "orContinueWith",
    "loginWithLine",
    "loginWithGoogle",
    "noAccount",
    "signUpLink",
] as const;

const REQUIRED_COMMON_KEYS = ["appName", "languageSwitcherLabel"] as const;

const THAI_SPECIFIC_LOGIN_KEYS = [
    "title",
    "description",
    "emailLabel",
    "passwordLabel",
    "signInButton",
    "orContinueWith",
    "loginWithLine",
    "loginWithGoogle",
    "noAccount",
    "signUpLink",
] as const;

const THAI_UNICODE_REGEX = /[\u0E00-\u0E7F]/;

const messages = { en: enMessages, th: thMessages } as const;
const locales = ["en", "th"] as const;

test.describe("Translation file key completeness", () => {
    for (const locale of locales) {
        test(`all required Login keys are present and non-empty for locale: ${locale}`, () => {
            const msgs = messages[locale];
            for (const key of REQUIRED_LOGIN_KEYS) {
                expect(msgs.Login[key], `Login.${key} missing for ${locale}`).toBeTruthy();
                expect(msgs.Login[key].length, `Login.${key} empty for ${locale}`).toBeGreaterThan(0);
            }
        });

        test(`all required Common keys are present and non-empty for locale: ${locale}`, () => {
            const msgs = messages[locale];
            for (const key of REQUIRED_COMMON_KEYS) {
                expect(msgs.Common[key], `Common.${key} missing for ${locale}`).toBeTruthy();
                expect(msgs.Common[key].length, `Common.${key} empty for ${locale}`).toBeGreaterThan(0);
            }
        });
    }
});

test.describe("Locale content correctness", () => {
    test("Thai Login strings contain Thai Unicode characters", () => {
        for (const key of THAI_SPECIFIC_LOGIN_KEYS) {
            expect(
                THAI_UNICODE_REGEX.test(thMessages.Login[key]),
                `Login.${key} in th.json should contain Thai characters`
            ).toBe(true);
        }
    });

    test("Thai Common strings contain Thai Unicode characters", () => {
        for (const key of ["appName", "languageSwitcherLabel"] as const) {
            expect(
                THAI_UNICODE_REGEX.test(thMessages.Common[key]),
                `Common.${key} in th.json should contain Thai characters`
            ).toBe(true);
        }
    });

    test("English Login strings do not contain Thai Unicode characters", () => {
        for (const key of REQUIRED_LOGIN_KEYS) {
            expect(
                THAI_UNICODE_REGEX.test(enMessages.Login[key]),
                `Login.${key} in en.json should not contain Thai characters`
            ).toBe(false);
        }
    });

    test("English Common strings do not contain Thai Unicode characters", () => {
        for (const key of REQUIRED_COMMON_KEYS) {
            expect(
                THAI_UNICODE_REGEX.test(enMessages.Common[key]),
                `Common.${key} in en.json should not contain Thai characters`
            ).toBe(false);
        }
    });
});

test.describe("Locale-aware translation lookup", () => {
    test("en.json Login values are non-empty and distinct from th.json for locale-specific keys", () => {
        for (const key of REQUIRED_LOGIN_KEYS) {
            expect(enMessages.Login[key], `en Login.${key} missing`).toBeTruthy();
            expect(enMessages.Login[key].length).toBeGreaterThan(0);
        }
        const anyDiffers = REQUIRED_LOGIN_KEYS.some(
            (k) => enMessages.Login[k] !== thMessages.Login[k]
        );
        expect(anyDiffers).toBe(true);
    });

    test("th.json Login values are non-empty", () => {
        for (const key of REQUIRED_LOGIN_KEYS) {
            expect(thMessages.Login[key], `th Login.${key} missing`).toBeTruthy();
            expect(thMessages.Login[key].length).toBeGreaterThan(0);
        }
    });

    test("/en/login renders English title", async ({ page }) => {
        await page.goto("/en/login");
        const title = page.locator("h1, h2, h3, [class*='CardTitle']").first();
        await expect(title).toContainText(enMessages.Login.title);
    });

    test("/th/login renders Thai title", async ({ page }) => {
        await page.goto("/th/login");
        const title = page.locator("h1, h2, h3, [class*='CardTitle']").first();
        await expect(title).toContainText(thMessages.Login.title);
    });
});
