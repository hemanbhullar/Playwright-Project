import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../fixture/TestWorld';
import { loginData } from '../data/login-data';

Given('I open the login page with no saved session', async function (this: TestWorld) {
  await this.login.open();
  await this.login.expectFresh();
});

Then('the login form and demo credentials are available', async function (this: TestWorld) {
  await this.login.expectFormUsable();
});

When('I enter a masked sample password', async function (this: TestWorld) {
  await this.login.enterSamplePassword();
});

When('I navigate forward and backward through the form and submit using the keyboard', async function (this: TestWorld) {
  await this.login.verifyKeyboardOrderAndSubmit();
});

When('I enter the {string} login credentials', async function (this: TestWorld, name: string) {
  const credentials = loginData(name);
  await this.login.fillCredentials(credentials.username, credentials.password);
});

When('I submit the login form', async function (this: TestWorld) {
  await this.login.submit();
});

Then('login is rejected without creating authentication state', async function (this: TestWorld) {
  await this.login.expectRejected();
});

Then('I reach home with valid authentication state', async function (this: TestWorld) {
  await this.login.expectAuthenticated();
});

When('I correct the {string} field', async function (this: TestWorld, field: string) {
  await this.login.correctField(field);
});

Then('the previous login error clears immediately', async function (this: TestWorld) {
  await this.login.expectErrorCleared();
});
