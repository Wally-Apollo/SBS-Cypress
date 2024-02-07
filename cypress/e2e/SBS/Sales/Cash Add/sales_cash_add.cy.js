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
    cy.get('h3').contains('Cash Add List');
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

context('Sales -> Cash Add', () => {
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

    it('Validation of Cash Add List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Cash Add from menu list
        navigateToSubModule('Cash Add');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Cash Add', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Funds from menu list
        navigateToSubModule('Cash Add');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/cash_add/search_cash_add_list_data').then((data) => {
            //Search Using POS Number
            cy.get('[name="f_pos"]').type(data.pos_number);
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

    it('Validation of Show Cash Drop page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Cash Add');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Cash Drop
                cy.get('h3').contains('Show Cash Add');
                cy.get('span').contains('Business Date:');
                cy.get('span').contains('Facility:');
                cy.get('span').contains('POS:');
                cy.get('span').contains('Shift No.:');
                cy.get('span').contains('Amount:');
                cy.get('span').contains('Currency:');
                cy.get('span').contains('Date Processed:');
                cy.get('span').contains('Training Mode:');
                
                cy.get('.btn').contains('Back to Cash Add List').click();
            }
        })
    })
})