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
    cy.get('h3').contains('Refund List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Receipt Number');
    cy.get('label').contains('Customer:');
    cy.get('label').contains('Returned Date From:');
    cy.get('label').contains('Returned Date To:');
    cy.get('label').contains('Status:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('th').contains('Receipt Number/Reference ID');
    cy.get('th').contains('Refund Date');
    cy.get('th').contains('Customer');
    cy.get('th').contains('Status');
    cy.get('th').contains('Amount');
}

context('Sales -> Modules Validation', () => {
    beforeEach(() => {
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();

        cy.contains('Masterfile');
        cy.contains('Matrix');
        cy.contains('Inventory');
        cy.contains('Sales');
        cy.contains('Report');
        cy.contains('Misc');
        cy.contains('Sign out');
    })

    it('Validation of Refund List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Refunds from menu list
        navigateToSubModule('Refunds');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Refund', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Refunds from menu list
        navigateToSubModule('Refunds');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/refund/search_refund_data').then((data) => {
            //Search Receipt Number
            searchWithOneField('salesOrder',data.receipt_number);
            cy.get('td').find('a').contains(data.receipt_number);
            cy.get('.btn').contains('Clear').click();

            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(3).contains(data.status);
                }
            })
            cy.get('.btn').contains('Clear').click();      
        })
    })

    it('Validation of Show Refund page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Refunds from menu list
        navigateToSubModule('Refunds');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Refund List
                cy.get('h3').contains('Show Refund');
                cy.get('li').find('a').contains('Refund Items');
                cy.get('.btn').contains('Back to Refund List').click();
            }
        })
    })
})