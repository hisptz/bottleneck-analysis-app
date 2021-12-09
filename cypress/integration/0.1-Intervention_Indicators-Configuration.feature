Feature: Interventions and Indicators Configuration

      As Hussein , a user with administrative access.
      I would like to be able to create Intervention and assign them t dashboards for other users to access depending on the sharing access granted to them
      So that other user can access the intervention and see the data that is relevant to them.


      @focus
      Scenario: Create a New Intervention by General Configuration
      Given authorized user with administrative access
      When click intervention search button
      And Choose to create a new Intervention
      Then Stepper Configuration should be displayed
