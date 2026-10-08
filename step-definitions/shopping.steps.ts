import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../fixture/TestWorld';
import { catalogue } from '../data/shopping-data';
import { basket } from '../data/cart-data';

Then('shopping has default filters and the complete catalogue', async function (this: TestWorld) {
  await this.shopping.expectDefaultFilters();
  await this.shopping.expectProducts(catalogue.map(product => product.name));
});

Then('every catalogue product and shopping control is correct', async function (this: TestWorld) {
  await this.shopping.expectCatalogue();
});

When('I search products for {string}', async function (this: TestWorld, term: string) {
  await this.shopping.search(term);
});

Then('the search clear and reset controls are visible', async function (this: TestWorld) {
  await this.shopping.expectSearchResetControls();
});

When('I clear product search', async function (this: TestWorld) {
  await this.shopping.clearSearch();
});

When('I select product category {string}', async function (this: TestWorld, category: string) {
  await this.shopping.selectCategory(category);
});

When('I select product price range {string}', async function (this: TestWorld, price: string) {
  await this.shopping.selectPrice(price);
});

Then('only these products are displayed: {string}', async function (this: TestWorld, names: string) {
  await this.shopping.expectProducts(names === 'none' ? [] : names.split(',').map(name => name.trim()));
});

When('I reset shopping filters using {string}', async function (this: TestWorld, name: string) {
  await this.shopping.resetFilters(name);
});

Then('shopping quantities and prices match the {string} basket with other products unchanged', async function (this: TestWorld, name: string) {
  const items = basket(name);
  await this.shopping.expectLoaded();
  await this.shopping.expectQuantities(catalogue.map(product => ({
    ...product, quantity: items.find(item => item.name === product.name)?.quantity ?? 0,
  })));
  await this.shopping.expectPrices(catalogue);
});

When('I attempt checkout with no items', async function (this: TestWorld) {
  await this.shopping.openCheckout();
});
