import { test, expect } from "@playwright/test";
import { locales, defaultLocale, localeLabels } from "../../../src/i18n/config";

test.describe("i18n config exports", () => {
    test("locales equals ['th', 'en']", () => {
        expect(locales).toEqual(["th", "en"]);
    });

    test("defaultLocale equals 'th'", () => {
        expect(defaultLocale).toBe("th");
    });

    test("localeLabels has a non-empty entry for every locale", () => {
        for (const locale of locales) {
            expect(localeLabels[locale]).toBeTruthy();
            expect(localeLabels[locale].length).toBeGreaterThan(0);
        }
    });

    test("defaultLocale is a member of locales", () => {
        expect(locales).toContain(defaultLocale);
    });
});
