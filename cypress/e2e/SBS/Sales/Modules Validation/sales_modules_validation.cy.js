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
    cy.get('h3').contains('Modules Validation List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Status:');
    cy.get('label').contains('Business Date From');
    cy.get('label').contains('Business Date To');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Status');
    cy.get('.sortable').contains('Total Cash');
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

    it('Validation of Modules Validation List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Modules Validation from menu list
        navigateToSubModule('Module Validation');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Modules Validation', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Modules Validation from menu list
        navigateToSubModule('Module Validation');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/modules_validation/search_modules_validation_list_data').then((data) => {
            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(2).contains(data.status);
                }
            })
            cy.get('.btn').contains('Clear').click();      
        })
    })

    it('Validation of Show Modules Validation page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Modules Validation from menu list
        navigateToSubModule('Module Validation');

        //Validate that there will be no Error message displayed
        validateModule();

        cy.get('tbody').find("tr").then((row) =>{
            for(let i = 0; i< row.length; i++){
                cy.get('tbody>tr').eq(i).find('a').eq(0).click();
                //Validate Show Cash Drop
                cy.get('h3').contains('Show Modules Validation');
                cy.get('.btn').contains('Back to Modules Validation List').click();
            }
        })
    })
})