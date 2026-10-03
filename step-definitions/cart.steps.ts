import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld as CartWorld } from '../fixture/TestWorld';
import { basket } from '../data/cart-data';

Given('I am signed in with a fresh empty shopping cart', async function (this: CartWorld) {
  await this.login.signIn();
  await this.login.openShopping();
  await this.shopping.expectLoaded();
  await this.shopping.expectCount(0);
});

When('I add the {string} basket to my cart', async function (this: CartWorld, name: string) {
  await this.shopping.addItems(basket(name));
});

Then('the checkout count is {int}', async function (this: CartWorld, count: number) {
  await this.shopping.expectCount(count);
});

When('I open checkout', async function (this: CartWorld) {
  await this.shopping.openCheckout();
  await this.cart.expectLoaded();
});

Then('the bill matches the {string} basket with a total of {string}', async function (this: CartWorld, name: string, total: string) {
  await this.cart.expectBill(basket(name), total);
});

When('I clear the cart', async function (this: CartWorld) {
  await this.cart.clear();
});

Then('the cart is empty and cannot be ordered', async function (this: CartWorld) {
  await this.cart.expectEmpty();
});

When('I return to shopping', async function (this: CartWorld) {
  await this.cart.backToShopping();
  await this.shopping.expectLoaded();
});

Then('shopping retains the {string} basket quantities', async function (this: CartWorld, name: string) {
  await this.shopping.expectQuantities(basket(name));
});

Then('shopping has no quantities for the {string} basket', async function (this: CartWorld, name: string) {
  await this.shopping.expectQuantities(basket(name).map(item => ({ ...item, quantity: 0 })));
});

When('I visit the cart directly without adding products', async function (this: CartWorld) {
  await this.cart.openDirectly();
});

When('I place the demo order', async function (this: CartWorld) {
  await this.cart.placeOrder();
});

Then('the order is confirmed and cannot be submitted again', async function (this: CartWorld) {
  await this.cart.expectOrderCompleted();
});
