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

function generateRandomString(string_length) {
    let text = '';
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    for(let i = 0; i < string_length; i++) 
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    return text;
  }

function validateModule(){
    cy.get('h3').contains('Fund List');
    cy.get('label').contains('Document No');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Status');
    cy.get('label').contains('Business Date From');
    cy.get('label').contains('Business Date To');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Document Id');
    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Total Amount');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Funds', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();
    })

    it('Validation of Fund List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Funds from menu list
        navigateToSubModule('Funds');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Funds', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Funds from menu list
        navigateToSubModule('Funds');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/funds/search_fund_list_data').then((data) => {
            //Search Using Document No.
            cy.get('#id').type('1')
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search Using Status
            cy.get('[id^=f_status]').select('Created');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            cy.get('[id^=f_status]').select('Cancelled');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            cy.get('[id^=f_status]').select('Approved');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click(); 

            //Search using date from
            cy.get('#businessDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search using date to
            cy.get('#businessDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })
    })

    it('Create, Print, Cancel fund', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');
        navigateToSubModule('Funds');
        validateModule();
        const generatedRandomString = generateRandomString(7)

        cy.get('.pull-right > .btn').click()
        cy.get('#referenceId').type(generatedRandomString)
        cy.get('#businessDate').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
        cy.get('.btn').contains('Save').click();
        cy.wait(2000)
        cy.get('.btn').contains('Print').click();
        cy.wait(2000)
        cy.get('.btn').contains('Cancel').click();
        cy.wait(2000)
        cy.get('.nav-buttons > .btn').click()
    })

    it('Create and Edit fund', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');
        navigateToSubModule('Funds');
        validateModule();
        const generatedRandomString = generateRandomString(7)

        cy.get('.pull-right > .btn').click()
        cy.get('#referenceId').type(generatedRandomString)
        cy.get('#businessDate').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
        cy.get('.btn').contains('Save').click();
        cy.wait(2000)
        cy.get('.btn').contains('Edit').click();
        cy.wait(2000)
        cy.get('#autoFundAccount').type('Change').type('{downArrow}').type('{enter}');
        cy.wait(2000)
        cy.get('#fundAction').select('Add');
        cy.get('#amount').type('100')
        cy.get('#vatStatus').select('Non Vatable')
        cy.get('.btn').contains('Add').click();
        cy.wait(2000)
        cy.get('.btn').contains('Save').click();
        cy.wait(1000)
        cy.get('.btn').contains('Print').click();
        cy.wait(1000)
        cy.get('.btn').contains('Approved').click();
        cy.wait(1000)
        cy.get('.nav-buttons > .btn').click()
    })
})