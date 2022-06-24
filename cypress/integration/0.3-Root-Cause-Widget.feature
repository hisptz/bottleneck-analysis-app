Feature: Root Cause Analysis Feature

  As Brian , a user (either normal user or admin) after authorized,
  I would like to be able see root cause component of a particular intervention,
  so that I would be able to manage those root causes as per particular intervention.


  @focus
  Scenario: Show root cause  component
    Given A user who authorized
    When I visit the Root Cause Component
    Then I should be able to see list of all the Root cause component

  @focus
  Scenario: Show new root cause form
    Given  A user who authorized
    When I visit the Root Cause Component
    And I navigate to add new root cause component
    Then A form of adding new root cause details should appear


  @focus
  Scenario: Add new root cause form
    Given A user who authorized
    And I visit the Root Cause Component
    And I navigate to add new root cause component
    And A form of adding new root cause details appeared
    When adding new root cause details in the form appear
    And Save the form with details entered
    Then I should be able to view the saved root cause


  Scenario: Edit root cause form
    Given A user who authorized
    And I visit the Root Cause Component
    And I select to edit one root cause
    Then I should be able to edit the root cause details
    And I should be able to save the edited root cause details
    And I should be able to view the saved root cause details


  Scenario: Delete root cause form
    Given A user who authorized
    And I visit the Root Cause Component
    And I select to delete one root cause
    Then I should be able to delete the root cause
    And I should not be able to view the deleted root cause details
