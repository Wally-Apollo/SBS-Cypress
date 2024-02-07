/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function navigateToSubModule2(subModule2){
    cy.get('li').contains(subModule2).last().click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

context('CYCLE COUNT', () => {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.visit(sbs_credentials.url)
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
          cy.get('[id^=username]').type(sbs_credentials.username)
          cy.get('[id^=password]').type(sbs_credentials.password)
          cy.get('[id^=submit]').click()

          cy.contains('Masterfile');
          cy.contains('Matrix');
          cy.contains('Inventory');
          cy.contains('Sales');
          cy.contains('Report');
          cy.contains('Misc');
          cy.contains('Sign out');
        })
      })
    })

    it('Validation of Receiving Advice List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Cycle Count')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Cycle Count List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Document Id')
          .and('contain', 'Type')
          .and('contain', 'Date Counted From')
          .and('contain', 'Date Counted To')
          .and('contain', 'Status')

        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('select[name^="f_type"]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateToSearch"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Cycle Count Variance')
        cy.get('.pull-right').contains('New Cycle Count')


        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
          .and('contain', 'Count Date')
          .and('contain', 'Type')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status');
      })  
      
})

