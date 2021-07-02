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
    cy.get('td').find('a').contains(value);
}

function validatePromoModule(){
    //Validate user module content
    cy.get('h3').contains('Promo List');
    cy.get('label').contains('Promo ID');
    cy.get('label').contains('Promo Name');
    cy.get('label').contains('Non Cash Master Code');
    cy.get('label').contains('Non Cash Code');
    cy.get('.btn').contains('Search');


    cy.get('.sortable').contains('Promo Id');
    cy.get('.sortable').contains('Promo Name');
    cy.get('.sortable').contains('Description');
    cy.get('.sortable').contains('Limit Per Customer');
    cy.get('.sortable').contains('Updated By');
    cy.get('.sortable').contains('Last Updated');
}

context('Masterfile -> Promo', () => {
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

    it('Validation of Promo List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Promo from menu list
        navigateToSubModule('Promo');

        //Validate that there will be no Error message displayed
        validatePromoModule();
      })

    it('Search Promo', () => {
      //Click Master file from the menu
      navigateToModule('Masterfile');

      //Click Promo from menu list
      navigateToSubModule('Promo');

      //Validate that there will be no Error message displayed
      validatePromoModule();    

      //Search Using Promo Id
      searchWithOneField('id','00000000');
      cy.get('.btn').contains('Clear').click();

      //Search Using Promo Name
      searchWithOneField('promoName','Dummy Promo');
      cy.get('.btn').contains('Clear').click();
    })

    it('Validation of Show Promo page', () => {
      //Click Master file from the menu
      navigateToModule('Masterfile');

      //Click Promo from menu list
      navigateToSubModule('Promo');

      //Validate that there will be no Error message displayed
      validatePromoModule();

      //Select any facility from the list
      cy.get('td').find('a').contains('00000000').click();
        
      //Validate Show Facility
      cy.get('h3').contains('Show Promo');
      cy.get('li').find('a').contains('Promo Facility');
    })

    it('Search Promo Facility',() => {
      //Click Master file from the menu
      navigateToModule('Masterfile');

      //Click Promo from menu list
      navigateToSubModule('Promo');

      //Validate that there will be no Error message displayed
      validatePromoModule();

      //Select any facility from the list
      cy.get('td').find('a').contains('00000000').click();

      //Validate Show Facility
      cy.get('h3').contains('Show Promo');
      cy.get('li').find('a').contains('Promo Facility').click();
      cy.get('[name="promoFacilitySearchCriteria"]').type('Orion');
      cy.get('*[class^="search btn"]').click();
      cy.get('td').find('a').contains('Orion');
    })

})