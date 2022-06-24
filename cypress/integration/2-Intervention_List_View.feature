User story: As a district-level user, I want to view a list of configured interventions, search for specific interventions

Scenario: No  intervention view
Given an authorized district-level user
When opening the app
And there are no interventions configured
Then a button with the text “Add New Intervention” should not  be visible

Scenario: View intervention list
Given an authorized district-level user
When opening the app
And there are interventions configured
Then a list of interventions should be visible

Scenario: Search intervention list
Given an authorized district-level user
And there are interventions configured
And I search “Test Intervention”
Then intervention with the name “Test Intervention” should be visible

Scenario: Search not found
Given an authorized district-level user
And there are interventions configured
And I search “Test Intervention -not available”
Then the error message with text “Searched Intervention is not found” should be visible

Scenario: Show more interventions
Given an authorized district-level user
And there are many interventions configured
And I click on  show more button
Then the indicator “Hidden from view” should be visible
