import type { Locator, Page } from '@playwright/test';
import { expect } from '../utils/assertions';
import { config } from '../utils/config';
import { HomePage } from './HomePage';

export class LoginPage {
  constructor(private readonly page: Page, private readonly home = new HomePage(page)) {}

  private username(): Locator {
    return this.page.getByRole('textbox', { name: 'Username', exact: true });
  }

  private password(): Locator {
    return this.page.getByRole('textbox', { name: 'Password', exact: true });
  }

  private submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign In', exact: true });
  }

  private error(): Locator {
    return this.page.getByText('Oops! The credentials are incorrect.', { exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Sign In', exact: true })).toBeVisible();
  }

  async expectFresh(): Promise<void> {
    await expect(this.username()).toHaveValue('');
    await expect(this.password()).toHaveValue('');
    await this.expectNoAuthentication();
    await this.expectErrorCleared();
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.username().fill(username);
    await this.password().fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }

  async signIn(): Promise<void> {
    await this.open();
    await this.fillCredentials(config.username, config.password);
    await this.submit();
    await this.expectAuthenticated();
  }

  async expectFormUsable(): Promise<void> {
    await expect(this.page.getByText('Scripted QA', { exact: true })).toBeVisible();
    await expect(this.page.getByText(config.username, { exact: true })).toBeVisible();
    await expect(this.page.getByText(config.password, { exact: true })).toBeVisible();
    for (const control of [this.username(), this.password(), this.submitButton()]) {
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
    }
    await expect(this.username()).toHaveAttribute('type', 'text');
    await expect(this.password()).toHaveAttribute('type', 'password');
  }

  async enterSamplePassword(): Promise<void> {
    await this.password().fill('InvalidSample1!');
    await expect(this.password()).toHaveValue('InvalidSample1!');
    await expect(this.password()).toHaveAttribute('type', 'password');
  }

  async verifyKeyboardOrderAndSubmit(): Promise<void> {
    await this.username().focus();
    await this.username().press('Tab');
    await expect(this.password()).toBeFocused();
    await this.password().press('Tab');
    await expect(this.submitButton()).toBeFocused();
    await this.submitButton().press('Shift+Tab');
    await expect(this.password()).toBeFocused();
    await this.password().press('Shift+Tab');
    await expect(this.username()).toBeFocused();
    await this.username().press('Tab');
    await this.password().press('Tab');
    await this.submitButton().press('Enter');
  }

  async expectAuthenticated(): Promise<void> {
    await this.home.expectLoaded();
    await this.expectErrorCleared();
    await expect.poll(() => this.page.evaluate(() => ({
      hasToken: Boolean(localStorage.getItem('authToken')?.trim()),
      keepLoggedIn: localStorage.getItem('keepLoggedIn'),
    }))).toEqual({ hasToken: true, keepLoggedIn: 'true' });
  }

  private async expectNoAuthentication(): Promise<void> {
    await expect.poll(() => this.page.evaluate(() => ({
      authToken: localStorage.getItem('authToken'),
      keepLoggedIn: localStorage.getItem('keepLoggedIn'),
    }))).toEqual({ authToken: null, keepLoggedIn: null });
  }

  async expectRejected(): Promise<void> {
    await expect(this.page).toHaveURL(new URL('/', config.baseURL).href);
    await expect(this.error()).toBeVisible();
    await expect(this.error()).toHaveText('Oops! The credentials are incorrect.');
    await this.home.expectNotDisplayed();
    await expect(this.password()).toHaveAttribute('type', 'password');
    await this.expectNoAuthentication();
  }

  async correctField(field: string): Promise<void> {
    if (field === 'username') await this.username().fill(config.username);
    else if (field === 'password') await this.password().fill(config.password);
    else throw new Error(`Unsupported login field: ${field}`);
  }

  async expectErrorCleared(): Promise<void> {
    await expect(this.error()).toHaveCount(0);
  }

  async openShopping(): Promise<void> {
    await this.home.openShopping();
  }
}
