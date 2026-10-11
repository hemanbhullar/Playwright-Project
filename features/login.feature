@login @regression
Feature: Scripted QA login
  As a user
  I want an accessible login form with clear validation
  So that I can authenticate or correct unsuccessful attempts

  Background:
    Given I open the login page with no saved session

  @LGN-01
  Scenario: Login form is available and usable
    Then the login form and demo credentials are available
    When I enter a masked sample password
    And I navigate forward and backward through the form and submit using the keyboard
    Then login is rejected without creating authentication state

  @LGN-02 @sanity
  Scenario: Valid credentials authenticate and reach the home page
    When I enter the "valid" login credentials
    And I submit the login form
    Then I reach home with valid authentication state

  @LGN-03
  Scenario Outline: Incorrect credentials are rejected safely - <credentials>
    When I enter the "<credentials>" login credentials
    And I submit the login form
    Then login is rejected without creating authentication state

    Examples:
      | credentials      |
      | invalid_username |
      | wrong_password   |

  @LGN-04
  Scenario Outline: Blank and partial submissions are handled consistently - <credentials>
    When I enter the "<credentials>" login credentials
    And I submit the login form
    Then login is rejected without creating authentication state

    Examples:
      | credentials   |
      | blank         |
      | username_only |
      | password_only |

  @LGN-05
  Scenario Outline: A user can correct a failed attempt and then sign in - <field>
    When I enter the "<credentials>" login credentials
    And I submit the login form
    Then login is rejected without creating authentication state
    When I correct the "<field>" field
    Then the previous login error clears immediately
    When I submit the login form
    Then I reach home with valid authentication state

    Examples:
      | credentials      | field    |
      | invalid_username | username |
      | wrong_password   | password |
