/**
 * Scenario: Show list of existing intervention
 *
 */

Given("A user with access to the Archive Intervention Feature", () => {
  cy.visit("/");
});

When("I visit the Archive Intervention page", () => {
  cy.get("[data-test='more-menu-button']").click();
  cy.get("[data-test='view-archives-list-button']").click();
});
Then("I should see a list of all the Archived Interventions", () => {
  cy.get(".InterventionList-test").should("be.visible");
});

/**
 * Scenario: View Individual Archived Intervention
 */
When("I visit the Archive Intervention page", () => {
  cy.get("[data-test='more-menu-button']").click();
  cy.get("[data-test='view-archives-list-button']").click();
});
Then("I should be able to view an individual Archived Intervention", () => {
  // cy.get(".InterventionList-test").should("be.visible");
  cy.get(".archive-menu-cell-action-test").click({ multiple: true });
  // cy.get(".InterventionList-test").should("be.visible");
});


Given(/^I am logged in as a user with access to the Archive Intervention Feature$/, function() {
  cy.visit("/");

});
When(/^I create an archived intervention$/, function() {
  cy.get("[data-test='more-menu-button']").click();
  cy.get("[data-test='archive-intervention-button']").click();
  cy.get("[data-test=\"dhis2-uicore-textarea\"]").type("Test Intervention archive");
  cy.get("[data-test='confirm-archive-intervention-button']").click();

});
Then(/^I should be navigated to the new intervention archive$/, function() {
  cy.get("[data-test=\"archive-container\"]").should("be.visible");
});


Then(/^I should be able to navigate back to the normal intervention page$/, function() {
  cy.get(".archive-intervntion-on-back-action").click();
});
When(/^I click on the delete button$/, function() {
  cy.get("[data-test='delete-archive-menu-button']").click();
});
Then(/^I should be able to delete the Archived Intervention$/, function() {
  cy.get(".destructive").click();
});
