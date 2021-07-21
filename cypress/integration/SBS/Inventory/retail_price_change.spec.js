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

context('RETAIL PRICE CHANGE', () => {
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
        navigateToSubModule('Retail Price Change')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Price Change List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
          .and('contain', 'Facility')
          .and('contain', 'Status')
          .and('contain', 'Price Change Date From')
          .and('contain', 'Price Change Date To')

        //Fields
        cy.get('input[id="id"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="priceChangeDateFromSearch"]').should('be.visible')
        cy.get('input[id="priceChangeDateToSearch"]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Price Change')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
          .and('contain', 'Price Change Date') 
          .and('contain', 'Total Price Change')
          .and('contain', 'Status')
        cy.get('thead').find('th').contains('No. of Items')

      })  

  // it('Create New Retail Price Change', function(){
  //   navigateToModule('Inventory')
  //   navigateToSubModule('Retail Price Change')
  //   cy.fixture('inventory/retail_price_change_data/retail_price_change_data').then((price_change_data) =>{

  //       cy.get('.pull-right').find('a').contains('New Price Change').click()
  //       //Validate Create Price Change
  //       cy.get('h3').contains('Create Price Change')
  //       cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
  //         .and('contain', 'Price Change Date')
  //         .and('contain', 'Comments')
  //       cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
  //       cy.get('.button-align-right').find('a').contains('Cancel')

  //       //Create Price Change and Save
  //       cy.get('.controls').find('[name="countDate"]').click();
  //       cy.get('div#ui-datepicker-div').should('be.visible');
  //       cy.get('.ui-datepicker-year').select(price_change_data.pc_year);
  //       cy.get('.ui-datepicker-month').select(price_change_data.pc_month);
  //       cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(price_change_data.pc_day).click();
  //       cy.get('.controls').find('[name="countDate"]').then($priceChangeDate => {
  //         const priceChangeDateValue = $priceChangeDate.val()
  //         cy.log(priceChangeDateValue)
  //         cy.get('.button-align-right').find('input[name="_action_save"]').click();

  //         //Validate Created Price Change
  //         cy.get('.popoutDiv').find('.alert1').contains('Product Transfer created');
  //         cy.get('div.sbsborder').find('span#documentId-label').contains('Document ID:')
  //         cy.get('div.sbsborder').find('span#countDate-label').contains('Price Change Date:')
  //         cy.get('div.sbsborder').find('span#facility-label').contains('Facility:')
  //         cy.get('div.sbsborder').find('span#status-label').contains('Status:')
  //         cy.get('div.sbsborder').find('span#dateCreated-label').contains('Total Price Change:')
  //         cy.get('div.sbsborder').find('span#createdBy-label').contains('Date Created:')
  //         cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Created By:')
  //         cy.get('div.sbsborder').find('span#updatedBy-label').contains('Last Updated:')
  //         cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By:')
  //         cy.get('div.sbsborder').find('span.property-value').contains(price_change_data.facility)
  //         //Buttons
  //         cy.get('.pull-down').find('a').should('contain', 'Print')
  //           .and('contain', 'Cancel')
  //           .and('contain', 'Complete')
  //           .and('contain', 'Edit');
  //         cy.get('.active').find('a').contains('Product List');
  //         //Table
  //         cy.get('#id="priceChangeItemTable"').find('th').should('contain', 'Line No')
  //           .and('contain', 'Product ID')
  //           .and('contain', 'Product Name')
  //           .and('contain', 'Current Price')
  //           .and('contain', 'New Price')
  //           .and('contain', 'Quantity')
  //           .and('contain', 'Price Difference')
  //           .and('contain', 'Total')
  //       })
  //     })
  // })

  it('Search Price Change', function() {
      cy.fixture('inventory/retail_price_change_data/retail_price_change_data').then((price_change_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Price Change');
            
        //Search and Assert Document ID
        cy.get('.controls').find('input[name="f_docId"]').type(price_change_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(price_change_data.document_id)
        
        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search and Assert Status
        cy.get('.controls').find('#f_status').select(price_change_data.search_status)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(4).contains(price_change_data.search_status);
          }
        })
      })
  })
      
})

