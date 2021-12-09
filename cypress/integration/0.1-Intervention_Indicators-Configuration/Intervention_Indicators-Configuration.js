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

/**
 * Scenario: Set Settings of New Intervention in General Configuration without Sub Level Analysis
 */
When("Stepper Configuration is displayed", () => {
  cy.get("[data-test='addIntervntionButton']").click();
  cy.get("[data-test='intervention-selection-menu']").should("be.visible");
  cy.get("[data-test='create-intervention-menu']").click();
  cy.get(".MuiPaper-root").should("be.visible");
  cy.get(".interventionConfig").should("be.visible");
  cy.get(".legend-definition-config").should("be.visible");
});
And("Set name of the intervention", () => {
  cy.get("[data-test='interventionName']").type("Test Intervention");
});
And("Set description of the intervention", () => {
  cy.get("[data-test='interventionDescription']").type("Test Description");
});
And("Choose the Period type of the intervention", () => {
  cy.get("[data-test='periodType-selection-menu']").click();
  cy.get('[data-value="Monthly"]').click();
});
And("Save the Intervention and Exit", () => {
  cy.get("[data-test='save-exit-intervention-button']").click();
});
Then("Intervention should be created Successfully", () => {
  cy.wait(2000);
  cy.get("#intervention-search").type("Test Intervention");
  cy.get(".gap > .column > .row > :nth-child(1)").should("be.visible").and("is.not.empty");
});
