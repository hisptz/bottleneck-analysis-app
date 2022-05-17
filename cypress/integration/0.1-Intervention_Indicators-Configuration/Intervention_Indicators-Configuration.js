/**
 * Scenario: Create a New Intervention by General Configuration
 */

Given("authorized user with administrative access", () => {
  cy.visit("/");
});
When("click intervention search button", () => {
  cy.get("[data-test='add-intervention-button']").click();
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
  cy.get("[data-test='add-intervention-button']").click();
  cy.get("[data-test='intervention-selection-menu']").should("be.visible");
  cy.get("[data-test='create-intervention-menu']").click();
  cy.get(".MuiPaper-root").should("be.visible");
  cy.get(".interventionConfig").should("be.visible");
  cy.get(".legend-definition-config").should("be.visible");
});
And("Set name of the intervention", () => {
  cy.get("[data-test='interventionName']").type("Test Intervention1");
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
  cy.get("#intervention-search").type("Test Intervention1");
  cy.get(".gap > .column > .row > :nth-child(1)").should("be.visible").and("is.not.empty");
});
/**
 * cy.get('.MuiPaper-root > :nth-child(3)')
 */
/**
 * Scenario: Display Indicators to the New Intervention in Determinant Configuration
 */
And("Determinant Configuration is displayed", () => {
  cy.get("[data-test='interventionName']").type("Some random name");
  cy.get(".MuiPaper-root > :nth-child(3)").click();
  cy.get(".determinant-main").should("be.visible");
});
And("Clear Button is Disabled", () => {
  cy.get("[data-test='clear-determinant-button']").should("be.disabled");
});
Then(
  "Determinant Configuration should be displayed with Add Button in Each Determinantet Settings of New Intervention in General Configuration without Sub Level Analysis",
  () => {
    cy.get("[data-test='clear-determinant-button']").should("be.disabled");
    // cy.get(":nth-child(1) > .MuiAccordionSummary-root").click();
    // cy.get("[data-test='add-indicator-button']").should("be.visible");
  }
);

/**
 * Scenario: Display Access Configuation Page
 */
Given("Access button is clicked", () => {
  cy.get("[data-test='add-intervention-button']").click();
  cy.get("[data-test='intervention-selection-menu']").should("be.visible");
  cy.get("[data-test='create-intervention-menu']").click();
  cy.get(".MuiPaper-root").should("be.visible");
  cy.get(".interventionConfig").should("be.visible");
  cy.get(".legend-definition-config").should("be.visible");
  cy.get("[data-test='interventionName']").type("Some random name");

  cy.get(".MuiPaper-root > :nth-child(5)").click();
  //accessConfig-helper
});
Then("Access Configuration page should displayed", () => {
  cy.get(".accessConfig-helper").should("be.visible");
});

/**
 * Scenario:  Display Access Levels in Access Configuration
 */
Given("authorized user with administrative access", () => {
  cy.visit("/");
});
When("user select access level", () => {
  cy.get("[data-test='configuration-button-test']").click();
  cy.get(".MuiPaper-root > :nth-child(5)").click();
  cy.get("[data-test='access-level-list-test']").click();
});
Then("List of access level should be displayed", () => {
  cy.get("[data-test='access-level-option-list-test']").should("be.visible");
});

/**
 * Scenario:  Give Access to view only to all user
 */
Given("authorized user with administrative access", () => {
  cy.visit("/");
});
When("access level of view only is given to normal user", () => {
  const username = Cypress.env("dhis2NormalUsername");
  const password = Cypress.env("dhis2NormalPassword");
  const loginUrl = Cypress.env("dhis2BaseUrl");
  const LOGIN_ENDPOINT = "dhis-web-commons-security/login.action";
  cy.request({
    url: `${loginUrl}/${LOGIN_ENDPOINT}`,
    method: "POST",
    form: true,
    followRedirect: true,
    body: {
      j_username: username,
      j_password: password,
      "2fa_code": "",
    },
  });
  cy.wait(5000);
});
Then("user should be able to view only", () => {
  cy.get("[data-test='configuration-button-test']").should("be.invisible");
});
