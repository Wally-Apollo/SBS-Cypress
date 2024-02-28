/// <reference types="Cypress" />

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

context('M03 - Masterfile (Product Tab)', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();

        cy.contains('Masterfile');
        cy.contains('Matrix');
        cy.contains('Inventory');
        cy.contains('Sales');
        cy.contains('Report');
        cy.contains('Misc');
        cy.contains('Sign out');
    })

    // it('Validation of Product List page', () => {
    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');

    //     //Click User from menu list
    //     navigateToSubModule('Product');

    //     //Validate that there will be no Error message displayed
    //     validateProductModule();
    //   })

    it('TC01: S01 - S07', () => {
    //Click Master file from the menu
    navigateToModule('Masterfile');

    //Click User from menu list
    navigateToSubModule('Product'); 
    validateProductModule();

        cy.fixture('masterfile/product/m03_product_invalid_data.json').then((data) => {
            //Search Using Short Name
            searchWithOneField('shortName',data.short_name);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using Long Name
            searchWithOneField('longName',data.long_name);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using GTIN
            searchWithOneField('gtin',data.gtin);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);            
        })
    })

    it('TC01: S08 - S14', () => {
    //Click Master file from the menu
    navigateToModule('Masterfile');

    //Click User from menu list
    navigateToSubModule('Product'); 
    validateProductModule();

        cy.fixture('masterfile/product/m03_product_valid_data.json').then((data) => {
            //Search Using Short Name
            searchWithOneField('shortName',data.short_name);
            cy.get('td').find('a').should('contain',data.short_name).wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using Long Name
            searchWithOneField('longName',data.long_name);
            cy.get('td').find('a').should('contain',data.long_name).wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using GTIN
            searchWithOneField('gtin',data.gtin);
            cy.get('td').find('a').should('contain',data.gtin).wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);

            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').should('contain',data.external_id).wait(1000);
            cy.get('.btn').contains('Clear').click().wait(1000);      
        })
    })

    // it('Validation of Show Product page', () =>{
        
    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');
    //     //Click User from menu list
    //     navigateToSubModule('Product'); 
    //     //Validate that there will be no Error message displayed
    //     validateProductModule();

    //     cy.fixture('masterfile/product/m03_product_valid_data.json').then((data) => {
    //         //Select any Product from the list
    //         cy.get('td').find('a').contains(data.external_id).click();

    //         //Validate Show Product
    //         cy.get('h3').contains('Show Product');
    //         cy.get('li').find('a').contains('Price');
    //         cy.get('li').find('a').contains('Supplier');
    //         cy.get('li').find('a').contains('Product Attribute');
    //         cy.get('li').find('a').contains('Product Price Commission');
    //         cy.get('li').find('a').contains('Product Identification');
    //         //recheck if needed on other product
    //         // cy.get('li').find('a').contains('Product Promo');
    //         cy.get('li').find('a').contains('Planogram Location');
    //     })
    // })

    it('TC01: S15- S16', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');
        cy.wait(1500);

        //Click User from menu list
        navigateToSubModule('Product');
        cy.wait(1500); 
        validateProductModule();
        cy.wait(1500);

        cy.fixture('masterfile/product/search_product_price_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.wait(1500);
            cy.get('td').find('a').contains(data.external_id).click();
            cy.wait(1500);

            // cy.get('li').find('a').contains('Price').click();
            cy.get('[name="productPriceSearchCriteria"]').type(data.product_price_criteria);
            cy.wait(1500);
            cy.get('*[class^="search btn"]').click();
            cy.wait(1500);
            cy.get('td').find('a').contains(data.product_price_criteria);
            cy.wait(1500);
        })
      })

    it('TC01: S17 - S21', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_product_supplier_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Supplier').click();
            cy.get('[name="supplierProductSearchCriteria"]').type(data.supplier_product_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').find('a').contains(data.supplier_product_criteria);
        })
    })

    it('TC01: S22 - S25', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_product_attribute_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Product Attribute').click();
            cy.get('[name="productAttributeSearchCriteria"]').type(data.product_attribute_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').find('a').contains(data.product_attribute_criteria);
        })
    })

    it('TC01: S26', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_product_price_commission_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Product Price Commission').click();
            cy.get('[name="productPriceCommissionSearchCriteria"]').type(data.product_price_commission_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').find('a').contains(data.product_price_commission_criteria);        
        })
    })

    it('TC01: S27 - S30', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_product_category_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Product Category').click();
            cy.get('[name="productCategoryMemberSearchCriteria"]').type(data.product_category_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').find('a').contains(data.product_category_criteria);
        })
    })

    it('TC01: S31 - S34', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_product_identification_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Product Identification').click();
            cy.get('[name="productIdentificationSearchCriteria"]').type(data.product_identification_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').find('a').contains(data.product_identification_criteria);
        })
    })

    // hidden in some data
    // it('Search Product Promo', () =>{
    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');

    //     //Click User from menu list
    //     navigateToSubModule('Product'); 
    //     validateProductModule();

    //     cy.fixture('masterfile/product/search_product_promo_data').then((data) => {
    //         //Search Using Product Id
    //         searchWithOneField('externalId',data.external_id);
    //         cy.get('td').find('a').contains(data.external_id).click();

    //         cy.get('li').find('a').contains('Product Promo').click();
    //         cy.get('[name="productPromoProductSearchCriteria"]').type(data.product_promo_criteria);
    //         cy.get('*[class^="search btn"]').click();
    //         cy.get('td').find('a').contains(data.product_promo_criteria);    
    //     })
    // })

    it('TC01: S35', () =>{
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Product'); 
        validateProductModule();

        cy.fixture('masterfile/product/search_planogram_location_data').then((data) => {
            //Search Using Product Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();

            cy.get('li').find('a').contains('Planogram Location').click();
            cy.get('[name="planogramLocationSearchCriteria"]').type(data.planogram_location_criteria);
            cy.get('*[class^="search btn"]').click();
            cy.get('td').contains(data.planogram_location_criteria);
        })
    })

    it('TC01: S36', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');
        cy.wait(1000);
        //Click Facility from menu list
        navigateToSubModule('Product');
        cy.wait(1000);
        //Validate that there will be no Error message displayed
        validateProductModule();
        cy.wait(1000);
        cy.get('.pagination > :nth-child(2)').click();
        cy.wait(1500);
        cy.get('.navbar-text > a').click();
        cy.wait(500);
    })

    // cy.get('.pagination > :nth-child(2)')
})