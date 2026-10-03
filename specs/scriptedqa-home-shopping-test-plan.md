# Scripted QA — Home Page Shopping Navigation Test Plan

**Application:** https://www.scriptedqa.com/  
**Exploration date:** 3 October 2026  
**Scope:** One core functionality: the Shopping tab is visible on the home page and opens the shopping page when clicked.  
**Priority:** High (navigation smoke test)

## Exploration findings

After signing in with the displayed demo credentials, the application opens `/home`. The Categories sidebar contains a **Shopping** navigation link with destination `/shopping`. Clicking it opened `/shopping`, where the **Products** heading, **Search products...** input, and product cards with **Add to Cart** buttons were present. The control called a “tab” in the requirement is implemented as a link.

## HOME-01 — Shopping tab is visible and navigates to the shopping page

### Starting state and prerequisites

- Start in a fresh browser context with no cookies or saved local storage.
- The application must be reachable.
- Use the demo username `admin` and password `Pass@9211` displayed on the login page.
- No previous test or pre-existing authenticated session is required.

### Steps and expected results

1. Navigate to `https://www.scriptedqa.com/`.
   - **Expected:** The Sign In page loads with Username and Password inputs.
2. Enter `admin` into Username and `Pass@9211` into Password, then click **Sign In**.
   - **Expected:** The URL becomes `https://www.scriptedqa.com/home`, and the home heading **Welcome back, Automation Engineer! 👋** is visible.
3. Locate **Shopping** in the **Categories** sidebar.
   - **Expected:** One navigation link named exactly Shopping exists, is visible to the user, and can be clicked. Its destination is `/shopping`.
4. Click the **Shopping** link once.
   - **Expected:** The URL becomes `https://www.scriptedqa.com/shopping`.
5. Verify that shopping content has loaded.
   - **Expected:** The **Products** heading and **Search products...** input are visible, and at least one product card offers an **Add to Cart** button. The home welcome heading is no longer displayed.

### Success criteria

The Shopping link is visible and actionable on `/home`, and one click opens `/shopping` with the expected shopping content. A URL change alone is insufficient to pass the test.

### Failure conditions / negative checks

- Fail if Shopping is missing, hidden, duplicated in the sidebar, or cannot be clicked.
- Fail if its destination points to an unrelated route.
- Fail if clicking leaves the user on `/home`, returns to Sign In, or opens an incorrect page.
- Fail if `/shopping` shows a blank/error page or fails to display the Products heading and product controls.
- If login or site availability prevents reaching home, report the navigation scenario as blocked and record the prerequisite failure.

### Automation guidance

- Locate the tab with `getByRole('link', { name: 'Shopping', exact: true })`, scoped to the Categories sidebar if needed.
- Assert visibility before clicking; do not force the click because that could hide a visibility defect.
- Use URL and visible-content assertions with Playwright's automatic waiting rather than fixed sleeps.
- Close the fresh browser context after the test; this scenario creates no shopping/cart data.

## Exploration result

The live browser exploration confirmed that Shopping was present on the authenticated home page and clicking it opened `/shopping` with Products and product controls. This observation supports the test plan; it does not replace executing HOME-01 in a fresh test context.
