/**
 * Scenario:  Show root cause  component
 */
Given("A user who authorized", () => {
  cy.visit("/");
});
When("I visit the Root Cause Component", () => {
  cy.wait(2000);
  cy.get("[data-test='root-cause-table']").scrollIntoView();
});
Then("I should be able to see list of all the Root cause component", () => {
  cy.get("[data-test='root-cause-table']").should("be.visible");
});

/**
 * Scenario: Show new root cause form
 */
And("I navigate to add new root cause component", () => {
  cy.get("[data-test='add-new-root-cause']").click();
});
Then("A form of adding new root cause details should appear", () => {
  cy.get("[data-test='root-cause-form']").should("be.visible");
});

/**
 * Scenario: Add new root cause form
 */
And("I visit the Root Cause Component", () => {
  cy.wait("2000");
  cy.get("[data-test='root-cause-table']").scrollIntoView();
});
And("I navigate to add new root cause component", () => {
  cy.get("[data-test='add-new-root-cause']").click();
});
And("A form of adding new root cause details appeared", () => {
  cy.get("[data-test='root-cause-form']").should("be.visible");
});
When("adding new root cause details in the form appear", () => {
  cy.get("[data-test='bootleneck-root-cause']").click();
  //   cy.get("[data-test='bootleneck-root-cause']").select(0);
  cy.get('[data-value="gMBbWj0ti27"]').click();
  cy.get("[data-test='indicator-root-cause']").click();
  cy.get('[data-test="dhis2-uicore-singleselectoption"]').click();
  cy.get("[data-test='possible-root-cause-input']").type("Test_possible-root-cause");
  cy.get("[data-test='possible-root-solution-input']").type("Test-possible-root-cause-solution");
});
And("Save the form with details entered", () => {
  cy.get("[data-test='save-new-root-cause']").click();
});
Then("I should be able to view the saved root cause", () => {
  cy.get("[data-test='root-cause-form']").should("be.visible");
});
