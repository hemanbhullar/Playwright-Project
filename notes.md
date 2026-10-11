#Project Documentation

## Overview
Project with Playwright Agents + Buildin MCP and Github copilot or codex
Website link: https://www.scriptedqa.com/
Framework: POM and Hybrid Framework, CuCumber
Test case creation using planner agent
code generation using generator agent
Sanity and Regression taging
Parallel execution
Test reporting
Test healing agent


## Installation
1. Github Copilot
2. Playwright
3. Playwright Agents


## Commands For Installation
npm init playwright@latest
npx playwright init-agents --loop=vscode


## Prompt 1 - Create Test Cases
Explore web application: https://www.scriptedqa.com/ and Create test plan covering 5 major core functionality of login page

## Prompt 2 - Create Test Cases
Explore web application: https://www.scriptedqa.com/home and Create test plan covering 1 major core functionality of home page to Verify whether home page has Shopping tab or not. Shopping tab should be visible and on clicking on it, it should take us to shopping page.

## Prompt 3 - Create Test Cases
Explore web application: https://www.scriptedqa.com/shopping and Create test plan covering 4 major core functionality of shopping page to verify whether shopping page has working filters, products, add to cart button and other things.

## Prompt 4 - Create Test Cases
Explore web application: https://www.scriptedqa.com/cart and Create test plan covering 4 major core functionality of cart page to verify whether cart page has working functionalities.

## Prompt 5 - Write Test Cases in POM + Cucumber + Hybrid Framework X 3

Generate playwright automation for all the test cases in : 
cart-page-test-plan.md

Follow Page Object Model + Cucumber Framework + Hybrid Framework strictly:

Put test scenarios/steps in the Feature files.
Put code in Seperate Step defination folder.
Create a runner file.

Put All Locators (XPath, CSS, Playwright locators, etc) and page-specific actions/methods in the page folder

Never write locator directly insite the test file.

Put reusable/generic methods in the utils folder

Put custom/reusable playwright fixtures in a fixture folder

Generate/store playwright extent reports in a report folder.

Reuse existing Page Objects, utilities, and fixture where possible;
don't create duplicates.

Prefer Playwright recommended locators (getByRole(), getByLabel(), getByTestId() etc.) over XPath/CSS whenever possible

Follow playwright Best Practices: auto-waiting, web-first assertions, no unnessary waitForTimeOut, reliable locators, clean async/await, and independent tests

Keep the test file clean and buisness readable; it should only call Page Object methods and perform meaningful assertions.

Inspect the existing project structure and follow its conventions before creating/modifying files.

Each test case should get launched in chrome.

Write test cases in typescript language

Follow data-driven approaches also.

Now implement the test case end to end.

## Prompt 6 - Add Tags
Add Sanity tags to sanity test cases and Regression tags to regression test cases

npm run test:cart -- --tags @sanity
npm run test:cart -- --tags @regression

## Prompt 7 - create parallel running
Enable parallel Execution
CUCUMBER_PARALLEL=2 npm run test:cart -- --headed

## Prompt 8 - Reporting
Add HTML extent reporting in the framework, Reports should be generated after all test cases are executed.


