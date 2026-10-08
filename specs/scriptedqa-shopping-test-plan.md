# Scripted QA — Shopping Page Test Plan

**Application:** https://www.scriptedqa.com/shopping  
**Exploration date:** 3 October 2026  
**Scope:** Four core functionalities: product catalogue, search/category/price filters, Add to Cart, and checkout/bill navigation.  
**Priority:** High

## Common starting state

Start every scenario independently in a fresh browser context with no saved cookies, local storage, cart, or navigation state. Open `https://www.scriptedqa.com/`, sign in using the displayed demo credentials (`admin` / `Pass@9211`), and click the Shopping sidebar link. Confirm `/shopping`, the Products heading, empty search, All Categories, All Prices, and Checkout Items: 0. A prerequisite failure blocks the scenario rather than demonstrating a shopping defect.

The data below reflects the current demo catalogue. If the catalogue is intentionally changed, update the fixtures before executing the plan.

## SHOP-01 — Product catalogue and shopping controls render correctly

**Starting state:** Common starting state.

1. Verify the Products heading, Search products... input, category dropdown, price dropdown, and Checkout Items: 0 button are visible.
2. Verify the unfiltered catalogue contains 15 distinct product cards; scroll through the catalogue as needed.
3. For every card, verify a readable product name, matching image/alternative text, category, positive dollar price, and enabled Add to Cart button. Confirm images load rather than showing broken-image placeholders.
4. Check representative fixtures: Laptop / electronics / $1000; Apple / Fruits / $2.2; Headphones / electronics / $200; Microwave Oven / electronics / $290.
5. Verify category options: All Categories, electronics, Fruits, Vegitables, Sports & Fitness. Verify price options: All Prices, Under $25, $25 to $50, $50 to $100, $100 to $500, Over $500.
6. Confirm merely viewing or scrolling through products leaves the checkout count at zero.

**Success criteria:** All catalogue fixtures and controls render consistently, images load, and viewing does not modify the cart.

**Failure conditions:** Missing/duplicate products, broken images, mismatched names/prices/categories, missing or unusable controls, or an unsolicited cart update.

## SHOP-02 — Search, category, price, and reset filters work together

**Starting state:** Common starting state. Use these checks sequentially within this scenario, resetting where specified.

1. Search for `aPp`.
   - **Expected:** Only Apple is displayed, demonstrating case-insensitive partial-name matching. A search-clear (✕) control and Reset Filters button appear.
2. Click the search-clear control.
   - **Expected:** Search becomes empty and all 15 products return.
3. Select Fruits with All Prices.
   - **Expected:** Only Mango ($1), Apple ($2.2), and Dragon Fruit ($5) appear.
4. Click Reset Filters. Select each non-default price range with All Categories, checking the result against the current catalogue:
   - Under $25: Mango, Apple, Dragon Fruit, Cauliflower, Eggplant.
   - $25 to $50: no results.
   - $50 to $100: Football ($99.99).
   - $100 to $500: Headphones, Microwave Oven, Smartwatch, Dumbbell.
   - Over $500: Laptop, Mobile, Refrigerator, Treadmill, Bat.
5. Select electronics and $100 to $500.
   - **Expected:** Only Headphones ($200), Microwave Oven ($290), and Smartwatch ($499) appear.
6. Enter `head` while those dropdown filters remain selected.
   - **Expected:** Only Headphones appears; all three filters apply together.
7. Clear search, then select Fruits while retaining $100 to $500.
   - **Expected:** No product cards or Add to Cart buttons remain in the results area. Display `No products found matching your current filters.` and Reset All Filters.
8. Click Reset All Filters.
   - **Expected:** Search is empty, dropdowns return to All Categories and All Prices, all 15 cards return, and reset controls disappear.
9. Search for `zz-no-product-987`, verify the same empty-results feedback, then click Reset Filters.
   - **Expected:** The default catalogue and filter values are restored; no error or stale results remain.
10. Confirm Checkout Items remains zero throughout.

**Success criteria:** Each filter returns exactly the matching products, combined filters intersect, empty results are explicit, and both reset actions restore defaults without changing the cart.

**Failure conditions:** Nonmatching products remain, matching products disappear, filters ignore one another, reset leaves stale values/results, an empty search result crashes the page, or filtering modifies the cart.

