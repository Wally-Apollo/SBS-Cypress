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
    cy.get('h3').contains('Disbursement List');
    cy.get('label').contains('Document No.');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Status');
    cy.get('label').contains('Business Date From');
    cy.get('label').contains('Business Date To');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Document ID');
    cy.get('.sortable').contains('Document No.');
    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Total Amount');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Store Disbursement', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/retailplus/login/auth')
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

    it('Validation of Service List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Store Disbursement from menu list
        navigateToSubModule('Store Disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Store Disbursement', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Store Disbursement from menu list
        navigateToSubModule('Store Disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/store_disbursement/search_disbursement_list_data').then((data) => {
            //Search Using Document No.
            searchWithOneField('documentId',data.document_id);
            cy.get('td').find('a').contains(data.document_id);
            cy.get('.btn').contains('Clear').click();            

            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(5).contains(data.status);
                }
            })
        })
    })

    it('Validation of Show Disbursement page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Store Disbursement');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Disbursement
                cy.get('h3').contains('Show Disbursement');
                cy.get('li').find('a').contains('Disbursement Entry');
                cy.get('.btn').contains('Back to Disbursement List').click();
            }
        })
    })
})