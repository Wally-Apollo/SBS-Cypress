/// <reference types="cypress" />

const { data } = require("cypress/types/jquery");

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

define('INVENTORY', () => {
    before(function(){
        cy.fixture('inventoryData').then(function(data) {     
            this.data=data        
    })
})

    beforeEach(() => {
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        // cy.get('[id^=password]').contains('Password');
        const username = '711001';
        const password = '711001';
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

    it('Validation of Inventory List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');

        //Click Inventory from menu list
        //navigateToSubModule2('Inventory');
        cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click()

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Inventory List');
        cy.get('div#small-heading').contains('Product Details')
        cy.get('label').contains('Product Id');
        cy.get('label').contains('Product Name');
        cy.get('div#small-heading').contains('Facility Details')
        cy.get('label').contains('Facility ID');
        cy.get('label').contains('Facility');
        cy.get('input[name="_action_list"]').contains('Search')
        cy.get('a').contains('Clear')
        cy.get('th.sortable').contains('Product Id');
        cy.get('th.sortable').contains('Product');
        cy.get('th.sortable').contains('QOH');
        cy.get('th.sortable').contains('ATP');
      
      })

      it('Search Inventory', () => {
        //Click Inventory from the menu
        navigateToModule('Inventory');

        //Click Inventory from the menu list
        cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();

        //Search Using Document Id 
        cy.get('input[id="autoProductListById"]').type(this.data.productId).wait(2000).type('{downArrow}').type('{enter}');
        cy.get('input[name="_action_list"]').click()
      

        //Validate Search Result
        cy.get('td').find('a').contains('25000009');
        cy.get('td').find('a').contains('MD Chocolate-Choco Peanut').click();

      })

      it('Validation of Inventory Detail Page', () => { 
        //Click Inventory from the menu list
        navigateToModule('Inventory');
        cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();

        //Search Using Document Id
        cy.get('input[id="autoProductListById"]').type('25000009').wait(2000).type('{downArrow}').type('{enter}');
        cy.get('input[name="_action_list"]').click()
        cy.get('td').find('a').contains('MD Chocolate-Choco Peanut').click();

        cy.get('h3').contains('Inventory Detail List');
        cy.get('.sbs-label').contains('Type');
        cy.get('.sbs-input-alignment').first().click().wait(2000)
        cy.get('#type').should('contain' ,'Receiving Advice')
            .and('contain', 'Sales')
            .and('contain', 'Refunds')
            .and('contain', 'Cycle Count')
            .and('contain', 'Dispatch Advice')
            .and('contain', 'Returns')
            .and('contain', 'Returns')
            .and('contain', 'Bad Merchandise')
            .and('contain', 'Product Transfer')
            .and('contain', 'Weekly Supplies')
            .and('contain', 'Claim Order')
            .and('contain', 'Audit Count')
            .and('contain', 'Purchase Order')
            .and('contain', 'Purchase Order Return');


        })

        //Validate Inventory Detail List

        // cy.ge((t('.btn').contains('Clear').click();

        // //Search Using Reference Id
        // searchWithOneField('f_referenceId','10 - Grocery');
        // cy.get('td').find('a').contains('10 - Grocery');
        // cy.get('.btn').contains('Clear').click();

        //Search Using Status
        // searchWithOneField('f_status','Published');
        // cy.get('td').find('a').contains('Published');
        // cy.get('.btn').contains('Clear').click();

        // //Search using all field
        // cy.get('[id^=f_documentId]').type('10_1L_20180103');
        // cy.get('[id^=f_status]').type('Published');
        // //Assert search result
        // cy.get('td').find('a').contains('10_1L_20180103');
        // cy.get('td').find('a').contains('Published');

    
})

