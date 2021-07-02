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

function validateProductModule(){
    //Validate user module content
    cy.get('h3').contains('Product List');
    cy.get('label').contains('Short Name :');
    cy.get('label').contains('Long Name :');
    cy.get('label').contains('GTin :');
    cy.get('label').contains('Product Id:');
    cy.get('label').contains('Description:');
    cy.get('label').contains('Introduction Date:');
    cy.get('label').contains('Discontinuation Date:');
    cy.get('.btn').contains('Search');

    cy.get('th').contains('Product Id');
    cy.get('th').contains('GTIN');
    cy.get('th').contains('Short Name');
    cy.get('th').contains('Long Name');
    cy.get('th').contains('Description');
    cy.get('th').contains('Introduction Date');
    cy.get('th').contains('Discontinuation Date');
}

context('Masterfile -> Product', () => {
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

    it('Validation of Product List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product');

        //Validate that there will be no Error message displayed
        validateProductModule();
      })

      it('Search Product', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Short Name
        searchWithOneField('shortName','ProdWithNoPrice');
        cy.get('td').find('a').contains('ProdWithNoPrice');
        cy.get('.btn').contains('Clear').click();

        //Search Using Long Name
        searchWithOneField('longName','Product with');
        cy.get('td').find('a').contains('Product with');
        cy.get('.btn').contains('Clear').click();

        //Search Using GTIN
        searchWithOneField('gtin','4256354125432');
        cy.get('td').find('a').contains('4256354125432');
        cy.get('.btn').contains('Clear').click();

        //Search Using Product Id
        searchWithOneField('externalId','00000002');
        cy.get('td').find('a').contains('00000002');
        cy.get('.btn').contains('Clear').click();

      })

      it('Validation of Show Product page', () =>{
        
        //Click Master file from the menu
        navigateToModule('Masterfile');
        //Click User from menu list
        navigateToSubModule('Product'); 
        //Validate that there will be no Error message displayed
        validateProductModule();

        //Select any user from the list
        cy.get('td').find('a').contains('00000002').click();

        //Validate Show user
        cy.get('h3').contains('Show Product');
        cy.get('li').find('a').contains('Price');
        cy.get('li').find('a').contains('Supplier');
        cy.get('li').find('a').contains('Product Attribute');
        cy.get('li').find('a').contains('Product Price Commission');
        cy.get('li').find('a').contains('Product Identification');
        cy.get('li').find('a').contains('Product Promo');
        cy.get('li').find('a').contains('Planogram Location');
      })

      // it('Search Facility User Role', () =>{

      //   //Click Master file from the menu
      //   navigateToModule('Masterfile');
      //   //Click User from menu list
      //   navigateToSubModule('User'); 
      //   //Validate that there will be no Error message displayed
      //   validateUserModule();

      //   //Select any user from the list
      //   cy.get('td').find('a').contains('0000000').click();

      //   //Validate Show user
      //   cy.get('h3').contains('Show User');
      //   cy.get('li').find('a').contains('Facility User Role').click();
        
      //   cy.get('[name="facilityUserRoleSearchCriteria"]').type('2003');
      //   cy.get('*[class^="search btn"]').click();
      //   cy.get('td').find('a').contains('2003');
      // })

      // it('Search Contact Info', () =>{

      //   //Click Master file from the menu
      //   navigateToModule('Masterfile');
      //   //Click User from menu list
      //   navigateToSubModule('User'); 
      //   //Validate that there will be no Error message displayed
      //   validateUserModule();

      //   //Select any user from the list
      //   cy.get('td').find('a').contains('0000000').click();

      //   //Validate Show user
      //   cy.get('h3').contains('Show User');
      //   cy.get('li').find('a').contains('Contact Info').click();
        
      //   cy.get('[name="contactMechSearchCriteria"]').type('sad');
      //   cy.get('*[class^="search btn"]').click();
      //   cy.get('td').find('a').contains('sad');
      // })

      // it('Search Party Info', () =>{

      //   //Click Master file from the menu
      //   navigateToModule('Masterfile');
      //   //Click User from menu list
      //   navigateToSubModule('User'); 
      //   //Validate that there will be no Error message displayed
      //   validateUserModule();

      //   //Select any user from the list
      //   cy.get('td').find('a').contains('0000000').click();

      //   //Validate Show user
      //   cy.get('h3').contains('Show User');
      //   cy.get('li').find('a').contains('Party Info').click();
        
      //   cy.get('[name="partyInfoSearchCriteria"]').type('Test-migel1');
      //   cy.get('*[class^="search btn"]').click();
      //   cy.get('td').find('a').contains('Test-migel1');
      // })
})