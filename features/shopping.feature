@shopping @regression
Feature: Shopping products, filters, cart updates, and checkout
  As a shopper
  I want accurate products and reliable filtering and cart controls
  So that I can find products and review my purchases

  Background:
    Given I am signed in with a fresh empty shopping cart
    Then shopping has default filters and the complete catalogue

  @SHOP-01 @sanity
  Scenario: Product catalogue and shopping controls render correctly
    Then every catalogue product and shopping control is correct
    And the checkout count is 0

  @SHOP-02
  Scenario: Search, category, combined filters, and reset controls work together
    When I search products for "aPp"
    Then only these products are displayed: "Apple"
    And the search clear and reset controls are visible
    And the checkout count is 0
    When I clear product search
    Then shopping has default filters and the complete catalogue
    When I select product category "Fruits"
    Then only these products are displayed: "Mango, Apple, Dragon Fruit"
    And the checkout count is 0
    When I reset shopping filters using "Reset Filters"
    Then shopping has default filters and the complete catalogue
    When I select product category "electronics"
    And I select product price range "$100 to $500"
    Then only these products are displayed: "Headphones, Microwave Oven, Smartwatch"
    And the checkout count is 0
    When I search products for "head"
    Then only these products are displayed: "Headphones"
    And the checkout count is 0
    When I clear product search
    And I select product category "Fruits"
    Then only these products are displayed: "none"
    And the checkout count is 0
    When I reset shopping filters using "Reset All Filters"
    Then shopping has default filters and the complete catalogue
    When I search products for "zz-no-product-987"
    Then only these products are displayed: "none"
    When I reset shopping filters using "Reset Filters"
    Then shopping has default filters and the complete catalogue
    And the checkout count is 0

  @SHOP-02 @price
  Scenario Outline: Price range filters return exactly the matching products - <range>
    When I select product price range "<range>"
    Then only these products are displayed: "<products>"
    And the checkout count is 0
    When I reset shopping filters using "Reset Filters"
    Then shopping has default filters and the complete catalogue

    Examples:
      | range        | products                                            |
      | Under $25    | Mango, Apple, Dragon Fruit, Cauliflower, Eggplant     |
      | $25 to $50   | none                                                |
      | $50 to $100  | Football                                            |
      | $100 to $500 | Headphones, Microwave Oven, Smartwatch, Dumbbell     |
      | Over $500    | Laptop, Mobile, Refrigerator, Treadmill, Bat          |

  @SHOP-03 @sanity
  Scenario: Add to Cart updates quantities and survives filter changes
    When I add the "headphones" basket to my cart
    Then the checkout count is 1
    And shopping quantities and prices match the "headphones" basket with other products unchanged
    When I add the "headphones" basket to my cart
    Then the checkout count is 2
    When I add the "microwave" basket to my cart
    Then the checkout count is 3
    And shopping quantities and prices match the "standard" basket with other products unchanged
    When I select product category "Fruits"
    Then only these products are displayed: "Mango, Apple, Dragon Fruit"
    And the checkout count is 3
    When I reset shopping filters using "Reset Filters"
    Then shopping has default filters and the complete catalogue
    And shopping quantities and prices match the "standard" basket with other products unchanged
    And the checkout count is 3

  @SHOP-04 @empty-checkout
  Scenario: Empty checkout opens a safe empty cart
    When I attempt checkout with no items
    Then the cart is empty and cannot be ordered
    When I return to shopping
    Then shopping has default filters and the complete catalogue
    And the checkout count is 0

  @SHOP-04 @sanity
  Scenario: Checkout opens an accurate bill and supports returning to shopping
    When I add the "standard" basket to my cart
    Then the checkout count is 3
    When I open checkout
    Then the bill matches the "standard" basket with a total of "$690.00"
    When I return to shopping
    Then the checkout count is 3
    And shopping retains the "standard" basket quantities
    When I open checkout
    Then the bill matches the "standard" basket with a total of "$690.00"
