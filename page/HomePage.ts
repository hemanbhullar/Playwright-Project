import type { Locator, Page } from '@playwright/test';
import { expect } from '../utils/assertions';
import { config } from '../utils/config';

export class HomePage {
  constructor(private readonly page: Page) {}

  private heading(): Locator {
    return this.page.getByRole('heading', { name: 'Welcome back, Automation Engineer! 👋', exact: true });
  }

  private navigationLink(name: string): Locator {
    return this.page.getByRole('complementary').getByRole('link', { name, exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new URL('/home', config.baseURL).href);
    await expect(this.heading()).toBeVisible();
  }

  async expectNotDisplayed(): Promise<void> {
    await expect(this.heading()).toHaveCount(0);
  }

  async expectNavigationLink(name: string, destination: string): Promise<void> {
    await this.expectLoaded();
    const sidebar = this.page.getByRole('complementary');
    await expect(sidebar.getByRole('heading', { name: 'Categories', exact: true })).toBeVisible();
    const link = this.navigationLink(name);
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    await expect(link).toHaveAttribute('href', destination);
  }

  async followNavigationLink(name: string): Promise<void> {
    await this.navigationLink(name).click();
  }

  async openShopping(): Promise<void> {
    await this.followNavigationLink('Shopping');
  }
}
