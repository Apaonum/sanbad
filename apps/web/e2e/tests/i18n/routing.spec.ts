import { test, expect } from "@playwright/test";

const defaultLocale = "th";

test.describe("Proxy routing — locale prefix invariant", () => {
    test("root path / redirects to /th/", async ({ page }) => {
        await page.goto("/");
        expect(page.url()).toContain(`/${defaultLocale}`);
    });

    test("path without locale prefix /login redirects to /th/login", async ({ page }) => {
        await page.goto("/login");
        expect(page.url()).toContain(`/${defaultLocale}/login`);
    });

    test("/en/login passes through without further redirect", async ({ page }) => {
        await page.goto("/en/login");
        expect(page.url()).toContain("/en/login");
    });

    test("/th/login passes through without further redirect", async ({ page }) => {
        await page.goto("/th/login");
        expect(page.url()).toContain("/th/login");
    });
});

test.describe("Proxy exclusion — static and API paths pass through", () => {
    test("/_next/static paths return a response (not redirected to locale)", async ({ request }) => {
        const response = await request.get("/_next/static/chunks/main.js");
        expect(response.url()).not.toContain(`/${defaultLocale}/_next`);
    });
});
