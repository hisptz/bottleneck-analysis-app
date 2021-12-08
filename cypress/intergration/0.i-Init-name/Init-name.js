/**
 * Scenario: Create Scorecard
 */

When("opening scorecard form", () => {
  cy.get("[data-test='new-scorecard-button']").click();
});
