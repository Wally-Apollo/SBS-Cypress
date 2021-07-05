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

        //Select any Product from the list
        cy.get('td').find('a').contains('00000002').click();

        //Validate Show Product
        cy.get('h3').contains('Show Product');
        cy.get('li').find('a').contains('Price');
        cy.get('li').find('a').contains('Supplier');
        cy.get('li').find('a').contains('Product Attribute');
        cy.get('li').find('a').contains('Product Price Commission');
        cy.get('li').find('a').contains('Product Identification');
        cy.get('li').find('a').contains('Product Promo');
        cy.get('li').find('a').contains('Planogram Location');
      })

    it('Search Product Price', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','EX000381');
        cy.get('td').find('a').contains('EX000381').click();

        // cy.get('li').find('a').contains('Price').click();
        cy.get('[name="productPriceSearchCriteria"]').type('PRC_CBD');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('PRC_CBD');
      })

    it('Search Product Supplier', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','EX000381');
        cy.get('td').find('a').contains('EX000381').click();

        cy.get('li').find('a').contains('Supplier').click();
        cy.get('[name="supplierProductSearchCriteria"]').type('CDI');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('CDI');
    })

    it('Search Product Attribute', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','10010030');
        cy.get('td').find('a').contains('10010030').click();

        cy.get('li').find('a').contains('Product Attribute').click();
        cy.get('[name="productAttributeSearchCriteria"]').type('Datu Puti');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('Datu Puti');
    })

    it('Search Product Price Commission', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','11800040');
        cy.get('td').find('a').contains('11800040').click();

        cy.get('li').find('a').contains('Product Price Commission').click();
        cy.get('[name="productPriceCommissionSearchCriteria"]').type('PRC_LUZON');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('PRC_LUZON');
    })

    it('Search Product Category', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','11800040');
        cy.get('td').find('a').contains('11800040').click();

        cy.get('li').find('a').contains('Product Category').click();
        cy.get('[name="productCategoryMemberSearchCriteria"]').type('1180');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('1180');
    })

    it('Search Product Identification', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','11800040');
        cy.get('td').find('a').contains('11800040').click();

        cy.get('li').find('a').contains('Product Identification').click();
        cy.get('[name="productIdentificationSearchCriteria"]').type('GTIN');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('GTIN');
    })

    it('Search Product Promo', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','10820362');
        cy.get('td').find('a').contains('10820362').click();

        cy.get('li').find('a').contains('Product Promo').click();
        cy.get('[name="productPromoProductSearchCriteria"]').type('Dummy Promo');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').find('a').contains('Dummy Promo');
    })

    it('Search Planogram Location', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        //Search Using Product Id
        searchWithOneField('externalId','14010016');
        cy.get('td').find('a').contains('14010016').click();

        cy.get('li').find('a').contains('Planogram Location').click();
        cy.get('[name="planogramLocationSearchCriteria"]').type('7558');
        cy.get('*[class^="search btn"]').click();
        cy.get('td').contains('7558');
    })
})