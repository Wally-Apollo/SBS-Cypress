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
 

context('BAD MERCHANDISE', () => {
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

  it('Validation of Bad Merchandise List page', () => {
      //Click Inventory file from the menu
      navigateToModule('Inventory');
      //Click Order from the submenu
      navigateToSubModule('Bad Merchandise')

      //Validate that there will be no Error message displayed
      cy.get('h3').contains('Bad Merchandise List');
      
      //Labels
      cy.get('.sbs-label').should('contain', 'Document ID')
        .and('contain', 'Facility')
        .and('contain', 'Status')
        .and('contain', 'BM Date From')
        .and('contain', 'BM Date To')

      //Fields
      cy.get('input[id="documentId"]').should('be.visible')
      cy.get('input[id="facility"]').should('be.visible')
      cy.get('[id^=f_status]').should('be.visible')
      cy.get('input[id="countDateFromSearch"]').should('be.visible')
      cy.get('input[id="countDateToSearch"]').should('be.visible')


      //Buttons
      cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
      cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
      cy.get('.pull-right').contains('New Bad Merchandise')

      //Table
      cy.get('.sortable').find('a').should('contain', 'Document ID')
        .and('contain', 'BM Date') 
  })  

  it('Create New Bad Merchandise', ()=> {
    navigateToModule('Inventory');
    navigateToSubModule('Bad Merchandise')
    cy.get('h3').contains('Bad Merchandise List');

    cy.get('.pull-right').find('a').contains('New Bad Merchandise').click();
    //Validate New Bad Merchandise page
    cy.get('h3').contains('Create Bad Merchandise')
    cy.get('.sbsborder').find('.sbs-label').should('contain', 'BM Date')
      .and('contain', 'Facility')
      .and('contain', 'Reference ID');
      
    cy.fixture('/inventory/bad_merchandise_data/bad_merchandise_data').then((bad_merchandise_data) => {
      cy.get('input#countDate').click();
      cy.get('div#ui-datepicker-div').should('be.visible');
      cy.get('.ui-datepicker-year').select(bad_merchandise_data.bm_year);
      cy.get('.ui-datepicker-month').select(bad_merchandise_data.bm_month);
      cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(bad_merchandise_data.bm_day).click();
      cy.get('.controls').find('#countDate').then($countDate => {
        const countDateValue = $countDate.val()
        cy.log(countDateValue)

        //Click Save button
        cy.get('.button-align-right').find('input[name="_action_save"]').click();
        cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
          const documentIdValue = $documentId.text()
          cy.log(documentIdValue)
          
          //Validate successful Creation of Order
          cy.get('h3').contains('Show Bad Merchandise')
          cy.get('.popoutDiv').find('span[class="message alert1"]').contains('Bad Merchandise created')
          //Document Id
          cy.get('.sbsdiv2').find('#documentId-label').contains('Document ID')
          cy.get('.sbsdiv2').find('.property-value2').contains(documentIdValue)
          //Facility
          cy.get('.sbsdiv2').find('#status-label').contains('Facility')
          cy.get('.sbsdiv2').find('.property-value2').contains(bad_merchandise_data.facility)
          //Reference ID:
          cy.get('.sbsdiv2').find('#status-label').should('be.visible')         
          //BM date
          cy.get('.sbsdiv2').find('#countDate-label').contains('BM Date')
          cy.get('.sbsdiv2').find('.property-value2').contains(countDateValue)
          //Status
          cy.get('.sbsdiv2').find('.property-label2').contains('Status')
          cy.get('.sbsdiv2').find('.property-value2').contains(bad_merchandise_data.new_status)
          //Total Number of Items
          cy.get('.sbsdiv2').find('#numItems-label').contains('Total Number of Items')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Total Cost
          cy.get('.sbsdiv2').find('#totalCost-label').contains('Total Cost')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Total Retail Price
          cy.get('.sbsdiv2').find('#totalRetailPrice-label').contains('Total Retail Price')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Created By
          cy.get('.sbsdiv2').find('#createdBy-label').contains('Created By')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Date Created
          cy.get('.sbsdiv2').find('#dateCreated-label').contains('Date Created')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Updated By
          cy.get('.sbsdiv2').find('#updatedBy-label').contains('Updated By')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')
          //Last Updated
          cy.get('.sbsdiv2').find('#lastUpdated-label').contains('Last Updated')
          cy.get('.sbsdiv2').find('.property-value2').should('be.visible')         

          //Buttons
          cy.get('.pull-down').find('a').should('contain', 'Print')
            .and('contain', 'Cancel')
            .and('contain', 'Edit')
          cy.get('.pull-right').find('a').contains('<< Back to Bad Merchandise List')

          //Tabs
          cy.get('.nav-tabs').find('a').should('contain', 'BM Items')

          //Table
          cy.get('table[class="table table-bordered font-small"]').find('th').should('contain', 'Line No.')
            .and('contain', 'Product ID')
            .and('contain', 'Product')
            .and('contain', 'Quantity')
            .and('contain', 'Unit Cost')
            .and('contain', 'Unit Retail Price')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail Price')           
        })
      })
    })    
  })   

  it('Edit Bad Merchandise', function (){
    navigateToModule('Inventory');
    navigateToSubModule('Bad Merchandise');

      cy.get('tbody').find('tr').eq(0).find('td').eq(0).then($documentId => {
        const documentIdValue = $documentId.text()
        cy.log(documentIdValue)
        cy.get('tbody').find('a').eq(0).should('have.text', documentIdValue).click()    
        
      })

        cy.get('h3').contains('Show Bad Merchandise')
        cy.get('.pull-down').find('a').contains('Edit').click()
        //Validate Edit Bad Merchandise page
        cy.get('h3').contains('Edit Bad Merchandise')
        cy.get('.sbsborder').find('.sbs-label').contains('BM Date')
        cy.get('.sbsborder').find('.sbs-label').contains('Facility')
        cy.get('.sbsborder').find('.sbs-label').contains('Reference ID')
        cy.get('input[name="_action_update"]').should('be.visible')
        cy.get('input[name="_action_show"]').should('be.visible')
        cy.get('#cycleCountVarianceTable').find('th').should('contain', 'Line No.')
          .and('contain', 'Product ID')
          .and('contain', 'Product')
          .and('contain', 'Quantity')
          .and('contain', 'Unit Cost')
          .and('contain', 'Unit Retail Price')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Actions')
        cy.get('.typeahead-wrapper').find('#autoBMProductList').should('be.visible')
        cy.get('tbody').find('input[name="_action_badMerchandiseItemSave"]').should('be.visible')

        //Add Product
        cy.fixture('/inventory/bad_merchandise_data/bad_merchandise_data').then((bad_merchandise_data) => {
          cy.get('.typeahead-wrapper').find('#autoBMProductList').type(bad_merchandise_data.product).type('{downArrow}').type('{enter}').wait(1000)
          //Log BM Item - to use in assertion
          cy.get('.typeahead-wrapper').find('#autoBMProductList').then($bmItem => {
            const bmItemName = $bmItem.val()
            cy.log(bmItemName)
            cy.get('tbody').find('#countedQuantity').type(bad_merchandise_data.qty)
            cy.get('tbody').find('input[name="_action_badMerchandiseItemSave"]').click();
            cy.get('.popoutDiv').find('.alert1').contains('BM Item created')
            cy.get('input[name="_action_update"]').click();
            
            //Validate Updated bad Merchandise
            cy.get('.popoutDiv').find('.alert1').contains('Bad Merchandise updated')
            cy.get('h3').contains('Show Bad Merchandise');
            cy.get('tbody').find('td').contains(bmItemName)

            //Complete Bad Merchandise
            cy.get('.pull-down').find('a').contains('Complete').click()
            cy.get('.popoutDiv').find('.alert1').should('contain', 'Successfully updated status of Bad Merchandise')
            cy.get('.sbsdiv2').find('.property-value2').contains('Completed')

          }) 
        })     
  })

  it('Search Bad Merchandise' , function(){
    cy.fixture('inventory/bad_merchandise_data/bad_merchandise_data').then((bad_merchandise_data) => {
    
      navigateToModule('Inventory')
      navigateToSubModule('Bad Merchandise')

      //Search and Assert Document ID
      cy.get('.controls').find('#documentId').type(bad_merchandise_data.document_id)
      cy.get('input[name="_action_list"]').click()
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(bad_merchandise_data.document_id)

      //Clear Search Result
      cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

      //Search and Assert Status
      cy.get('.controls').find('#f_status').select(bad_merchandise_data.search_status)
      cy.get('input[name="_action_list"]').click()
      cy.get('tbody').find("tr").then((row) =>{
        for(let i = 0; i< row.length; i++){
            cy.get('tbody>tr').eq(i).find('a').eq(2).contains(bad_merchandise_data.search_status);
        }
      })
    })  
  })

  it('Search Bad Merchandise Item', function () {

    navigateToModule('Inventory')
    navigateToSubModule('Bad Merchandise')

    cy.fixture('inventory/bad_merchandise_data/bad_merchandise_data').then((bad_merchandise_data) => {

      //Search Bad Merchandise
      cy.get('.controls').find('#documentId').type(bad_merchandise_data.document_id)
      cy.get('input[name="_action_list"]').click()
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(bad_merchandise_data.document_id).click()

      //Search bad Merchandise Product
      //Search via Product ID
      cy.get('span[class="pull-right form-inline"]').find('input[name="cycleCountVarianceSearchCriteria"]')
        .type(bad_merchandise_data.bm_product_id)
      cy.get('button[class="search btn"]').find('.icon-search').click()
      cy.get('tbody').find('tr').eq(0).find('td').eq(1).contains(bad_merchandise_data.bm_product_id)

      //Search via Product Name
      cy.get('span[class="pull-right form-inline"]').find('input[name="cycleCountVarianceSearchCriteria"]')
      .type(bad_merchandise_data.bm_product_name)
      cy.get('button[class="search btn"]').find('.icon-search').click()
      cy.get('tbody').find('tr').eq(0).find('td').eq(2).contains(bad_merchandise_data.bm_product_name)
    })
  })

})

