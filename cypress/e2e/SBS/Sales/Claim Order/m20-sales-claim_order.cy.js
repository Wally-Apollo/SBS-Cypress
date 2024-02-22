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

function searchWithCategory(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get('.btn').contains('Search').click();
}

function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") { 
            if(category) {
                searchWithCategory(key, data[key]);
            } else {
                searchWithOneField(key, data[key]);
            }
            if(check) {
                cy.get('table').should('have.descendants', 'td');
            } else {
                cy.get('.message').should('contain', 'Result not found.');
            }
            cy.get('.btn').contains('Clear').click();
        }
    });
}

function searchClear(check = false) {
    cy.get('.btn').contains('Search').click();
    if(check) {
        cy.get('table').should('have.descendants', 'td');
    } else {
        cy.get('.message').should('contain', 'Result not found.');
    }
    cy.get('.btn').contains('Clear').click();
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

function login() {
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
}

context('Sales -> Claim Order List', () => {
    login()

    it('Validation of Claim Order List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Claim Order from menu list
        navigateToSubModule('Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Claim Order from menu list
        navigateToSubModule('Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/claim_order/m20-sales-claim_order.json').then((data) => {
            searchSuccess(data[0])

            cy.get('#salesDateFrom').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('#salesDateTo').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();
        })
    })
})