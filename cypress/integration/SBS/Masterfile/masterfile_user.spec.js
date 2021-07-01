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

context('Search Contact Info', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/retailplus/login/auth')
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

    it('Validation of User List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('User');

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('User List');
        cy.get('label').contains('User Id:');
        cy.get('label').contains('Username:');
        cy.get('label').contains('First Name:');
        cy.get('label').contains('Last Name:');
        cy.get('.btn').contains('Search');
        cy.get('.sortable').contains('User Id');
        cy.get('.sortable').contains('First Name');
        cy.get('.sortable').contains('Last Name');
        cy.get('.sortable').contains('Username');
        cy.get('.sortable').contains('Status');
        cy.get('.sortable').contains('Updated By');
        cy.get('.sortable').contains('Last Updated');
      })

      it('Search User', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('User'); 

        //Search Using User Id
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