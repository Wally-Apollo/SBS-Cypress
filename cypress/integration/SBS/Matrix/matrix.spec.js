/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

context('MATRIX', () => {
    beforeEach(() => {
        cy.visit('http://192.168.21.134/retailplus/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        // cy.get('[id^=password]').contains('Password');
        const username = '0920013';
        const password = '920013';
        cy.get('[id^=username]').type(username);
        cy.get('[id^=password]').type(password);
        cy.get('[id^=submit]').click();

        cy.contains('Masterfile');
        cy.contains('Matrix');
        cy.contains('Inventory');
        cy.contains('Sales');
        cy.contains('Report');
        cy.contains('Misc');
        cy.contains('Sign out');
    })

    it('Validation of Planogram List page', () => {
        //Click Master file from the menu
        navigateToModule('Matrix');

        //Click Planogram from menu list
        navigateToSubModule('Planogram');

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Planogram List');
        cy.get('label').contains('Document Id');
        cy.get('label').contains('Reference Id');
        cy.get('label').contains('Status:');
        cy.get('.sortable').contains('Document Id');
        cy.get('.sortable').contains('Reference Id');
        cy.get('.sortable').contains('Status');
      })

      it('Search Planogram', () => {
        //Click Matrix from the menu
        navigateToModule('Matrix');

        //Click Planogram from the menu list
        navigateToSubModule('Planogram'); 

        //Search Using Document Id
        searchWithOneField('externalId','0000000');
        cy.get('td').find('a').contains('0000000');
        cy.get('.btn').contains('Clear').click();

        //Search Using Username
        searchWithOneField('username','0000000');
        cy.get('td').find('a').contains('0000000');
        cy.get('.btn').contains('Clear').click();

        //Search Using Firstname
        searchWithOneField('firstName','Dummy');
        cy.get('td').find('a').contains('Dummy');
        cy.get('.btn').contains('Clear').click();

        //Search Using Last name
        searchWithOneField('lastName','Cashier');
        cy.get('td').find('a').contains('Cashier');
        cy.get('.btn').contains('Clear').click();

        //Search using all field
        cy.get('[id^=externalId]').type('0000000');
        cy.get('[id^=username]').type('0000000');
        cy.get('[id^=firstName]').type('Dummy');
        cy.get('[id^=lastName]').type('Cashier');
        cy.get('.btn').contains('Search').click();

        cy.get('td').find('a').contains('0000000');
        cy.get('td').find('a').contains('0000000');
        cy.get('td').find('a').contains('Dummy');
        cy.get('td').find('a').contains('Cashier');

      })
})

