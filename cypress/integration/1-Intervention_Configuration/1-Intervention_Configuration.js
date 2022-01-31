/**
 * Scenario:  Create a New Intervention by General Configuration
 */

Given("authorize user with administrative access",()=>{
    cy.visit("/");
});

When("click intervention search button",()=>{
    cy.get('.header-container > .column').click();
    cy.get('[data-test=addIntervntionButton]').click();
    cy.get('#name').click();
    cy.get('#name').type('{backspace}');
    cy.get('#name').type('{backspace}');
    cy.get('#name').type('Testing Intervention');
    cy.get('#description').click();
    cy.get('#description').type('Testing Intervention Description');
    cy.get('[data-test=scorecard-admin-next-button]').click();
    cy.get('.Mui-expanded > .MuiIconButton-label > svg').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('.MuiPaper-root:nth-child(1) > .MuiButtonBase-root svg').click();
    cy.get('.Mui-expanded > .MuiIconButton-label > svg').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('.MuiPaper-root:nth-child(2) > .MuiButtonBase-root svg').click();
    cy.get('.Mui-expanded > .MuiIconButton-label > svg').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('.MuiPaper-root:nth-child(3) > .MuiButtonBase-root > .MuiButtonBase-root').click();
    cy.get('.MuiPaper-root:nth-child(4) > .MuiButtonBase-root .column').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('.MuiPaper-root:nth-child(4) > .MuiButtonBase-root > .MuiButtonBase-root').click();
    cy.get('.MuiPaper-root:nth-child(5) .accordion-title').click();
    cy.get('.Mui-expanded > .MuiIconButton-label > svg').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('.MuiPaper-root:nth-child(5) > .MuiButtonBase-root > .MuiButtonBase-root').click();
    cy.get('.Mui-expanded > .MuiIconButton-label > svg').click();
    cy.get('[data-test=add-indicator-button]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-transferoption]').click();
    cy.get('[data-test=dhis2-uicore-button]').click();
    cy.get('[data-test=scorecard-admin-next-button]').click();
    cy.get('[data-test=scorecard-admin-next-button]').click();
    
})
And("Choose to create a new Intervention",()=>{

})
Then("Stepper Configuration should be displayed",()=>{

});