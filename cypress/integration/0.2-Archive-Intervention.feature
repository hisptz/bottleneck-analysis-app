Feature: Archive Intervention Feature

      As Aisha , a user with access to the Archive Intervention Feature,
      I would like to be able to see previous Archived Interventions,
      So that I would be able to manage those  individual Archived Interventions.


      @focus:
      Scenario: Show list of existing intervention
        Given A user with access to the Archive Intervention Feature
        When I visit the Archive Intervention page
        Then I should see a list of all the Archived Interventions


      @focus:
    Scenario: View Individual Archived Intervention
      Given A user with access to the Archive Intervention Feature
      When I visit the Archive Intervention page
      Then I should be able to view an individual Archived Intervention

    @focus:
    Scenario: "On Delete Comfirmation Archived Intervention"
      Given A user with access to the Archive Intervention Feature
      When I visit the Archive Intervention page
      Then I should be able to see  an individual Archived Intervention dialog for comfirmation

    @focus:
      Scenario: On Delete Archive Intervention
        Given A user with access to the Archive Intervention Feature
        When I visit the Archive Intervention page
        Then I should be able to delete an individual Archived Intervention

    @focus:
    Scenario: To Navigate back to normal intervention page
      Given A user with access to the Archive Intervention Feature
      When I visit the Archive Intervention page
      Then I should be able to navigate back to the normal intervention page
