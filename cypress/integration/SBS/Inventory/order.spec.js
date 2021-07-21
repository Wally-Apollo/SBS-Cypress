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


context('ORDER', () => {
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

    it('Validation of Order List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Order')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Replenishment Order');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Document ID')
          .and('contain', 'Status');
        cy.get('.sbs-label-replenishment').should('contain', 'Replenishment Order Date From')
          .and('contain', 'Replenishment Order Date From');
        
        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="fromDateSearch"]').should('be.visible')
        cy.get('input[id="thruDateSearch"]').should('be.visible');

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.btn').should('contain', 'New Replenishment Order');

        //Table
        cy.get('thead').find('.sortable').should('contain', 'Document ID')
          .and('contain', 'Date Created')
          .and('contain', 'Order Date')
          .and('contain', 'Number of Item Ordered')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail')
          .and('contain', 'Status');
      })

    it('Create New Order, Search Order and Edit Order', ()=> {

      cy.fixture('inventory/order_data/order_data').then((order_data) => {
        //Go to Inventory > Order
        navigateToModule('Inventory')
        navigateToSubModule('Order')

        //Go to Create Order page
        cy.get('.pull-right').contains('New Replenishment Order').click();
        
        //Validate Create Order page - Header
        cy.get('h3').contains('Create Order')
        //Validate Create Order page - Label
        cy.get('.sbsborder').find('.sbs-label').should('contain', 'Facility:')
          .and('contain', 'Order Date:');
        //Validate Create Order page - Buttons
        cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible') //Search button
        cy.get('.button-align-right').find('a').should('contain', 'Cancel') //Cancel Button

        //Click Save button
        cy.get('.button-align-right').find('input[name="_action_save"]').click();

        //Validate Created Order
        cy.get('.popoutDiv').find('.alert1').should('contain', 'Order created') //Pop up Successful Message
        //Labels
        cy.get('.sbsdiv3').find('.property-label2').should('contain','Document ID:')
          .and('contain', 'Facility:')
          .and('contain', 'Status')
          .and('contain', 'Order Date:')
          .and('contain', 'Delivery Date:')
          .and('contain', 'Cancel If Not Delivered By:')
          .and('contain', 'Date Created:')
          .and('contain', 'Last Updated:')
          .and('contain', 'Created By:')
          .and('contain', 'Updated By:');
        //Status
        cy.get('.fieldcontain').find('.property-value').contains(order_data.new_status)
        
        //Log Generated Document ID
        cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
          const documentIdValue = $documentId.text()
          cy.log(documentIdValue)
      

        //Validate Buttons
        cy.get('.pull-down').find('a').should('contain', 'Print')
          .and('contain', 'Cancel')
          .and('contain', 'Edit')

        //Tabs
        cy.get('.nav-tabs').find('a').should('contain', 'Order Item')
          .and('contain', 'Purchase Order');

        //Table
        cy.get('.table-condensed').find('.roTdPadding').should('contain', 'Select Category:')
          .and('contain', 'No. of Items Ordered:')
          .and('contain', 'Total Cost:')
          .and('contain', 'Total Retail:')

        // cy.get('thead').find('th').invoke(text).then((text) => {
        cy.get('thead').find('th').should('contain', 'Line', 'No.')
          .and('contain', 'Supplier', 'ID')
          .and('contain', 'Product', 'ID')
          .and('contain', 'Product', 'Name')
          .and('contain', 'OH')
          .and('contain', 'IT')
          .and('contain', 'SOQ')
          .and('contain', 'MOQ')
          .and('contain', 'Actual')
          .and('contain', 'Final')
          .and('contain', 'Sales 1')
          .and('contain', 'Sales 2')
          .and('contain', 'Sales 3')
          .and('contain', 'Sales 4')
          .and('contain', 'Sales 5')
          .and('contain', 'Sales 6')
          .and('contain', 'Sales 7')
          .and('contain', 'Unit', 'Cost')
          .and('contain', 'Unit', 'Retail');
        
        // Search Field
        cy.get('fieldset').find('input[name="replenishmentOrderItemSearchCriteria"]').should('be.visible')
        cy.get('button').find('.icon-search').should('be.visible')

        // TEST CASE - SEARCH ORDER
        cy.get('.pull-right').find('a').contains('<< Back to Order List').click();
        cy.get('.controls').find('#documentId').type(documentIdValue);
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click();

        //Validate Search Result
        cy.get('.even').find('a').should('contain', documentIdValue)
        cy.get('.even').find('a').should('contain', order_data.new_status);

        // Select Order
        cy.get('.even').find('a').contains(documentIdValue).click()
        //TEST CASE- EDIT ORDER
        cy.get('.pull-down').find('a').contains('Edit').click();

        //Validate Edit Order page
        cy.get('#show').find('h3').contains('Edit Order')
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility:')
          .and('contain', 'Order Date:')
        cy.get('div').find('input[name="_action_suggest"]').should('be.visible')
        cy.get('div').find('input[name="_action_update"]').should('be.visible')
        cy.get('div').find('a').contains('Cancel');

        //Update and Save
        cy.get('tbody').find('#quantityOrdered1').clear().type(order_data.actual_qty)
        cy.get('div').find('input[name="_action_update"]').click();
        cy.get('.popoutDiv').find('.alert1').should('contain', 'Order updated') //Pop up Successful Message
        cy.get('.fieldcontain').find('.property-value').contains(order_data.new_status)
        cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
          const documentIdValue = $documentId.text()
          cy.log(documentIdValue)

        //Complete the Order
        cy.get('.pull-down').find('a').contains('Complete').click();
        cy.get('.popoutDiv').find('.alert1').should('contain', 'Order updated') //Pop up Successful Message
        cy.get('.fieldcontain').find('.property-value').contains(order_data.complete_status)
        cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
          const documentIdValue = $documentId.text()
          cy.log(documentIdValue)
        
        })
        })
        })
        })
        })
        
})

