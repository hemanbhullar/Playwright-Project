import type { Locator, Page } from '@playwright/test';
import { expect } from '../utils/assertions';
import type { CartItem } from '../data/cart-data';
import { config } from '../utils/config';
import { catalogue, categoryOptions, priceOptions, type Product } from '../data/shopping-data';

export class ShoppingPage {
  constructor(private readonly page: Page) {}

  // The application has no card roles/test IDs. Traverse only inside this page object.
  private card(name: string): Locator {
    return this.page.getByRole('img', { name, exact: true }).locator('..').locator('..');
  }

  private checkout(): Locator {
    return this.page.getByRole('button', { name: /^Checkout Items:/ });
  }

  private searchInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Search products...', exact: true });
  }

  private categoryFilter(): Locator {
    return this.page.getByRole('combobox').nth(0);
  }

  private priceFilter(): Locator {
    return this.page.getByRole('combobox').nth(1);
  }

  private addButtons(): Locator {
    return this.page.getByRole('button', { name: /^Add to Cart/ });
  }

  async expectDefaultFilters(): Promise<void> {
    await expect(this.searchInput()).toHaveValue('');
    await expect(this.categoryFilter().getByRole('option', { selected: true })).toHaveText('All Categories');
    await expect(this.priceFilter().getByRole('option', { selected: true })).toHaveText('All Prices');
    await expect(this.page.getByRole('button', { name: 'Reset Filters', exact: true })).toHaveCount(0);
    await expect(this.page.getByRole('button', { name: 'Reset All Filters', exact: true })).toHaveCount(0);
  }

  async expectProducts(names: readonly string[]): Promise<void> {
    await expect(this.addButtons()).toHaveCount(names.length);
    for (const name of names) {
      await expect(this.card(name)).toHaveCount(1);
      await expect(this.card(name).getByText(name, { exact: true })).toBeVisible();
      await expect(this.card(name).getByRole('img', { name, exact: true })).toBeVisible();
    }
    if (names.length === 0) {
      await expect(this.page.getByText('No products found matching your current filters.', { exact: true })).toBeVisible();
      await expect(this.page.getByRole('button', { name: 'Reset All Filters', exact: true })).toBeVisible();
    } else {
      await expect(this.page.getByText('No products found matching your current filters.', { exact: true })).toHaveCount(0);
    }
  }

  async expectCatalogue(): Promise<void> {
    await this.expectLoaded();
    for (const control of [this.searchInput(), this.categoryFilter(), this.priceFilter(), this.checkout()]) {
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
    }
    await expect(this.categoryFilter().getByRole('option')).toHaveText(categoryOptions);
    await expect(this.priceFilter().getByRole('option')).toHaveText(priceOptions);
    await this.expectProducts(catalogue.map(product => product.name));
    for (const product of catalogue) {
      const card = this.card(product.name);
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByText(product.category, { exact: true })).toBeVisible();
      await this.expectPrices([product]);
      const image = card.getByRole('img', { name: product.name, exact: true });
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
        { message: `Catalogue image must load: ${product.name}` }).toBe(true);
      await expect(card.getByRole('button', { name: 'Add to Cart', exact: true })).toBeEnabled();
    }
    await this.expectCount(0);
  }

  async expectPrices(products: readonly Pick<Product, 'name' | 'unitCents'>[]): Promise<void> {
    for (const product of products) {
      expect(product.unitCents).toBeGreaterThan(0);
      await expect(this.card(product.name).getByText(/^\$\d+(\.\d+)?$/))
        .toHaveText(`$${product.unitCents / 100}`);
    }
  }

  async search(term: string): Promise<void> {
    await this.searchInput().fill(term);
  }

  async expectSearchResetControls(): Promise<void> {
    await expect(this.page.getByRole('button', { name: '✕', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Reset Filters', exact: true })).toBeVisible();
  }

  async clearSearch(): Promise<void> {
    await this.page.getByRole('button', { name: '✕', exact: true }).click();
    await expect(this.searchInput()).toHaveValue('');
  }

  async selectCategory(label: string): Promise<void> {
    await this.categoryFilter().selectOption({ label });
    await expect(this.categoryFilter().getByRole('option', { selected: true })).toHaveText(label);
  }

  async selectPrice(label: string): Promise<void> {
    await this.priceFilter().selectOption({ label });
    await expect(this.priceFilter().getByRole('option', { selected: true })).toHaveText(label);
  }

  async resetFilters(buttonName: string): Promise<void> {
    if (!['Reset Filters', 'Reset All Filters'].includes(buttonName)) throw new Error(`Unsupported reset: ${buttonName}`);
    await this.page.getByRole('button', { name: buttonName, exact: true }).click();
  }

  async expectEmptyCheckoutSafe(): Promise<void> {
    await this.expectLoaded();
    await this.expectCount(0);
    await expect(this.page.getByRole('heading', { name: '🧾 Bill', exact: true })).toHaveCount(0);
    await expect(this.page.getByRole('heading', { name: 'Order Placed Successfully!', exact: true })).toHaveCount(0);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new URL('/shopping', config.baseURL).href);
    await expect(this.page.getByRole('heading', { name: 'Products', exact: true })).toBeVisible();
  }

  async expectCatalogueAvailable(destination: string): Promise<void> {
    await this.expectLoaded();
    await expect(this.page).toHaveURL(new URL(destination, config.baseURL).href);
    await expect(this.searchInput()).toBeVisible();
    const addButtons = this.page.getByRole('button', { name: 'Add to Cart', exact: true });
    await expect(addButtons.first()).toBeVisible();
    await expect(addButtons.first()).toBeEnabled();
  }

  async expectCount(count: number): Promise<void> {
    await expect(this.checkout()).toHaveText(new RegExp(`^Checkout Items:\\s*${count}$`));
  }

  async addItems(items: readonly CartItem[]): Promise<void> {
    for (const item of items) {
      for (let unit = 0; unit < item.quantity; unit++) {
        await this.card(item.name).getByRole('button', { name: /^Add to Cart/ }).click();
      }
    }
  }

  async expectQuantities(items: readonly CartItem[]): Promise<void> {
    for (const item of items) {
      await expect(this.card(item.name).getByRole('button', { name: /^Add to Cart/ }))
        .toHaveText(item.quantity ? `Add to Cart (${item.quantity})` : 'Add to Cart');
    }
  }

  async openCheckout(): Promise<void> {
    await this.checkout().click();
  }
}
