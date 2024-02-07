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

context('RETURNS', () => {
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

    it('Validation of Returns List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Returns')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Returns List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Document ID')
          .and('contain', 'Supplier')
          .and('contain', 'Return Date From')
          .and('contain', 'Return Date To')
          .and('contain', 'Status')

        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="apoId"]').should('be.visible')
        cy.get('input[id="autoSupplier"]').should('be.visible')
        cy.get('input[id="returnDateFromSearch"]').should('be.visible')
        cy.get('input[id="returnDateToSearch"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Returns')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
          .and('contain', 'Return Date')
          .and('contain', 'Supplier')
          .and('contain', 'Total No. of Items')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status');
      })  

    it('Create New Return', function () {
      navigateToModule('Inventory')
      navigateToSubModule('Returns')
      cy.fixture('inventory/returns_data/returns_data').then((return_data) =>{

        cy.get('.pull-right').find('a').contains('New Returns').click()
        //Validate Create Return page
        cy.get('h3').contains('Create Return')
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Supplier')
          .and('contain', 'Return Date')
        cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
        cy.get('.button-align-right').find('a').contains('Cancel')

        //Create Return and Save
        cy.get('.controls').find('#autoSupplier').type(return_data.supplier).type('{downArrow}').wait(1000).type('{enter}')
        cy.get('input#returnDate').click()
        cy.get('div#ui-datepicker-div').should('be.visible');
        cy.get('.ui-datepicker-year').select(return_data.returns_year);
        cy.get('.ui-datepicker-month').select(return_data.returns_month);
        cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(return_data.returns_day).click();
        cy.get('.controls').find('#returnDate').then($returnsDate => {
          const returnsDateValue = $returnsDate.val()
          cy.log(returnsDateValue)
          cy.get('.button-align-right').find('input[name="_action_save"]').click();

          //Validate Created Return
          cy.get('.popoutDiv').find('.alert1').contains('Returns created');
          cy.get('div.sbsborder').find('span#apoId-label').contains('Document Id')
          cy.get('div.sbsborder').find('span#facility-label').contains('Facility')
          cy.get('div.sbsborder').find('span.property-value2').contains(return_data.facility)
          cy.get('div.sbsborder').find('span#supplier-label').contains('Supplier')
          cy.get('div.sbsborder').find('span.property-value2').contains(return_data.supplier)
          cy.get('div.sbsborder').find('span#returnDate-label').contains('Return Date')
          cy.get('div.sbsborder').find('span#status-label').contains('Status')
          cy.get('div.sbsborder').find('span#createdBy-label').contains('Created By')
          cy.get('div.sbsborder').find('span#dateCreated-label').contains('Date Created')
          cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By')
          cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Last Updated')
          //Buttons
          cy.get('.pull-down').find('a').should('contain', 'Print')
            .and('contain', 'Cancel')
            .and('contain', 'Approve')
            .and('contain', 'Edit');
          cy.get('.active').find('a').contains('Return Item');
          //Table
          cy.get('#returnItemTable').find('th').should('contain', 'Line No')
            .and('contain', 'Product Id')
            .and('contain', 'Product Name')
            .and('contain', 'Serial No.')
            .and('contain', 'Return Qty')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail Price')
        })
      })
    })

    it('Edit Return', function() {
      
      navigateToModule('Inventory');
      navigateToSubModule('Returns');
  
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).then($documentId => {
        const documentIdValue = $documentId.text().trim()
        cy.log(documentIdValue)
        cy.get('tbody').find('a').eq(0).contains(documentIdValue).click()    

        cy.get('h3').contains('Show Return')
        cy.get('.pull-down').find('a').contains('Edit').click()
        //Validate Edit Bad Merchandise page
        cy.get('h3').contains('Edit Return')
        cy.get('.form-box').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Supplier')
          .and('contain', 'Return Date')
        cy.get('input[name="_action_update"]').should('be.visible')
        cy.get('#returnItemTable').find('th').should('contain', 'Line No')
          .and('contain', 'Product Id')
          .and('contain', 'Product Name')
          .and('contain', 'Serial No.')
          .and('contain', 'Return Qty')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Actions')
        cy.get('tbody').find('#autoFilteredProduct').should('be.visible')
        cy.get('tbody').find('input[name="returnQuantity"]').should('be.visible')

        //Add Product
        cy.fixture('/inventory/returns_data/returns_data').then((returns_data) => {
          cy.get('tbody').find('#autoFilteredProduct').type(returns_data.product).wait(1000).type('{downArrow}').wait(1000).type('{enter}').wait(1000)
          //Log BM Item - to use in assertion
          cy.get('tbody').find('#autoFilteredProduct').then($returnsItem => {
            const returnsItemName = $returnsItem.val()
            cy.log(returnsItemName)
            cy.get('tbody').find('input[name="returnQuantity"]').type(returns_data.qty)
            cy.get('tbody').find('input[name="_action_returnItemSave"]').click();
            cy.get('.popoutDiv').find('.alert1').contains('Return Item created')
            cy.get('input[name="_action_update"]').click();
            
            //Validate Updated Returns
            cy.get('.popoutDiv').find('.alert1').contains('Returns updated')
            cy.get('h3').contains('Show Return');
            cy.get('tbody').find('td').contains(returnsItemName)
            // cy.get('.fieldcontain').find('.property-value2').contains(documentIdValue)

            //Approve Return
            const approvedMessage = "Successfully updated status of Returns "  + documentIdValue + " to Approved"
            cy.get('.pull-down').find('a').contains('Approve').click()
            cy.get('.popoutDiv').find('.alert1').should('contain', approvedMessage)
            cy.get('.sbsdiv2').find('.property-value2').contains('Approved')
          })
        }) 
      })  
    })

    it('Search Return', function() {
      cy.fixture('inventory/returns_data/returns_data').then((returns_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Returns');
            
        //Search and Assert Document ID
        cy.get('.controls').find('#apoId').type(returns_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(returns_data.document_id)
        
        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search and Assert Supplier
        cy.get('.controls').find('#autoSupplier').type(returns_data.supplier).wait(1000).type('{downArrow').type('{enter}')
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(2).contains(returns_data.supplier); 
          }
        })

        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search and Assert Status
        cy.get('.controls').find('#f_status').select(returns_data.search_status)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(6).contains(returns_data.search_status);
          }
        })
      })
    })   
    
    it('Search Return Item', function(){
      navigateToModule('Inventory')
     navigateToSubModule('Returns')

      cy.fixture('inventory/returns_data/returns_data').then((returns_data) => {

        //Search Bad Merchandise
        cy.get('.controls').find('#apoId').type(returns_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(returns_data.document_id).click()

        //Search via Product Name
        cy.get('span[class="pull-right form-inline"]').find('input[name="returnItemSearchCriteria"]')
        .type(returns_data.returns_product_name)
        cy.get('button[class="search btn"]').find('.icon-search').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(2).contains(returns_data.returns_product_name)
      })
    })
})

