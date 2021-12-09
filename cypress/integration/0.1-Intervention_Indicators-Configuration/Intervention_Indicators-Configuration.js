/**
 * Scenario: Create a New Intervention by General Configuration
 */
Given("authorized user with administrative access", () => {
  cy.visit("/");
});
When("click intervention search button", () => {
  cy.get("[data-test='addIntervntionButton']").click();
  cy.get("[data-test='intervention-selection-menu']").should("be.visible");
});
And("Choose to create a new Intervention", () => {
  cy.get("[data-test='create-intervention-menu']").click();
});
Then("Stepper Configuration should be displayed", () => {
  cy.get(".MuiPaper-root").should("be.visible");
  cy.get(".interventionConfig").should("be.visible");
  cy.get(".legend-definition-config").should("be.visible");
});
