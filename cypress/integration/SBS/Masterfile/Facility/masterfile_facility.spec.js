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

function validateFacilityModule(){
    //Validate user module content
    cy.get('h3').contains('Facility List');
    cy.get('label').contains('Facility Id');
    cy.get('label').contains('Facility Name');
    cy.get('label').contains('Global Location Number');
    cy.get('label').contains('Status');
    cy.get('label').contains('Facility Type');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');
    cy.get('.sortable').contains('Facility Id');
    cy.get('.sortable').contains('GLN');
    cy.get('.sortable').contains('Facility Name');
    cy.get('.sortable').contains('Facility Type');
    cy.get('.sortable').contains('Updated By');
    cy.get('.sortable').contains('Last Updated');
}

context('Masterfile -> Facility', () => {
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

    it('Validation of Facility List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();
    })

    it('Search Facility', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Facility from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();

       //Search Using Facility Id
       searchWithOneField('externalId','0166');
       cy.get('td').find('a').contains('0166');
       cy.get('.btn').contains('Clear').click();

       //Search Using Facility Name
       searchWithOneField('groupName','COLUMBIA');
       cy.get('td').find('a').contains('COLUMBIA');
       cy.get('.btn').contains('Clear').click();

       //Search Using GLN
       searchWithOneField('gln','4806018201660');
       cy.get('td').find('a').contains('4806018201660');
       cy.get('.btn').contains('Clear').click();

       //Search Using Status
       cy.get('[id^=facilityStatus]').select('Closed');
       cy.get('.btn').contains('Search').click();
       cy.get('tbody>tr').eq(0).find('a').eq(0).click(); 
       cy.get('span').contains('Closed');
       cy.get('.btn').contains('<< Back to Facility List').click();

       //Search Using Facility Type
       cy.get('[id^=autoFTParentList]').click().type('{downarrow}').type('{enter}');
       cy.get('.btn').contains('Search').click();
       for(let i = 0; i < 10; i ++){
           cy.get('tbody>tr').eq(i).find('a').eq(3).contains('Corporate');
       }

        
    })

    it('Validation of Show Facility page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Facility from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();

        //Select any facility from the list
        cy.get('td').find('a').contains('0002').click();
        
        //Validate Show Facility
        cy.get('h3').contains('Show Facility');
        cy.get('li').find('a').contains('Contact Info');
    })

    it('Search Facility Contact Info', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Facility from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();

       //Search Using Facility Id
       searchWithOneField('externalId','0166');
       cy.get('td').find('a').contains('0166').click();

        //Validate Show Facility
        cy.get('h3').contains('Show Facility');
        cy.get('li').find('a').contains('Contact Info').click();
        cy.get('[name="contactMechSearchCriteria"]').type('1232323');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('1232323');
    })
})