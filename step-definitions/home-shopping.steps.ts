import { When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../fixture/TestWorld';

Then('home displays exactly one actionable {string} link to {string}', async function (this: TestWorld, name: string, destination: string) {
  await this.home.expectNavigationLink(name, destination);
});

When('I click the {string} home navigation link', async function (this: TestWorld, name: string) {
  await this.home.followNavigationLink(name);
});

Then('the shopping catalogue loads at {string}', async function (this: TestWorld, destination: string) {
  await this.shopping.expectCatalogueAvailable(destination);
});

Then('the home welcome content is no longer displayed', async function (this: TestWorld) {
  await this.home.expectNotDisplayed();
});
