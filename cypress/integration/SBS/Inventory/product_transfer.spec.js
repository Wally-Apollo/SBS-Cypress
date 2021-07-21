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

context('PRODUCT TRANSFER', () => {
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

    it('Validation of Product Transfer List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Product Transfer')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Product Transfer List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
          .and('contain', 'Facility')
          .and('contain', 'Status')
          .and('contain', 'PT Slip Date From')
          .and('contain', 'PT Slip Date To')

        //Fields
        cy.get('input[id="id"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="productTransferFromSearch"]').should('be.visible')
        cy.get('input[id="productTransferToSearch"]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('input[value="Clear"]').should('be.visible') //Clear Button
        cy.get('.pull-right').contains('New Product Transfer')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
          .and('contain', 'PT Slip Date') 
          .and('contain', 'Status')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
        cy.get('thead').find('th').contains('Total No. of Items')
      })  

    it('Create New Product Transfer', function () {
      navigateToModule('Inventory')
      navigateToSubModule('Product Transfer')
      cy.fixture('inventory/product_transfer_data/product_transfer_data').then((product_transfer_data) =>{

        cy.get('.pull-right').find('a').contains('New Product Transfer').click()
        //Validate Create Product Transfer
        cy.get('h3').contains('Create Product Transfer')
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'PT Slip Date')
        cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
        cy.get('.button-align-right').find('a').contains('Cancel')

        //Create Return and Save
        cy.get('.controls').find('[name="countDate"]').click();
        cy.get('div#ui-datepicker-div').should('be.visible');
        cy.get('.ui-datepicker-year').select(product_transfer_data.pt_year);
        cy.get('.ui-datepicker-month').select(product_transfer_data.pt_month);
        cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(product_transfer_data.pt_day).click();
        cy.get('.controls').find('[name="countDate"]').then($productTransferDate => {
          const productTransferDateValue = $productTransferDate.val()
          cy.log(productTransferDateValue)
          cy.get('.button-align-right').find('input[name="_action_save"]').click();

          //Validate Created Return
          cy.get('.popoutDiv').find('.alert1').contains('Product Transfer created');
          cy.get('div.sbsborder').find('span#documentId-label').contains('Document ID:')
          cy.get('div.sbsborder').find('span#countDate-label').contains('PT Slip Date:')
          cy.get('div.sbsborder').find('span#facility-label').contains('Facility:')
          cy.get('div.sbsborder').find('span#status-label').contains('Status:')
          cy.get('div.sbsborder').find('span#dateCreated-label').contains('Date Created:')
          cy.get('div.sbsborder').find('span#createdBy-label').contains('Created By:')
          cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Last Updated:')
          cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By:')
          cy.get('div.sbsborder').find('span.property-value').contains(product_transfer_data.facility)
          //Buttons
          cy.get('.pull-down').find('a').should('contain', 'Print')
            .and('contain', 'Cancel')
            .and('contain', 'Edit');
          cy.get('.active').find('a').contains('Product List');
          //Table
          cy.get('#productTransferItemTable').find('th').should('contain', 'Line No.')
            .and('contain', 'Product')
            .and('contain', 'Product Name')
            .and('contain', 'Quantity')
            .and('contain', 'Destination')
            .and('contain', 'Unit Cost')
            .and('contain', 'Unit Retail Price')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Price')            

        })
      })
    })

    it('Edit Product Transfer', function() {
      
      navigateToModule('Inventory');
      navigateToSubModule('Product Transfer');
  
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).then($documentId => {
        const documentIdValue = $documentId.text().trim()
        cy.log(documentIdValue)
        cy.get('tbody').find('a').eq(0).contains(documentIdValue).click()    

        cy.get('h3').contains('Show Product Transfer')
        cy.get('.pull-down').find('a').contains('Edit').click()
        //Validate Edit Bad Merchandise page
        cy.get('h3').contains('Edit Product Transfer')
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'PT Slip Date')
        cy.get('input[name="_action_update"]').should('be.visible')
        cy.get('#productTransferItemTable').find('th').should('contain', 'Line No.')
          .and('contain', 'Product')
          .and('contain', 'Product Name')
          .and('contain', 'Quantity')
          .and('contain', 'Destination')
          .and('contain', 'Unit Cost')
          .and('contain', 'Unit Retail Price')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Price')
          .and('contain', 'Actions')
        cy.get('tbody').find('#autoFilteredProduct').should('be.visible')
        cy.get('tbody').find('input[name="variance"]').should('be.visible')
        cy.get('tbody').find('input#autoFilteredProductDest').should('be.visible')
        cy.get('tbody').find('input[name="_action_productTransferItemSave"]').should('be.visible')
      })


        //Add Product
        cy.fixture('/inventory/product_transfer_data/product_transfer_data').then((product_transfer_data) => {
        cy.get('.typeahead-wrapper').find('#autoFilteredProduct').click().wait(3000)
        cy.get('.typeahead-wrapper').find('#autoFilteredProduct').type(product_transfer_data.product)
          .type('{downArrow}').type('{enter}')
          //Log BM Item - to use in assertion
          cy.get('tbody').find('#autoFilteredProduct').then($ptItem => {
            const ptItemName = $ptItem.val()
            cy.log(ptItemName)
            cy.get('tbody').find('input[id="variance"]').type(product_transfer_data.qty)
            cy.get('tbody').find('input[id="autoFilteredProductDest"]').type(product_transfer_data.destination).wait(1000).type('{downArrow}').wait(2000).type('{enter}').wait(1000)
            cy.get('tbody').find('input[name="_action_productTransferItemSave"]').click();
            cy.get('.popoutDiv').find('.alert1').contains('Product Transfer Item created')
            cy.get('input[name="_action_update"]').click();
          
            
            //Validate Updated Returns
            cy.get('.popoutDiv').find('.alert1').contains('Product Transfer updated')
            cy.get('h3').contains('Show Product Transfer');
            cy.get('tbody').find('td').contains(ptItemName)
            // cy.get('.fieldcontain').find('.property-value2').contains(documentIdValue)

            //Complete Product Transfer
            cy.get('.pull-down').find('a').contains('Complete').click()
            cy.get('.popoutDiv').find('.alert1').contains('Successfully updated status of Product Transfer')
            cy.get('.sbsdiv3').find('.property-value').contains('Completed')
          })
        })   
    })

    it('Search Product Transfer', function() {
      cy.fixture('inventory/product_transfer_data/product_transfer_data').then((product_transfer_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Product Transfer');
            
        //Search and Assert Document ID
        cy.get('.controls').find('#id').type(product_transfer_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(product_transfer_data.document_id)
        
        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('input[value="Clear"]').click();

        //Search and Assert Status
        cy.get('.controls').find('#f_status').select(product_transfer_data.search_status)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(5).contains(product_transfer_data.search_status);
          }
        })
      })
    })   
})


