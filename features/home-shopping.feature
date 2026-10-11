@home-shopping @HOME-01 @regression
Feature: Home page shopping navigation
  As an authenticated shopper
  I want a visible Shopping link on the home page
  So that I can reach the product catalogue

  Background:
    Given I open the login page with no saved session

  @sanity
  Scenario Outline: Shopping tab is visible and navigates to the shopping page
    When I enter the "valid" login credentials
    And I submit the login form
    Then I reach home with valid authentication state
    And home displays exactly one actionable "<tab>" link to "<destination>"
    When I click the "<tab>" home navigation link
    Then the shopping catalogue loads at "<destination>"
    And the home welcome content is no longer displayed
    And the checkout count is 0

    Examples:
      | tab      | destination |
      | Shopping | /shopping   |
