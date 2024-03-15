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

function validateModule(){
    cy.get('h3').contains('Service Sales List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Status');
    cy.get('label').contains('Business Date From');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Prepared By');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Service Sales', () => {
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

    it('Validation of Service List List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Service Sales');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search service sales', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Service Sales');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/service_sales/search_service_sales_list_data').then((data) => {
            //Search Using Status
            cy.get('[id^=f_status]').select('Created');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })

        cy.fixture('sales/service_sales/search_service_sales_list_data').then((data) => {
            //Search Using Status
            cy.get('[id^=f_status]').select('Approved');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })

        cy.fixture('sales/service_sales/search_service_sales_list_data').then((data) => {
            //Search Using Status
            cy.get('[id^=f_status]').select('Cancelled');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })

        cy.fixture('sales/service_sales/search_service_sales_list_data').then((data) => {
            //Search Using Status
            cy.get('input[id="fromDateSearch"]').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })

        cy.fixture('sales/service_sales/search_service_sales_list_data').then((data) => {
            //Search Using Status
            cy.get('input[id="thruDateSearch"]').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })
    })

    it('Create purchase order', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Service Sales');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('.pull-right > .btn').click()
        cy.get('input[id="businessDate"]').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
        cy.get('.btn').contains('Save').click();
    })
})