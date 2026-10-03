import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { ShoppingPage } from '../page/ShoppingPage';
import { CartPage } from '../page/CartPage';
import { HomePage } from '../page/HomePage';
import { config } from '../utils/config';

/** Cucumber's per-scenario World supplies reusable Playwright fixtures. */
export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  login!: LoginPage;
  home!: HomePage;
  shopping!: ShoppingPage;
  cart!: CartPage;
  artifactDir = '';

  constructor(options: IWorldOptions) { super(options); }

  async start(): Promise<void> {
    // Branded Chrome only: do not silently fall back to bundled Chromium.
    this.browser = await chromium.launch({ channel: 'chrome', headless: config.headless });
    this.context = await this.browser.newContext({ baseURL: config.baseURL, viewport: { width: 1440, height: 1000 } });
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(config.actionTimeout);
    this.page.setDefaultNavigationTimeout(config.navigationTimeout);
    this.home = new HomePage(this.page);
    this.login = new LoginPage(this.page, this.home);
    this.shopping = new ShoppingPage(this.page);
    this.cart = new CartPage(this.page);
  }

  async close(): Promise<void> {
    try { await this.context?.close(); }
    finally { await this.browser?.close(); }
  }
}

setWorldConstructor(TestWorld);
