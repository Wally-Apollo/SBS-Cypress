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

function validateShiftWorksheetModule(){
    cy.get('h3').contains('Shift Work Sheet List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Pos:');
    cy.get('label').contains('Shift:');
    cy.get('label').contains('Business Date From:');
    cy.get('label').contains('Business Date To:');
    cy.get('label').contains('Status:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('POS');
    cy.get('.sortable').contains('Shift');
    cy.get('.sortable').contains('Cashier');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Shift Worksheet', () => {
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

    it('Validation of Shift Worksheet List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Shift Worksheet');

        //Validate that there will be no Error message displayed
        validateShiftWorksheetModule();
    })

    it('Search Shift Worksheet', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Shift Worksheet');

        //Validate that there will be no Error message displayed
        validateShiftWorksheetModule();
        
        cy.fixture('sales/shift_worksheet/search_shift_worksheet_list_data').then((data) => {
            
            //Search Using POS Number
            cy.get('[name="autoPosTerminal"]').type(data.pos_number);
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(1).contains(data.pos_number);
                }
            })
            cy.get('.btn').contains('Clear').click();

            //Search Using shift number
            cy.get('[id^=shift]').select(data.shift_number);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(2).contains(data.shift_number);
                }
            })
            cy.get('.btn').contains('Clear').click();

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

    it('Validation of Show Shift Worksheet page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Shift Worksheet from menu list
        navigateToSubModule('Shift Worksheet');

        //Validate that there will be no Error message displayed
        validateShiftWorksheetModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Shift Work Sheet
                cy.get('h3').contains('Show Shift Work Sheet');
                cy.get('li').find('a').contains('ePayment Details');
                cy.get('li').find('a').contains('Discount Details');
                cy.get('li').find('a').contains('Card Details');
                cy.get('li').find('a').contains('711 Gift Cheque Details');
                cy.get('li').find('a').contains('Additional Gift Cheques');
                cy.get('li').find('a').contains('Cash Invoice');
                cy.get('.btn').contains('Back to Shift Work Sheet List').click();
            }
        })
    })
})