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

function createPurchaseOrder(fieldId,value){
  const field = `[id^=${fieldId}]`;
  cy.get(field).type(value).type('{downArrow}').type('{enter}');
  cy.get('input[name="_action_save"]').contains('Search').click();
}

function computeTotals(number1,number2)
{
  var total = number1 * number2
  cy.log(total)
}

function generateRandomString(string_length) {
  let text = '';
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  for(let i = 0; i < string_length; i++) 
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  return text;
}

context('RECEIVING ADVICE', () => {
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

    it('Validation of Receiving Advice List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Receiving Advice')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Receiving Advice List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document No')
          .and('contain', 'Facility')
          .and('contain', 'Received From')
          .and('contain', 'Received Date From')
          .and('contain', 'Received Date To')
          .and('contain', 'Status')
        cy.get('.pull-right').contains('Receiving Advice for:')


        //Fields
        cy.get('input[id="referenceId"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="autoReceivedFrom"]').should('be.visible')
        cy.get('input[id="receiveDateFromSearch"]').should('be.visible')
        cy.get('input[id="receiveDateToSearch"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button

        //Table
        cy.get('thead').find('.sortable').should('contain', 'Document ID')
          .and('contain', 'Document No')
          .and('contain', 'Date Received')
          .and('contain', 'From')
          .and('contain', 'To')
          .and('contain', 'Total No. of Items')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status');
      })  
      
      it('Receiving Advice - Create Purchase Order', () => {
        navigateToModule('Inventory');
        navigateToSubModule('Purchase Order')

        //Create Purchase Order
        cy.fixture('/inventory/purchase_order_data/purchase_order_data').then((purchase_order_data) => {
          cy.get('div[class="pull-right nav nav-buttons"]').find('a').contains('New Purchase Order').click().wait(2000)  
          cy.get('#autoSeller').type(purchase_order_data.supplier).wait(1000).type('{downArrow}').type('{enter}')
          cy.get('input#orderDate').click();
          cy.get('div#ui-datepicker-div').should('be.visible');
          cy.get('.ui-datepicker-year').select(purchase_order_data.po_year);
          cy.get('.ui-datepicker-month').select(purchase_order_data.po_month);
          cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(purchase_order_data.po_day).click();
          
          //Click Save button
          cy.get('.button-align-right').find('input[name="_action_save"]').click();
          cy.get('.fieldcontain').find('span[aria-labelledby="documentId-label"]').then($documentId => {
            const documentIdValue = $documentId.text()
            cy.log(documentIdValue)
          
            //Edit Purchase Order
            cy.get('.pull-down').contains('Edit').click()
            cy.get('h3').contains('Edit Purchase Order')
            cy.get('tbody').find('#autoFilteredProduct').type(purchase_order_data.product)
              .wait(1000).type('{downArrow}').type('{enter}')
            cy.get('tbody').find('#orderQuantity').type(purchase_order_data .order_qty)
            cy.get('tbody>tr').find('input[name="_action_purchaseOrderItemSave"]').click().wait(2000)
            cy.get('div[class="pull-right bottom-buttons"]').find('input[name="_action_update"]').click()
            cy.get('.pull-down').contains('Approve').click()

            //Log Product Name
            cy.get('tbody>tr').find('td').eq(1).then($productId => {
              const productIdValue = $productId.text()
              cy.log(productIdValue)

              //Log Order Qty
              cy.get('tbody>tr').find('td').eq(5).then($orderQty => {
                const orderQtyValue = $orderQty.text()
                cy.log(orderQtyValue)

                //Compute Total Cost
                cy.get('tbody>tr').find('td').eq(13).then($unitCost => {
                const unitCostValue = $unitCost.text()
                cy.log(unitCostValue) 

                computeTotals(orderQtyValue,unitCostValue);
                cy.log(computeTotals)
              
                //Log Unit Price
                cy.get('tbody>tr').find('td').eq(14).then($unitPrice => {
                const unitPriceValue = $unitPrice.text()
                cy.log(unitPriceValue)

                //Log Total
                cy.get('tbody>tr').find('td').eq(15).then($total => {
                const totalValue = $total.text()
                cy.log(totalValue)

                  navigateToModule('Inventory')
                  navigateToSubModule('Receiving Advice')

                  cy.fixture('inventory/receiving_advice_data/receiving_advice_data').then((receiving_advice_data) => {
                    cy.get('#createType').select('Purchase Order')
                    cy.get('input[name="_action_create"]').click();
                    cy.get('#autoPOApproved').type(documentIdValue).type('{downArrow}').type('{enter}').wait(2000)
                    cy.get('input[name="referenceId"]').type(receiving_advice_data.document_number)
                    cy.get('input#receiveDate').click();
                    cy.get('div#ui-datepicker-div').should('be.visible');
                    cy.get('.ui-datepicker-year').select(receiving_advice_data.ra_year);
                    cy.get('.ui-datepicker-month').select(receiving_advice_data.ra_month);
                    cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(receiving_advice_data.ra_day).click();
                    cy.get('.controls').find('#receiveDate').then($raDate => {
                      const raDateValue = $raDate.val()
                      cy.log(raDateValue)
                      //Click Save button
                      cy.get('input[name="_action_save"]').click();
                      //Validate Created Receiving Advice
                      cy.get('.popoutDiv').find('.alert1').contains('Receiving Advice created')
                      cy.get('.sbsdiv3').find('.property-value2').eq(0).contains(documentIdValue) //Purchase Order ID
                      cy.get('.sbsdiv3').find('.property-value2').eq(1).should('contain', receiving_advice_data.document_number) //Document ID
                      cy.get('.sbsdiv3').find('.property-value2').eq(2).contains(raDateValue) //Receiving Advice Date
                      cy.get('.sbsdiv3').find('.property-value2').contains('Created') //Status

                      cy.get('tbody > tr').find('td').eq(1).contains(productIdValue)
                      cy.get('tbody > tr').find('td').eq(2).should('contain', purchase_order_data.product)
                      cy.get('tbody > tr').find('td').eq(6).contains(unitCostValue)
                      cy.get('tbody > tr').find('td').eq(7).contains(unitPriceValue)
                      cy.get('tbody > tr').find('td').eq(8).contains(totalValue)

                      cy.get('.pull-down').contains('Complete').click()
                      cy.get('.popoutDiv').find('.alert1').contains('Successfully updated status of Receiving Advice')
                      cy.get('.sbsdiv3').find('.property-value2').contains('Completed') //Status
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })

    it('Create Receiving Order - Unordered', ()=>{

      navigateToModule('Inventory')
      navigateToSubModule('Receiving Advice')

      cy.fixture('inventory/receiving_advice_data/receiving_advice_data').then((receiving_advice_data) => {
        // cy.get('.pull-right').find('#createType').select('Unordered')
        cy.get('input[name="_action_create"]').click();

        //Populate Received From field
        cy.get('#autoSellerForUnordered').type(receiving_advice_data.received_from).type('{downArrow}').type('{enter}')
        //Populate Date Received

        cy.get('input#receiveDate').click();
        cy.get('div#ui-datepicker-div').should('be.visible');
        cy.get('.ui-datepicker-year').select(receiving_advice_data.ra_year);
        cy.get('.ui-datepicker-month').select(receiving_advice_data.ra_month);
        cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(receiving_advice_data.ra_day).click();
        //Populate Document No
        const documentNumber = generateRandomString(7)
        cy.get('input[name="referenceId"]').type(documentNumber)
          cy.log(documentNumber)

          //Save
          cy.get('input[name="_action_save"]').click();

          //Validate Created Receiving Advice - Unordered
          cy.get('.popoutDiv').find('.alert1').contains('Receiving Advice created')
          cy.get('.fieldcontain').eq(0).find('.property-value2').eq(0).contains(documentNumber)
          cy.get('.fieldcontain').eq(3).find('.property-value2').eq(0).contains(receiving_advice_data.received_from)
          //Buttons
          cy.get('.pull-down').find('a').should('contain','Print')
            .and('contain', 'Cancel')
            .and('contain', 'Edit')

          //Edit Receiving Advice
          cy.get('.pull-down').find('a').contains('Edit').click();
          cy.get('h3').contains('Edit Receiving Advice');
          cy.get('#autoFilteredProduct').type(receiving_advice_data.product_name).type('{downArrow}').type('{enter}');
          cy.get('#receivedQuantity').type(receiving_advice_data.received_qty);
          cy.get('input[name="_action_receivingAdviceItemSave"]').click();

          //Validate successful creation of unordered RA
          cy.get('.popoutDiv').contains('Receiving Advice Item created');
          cy.get('tbody>tr').eq(1).find('td').eq(2).contains(receiving_advice_data.product_name);
          cy.get('tbody>tr').eq(1).find('td').eq(3).contains(receiving_advice_data.received_qty);
          cy.get('input[name="_action_update"]').click();
          cy.get('.popoutDiv').contains('Receiving Advice updated');

          //Complete Receiving Advice
          cy.get('.pull-down').find('a').contains('Complete').click()
          cy.get('.popoutDiv').find('.alert1').contains('Successfully updated status of Receiving Advice')
          cy.get('.sbsdiv3').eq(2).find('.property-value2').eq(0).contains('Completed')
      })
    })

    it('Search Receiving Advice',() =>{
      navigateToModule('Inventory')
      navigateToSubModule('Receiving Advice')
      cy.fixture('/inventory/receiving_advice_data/receiving_advice_data').then((receiving_advice_data) => {

        //Search Document Number
        cy.get('.controls').find('#referenceId').type(receiving_advice_data.document_no)
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click();
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(1).contains(receiving_advice_data.document_no);
          }
        })

        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search Received From
        cy.get('.controls').find('#autoReceivedFrom').type(receiving_advice_data.received_from).wait(1000).type('{downArrow}').type('{enter}')
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click();
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(3).contains(receiving_advice_data.received_from);
          }
        })

        cy.get('.sbs-searchbtn-alignment').find('a').contains('Clear').click();

        //Search Status
        cy.get('.controls').find('#f_status').select(receiving_advice_data.status)
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click();
        cy.get('tbody').find("tr").then((row) =>{
          for(let i = 0; i< row.length; i++){
              cy.get('tbody>tr').eq(i).find('a').eq(8).contains(receiving_advice_data.status);
          }
        })
      })
    })
})
        