**Boundary note:** Current fixtures do not include products priced exactly $25, $50, $100, or $500. Inclusive/exclusive behavior at those boundaries requires agreed requirements and controlled boundary fixtures; it is not proven by this scenario.

## SHOP-03 — Add to Cart updates quantities and survives filter changes

**Starting state:** Common starting state.

1. Find the Headphones card and click its Add to Cart button once.
   - **Expected:** Its button reads Add to Cart (1); Checkout Items becomes 1; the page remains `/shopping`.
2. Click the same card's button once more.
   - **Expected:** Its button reads Add to Cart (2); Checkout Items becomes 2. Other product quantities remain unchanged.
3. Click Microwave Oven's Add to Cart button once.
   - **Expected:** Its button reads Add to Cart (1); Checkout Items becomes 3 (total units, not distinct products).
4. Select Fruits, hiding both added products.
   - **Expected:** Checkout Items stays 3; filtering does not remove items from the cart.
5. Click Reset Filters.
   - **Expected:** Headphones still shows (2), Microwave Oven still shows (1), and Checkout Items remains 3.
6. Verify product prices remain $200 and $290 respectively.

**Success criteria:** Each deliberate click adds exactly one unit of the intended product; counts agree; filters preserve quantities; unrelated products and prices remain unchanged.

**Failure conditions:** Missed/double increments, wrong product added, inconsistent badge/button quantities, loss of cart data when filtering, or unexpected navigation.

## SHOP-04 — Checkout opens an accurate bill and supports returning to shopping

**Starting state:** Common starting state; prepare this scenario's own cart rather than relying on SHOP-03.

1. Click Checkout Items: 0.
   - **Expected:** Navigate to `/cart`, show `Your cart is empty.`, and show no product entries, Grand Total, Clear Cart, Place Order, or order-success message. Back to Shopping remains available. Click it and verify `/shopping` with the default catalogue, filters, and Checkout Items: 0 before continuing.
2. Add Headphones twice and Microwave Oven once. Confirm Checkout Items: 3.
3. Click Checkout Items: 3.
   - **Expected:** Navigate to `/cart`; the Bill heading, Clear Cart, Back to Shopping, and Place Order controls appear.
4. Verify two bill entries, with no unrelated products:
   - Headphones: unit price $200.00, quantity x2, line total $400.00.
   - Microwave Oven: unit price $290.00, quantity x1, line total $290.00.
   - Grand Total: $690.00.
5. Click Back to Shopping.
   - **Expected:** Return to `/shopping` with Products visible, Checkout Items: 3, and the existing product quantities retained.
6. Open checkout again and verify the same two entries and $690.00 total, without duplicated items.

**Success criteria:** Nonempty checkout reaches the bill with accurate names, prices, quantities, line totals, and grand total; returning and reopening retains the cart without duplication.

**Failure conditions:** Empty checkout creates items/an order, wrong route, blank bill, missing/extra entries, incorrect arithmetic, or lost/duplicated cart data on return.

**Scope:** Verify Place Order is present; order submission is outside this shopping-page plan.

## Execution and exploration notes

- **Expectation revision — 8 October 2026:** The original SHOP-04 empty-checkout expectation required remaining on `/shopping`. A healer reproduction and its screenshot confirmed that the demo opens `/cart` with the empty-cart message and no ordering controls. The automated scenario and this plan now validate that observed flow and a safe return to shopping. This revises the test expectation; it does not change the application. Empty checkout remains a separate scenario so its result does not mask populated-checkout coverage.

- Use visible-content assertions alongside URL assertions; a route change alone is insufficient.
- Scope repeated Add to Cart controls to their product cards. Button names change after adding units, so avoid stale element references and exact names that only match the initial state.
- Use Playwright automatic waiting rather than fixed sleeps. Close each fresh context after its scenario.
- Live exploration confirmed partial case-insensitive search, combined category/price filtering, empty-results feedback, Reset All Filters, repeated additions, correct $690.00 bill arithmetic, and cart retention through Back to Shopping. Remaining checks above are planned assertions, not claimed execution results.
- The planner-specific setup/save tools were unavailable; exploration used the available Playwright browser tools and the plan was saved directly as Markdown.
