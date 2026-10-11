# Scripted QA automation

TypeScript + Playwright + Cucumber, using Page Object Model and data-driven scenarios.
The existing Playwright starter tests/config are preserved; the cart suite has its own Cucumber runner.

## Run

Requires Node.js 22+ and installed Google Chrome. Install project dependencies with `npm ci`.

```sh
npm run typecheck
npm run test:cart:dry
npm run test:cart
npm run test:login:dry
npm run test:login
npm run test:home-shopping:dry
npm run test:home-shopping
npm run test:shopping:dry
npm run test:shopping
```

All Cucumber suites run scenarios in parallel using two workers by default. Each scenario has its own Chrome browser, context, and artifact directory. Chrome opens for each scenario by default. For CI, use `HEADLESS=true npm run test:cart`; this still runs branded Chrome, not bundled Chromium. To filter cases, use `npm run test:cart -- --tags @CART-04` (other tags: @CART-01, @CART-02, @CART-03). Cucumber accepts additional CLI options through the runner, including `--parallel` and `--order random`.

Override the worker count for any suite, including tagged runs:

```sh
npm run test:cart -- --tags @sanity --parallel 4
npm run test:shopping -- --tags @regression --parallel 4
npm run test:login -- --parallel 1
```

Use `--parallel 1` for sequential execution.

Run cart sanity or regression coverage with:

```sh
npm run test:cart -- --tags @sanity
npm run test:cart -- --tags @regression
```

`@sanity` selects four core cases: standard-basket bill accuracy, Clear Cart, Back to Shopping, and Place Order. `@regression` selects all six cart cases, including the sanity cases, decimal-price accuracy, and direct empty-cart navigation. Add `--dry-run` to either command to check scenario selection without launching Chrome.

All feature files use the same tags. Regression includes every scenario; sanity selects these core flows:

| Suite | Sanity cases | Regression cases |
| --- | --- | --- |
| `cart` | 4: standard bill, clear cart, return to shopping, place order | 6 |
| `login` | 1: valid credentials authenticate | 9 |
| `home-shopping` | 1: Shopping link navigates to the catalogue | 1 |
| `shopping` | 3: catalogue renders, add to cart, populated checkout | 10 |

Use `npm run test:login -- --tags @sanity`, `npm run test:home-shopping -- --tags @sanity`, or `npm run test:shopping -- --tags @sanity` for the other suites. Replace `@sanity` with `@regression` to run their full coverage.

Optional environment variables: `BASE_URL`, `QA_USERNAME`, `QA_PASSWORD`, `HEADLESS`.
Defaults are the public Scripted QA demo URL and the demo credentials displayed by the site. Use only the demo environment for the Place Order scenario.

The login suite covers all five cases in `specs/scriptedqa-login-test-plan.md` with nine independent Chrome executions: keyboard usability, valid authentication, two invalid-credential variations, three incomplete submissions, and error recovery by editing either field. Filter it with `npm run test:login -- --tags @LGN-05`. Both suites reuse `fixture/TestWorld.ts`, the page objects, and the reporting utilities. Each run writes its own Spark Extent report, Cucumber reports, and diagnostic traces under `report/`.

The home-shopping suite implements HOME-01 from `specs/scriptedqa-home-shopping-test-plan.md`. Its Examples table supplies the link name and route. It verifies the unique visible Shopping link in Categories, checks its destination, clicks once, and asserts Products, product search, an enabled Add to Cart button, absence of the home welcome heading, and zero cart items. It reuses login/cart steps, shared fixtures, and ShoppingPage. Home navigation locators/actions live in HomePage; LoginPage delegates its existing shopping helper to that page object.

## Structure

The shopping suite implements `specs/scriptedqa-shopping-test-plan.md` with ten fresh-Chrome scenarios: all 15 catalogue cards and images, search/category/combined-filter/reset behavior, five price-range Examples, incremental cart quantities, and separate empty/populated checkout checks with return navigation. Use `npm run test:shopping -- --tags @SHOP-02` to run filter coverage. It reuses the existing login, cart, and checkout steps and adds all shopping selectors/actions to ShoppingPage. Catalogue expectations are in `data/shopping-data.ts`. Exact price-boundary values are absent from the demo catalogue and are not claimed as covered.

Empty-checkout expectation was revised on 8 October 2026 after reproducing the demo behavior: checkout with zero items opens `/cart` with `Your cart is empty.` rather than remaining on `/shopping`. The `@empty-checkout` scenario reuses CartPage assertions to verify no products, total, order controls, or success message appear, then returns to shopping and verifies the cart stays empty. The original assumption and correction are documented in the shopping test plan. No test is skipped and no application behavior was changed.

- `features/`: business-readable scenarios; CART-01 expands into standard and decimal-price cases, CART-02 includes a separate fresh-context empty-state case (six executions total).
- `step-definitions/`: thin Cucumber steps calling page methods; no locators.
- `page/`: all selectors, page actions, and web-first UI assertions. Role/name selectors are preferred; parent traversal is isolated here because product cards and bill entries lack accessible roles/test IDs.
- `fixture/`: scenario-scoped Playwright browser/context/page fixtures supplied by the Cucumber World, with setup/teardown and diagnostics hooks. Each scenario launches Google Chrome and a fresh context.
- `data/`: typed reusable basket data; prices stored as integer cents.
- `utils/`: generic configuration, money calculation, and artifact helpers.
- `runner/`: TypeScript suite entry point; creates isolated report folders and preserves failure exit codes.
- `report/`: Spark Extent and Cucumber reports, traces, and failure screenshots.

No fixed sleeps, shared session/cart state, forced clicks, or locator code in features/steps. The source plan is `specs/scriptedqa-cart-test-plan.md`.
