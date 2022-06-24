User story: As an administrator, I want to create and be able to configure the general, determinants and access for a new intervention, and edit an existing intervention

Scenario: Create a new intervention on the new app
Given an authorized "administrator"
When opening the app
And there are no interventions configured
Then a button with the text “Add New Intervention” should be visible

Scenario: Create a new intervention on the app with already configured interventions
Given an authorized "administrator"
When opening the app
And there are interventions configured
Then a button with the “+” sign should be visible

Scenario: Unauthorized creation of new intervention on the new app
Given an authorized "administrator"
When opening the app
And there are no interventions configured
Then a button with the text “Add New Intervention” should be visible
Then a button with the “+” sign should not be visible


Scenario: Unauthorized creation of a new intervention on the app with already configured intervention
Given an authorized "administrator"
When opening the app
And there are interventions configured
Then a button with the “+” sign should not be visible

Scenario:  General configuration page visible
Given an authorized "administrator"
And the active tab is “General”
Then the name, description, period type, period, org unit, and legend definition fields should be visible

Scenario: General configuration
Given an authorized "administrator"
And the active tab is “General”
And I input the name as “Automated Intervention Test”
And I input the description as “This is an automated test to verify BNA app functionalities”
And I input the period type as “Yearly”
And I input the default period as “2021”
And I select the organisation unit as “Bo”
And I set the “second” legend definition to “Much progress made” with color “#f5a623”
And I click on Next
Then the active tab should change to “Determinants”

Scenario: General configuration validations
Given an authorized "administrator"
And the active tab is “General”
And the name input is empty
And I click on Next
Then an error message on the name input with the text “Intervention name is required” should be visible
And when  I type in the name “An existing Intervention Name”
And I click on Next
Then an error message on the name input with the text “An intervention with this name already exists” should be visible

Scenario: Determinants Configuration page visible
Given an authorized "administrator"
And the active tab is “Determinant”
Then the determinants configuration area should be visible

Scenario: Determinants indicator configuration
Given an authorized "administrator"
And the active tab is “Determinants”
And the “Commodities” determinant is assigned the indicator “Access to ANC Services”
And the “Human Resource” determinant is assigned the indicator “ANC Coverage 1” and indicator “ANC Coverage 2”
And the “Geographical Accessibility” determinant is assigned the indicator “ANC Coverage 2”
And the “Initial Utilization” determinant is assigned the indicator “Access to ANC Services”
And the “Continuous Utilization” determinant is assigned the indicator “Access to ANC Services”
And the “Effective Coverage” determinant is assigned the indicator “Access to ANC Services”
And save and exit is clicked
Then the assigned indicators per change should be reflected

Scenario: Determinant color configuration
Given an authorized "administrator"
And the active tab is “Determinants”
And the “Commodities” determinant is assigned color “#someColor”
And the “Effective Coverage” determinant is assigned color “#someColor”
And save and exit is clicked
Then the color changes should be reflected in the chart

Scenario: Determinant indicator configuration
Given an authorized "administrator"
And the active tab is “Determinants”
And the “ANC Coverage 1” indicator from the “Commodities” determinant is selected
And the label is changed to “ANC”
And the “Target” legend is changed to min = “90” and max = “100”
And the “Progress” legend is changed to min = “60” and max = “90”
And the “Not on track” legend is changed to min = “0” and max = “60”
And save and exit is clicked
Then values equal or greater than “90” should have “green” color in the sub-level table
Then values equal or greater than “60”  but less than “90” should have “yellow” color in the sub-level table
Then values equal or greater than “0”  but less than “90” should have “red” color in the sub-level table
Then the “Commodities” determinant should have an indicator with label “ANC” on the chart
Then the “Commodities” determinant should have an indicator with label “ANC” on the sub-level-table


Scenario: Determinant indicator configuration validation
Given an authorized "administrator"
And the active tab is “Determinants”
And the “ANC Coverage 1” indicator from the “Commodities” determinant is selected
And the label is changed to “”
And I click save and exit
Then an error message on label input with the text “Label is required” should be visible


Scenario: Clear all indicators on all determinants
Given an authorized "administrator"
And the active tab is “Determinants”
And “Clear All” button is clicked
And confirm dialog appears
And “Confirm” button is clicked
Then the “Commodities” determinant should have “0” indicators configured
Then the “Human Resources” determinant should have “0” indicators configured
Then the “Geographical Accessibility” determinant should have “0” indicators configured
Then the “Initial Utilization” determinant should have “0” indicators configured
Then the “Continuous Utilization” determinant should have “0” indicators configured
Then the “Effective Coverage” determinant should have “0” indicators configured

Scenario: Use short names as labels
Given an authorized "administrator"
And the active tab is “Determinants”
And the “Use short name as labels” checkbox is checked
And the confirm dialogs appear
And the “Confirm” button is clicked
And the “ANC Coverage 1” indicator from the “Commodities” determinant is selected
Then the label input should be disabled

Scenario: Delete indicator
Given an authorized "administrator"
And the active tab is “Determinants”
And the “ANC Coverage 2” indicator from the “Human Resources” determinant is deleted
Then the indicator “ANC Coverage 2” should not be visible in the “Human Resource” list
And I click on save and exit
Then the indicator “ANC Coverage 2” should not appear on the “Human Resource” chat
Then the indicator “ANC Coverage 2” should not appear on the “Human Resource” sub-level table

Scenario: Determinants validation
Given an authorized "administrator"
And the active tab is “Determinants”
And the “ANC Coverage 1” indicator is removed from the “Commodities” determinant
And I click on save and exit
Then an error message with the text “Please select at least one indicator per each determinant” should be visible


Scenario: Access Configuration page visible
Given an authorized "administrator"
And the active tab is “Access”
Then the access configuration area should be visible

Scenario: Search User
Given configuration page
And the active tab is “Access”
And I Search for “John Traote”
Then the search results should contain “John Traote”

Scenario: Search User group
Given configuration page
And the active tab is “Access”
And I Search for “Administrators”
Then the search results should contain “Administrators”

Scenario: Assign User access
Given configuration page
And the active tab is “Access”
And I Search for “John Traote”
And I assign access level of “View and edit”
Then the access list should contain “John Traotre”
Then “John Traotre” access should be “View and Edit”

Scenario: Delete User Access
Given configuration page
And the active tab is “Access”
And I delete “John Traotre” access
Then the access list should not contain “John Traotre”

Scenario: Save and continue
Given configuration page
And the active tab is “General”
And I input the name as “Automated Intervention Test -  Edited”
And I click on save and continue
Then the active page should change to “Determinants”
And I click on the “exit without saving” button
Then the name should be “Automated Intervention Test -  Edited”
