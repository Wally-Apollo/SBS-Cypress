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
      })  

    it('Search dispatch advice', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Dispatch Advice from the submenu
        navigateToSubModule('Dispatch Advice')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Dispatch Advice List')

        //documentID
        cy.get('input[id="documentId"]').type("123456")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        //status
        cy.get('[id^=f_status]').select("Created")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        cy.get('[id^=f_status]').select("Approved")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        cy.get('[id^=f_status]').select("Received")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        cy.get('[id^=f_status]').select("Completed")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        cy.get('[id^=f_status]').select("Cancelled")
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        //date
        cy.get('input[id="deliveryDateFrom"]').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        cy.get('input[id="deliveryDateTo"]').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button

        //destination
        cy.get('input[id="autoDispatchTo"]').type("0352").type('{downArrow}').type('{enter}')
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click() //Search button
        cy.wait(2000)
        cy.get('.sbs-searchbtn-alignment').find('a').click() //Clear Button
      })  

    it('Create new disptach advice', function () {
        navigateToModule('Inventory')
        navigateToSubModule('Dispatch Advice')
        const generatedRandomString = generateRandomString(7)
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

        cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) =>{
            //Create Dispatch and Save
            cy.get('.controls').find('input[name="documentId"]').type(generatedRandomString)
            cy.get('.controls').find('#autoFacilityList').type('{downArrow}').type('{downArrow}').type('{enter}')
            cy.get('.controls').find('[name="deliveryDate"]').click();
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('#referenceId').type('test')
            cy.get('#carrierType').type('test')
            cy.get('#carrierDescription').type('test')
            cy.get('.button-align-right').find('input[name="_action_save"]').click();
        })

        cy.get('.pull-down').find('a').contains('Print').click();
        cy.get('.pull-down').find('a').contains('Cancel').click();
        cy.wait(2000)
        cy.get('.nav-buttons > .btn').click()
    })

    it('Test to verify if user can complete return', function () {
        navigateToModule('Inventory')
        navigateToSubModule('Dispatch Advice')
        const generatedRandomString = generateRandomString(7)
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

        cy.fixture('inventory/dispatch_advice_data/dispatch_advice_data').then((dispatch_advice_data) =>{
            //Create Dispatch and Save
            cy.get('.controls').find('input[name="documentId"]').type(generatedRandomString)
            cy.get('.controls').find('#autoFacilityList').type('{downArrow}').type('{enter}')
            cy.get('.controls').find('[name="deliveryDate"]').click();
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('#referenceId').type('test')
            cy.get('#carrierType').type('test')
            cy.get('#carrierDescription').type('test')
            cy.get('.button-align-right').find('input[name="_action_save"]').click();
        })
        cy.wait(2000)
        cy.get('.pull-down').find('a').contains('Edit').click();
        cy.get('#autoProductListDispatchAdvice').type('{downArrow}').wait(2000)
        cy.get('#autoProductListDispatchAdvice').type('{downArrow}').type('{enter}')
        cy.get('#sscc').type('1')
        cy.get('#dispatchedQuantity').type(10)
        cy.get(':nth-child(15) > .btn').click()
        cy.get('[name="_action_update"]').click()
        cy.get('.pull-down').find('a').contains('Approve').click();

        cy.get('.nav-buttons > .btn').click()
    })
})

