@cart @regression
Feature: Scripted QA cart
  As a shopper
  I want an accurate bill and reliable cart actions
  So that I can review, clear, continue shopping, and complete my demo order

  Background:
    Given I am signed in with a fresh empty shopping cart

  @CART-01
  Scenario Outline: Bill displays correct products, quantities, and totals - <basket>
    When I add the "<basket>" basket to my cart
    Then the checkout count is <units>
    When I open checkout
    Then the bill matches the "<basket>" basket with a total of "<total>"

    @sanity
    Examples: Standard basket
      | basket   | units | total   |
      | standard | 3     | $690.00 |

    Examples: Decimal-price basket
      | basket   | units | total   |
      | decimal  | 3     | $9.40   |

  @CART-02 @sanity
  Scenario: Clear Cart empties the bill and allows a new cart
    When I add the "standard" basket to my cart
    And I open checkout
    Then the bill matches the "standard" basket with a total of "$690.00"
    When I clear the cart
    Then the cart is empty and cannot be ordered
    When I return to shopping
    Then the checkout count is 0
    And shopping has no quantities for the "standard" basket
    When I add the "headphones" basket to my cart
    And I open checkout
    Then the bill matches the "headphones" basket with a total of "$200.00"

  @CART-02 @empty
  Scenario: Direct cart navigation without products displays a safe empty state
    When I visit the cart directly without adding products
    Then the cart is empty and cannot be ordered

  @CART-03 @sanity
  Scenario: Back to Shopping preserves an unmodified cart
    When I add the "standard" basket to my cart
    And I open checkout
    Then the bill matches the "standard" basket with a total of "$690.00"
    When I return to shopping
    Then the checkout count is 3
    And shopping retains the "standard" basket quantities
    When I add the "apple" basket to my cart
    Then the checkout count is 4
    When I open checkout
    Then the bill matches the "expanded" basket with a total of "$692.20"
    When I return to shopping
    And I open checkout
    Then the bill matches the "expanded" basket with a total of "$692.20"

  @CART-04 @sanity
  Scenario: Place Order shows confirmation and consumes the demo cart
    When I add the "headphones" basket to my cart
    And I open checkout
    Then the bill matches the "headphones" basket with a total of "$200.00"
    When I place the demo order
    Then the order is confirmed and cannot be submitted again
    When I return to shopping
    Then the checkout count is 0
    And shopping has no quantities for the "headphones" basket
    When I add the "apple" basket to my cart
    And I open checkout
    Then the bill matches the "apple" basket with a total of "$2.20"
