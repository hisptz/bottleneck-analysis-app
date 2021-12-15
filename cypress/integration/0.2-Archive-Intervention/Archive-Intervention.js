/**
 * Scenario: Show list of existing intervention
 *
 */

Given("A user with access to the Archive Intervention Feature", () => {
  cy.visit("/");
});

When("I visit the Archive Intervention page", () => {
  cy.get(".view-archives-test").click();
});
Then("I should see a list of all the Archived Interventions", () => {
  cy.get(".InterventionList-test").should("be.visible");
});

/**
 * Scenario: View Individual Archived Intervention
 */
When("I visit the Archive Intervention page", () => {
  cy.get(".view-archives-test").click();
});
Then("I should be able to view an individual Archived Intervention", () => {
  // cy.get(".InterventionList-test").should("be.visible");
  cy.get(".archive-menu-cell-action-test").click({ multiple: true });
  cy.get(".archive-menu-cell-action-delete-test > a.jsx-3508410433").click();
  // cy.get(".InterventionList-test").should("be.visible");
});
