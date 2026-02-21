import { type Page, type Locator } from "@playwright/test";

export class LoginPage {
    readonly page: Page;

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly signUpLink: Locator;
    readonly lineButton: Locator;
    readonly googleButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"]#email');
        this.passwordInput = page.locator('input[type="password"]#password');
        this.submitButton = page.locator('button[type="submit"]');
        this.signUpLink = page.locator('a[href="/signup"]');
        this.lineButton = page.getByRole("button", { name: /LINE/i });
        this.googleButton = page.getByRole("button", { name: /Google/i });
    }

    async goto(locale = "en") {
        await this.page.goto(`/${locale}/login`);
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
