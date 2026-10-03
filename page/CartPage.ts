import type { Locator, Page } from '@playwright/test';
import { expect } from '../utils/assertions';
import type { CartItem } from '../data/cart-data';
import { dollars, cartTotal } from '../utils/money';
import { config } from '../utils/config';

export class CartPage {
  constructor(private readonly page: Page) {}

  private bill(): Locator {
    return this.page.getByRole('heading', { name: '🧾 Bill', exact: true }).locator('..').locator('..');
  }

  private button(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  private total(): Locator {
    return this.bill().getByText('Grand Total', { exact: true }).locator('..');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new URL('/cart', config.baseURL).href);
    await expect(this.page.getByRole('heading', { name: '🧾 Bill', exact: true })).toBeVisible();
    await expect(this.button('Back to Shopping')).toBeVisible();
    await expect(this.button('Back to Shopping')).toBeEnabled();
  }

  async expectBill(items: readonly CartItem[], expectedTotal: string): Promise<void> {
    await this.expectLoaded();
    await expect(this.bill().getByRole('img')).toHaveCount(items.length);
    for (const item of items) {
      const image = this.bill().getByRole('img', { name: item.name, exact: true });
      await expect(image).toHaveCount(1);
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
        { message: `Product image must load: ${item.name}` }).toBe(true);
      const row = image.locator('..').locator('..');
      await expect(row.getByText(item.name, { exact: true })).toBeVisible();
      await expect(row.getByText(`x${item.quantity}`, { exact: true })).toBeVisible();
      await expect(row.getByText(/^\$\d+\.\d{2}$/)).toHaveText(dollars(item.unitCents));
      // The responsive line-total field includes a hidden mobile label on desktop.
      await expect(row.getByText('Total:', { exact: true }).locator('..'))
        .toHaveText(`Total: ${dollars(item.unitCents * item.quantity)}`);
    }
    expect(dollars(cartTotal(items))).toBe(expectedTotal);
    await expect(this.total()).toHaveText(`Grand Total${expectedTotal}`);
    for (const name of ['Clear Cart', 'Place Order']) {
      await expect(this.button(name)).toBeVisible();
      await expect(this.button(name)).toBeEnabled();
    }
    await expect(this.page.getByRole('heading', { name: 'Order Placed Successfully!', exact: true })).toHaveCount(0);
    await expect(this.bill().getByText('Your cart is empty.', { exact: true })).toHaveCount(0);
  }

  async clear(): Promise<void> {
    await this.button('Clear Cart').click();
  }

  async backToShopping(): Promise<void> {
    await this.button('Back to Shopping').click();
  }

  async openDirectly(): Promise<void> {
    await this.page.goto('/cart');
  }

  private async expectNoOrderControls(): Promise<void> {
    await expect(this.bill().getByRole('img')).toHaveCount(0);
    await expect(this.bill().getByText('Grand Total', { exact: true })).toHaveCount(0);
    await expect(this.button('Clear Cart')).toHaveCount(0);
    await expect(this.button('Place Order')).toHaveCount(0);
  }

  async expectEmpty(): Promise<void> {
    await this.expectLoaded();
    await expect(this.bill().getByText('Your cart is empty.', { exact: true })).toBeVisible();
    await this.expectNoOrderControls();
    await expect(this.page.getByRole('heading', { name: 'Order Placed Successfully!', exact: true })).toHaveCount(0);
  }

  async placeOrder(): Promise<void> {
    await this.button('Place Order').click();
  }

  async expectOrderCompleted(): Promise<void> {
    await this.expectLoaded();
    await expect(this.page.getByRole('heading', { name: 'Order Placed Successfully!', exact: true })).toBeVisible();
    await expect(this.bill().getByText('Thank you for your purchase.', { exact: true })).toBeVisible();
    await this.expectNoOrderControls();
    await expect(this.bill().getByText('Your cart is empty.', { exact: true })).toHaveCount(0);
  }
}
