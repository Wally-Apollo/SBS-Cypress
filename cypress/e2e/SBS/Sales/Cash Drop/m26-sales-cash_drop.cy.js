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
    cy.get('h3').contains('Cash Drop List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Pos:');
    cy.get('label').contains('Shift:');
    cy.get('label').contains('Business Date From:');
    cy.get('label').contains('Business Date To:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Pos');
    cy.get('.sortable').contains('Shift');
    cy.get('.sortable').contains('Amount');
}

context('Sales -> Cash Drop', () => {
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

    it('Validation of Cash Drop List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Funds from menu list
        navigateToSubModule('Cash Drop');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        navigateToModule('Sales');
        navigateToSubModule('Cash Drop');
        
        cy.fixture('sales/cash_drop/m2').then((data) => {
            //Search Using POS Number
            cy.get('[name="autoPosTerminal"]').type(data.pos_number);
            cy.get('.btn').contains('Search').click();
            const posNumber = 'POS ' + data.pos_number;
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(1).contains(posNumber);
                }
            })
            cy.get('.btn').contains('Clear').click();      

            //Search Using Status
            cy.get('[id^=shiftNo]').select(data.shift);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(2).contains(data.shift);
                }
            })
        })
    })
})