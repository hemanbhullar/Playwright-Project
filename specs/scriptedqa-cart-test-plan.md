# Scripted QA — Cart Page Test Plan

**Application:** https://www.scriptedqa.com/cart  
**Exploration date:** 3 October 2026  
**Scope:** Four core functionalities: bill accuracy, Clear Cart/empty state, Back to Shopping, and Place Order.  
**Priority:** High

## Independent setup for every scenario

1. Start a fresh browser context with no saved cookies, local storage, or navigation/cart state.
2. Open `https://www.scriptedqa.com/` and sign in with the displayed demo credentials: `admin` / `Pass@9211`.
3. Click Shopping and confirm `/shopping`, Products, and Checkout Items: 0.
4. Prepare only the products specified in the scenario, using each product's Add to Cart button; enter `/cart` using Checkout Items.

Scenarios can run in any order. A failed login or unavailable application blocks the scenario. Do not rely on another scenario's cart. Direct navigation to `/cart` does not prepare a populated bill; checkout passes the selected items to the cart page.

## CART-01 — Bill displays correct products, quantities, and totals

**Starting state:** Independent setup; empty shopping cart.

1. Add Headphones twice ($200 per unit) and Microwave Oven once ($290 per unit).
   - **Expected:** Checkout Items: 3, representing three units across two products.
2. Click Checkout Items and verify `/cart` and the Bill heading.
3. Verify exactly two bill entries, each with its matching image/name, unit price, quantity, and line total:
   - Headphones: $200.00, x2, $400.00.
   - Microwave Oven: $290.00, x1, $290.00.
4. Verify Grand Total is $690.00; verify Clear Cart, Back to Shopping, and Place Order are visible and enabled.
5. Verify unrelated products are absent and repeated Headphones additions are consolidated into one x2 entry.
6. Run a decimal-price variation in another fresh context: add Apple twice ($2.20 each) and Dragon Fruit once ($5.00), then open checkout.
   - **Expected:** Apple x2 totals $4.40, Dragon Fruit x1 totals $5.00, and Grand Total is $9.40. All monetary values have two decimal places.

**Success criteria:** Product identity and quantities match the prepared cart; each line equals unit price × quantity; Grand Total equals the sum of line totals; decimal formatting is correct.

**Failure conditions:** Missing/extra/duplicate entries, broken product images, incorrect quantities, prices or arithmetic, floating-point display artifacts, or missing bill controls.

## CART-02 — Clear Cart empties the bill and prevents empty ordering

**Starting state:** Independent setup; add Headphones twice and Microwave Oven once, then open checkout.

1. Confirm the populated bill and $690.00 total.
2. Click Clear Cart once.
   - **Expected:** Remain on `/cart` and display `Your cart is empty.`
3. Verify product entries, Grand Total, Clear Cart, and Place Order are no longer displayed; Bill and Back to Shopping remain visible.
   - **Expected:** No stale totals, order-success message, or actionable empty-order control.
4. Click Back to Shopping.
   - **Expected:** `/shopping`, Products, Checkout Items: 0, and no old quantity suffixes on the previously added products.
5. Add one Headphones and open checkout again.
   - **Expected:** Exactly one Headphones entry at x1 with a $200.00 grand total; cleared items do not reappear.
6. In a separate fresh authenticated context, navigate directly to `/cart` without adding products.
   - **Expected:** The same empty-cart state appears without an error; Place Order and Clear Cart are absent.

**Success criteria:** Clearing removes all prepared cart items and totals, propagates the empty state back to shopping, and allows a new cart to be created.

**Failure conditions:** Only some items clear, stale quantities/totals remain, old items return, empty ordering is possible, or the empty page crashes.

## CART-03 — Back to Shopping preserves an unmodified cart

**Starting state:** Independent setup; add Headphones twice and Microwave Oven once, then open checkout.

1. Record the two bill entries and $690.00 grand total.
2. Click Back to Shopping.
   - **Expected:** `/shopping` and Products are visible; Checkout Items: 3; Headphones shows Add to Cart (2) and Microwave Oven shows Add to Cart (1).
3. Add one Apple ($2.20).
   - **Expected:** Checkout Items: 4 without resetting the existing quantities.
4. Click Checkout Items.
   - **Expected:** `/cart` contains Headphones x2 ($400.00), Microwave Oven x1 ($290.00), and Apple x1 ($2.20), with Grand Total $692.20.
5. Return using Back to Shopping and reopen checkout once more without adding anything.
   - **Expected:** The same three entries, quantities, and $692.20 total remain; navigation alone adds no duplicates.

**Success criteria:** The explicit Back to Shopping control returns to the catalogue and retains cart contents correctly across repeated checkout visits.

**Failure conditions:** Wrong destination, lost cart, changed quantities, duplicated entries, or incorrect updated totals.

## CART-04 — Place Order shows confirmation and consumes the demo cart

**Starting state:** Independent setup; add one Headphones, then open checkout. Verify a $200.00 populated bill.

1. Click Place Order once.
   - **Expected:** Remain on `/cart` and display `Order Placed Successfully!` and `Thank you for your purchase.`
2. Verify the completed state has no bill entries, Grand Total, Clear Cart, or Place Order button. Back to Shopping remains available.
   - **Expected:** No second submission is available after completion; the success message replaces the bill rather than appearing alongside stale contents or an empty-cart error.
3. Click Back to Shopping.
   - **Expected:** `/shopping`, Products, Checkout Items: 0, and no Headphones quantity suffix.
4. Add one Apple and open checkout.
   - **Expected:** A new bill contains only Apple x1 at $2.20, with Grand Total $2.20 and Place Order available. The previous success message and ordered Headphones do not carry over.

**Success criteria:** One submission transitions to a clear completed state, consumes the demo cart, and supports starting a new independent cart.

**Failure conditions:** Missing confirmation, stale bill or resubmission control, ordered items returning, nonzero checkout count after returning, or confirmation leaking into a new cart.

## Evidence and execution guidance

- Live exploration confirmed direct `/cart` empty-state rendering, a Headphones x1 bill at $200.00, Clear Cart removing the bill and order control, and Back to Shopping showing Checkout Items: 0. Prior shopping exploration confirmed a two-product, three-unit bill totaling $690.00 and cart retention on return.
- Place Order's planned success text and cart-reset behavior are supported by the public application JavaScript inspected during exploration. Place Order was not clicked during this exploration; CART-04 remains a planned execution check. The implementation is a local demo state transition rather than a payment workflow.
- No quantity-editing or individual-item removal controls were present on the cart page. Prepare quantities on Shopping; this plan tests the implemented cart controls.
- Current catalogue fixtures are explicit above. Update expected values if an intentional catalogue change occurs.
- Use role/name locators for buttons and scope bill assertions to the relevant product entry. Reacquire controls after state transitions and use automatic waiting instead of fixed sleeps.
- The planner-specific setup/save tools were unavailable in this session. Available Playwright browser tools were used for exploration, and this plan was saved directly as Markdown.
