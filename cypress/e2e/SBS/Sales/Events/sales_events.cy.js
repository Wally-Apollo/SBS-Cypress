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

function validateEventModule(){
    cy.get('h3').contains('Event List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Event Type');
    cy.get('label').contains('Pos:');
    cy.get('label').contains('Business Date From');
    cy.get('label').contains('Business Date To');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Type');
    cy.get('.sortable').contains('POS');
    cy.get('.sortable').contains('Shift');
    cy.get('.sortable').contains('Receipt');
}

context('Sales -> Events', () => {
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

    it('Validation of Event List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Events');

        //Validate that there will be no Error message displayed
        validateEventModule();
    })

    it('Search Event', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Event from menu list
        navigateToSubModule('Events');

        //Validate that there will be no Error message displayed
        validateEventModule();
        
        cy.fixture('sales/events/search_event_list_data').then((data) => {

            //Search Using Event type
            cy.get('[id^=f_type]').select(data.event_type);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(2).contains(data.event_type);
                }
            })
            //Search Using POS Number
            cy.get('[name="autoPosTerminal"]').type(data.pos_number);
            const posNumber = 'POS ' + data.pos_number;
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(3).contains(posNumber);
                }
            })
            cy.get('.btn').contains('Clear').click();
        })
    })

    it('Validation of Show Event page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Events');

        //Validate that there will be no Error message displayed
        validateEventModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(3).click();
                //Validate Show Transaction
                cy.get('h3').contains('Show Event');
                cy.get('.btn').contains('Back to Event List').click();
            }
        })
    })
})