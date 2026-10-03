# Scripted QA — Login Test Plan

**Application:** https://www.scriptedqa.com/  
**Scope:** Login page (`/`)  
**Test data:** Valid username `admin`; valid password `Pass@9211`  
**Starting state for every scenario:** Open a fresh browser context (no cookies or local-storage entries) and navigate to the application root.

## Observed login behavior

The page presents a `Username` text field, a masked `Password` field, a `Sign In` button, and demo credentials. A successful sign-in routes to `/home` and stores `authToken` plus `keepLoggedIn=true` in local storage. Failed attempts display `Oops! The credentials are incorrect.` No password-recovery, account-registration, or explicit “remember me” control is present on this page.

## LGN-01 — Login form is available and usable

**Purpose:** Confirm a user can discover and operate every login control.

1. Open the login page in the stated fresh state.
2. Verify the page identifies the product as **Scripted QA** and includes the **Sign In** heading.
3. Verify the displayed demo credentials show `admin` and `Pass@9211`.
4. Verify a `Username` text input, a `Password` input, and a `Sign In` button are visible and enabled.
5. Enter a sample password and verify its characters are obscured in the password field.
6. Navigate through controls using the keyboard (Tab / Shift+Tab) and activate `Sign In` with the keyboard.

**Expected results / success criteria:** Controls have a logical keyboard focus order; the password remains masked; activation is possible without a mouse; and no successful login occurs with the sample data.

**Failure conditions:** Missing, disabled, inaccessible, or incorrectly typed controls; exposed password characters; or a keyboard trap.

## LGN-02 — Valid credentials authenticate and reach the protected home page

**Purpose:** Verify the primary login journey.

1. Enter username `admin`.
2. Enter password `Pass@9211`.
3. Select `Sign In` once.
4. Wait for navigation to complete.
5. Verify the current route is `/home` and the application home content is rendered.
6. Inspect browser local storage for the application origin.

**Expected results / success criteria:** The user is taken to `/home`; no credential-error message is displayed; `authToken` contains a non-empty value; and `keepLoggedIn` is stored as `true`.

**Failure conditions:** Remaining on the login page, an error message after valid credentials, no token/persistence value, or navigation to an unexpected route.

## LGN-03 — Incorrect credentials are rejected safely

**Purpose:** Ensure bad credentials do not grant access.

1. Enter an invalid username (for example, `unknown-user`) and any non-empty password.
2. Select `Sign In`.
3. Repeat with username `admin` and an incorrect password (for example, `WrongPass1!`).
4. After each attempt, inspect the current route and local storage.

**Expected results / success criteria:** Each attempt stays on the login page and displays exactly `Oops! The credentials are incorrect.` No authenticated home content is displayed, and no new usable `authToken` or logged-in flag is created.

**Failure conditions:** Access is granted, the error is absent or misleading, a previous session is created/overwritten by invalid input, or the password value is exposed.

## LGN-04 — Blank and partial submissions are handled consistently

**Purpose:** Cover required-input boundary cases.

1. Select `Sign In` with both fields empty.
2. Enter only `admin`, then select `Sign In`.
3. Clear the username, enter only `Pass@9211`, then select `Sign In`.
4. Check the route and local storage after each submission.

**Expected results / success criteria:** Every incomplete submission remains on the login page, does not authenticate, and uses the same generic credential-error feedback (`Oops! The credentials are incorrect.`) currently used by the page. No local authentication state is created.

**Failure conditions:** An incomplete submission authenticates, causes an unhandled error, navigates away, or leaves stale authentication data.

## LGN-05 — A user can correct a failed attempt and then sign in

**Purpose:** Verify error recovery and retry behavior.

1. Enter invalid credentials and select `Sign In`.
2. Confirm the generic credential-error message appears.
3. Change either field.
4. Verify the displayed credential-error message clears as the user edits.
5. Complete the fields with `admin` and `Pass@9211`.
6. Select `Sign In` once and wait for navigation.

**Expected results / success criteria:** Editing either input clears the prior error. The corrected submission authenticates normally, routes to `/home`, and creates the expected local-storage authentication values.

**Failure conditions:** The stale error remains while editing, corrected values are ignored, authentication requires a refresh, or the user is not routed to `/home` after a valid retry.

## Execution notes

- Run each scenario independently in a new browser context to avoid state leakage from `localStorage`.
- For automation, prefer locators based on placeholder (`Username`, `Password`) and role/name (`button`, `Sign In`); the inputs do not expose visible labels.
- The exact demo credentials are intentionally visible on this QA-training site; do not reuse this pattern for a production authentication test.
