User story: As a district-level user, I want to view an intervention’s chart

Scenario: View chart of each determinant
Given intervention view page
And there is a chart
Then chart for the determinant “Commodities” should be visible
Then chart for the determinant “Human Resource” should be visible
Then chart for the determinant “Geographical Accessibility” should be visible
Then chart for the determinant “Initial Utilization” should be visible
Then chart for the determinant “Continuous Utilization” should be visible
Then chart for the determinant “Effective Coverage” should be visible

Scenario:  View chart in full screen
Given intervention view page
And there is a chart
And I click on the side menu
And I click on “View Full Page”
Then the chart should be in full screen

Scenario: Download PDF
Given intervention view page
And there is a chart
And I click on the side menu
And I click on “Download PDF”
Then a “PDF” file should be downloaded

Scenario: Download PNG
Given intervention view page
And there is a chart
And I click on the side menu
And I click on “Download PNG”
Then a “PNG” file should be downloaded

Scenario: Download Excel
Given intervention view page
And there is a chart
And I click on the side menu
And I click on “Download Excel”
Then an  “Excel” file should be downloaded

Scenario: Highlight chart column
Given intervention page
And there is a chart
And I click on one chart
Then the chart color should change to red

Scenario: Highlight Multiple chart column
Given intervention page
And there is a chart
And I click on two charts while holding the control key
Then the color of the columns should change to red

Scenario: Network error
Given intervention page
And there is a network error
Then the error message with the text “Unknown Network error” should be visible
Then a refresh button should be visible

Scenario: Indicators not configured error
Given intervention page
And there are no indicators configured
Then the error message with the text “No configured indicators” should be visible


User story: As a district-level user, I want to view an intervention’s sub-level analysis, indicator dictionary, and map

Scenario: Sub-level analysis table view
Given intervention page
Then the sub-level analysis table should be visible

Scenario: Default Layout
Given intervention view page
And sub-level card is visible
And sub-level card is visible
Then the organisation units should be as rows and determinants as columns on the  table

Scenario: Switch Layout
Given intervention view page
And sub-level card is visible
And sub-level card is visible
And I click on the “Switch Layout” button
Then the organisation units should be as columns and determinants as rows on the  table

Scenario: Sub-level analysis legends view
Given intervention page
Then  sub-level analysis legends should be visible

Scenario: Sub-level analysis indicator dictionary
Given intervention page
And the sub-level card is visible
And I select to view indicator dictionary
Then the indicator dictionary for configured indicators should be visible

Scenario: Sub-level analysis indicator dictionary search
Given intervention page
And the sub-level card is visible
And I select to view “ indicator dictionary”
And I search “ANC Coverage 1”
Then the indicator dictionary for “ANC Coverage 1” should be visible

Scenario: View map
Given intervention page
And sub-level card is visible
And I select to view “map”
Then the map should be visible

Scenario: Download Excel
Given intervention view page
And sub-level card is visible
And I click on the side menu
And I click on “Download Excel”
Then an  “Excel” file should be downloaded

Scenario:  View sub-level in full screen
Given intervention view page
And sub-level card is visible
And I click on the side menu
And I click on “View Full Page”
Then the sub-level should be in full screen

User story: As a district-level user, I want to view and manage root causes data.

Scenario: View root cause table
Given intervention page
And root cause card is visible
Then the table showing organisation unit, period, intervention, bottleneck, indicator, possible root cause, possible solutions, and actions should be visible

Scenario: View empty root cause table
Given intervention page
And root cause card is visible
And there are no root causes
Then the text “There are no root causes for this intervention, period, and organisation unit” should be visible
Then the “Add New” should be visible

Scenario: Add root cause
Given intervention page
And root cause card is visible
And I click on “Add New” button
Then the add root cause modal should be visible
And I select the “Bottleneck” as “Geographical Accessiblity”
And I select the “Indicator” as “ANC Coverage 1”
And I input the “Possible root cause” as “Automated root cause testing”
And I input the “Possible Solution” as “Automated root cause testing solution”
And I click on Save
Then the add root cause modal should not be visible
Then a root cause with “Possible root cause” as “Automated root cause testing” should be visible


Scenario: Add root cause form validation
Given intervention page
And root cause card is visible
And I click on the “Add New” button
And I click on the “Save” button
Then error with the text “Bottleneck is required” should be visible
Then error with the text “Possible solution  is required” should be visible

Scenario: Edit root cause
Given intervention page
And root cause card is visible
And I select to ”edit” root cause with the ‘Possible root cause“ as “Automated root cause testing”
And I input the “Possible root cause” as “Automated root cause testing - edited”
And I click on the “Save” button
Then the add root cause modal should not be visible
Then a root cause with “Possible root cause” as “Automated root cause testing - edited” should be visible

Scenario: Delete root cause
Given intervention page
And root cause card is visible
And I select to “delete” root cause with the ‘Possible root cause“ as “Automated root cause testing - edited”
Then a root cause with “Possible root cause” as “Automated root cause testing - edited” should not  be visible


Scenario: Download Excel
Given intervention view page
And root cause card is visible
And I click on the side menu
And I click on “Download Excel”
Then an  “Excel” file should be downloaded

Scenario:  View sub-level in full screen
Given intervention view page
And root cause card is visible
And I click on the side menu
And I click on “View Full Page”
Then the root cause table should be in full screen
