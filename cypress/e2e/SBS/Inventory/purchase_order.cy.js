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

context('PURCHASE ORDER', () => {
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

    it('Validation of Price Change List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Purchase Order')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Purchase Order List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
          .and('contain', 'Order Date From:')
          .and('contain', 'Order Date To:')
          .and('contain', 'Facility')
          .and('contain', 'Supplier:')
          .and('contain', 'Status:')

        //Fields
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('input[id="orderDateFromSearch"]').should('be.visible')
        cy.get('input[id="orderDateToSearch"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="autoSeller"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Purchase Order')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
          .and('contain', 'Order Date') 
          .and('contain', 'Supplier')
          .and('contain', 'Delivery Date')
          .and('contain', 'Total Number of Items')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status')
    }) 
      
    it('Create Purchase Order', function() {
      navigateToModule('Inventory');
      navigateToSubModule('Purchase Order')

        cy.fixture('/inventory/purchase_order_data/purchase_order_data').then((purchase_order_data) => {
          cy.get('.pull-right').find('a').contains('New Purchase Order').click().wait(2000)  
          cy.get('#autoSeller').type(purchase_order_data.supplier).wait(1000).type('{downArrow}').type('{enter}')
          //Populate Order Date field
          cy.fixture('/inventory/purchase_order_data/purchase_order_data').then((purchase_order_data) => {
            cy.get('input#orderDate').click();
            cy.get('div#ui-datepicker-div').should('be.visible');
            cy.get('.ui-datepicker-year').select(purchase_order_data.po_year);
            cy.get('.ui-datepicker-month').select(purchase_order_data.po_month);
            cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(purchase_order_data.po_day).click();
              cy.get('.controls').find('#orderDate').then($orderDate => {
                const orderDateValue = $orderDate.val()
                cy.log(orderDateValue)
              
              //Click Save button
              cy.get('.button-align-right').find('input[name="_action_save"]').click();
              cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
                const documentIdValue = $documentId.text()
                cy.log(documentIdValue)

                //Validate Created Purchase Order
                cy.get('h3').contains('Show Purchase Order')
                cy.get('.popoutDiv').find('span[class="message alert1"]').contains('Purchase Order created')
                //Document Id
                cy.get('.sbsdiv3').find('#documentId-label2').should('contain', 'Document ID:')
                cy.get('.sbsdiv3').find('.property-value2').should('contain', documentIdValue)
                //Reference ID:
                cy.get('.sbsdiv3').find('#referenceId-label').should('be.visible')
                //Order date
                cy.get('.sbsdiv3').find('#orderDate-label').should('contain', 'Order Date:')
                cy.get('.sbsdiv3').find('.property-value2').should('contain', orderDateValue)
                //Delivery Date
                cy.get('.sbsdiv3').find('#deliveryDate-label').should('contain', 'Delivery Date:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Delivery Date
                cy.get('.sbsdiv3').find('#cancelIfNotDeliveredBy-label').should('contain', 'Cancel If Not Delivered By:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Facility
                cy.get('.sbsdiv3').find('#buyer-label').should('contain', 'Facility:')
                cy.get('.sbsdiv3').find('.property-value2').should('contain', purchase_order_data.facility)
                //Supplier
                cy.get('.sbsdiv3').find('#seller-label').should('contain', 'Supplier:')
                cy.get('.sbsdiv3').find('.property-value2').should('contain', purchase_order_data.supplier)
                //Total Cost
                cy.get('.sbsdiv3').find('#totalCost-label').should('contain', 'Total Cost:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Total Retail Price
                cy.get('.sbsdiv3').find('#totalRetailPrice-label').should('contain', 'Total Retail Price:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Total Number of Items
                cy.get('.sbsdiv3').find('#totalNumberOfItems-label').should('contain', 'Total Number of Items:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Status
                cy.get('.sbsdiv3').find('#status-label').should('contain', 'Status:')
                cy.get('.sbsdiv3').find('.property-value2').should('contain', purchase_order_data.new_status)
                //Delivery To
                cy.get('.sbsdiv3').find('#deliveryTo-label').should('contain', 'Delivery To:')
                //Delivery From
                cy.get('.sbsdiv3').find('#deliveryFrom-label').should('contain', 'Delivery From:')
                //Date Created
                cy.get('.sbsdiv3').find('#dateCreated-label').should('contain', 'Date Created:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Created Byw
                cy.get('.sbsdiv3').find('#createdBy-label').should('contain', 'Created By:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Last Updated
                cy.get('.sbsdiv3').find('#lastUpdated-label').should('contain', 'Last Updated:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')
                //Updated By 
                cy.get('.sbsdiv3').find('#updatedBy-label').should('contain', 'Updated By:')
                cy.get('.sbsdiv3').find('.property-value2').should('be.visible')

                //Buttons
                cy.get('.pull-down').find('a').should('contain', 'Print')
                  .and('contain', 'Cancel')
                  .and('contain', 'Edit')
                cy.get('.pull-right').find('a').contains('<< Back to Purchase Order List')

                //Tabs
                cy.get('.nav-tabs').find('a').should('contain', 'Purchase Order Item')
                  .and('contain', 'Receiving Advice')

                //Table
                cy.get('table[class="table table-bordered font-small"]').find('th').should('contain', 'Line No.')
                  .and('contain', 'Product ID')
                  .and('contain', 'Product Name')
                  .and('contain', 'QOH')
                  .and('contain', 'IT')
                  .and('contain', 'Order Qty')
                  .and('contain', 'Sales 1')
                  .and('contain', 'Sales 2')
                  .and('contain', 'Sales 3')
                  .and('contain', 'Sales 4')
                  .and('contain', 'Sales 5')
                  .and('contain', 'Sales 6')
                  .and('contain', 'Sales 7')
                  .and('contain', 'Unit Cost')
                  .and('contain', 'Unit Price')
                  .and('contain', 'Total')
                  .and('contain', 'Total Price')                
              })
            })
          })
        })
    })
    it('Search Order', function() {
      navigateToModule('Inventory')
      navigateToSubModule('Purchase Order')
      cy.fixture('inventory/purchase_order_data/purchase_order_data').then((purchase_order_data) => {
        //Search Document ID
        cy.get('#documentId').type(purchase_order_data.document_id)
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click()
        cy.get('tbody').find('a').contains(purchase_order_data.document_id)
        //Search Status
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click()
        cy.get('#f_status').select(purchase_order_data.new_status)
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(7).contains(purchase_order_data.new_status);
          }
         })
      })
    })

    it('Print Purchase Order', function() { 
      navigateToModule('Inventory')
      navigateToSubModule('Purchase Order')
      cy.fixture('inventory/purchase_order_data/purchase_order_data').then((purchase_order_data) => {
        //Search Document ID
        cy.get('#documentId').type(purchase_order_data.document_id)
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click()
        cy.get('tbody').find('a').contains(purchase_order_data.document_id).click()        
        cy.get('.pull-down').find('a').contains('Print').click();
        // cy.on('window:before:load', (win) => {
        //   // just log the win.location.href for convenience
        //   console.log('WINDOW BEFORE LOAD', win.location.href)
      
        //   // if we're trying to load the page we want to stop, win.stop()
        //   if (win.location.href === 'http://192.168.64.3:8080/RetailPlusStoreBackend/purchaseOrder/show/1728346623937369406') {
        //     win.stop()
        // cy.readFile('cypress/downloads/purchaseOrder.pdf')

    //   }
    // })

      })
    })
})

