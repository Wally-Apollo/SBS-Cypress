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
            // searchWithOneField('id',data.document_id);
            // cy.get('td').find('a').contains(data.document_id);
            // cy.get('.btn').contains('Clear').click();            

            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(4).contains(data.status);
                }
            })
        })
    })

    it('Validation of Show Fund page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Fund');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Disbursement
                cy.get('h3').contains('Show Fund');
                cy.get('li').find('a').contains('Fund Entry');
                cy.get('.btn').contains('Back to Fund List').click();
            }
        })
    })
})