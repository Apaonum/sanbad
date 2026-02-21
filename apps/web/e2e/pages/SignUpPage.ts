import { type Page, type Locator } from "@playwright/test";

export class SignUpPage {
    readonly page: Page;

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;
    readonly loginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]').nth(0);
        this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
        this.submitButton = page.locator('button[type="submit"]');
        this.loginLink = page.locator('a[href="/login"]');
    }

    async goto(locale = "en") {
        await this.page.goto(`/${locale}/signup`);
    }

    async signUp(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await this.submitButton.click();
    }
}
