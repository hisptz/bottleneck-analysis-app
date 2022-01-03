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

      @focus
      Scenario: Set Settings of New Intervention in General Configuration without Sub Level Analysis
      Given authorized user with administrative access
      When Stepper Configuration is displayed
      And Set name of the intervention
      And Set description of the intervention
      And Choose the Period type of the intervention
      And Save the Intervention and Exit 
      Then Intervention should be created Successfully
 
    # TODO
    #  Scenario: Set Settings of New Intervention in General Configuration with Sub Level Analysis

    @focus
    Scenario: Display Indicators to the New Intervention in Determinant Configuration
      Given authorized user with administrative access
      When Stepper Configuration is displayed
      And Determinant Configuration is displayed
      And Clear Button is Disabled
      Then Determinant Configuration should be displayed with Add Button in Each Determinantet Settings of New Intervention in General Configuration without Sub Level Analysis


      # @focus
      # Scenario: Add Indicators to the New Intervention in Determinant Configuration
   @focus
   Scenario: Display Access Configuation Page
   Given authorized user with administrative access
   When Access button is clicked
   Then Access Configuration page should displayed

   @focus
   Scenario: Display Access Levels in Access Configuration
   Given authorized user with administrative access
   When user select access level
   Then List of access level should be displayed

   @focus 
   Scenario: Give Access to view only to all user
   Given authorized user with administrative access
   When access level of view only is given to normal user
   Then user should be able to view only
