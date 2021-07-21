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

context('WEEKLY SUPPLIES', () => {
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

    it('Validation of Weekly Supplies List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Weekly Supplies')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Weekly Supplies List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
          .and('contain', 'Facility')
          .and('contain', 'Status')
          .and('contain', 'WS Slip Date From')
          .and('contain', 'WS Slip Date To')

        //Fields
        cy.get('input[id="wsSlipNo"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateToSearch"]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Weekly Supplies')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
          .and('contain', 'WS Slip Date') 
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status')
        cy.get('thead').find('th').contains('Total No. of Items')
      })  

    it('Create New Weekly Supplies', function () {
      navigateToModule('Inventory')
      navigateToSubModule('Weekly Supplies')
      cy.fixture('inventory/weekly_supplies_data/weekly_supplies_data').then((weekly_supplies_data) =>{

        cy.get('.pull-right').find('a').contains('New Weekly Supplies').click()
        //Validate Create Return page
        cy.get('h3').contains('Create Weekly Supplies')
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'WS Slip Date')
        cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
        cy.get('.button-align-right').find('a').contains('Cancel')

        //Create Return and Save
        cy.get('input#countDate').click()
        cy.get('div#ui-datepicker-div').should('be.visible');
        cy.get('.ui-datepicker-year').select(weekly_supplies_data.ws_year);
        cy.get('.ui-datepicker-month').select(weekly_supplies_data.ws_month);
        cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(weekly_supplies_data.ws_day).click();
        cy.get('.controls').find('#countDate').then($wsDate => {
          const wsDateValue = $wsDate.val()
          cy.log(wsDateValue)
          cy.get('.button-align-right').find('input[name="_action_save"]').click();

          //Validate Created Return
          cy.get('.popoutDiv').find('.alert1').contains('Weekly Supplies created');
          cy.get('div.sbsborder').find('span#documentId-label2').contains('Document ID:')
          cy.get('div.sbsborder').find('span#countDate-label2').contains('WS Slip Date:')
          cy.get('div.sbsborder').find('span#facility-label2').contains('Facility:')
          cy.get('div.sbsborder').find('span.property-value2').contains(weekly_supplies_data.facility)
          cy.get('div.sbsborder').find('span#status-label2').contains('Status:')
          cy.get('div.sbsborder').find('span#totalCost-label').contains('Total Cost:')          
          cy.get('div.sbsborder').find('span#totalRetailPrice-label').contains('Total Retail Price:')
          cy.get('div.sbsborder').find('span#totalRetailPrice-label').contains('Total No Of Items:')
          cy.get('div.sbsborder').find('span#dateCreated-label2').contains('Date Created:')
          cy.get('div.sbsborder').find('span#createdBy-label2').contains('Created By:')
          cy.get('div.sbsborder').find('span#lastUpdated-label2').contains('Last Updated:')
          cy.get('div.sbsborder').find('span#updatedBy-label2').contains('Updated By:')
          //Buttons
          cy.get('.pull-down').find('a').should('contain', 'Print')
            .and('contain', 'Cancel')
            .and('contain', 'Edit');
          cy.get('.active').find('a').contains('Weekly Supplies Item');
          //Table
          cy.get('#cycleCountVarianceTable').find('th').should('contain', 'Line No.')
            .and('contain', 'Product ID')
            .and('contain', 'Product')
            .and('contain', 'Unit Cost')
            .and('contain', 'Unit Retail Price')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail Price')
        })
      })
    })

    it('Edit Return', function() {
      navigateToModule('Inventory');
      navigateToSubModule('Weekly Supplies');
  
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).then($documentId => {
        const documentIdValue = $documentId.text().trim()
        cy.log(documentIdValue)
        cy.get('tbody').find('a').eq(0).contains(documentIdValue).click()    
        cy.get('h3').contains('Show Weekly Supplies')
        cy.get('.pull-down').find('a').contains('Edit').click()
        //Validate Edit Weekly Supplies page
        cy.get('h3').contains('Edit Weekly Supplies')
        cy.get('.sbsdiv2').find('.sbs-label').should('contain', 'Facility')
          .and('contain', 'WS Slip Date')
        cy.get('input[name="_action_update"]').should('be.visible')
        cy.get('#cycleCountVarianceTable').find('th').should('contain', 'Line No.')
          .and('contain', 'Product ID')
          .and('contain', 'Product')
          .and('contain', 'Quantity')
          .and('contain', 'Unit Cost')
          .and('contain', 'Unit Retail Price')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Actions')
        // cy.get('tbody').find('#autoWeeklySuppliesProductList').should('be.visible')
        // cy.get('tbody').find('input.countedQuantity').should('be.visible')
      })
      
      cy.fixture('inventory/weekly_supplies_data/weekly_supplies_data').then((weekly_supplies_data) =>{

        // Add Product
          cy.get('tbody').find('#autoWeeklySuppliesProductList').type(weekly_supplies_data.product).wait(1000).type('{downArrow}').wait(1000).type('{enter}').wait(1000)
          //Log BM Item - to use in assertion
          cy.get('tbody').find('#autoWeeklySuppliesProductList').then($wsItem => {
            const wsItemName = $wsItem.val()
            cy.log(wsItemName)
            cy.get('tbody').find('input#countedQuantity').type(weekly_supplies_data.qty)
            cy.get('tbody').find('input[name="_action_weeklySuppliesItemSave"]').click();
            cy.get('.popoutDiv').find('.alert1').contains('Weekly Supplies created')
            cy.get('input[name="_action_update"]').click();
            
            //Validate Updated Returns
            cy.get('.popoutDiv').find('.alert1').contains('WeeklySupplies updated')
            cy.get('h3').contains('Show Weekly Supplies');
            cy.get('tbody').find('td').contains(wsItemName)

            //Complete Return
            // const approvedMessage = "Successfully updated status of Returns "  + documentIdValue + " to Approved"
            cy.get('.pull-down').find('a').contains('Complete').click()
            cy.get('.popoutDiv').find('.alert1').contains('WeeklySupplies updated')
            cy.get('.sbsdiv3').find('.property-value2').contains('Completed')
          })
      }) 
    })
      
    it('Search Weekly Supplies', function() {
      cy.fixture('inventory/weekly_supplies_data/weekly_supplies_data').then((weekly_supplies_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Weekly Supplies');
            
        //Search and Assert Document ID
        cy.get('.controls').find('#wsSlipNo').type(weekly_supplies_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(weekly_supplies_data.document_id)
        
        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search and Assert Status
        cy.get('.controls').find('#f_status').select(weekly_supplies_data.search_status)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(5).contains(weekly_supplies_data.search_status);
          }
        })
      })
    })   
})

