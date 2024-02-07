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
    cy.get('h3').contains('Claim Order List');
    cy.get('label').contains('Document ID');
    cy.get('label').contains('Facility');
    cy.get('label').contains('ERC Number:');
    cy.get('label').contains('Claim Date From:');
    cy.get('label').contains('Claim Date To:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('th').contains('Document ID');
    cy.get('th').contains('Buyer');
    cy.get('th').contains('Total Items');
    cy.get('th').contains('Total Amount');
    cy.get('th').contains('Claim Date');
    cy.get('th').contains('Date Created');
}

context('Sales -> Claim Order List', () => {
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

    it('Validation of Claim Order List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Claim Order from menu list
        navigateToSubModule('Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Claim Order List', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Claim Order from menu list
        navigateToSubModule('Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/claim_order/search_claim_order_list_data').then((data) => {
            //Search Using Document No.
            searchWithOneField('documentId',data.document_id);
            cy.get('td').contains(data.document_id);
            cy.get('.btn').contains('Clear').click();
        })
    })

    it('Validation of Show Claim Order List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Disbursement
                cy.get('h3').contains('Show Claim Order');
                cy.get('li').find('a').contains('Claim Order Items');
                cy.get('.btn').contains('Back to Claim Order List').click();
            }
        })
    })
})