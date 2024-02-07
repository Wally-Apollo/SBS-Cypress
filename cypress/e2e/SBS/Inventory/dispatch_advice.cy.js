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

function generateRandomString(string_length) {
  let text = '';
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  for(let i = 0; i < string_length; i++) 
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  return text;
}


context('DISPATCH ADVICE', () => {
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

    it('Validation of Dispatch Advice List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Dispatch Advice')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Dispatch Advice List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document Id')
          .and('contain', 'Origin')
          .and('contain', 'Destination')
          .and('contain', 'Delivery Date From')
          .and('contain', 'Delivery Date To')
          .and('contain', 'Status')

        //Fields
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('input[id="deliveryDateFrom"]').should('be.visible')
        cy.get('input[id="deliveryDateTo"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="autoDispatchTo"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Dispatch Advice')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
          .and('contain', 'Dispatch Advice Date') 
          .and('contain', 'Origin')
          .and('contain', 'Destination')
          .and('contain', 'Total Number Of Items')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status')

          //Origin
          cy.get('.controls').find('#facility').then($origin => {
            const originValue = $origin.val()
            cy.log(originValue)
                
            cy.get('tbody').find("tr").then((row) =>{
              for(let i = 0; i< row.length; i++){
                  cy.get('tbody>tr').eq(i).find('a').eq(2).contains(originValue);
            }
          })  
        })
      })  
      
      it('Create New Disptach Advice', function () {
        navigateToModule('Inventory')
        navigateToSubModule('Dispatch Advice')
  
          cy.get('.pull-right').find('a').contains('New Dispatch Advice').click()
          //Validate Create Dispatch Advice
          cy.get('h3').contains('Create Dispatch Advice')
          cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Document Id')
            .and('contain', 'Destination')
            .and('contain', 'Origin')
            .and('contain', 'Dispatch Advice Date')
            .and('contain', 'Reference Id')
            .and('contain', 'Carrier Type')
            .and('contain', 'Carrier Description')
          cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
          cy.get('.button-align-right').find('input[name="_action_list"]').should('be.visible')

          const generatedRandomString = generateRandomString(7)

          cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) =>{

          //Create Dispatch and Save
          cy.get('.controls').find('input[name="documentId"]').type(generatedRandomString)
          cy.get('.controls').find('#autoFacilityList').type(dispatch_advice_data.destination).wait(2000).type('{downArrow}').type('{downArrow}').type('{enter}')
          cy.get('.controls').find('[name="deliveryDate"]').click();
          cy.get('div#ui-datepicker-div').should('be.visible');
          cy.get('.ui-datepicker-year').select(dispatch_advice_data.da_year);
          cy.get('.ui-datepicker-month').select(dispatch_advice_data.da_month);
          cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(dispatch_advice_data.da_day).click();
          // Log Date
          cy.get('.controls').find('[name="deliveryDate"]').then($dispatchAdviceDate => {
            const dispatchAdviceDateValue = $dispatchAdviceDate.val()
            cy.log(dispatchAdviceDateValue);

          //Log Document ID
          cy.get('input[name="documentId"]').then($documentId => {
            const documentIDValue = $documentId.val()
            cy.log(documentIDValue)

            cy.get('.button-align-right').find('input[name="_action_save"]').click();
  
            //Validate Created Return
            //Labels
            cy.get('.popoutDiv').find('.alert1').contains('Dispatch Advice created');
            cy.get('div.sbsborder').find('span#documentId-label2').contains('Document Id:')
            cy.get('div.sbsborder').find('span#deliveryDate-label').contains('Dispatch Advice Date:')
            cy.get('div.sbsborder').find('span#referenceId-label').contains('Reference Id:')
            cy.get('div.sbsborder').find('span#to-label').contains('Destination:')
            cy.get('div.sbsborder').find('span#from-label').contains('Origin:')
            cy.get('div.sbsborder').find('span#totalNumberOfItems-label').contains('Total Number Of Items:')
            cy.get('div.sbsborder').find('span#totalCost-label').contains('Total Cost:')
            cy.get('div.sbsborder').find('span#totalRetailPrice-label').contains('Total Retail Price:')
            cy.get('div.sbsborder').find('span#deliveryTo-label').contains('Delivery To:')
            cy.get('div.sbsborder').find('span#deliveryFrom-label').contains('Delivery From:')
            cy.get('div.sbsborder').find('span#carrierType-label').contains('Carrier Type:')
            cy.get('div.sbsborder').find('span#carrierDescription-label').contains('Carrier Description:')
            cy.get('div.sbsborder').find('span#status-label').contains('Status:')
            cy.get('div.sbsborder').find('span#dateCreated-label').contains('Date Created:')
            cy.get('div.sbsborder').find('span#createdBy-label').contains('Created By:')
            cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Last Updated:')
            cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By:')
            //Details
            cy.get('div.sbsborder').find('.property-value2').contains(dispatch_advice_data.facility)
            cy.get('div.sbsborder').find('.property-value2').contains(documentIDValue)
            cy.get('div.sbsborder').find('.property-value2').contains(dispatch_advice_data.destination)
          })
            //Buttons
            cy.get('.pull-down').find('a').should('contain', 'Print')
              .and('contain', 'Cancel')
              .and('contain', 'Edit');
            cy.get('.active').find('a').contains('Dispatch Advice Item');
            //Table
            cy.get('#list-dispatchAdviceItem').find('th').should('contain', 'Line No.')
              .and('contain', 'Product ID')
              .and('contain', 'Product Name')
              .and('contain', 'SSCC')
              .and('contain', 'QOH')
              .and('contain', 'IT')
              .and('contain', 'Dispatched Qty')
              .and('contain', 'Received Qty')
              .and('contain', 'Serial No.')    
              .and('contain', 'Unit Cost')            
              .and('contain', 'Unit Retail Price')  
              .and('contain', 'Total Cost')            
              .and('contain', 'Total Retail Price')                 
          })
        })
      })

    it('Edit Dispatch Advice',  function() {
      navigateToModule('Inventory');
      navigateToSubModule('Dispatch Advice');
  
      cy.get('tbody').find('tr').eq(0).find('td').eq(0).then($documentId => {
        const documentIdValue = $documentId.text().trim()
        cy.log(documentIdValue)
        cy.get('tbody').find('a').eq(0).contains(documentIdValue).click()    

        cy.get('h3').contains('Show Dispatch Advice')
        cy.get('.pull-down').find('a').contains('Edit').click()
        //Validate Edit Dispatch ADvice page
        cy.get('h3').contains('Edit Dispatch Advice') 
        cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Document Id')
          .and('contain', 'Destination')
          .and('contain', 'Origin')
          .and('contain', 'Dispatch Advice Date')
          .and('contain', 'Reference Id')
          .and('contain', 'Carrier Type')
          .and('contain', 'Carrier Description')
          .and('contain', 'Destination')
        cy.get('input[name="_action_update"]').should('be.visible')
        cy.get('input[name="_action_show"]').should('be.visible')
        cy.get('.resizable-container').find('th').should('contain', 'Line No.')
          .and('contain', 'Product ID')
          .and('contain', 'Product Name')
          .and('contain', 'SSCC')
          .and('contain', 'QOH')
          .and('contain', 'IT')
          .and('contain', 'Dispatched Qty')
          .and('contain', 'Received Qty')
          .and('contain', 'Serial No.')
          .and('contain', 'Unit Cost')
          .and('contain', 'Unit Retail Price')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Actions')
        cy.get('tbody').find('#autoProductListDispatchAdvice').should('be.visible')
        cy.get('tbody').find('input[name="sscc"]').should('be.visible')
        cy.get('tbody').find('input#dispatchedQuantity').should('be.visible')
        cy.get('tbody').find('input[name="_action_dispatchAdviceItemSave"]').should('be.visible')
      })

      //Add Product
      cy.fixture('/inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) => {
        cy.get('.typeahead-wrapper').find('#autoProductListDispatchAdvice').click().wait(3000)
        cy.get('.typeahead-wrapper').find('#autoProductListDispatchAdvice').type(dispatch_advice_data.product)
        .wait(2000).type('{downArrow}').type('{enter}')
        cy.get('tbody').find('#sscc').type(dispatch_advice_data.sscc)
        cy.get('tbody').find('#dispatchedQuantity').type(dispatch_advice_data.dispatched_qty)
          //Log BM Item - to use in assertion
        cy.get('tbody').find('#autoProductListDispatchAdvice').then($ptItem => {
          const ptItemName = $ptItem.val()
          cy.log(ptItemName)
          cy.get('tbody').find('input[name="_action_dispatchAdviceItemSave"]').click();
          cy.get('.popoutDiv').find('.alert1').contains('Dispatch Advice Item created')
          cy.get('input[name="_action_update"]').click();
          
          //Validate Updated Dispatch Advice
          cy.get('.popoutDiv').find('.alert1').contains('DispatchAdvice updated')
          cy.get('h3').contains('Show Dispatch Advice');
          cy.get('tbody').find('td').contains(ptItemName)

          //Approve Dispatch Advice
          cy.get('.pull-down').find('a').contains('Approve').click()
          cy.get('.popoutDiv').find('.alert1').contains('Successfully updated status of Dispatch Advice')
          cy.get('.sbsdiv3').find('.property-value2').contains('Approved')
        })
      })
    })

    it('Cancel Dispatch Advice' , function () {
      navigateToModule('Inventory')
      navigateToSubModule('Dispatch Advice')

      cy.get('.pull-right').find('a').contains('New Dispatch Advice').click()
          //Validate Create Dispatch Advice
          cy.get('h3').contains('Create Dispatch Advice')
          cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Document Id')
            .and('contain', 'Destination')
            .and('contain', 'Origin')
            .and('contain', 'Dispatch Advice Date')
            .and('contain', 'Reference Id')
            .and('contain', 'Carrier Type')
            .and('contain', 'Carrier Description')
          cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
          cy.get('.button-align-right').find('input[name="_action_list"]').should('be.visible')

          const generatedRandomString = generateRandomString(7)

       cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) =>{

        //Create Dispatch and Save
        cy.get('.controls').find('input[name="documentId"]').type(generatedRandomString)
        cy.get('.controls').find('#autoFacilityList').type(dispatch_advice_data.destination).wait(2000).type('{downArrow}').type('{downArrow}').type('{enter}')
        cy.get('.controls').find('[name="deliveryDate"]').click();
        cy.get('div#ui-datepicker-div').should('be.visible');
        cy.get('.ui-datepicker-year').select(dispatch_advice_data.da_year);
        cy.get('.ui-datepicker-month').select(dispatch_advice_data.da_month);
        cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(dispatch_advice_data.da_day).click();
        // Log Date
        cy.get('.controls').find('[name="deliveryDate"]').then($dispatchAdviceDate => {
          const dispatchAdviceDateValue = $dispatchAdviceDate.val()
          cy.log(dispatchAdviceDateValue);

          //Log Document ID
          cy.get('input[name="documentId"]').then($documentId => {
            const documentIDValue = $documentId.val()
            cy.log(documentIDValue)

            cy.get('.button-align-right').find('input[name="_action_save"]').click();
  
            //Validate Created Return
            //Labels
            cy.get('.popoutDiv').find('.alert1').contains('Dispatch Advice created');
            cy.get('div.sbsborder').find('span#documentId-label2').contains('Document Id:')
            cy.get('div.sbsborder').find('span#deliveryDate-label').contains('Dispatch Advice Date:')
            cy.get('div.sbsborder').find('span#referenceId-label').contains('Reference Id:')
            cy.get('div.sbsborder').find('span#to-label').contains('Destination:')
            cy.get('div.sbsborder').find('span#from-label').contains('Origin:')
            cy.get('div.sbsborder').find('span#totalNumberOfItems-label').contains('Total Number Of Items:')
            cy.get('div.sbsborder').find('span#totalCost-label').contains('Total Cost:')
            cy.get('div.sbsborder').find('span#totalRetailPrice-label').contains('Total Retail Price:')
            cy.get('div.sbsborder').find('span#deliveryTo-label').contains('Delivery To:')
            cy.get('div.sbsborder').find('span#deliveryFrom-label').contains('Delivery From:')
            cy.get('div.sbsborder').find('span#carrierType-label').contains('Carrier Type:')
            cy.get('div.sbsborder').find('span#carrierDescription-label').contains('Carrier Description:')
            cy.get('div.sbsborder').find('span#status-label').contains('Status:')
            cy.get('div.sbsborder').find('span#dateCreated-label').contains('Date Created:')
            cy.get('div.sbsborder').find('span#createdBy-label').contains('Created By:')
            cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Last Updated:')
            cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By:')
            //Details
            cy.get('div.sbsborder').find('.property-value2').contains(dispatch_advice_data.facility)
            cy.get('div.sbsborder').find('.property-value2').contains(documentIDValue)
            cy.get('div.sbsborder').find('.property-value2').contains(dispatch_advice_data.destination)
          })
            //Buttons
            cy.get('.pull-down').find('a').should('contain', 'Print')
              .and('contain', 'Cancel')
              .and('contain', 'Edit');
            cy.get('.active').find('a').contains('Dispatch Advice Item');

            //Cancel and Validate Dispatch Advice
            cy.get('.pull-down').find('a').contains('Cancel').click();
            cy.get('.popoutDiv').find('.alert1').contains('Successfully updated status of Dispatch Advice')
            cy.get('.sbsdiv3').find('.property-value2').contains('Cancelled')
        })
      })
    })
    
    it('Search Dispatch Advice', function() {
      cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Dispatch Advice');
            
        //Search and Assert Document ID
        cy.get('.controls').find('#documentId').type(dispatch_advice_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(dispatch_advice_data.document_id)
        
        //Clear Search Result
        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        // //Search and Assert Destination
        // cy.get('#autoDispatchTo').type(dispatch_advice_data.destination).type('{downArrow}').type('{downArrow}').type('{enter}')
        // cy.get('input[name="_action_list"]').click()
        // cy.get('tbody').find('tr').eq(0).find('td').eq(3).contains(dispatch_advice_data.document_id)

        // //Clear Search Result
        // cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search and Assert Status
        cy.get('.controls').find('#f_status').select(dispatch_advice_data.search_status)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(7).contains(dispatch_advice_data.search_status);
          }
        })
      })
    })  

    it('Serch Dispatch Advice Item', function(){

      navigateToModule('Inventory')
      navigateToSubModule('Dispatch Advice')

      cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) => {

        //Search and Assert Document ID
        cy.get('.controls').find('#documentId').type(dispatch_advice_data.document_id)
        cy.get('input[name="_action_list"]').click()
        cy.get('tbody').find('tr').eq(0).find('td').eq(0).contains(dispatch_advice_data.document_id).click();

        // Search Product Name
        cy.get('input[name="dispatchAdviceItemSearchCriteria"]').type(dispatch_advice_data.product)
        cy.get('.icon-search').click()
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('td').eq(2).contains(dispatch_advice_data.product);
          
        
        // Search Product Name
        cy.get('input[name="dispatchAdviceItemSearchCriteria"]').type(dispatch_advice_data.product_id)
        cy.get('.icon-search').click()
              cy.get('tbody>tr').eq(i).find('td').eq(1).contains(dispatch_advice_data.product_id);
          }
        })
      })
    })

})

