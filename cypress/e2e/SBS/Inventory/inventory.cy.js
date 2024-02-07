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

context('INVENTORY', () => {
    beforeEach(() => {
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        // cy.get('[id^=password]').contains('Password');
        const username = '711001';
        const password = '711001';
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
        cy.get('input[id="autoProductListById"]').type('25000009').wait(2000).type('{downArrow}').type('{enter}');
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
        cy.fixture('inventory/inventory/search_inventory_data.json').then((search_inventory_data) => {
        cy.get('input[id="autoProductListById"]').type(search_inventory_data.product_id).wait(2000).type('{downArrow}').type('{enter}');
        cy.get('input[name="_action_list"]').click()
        cy.get('td').find('a').contains(search_inventory_data.productId.product_name).click();

        //Validate Inventory Details
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
        cy.get('.sbs-label').contains('Document Id');
        cy.get('input[id="referenceId"]').should('be.visible');
        cy.get('.sbs-label').contains('Created Date From');
        cy.get('input[id="dateCreatedFrom"]').should('be.visible');
        cy.get('.sbs-label').contains(' Created Date To');
        cy.get('input[id="dateCreatedTo"]');
        cy.get('input[name="_action_list"]').should('be.visible');
        cy.get('a').contains('Clear');
        cy.get('a').contains('Print');
        cy.get('thead').contains('th' , 'Transaction Type')
        cy.get('thead').contains('th' , 'Transaction Date')
        cy.get('thead').contains('th' , 'Date Created')
        cy.get('thead').contains('th' , 'Document ID')
        cy.get('thead').contains('th' , 'Product ID')
        cy.get('thead').contains('th' , 'Product Name')
        cy.get('thead').contains('th' , 'Beginning Inventory')
        cy.get('thead').contains('th' , 'Adjustment')
        cy.get('thead').contains('th' , 'Ending Inventory')
        })

      })

     it('Search Inventory Item', () => { 
        //Click Inventory from the menu list
        navigateToModule('Inventory');
        cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();
    
        //Search Using Document Id
        cy.get('input[id="autoProductListById"]').type('25000085').wait(2000).type('{downArrow}').type('{enter}');
        cy.get('input[name="_action_list"]').click()
        cy.get('td').find('a').contains('MD Bavarian Classic Queen Donut').click();

        cy.get("tbody")
        .find("tr")
        .then((rows) => {
          rows.toArray().forEach((element) => {
            if (element.innerHTML.includes("Sales")) {
            //rows.index(element) will give you the row index
              cy.log(rows.index(element))
            }
          });

          for(let i = 0; i < rows; i ++){
            cy.get('tbody>tr').eq(i).find('tr').eq(0).contains('Sales');
            }
        })
     });



    
})

