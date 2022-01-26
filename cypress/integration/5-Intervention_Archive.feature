User story: As a district-level user, I want to view and create archives for intervention

Scenario: Archive intervention
Given intervention page
And I click on the “More” Button
And I click on “Archive”
Then a modal with archive description input should be visible
And I input “Archive description” as “Automated test archive description”
And I click the “Archive” button
Then the intervention should be archived
Then I should be navigated to the archived page for the intervention

Scenario: View archives
Given intervention page
And I click on the “More” Button
And I click on “View Archives”
Then the archive table should be visible

Scenario: View empty archives
Given intervention page
And I click on the “More” Button
And I click on “View Archives”
And there are no archives
Then the archive table should not  be visible
Then the message “There are no archived interventions” should be visible
Then the button “Back to Interventions” should be visible


Scenario: Delete archives from the list
Given intervention page
And I click on the “More” Button
And I click on “View Archives”
And I delete the first archive with the intervention description  “Automated Intervention”
Then the archive with intervention “Automated Intervention” should not be visible

Scenario: Delete archives from the archive
Given intervention page
And I click on the “More” Button
And I click on “View Archives”
And I click on the first archive with
And I click on the “Delete” button
Then the archive with the description ”To be deleted” should not be visible

