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

context('Sales -> Modules Validation', () => {
    login()

    it('Validation of Modules Validation List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Modules Validation from menu list
        navigateToSubModule('Module Validation');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Modules Validation', ()=> {
        navigateToModule('Sales');
        navigateToSubModule('Module Validation');

        cy.fixture('sales/modules_validation/m27-sales-modules_validation').then((data) => {
            searchSuccess(data[0].data[0], false, true)
            searchSuccess(data[0].data[1], false, true)
            searchSuccess(data[0].data[2], false, true)

            cy.get('#businessDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('#businessDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('.pull-right > .btn').click()
            cy.get('#businessDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('.btn').contains('Save').click();
            cy.get('.btn').contains('<< Back to').click(); 

            cy.get('.pull-right > .btn').click()
            cy.get('#businessDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('.btn').contains('Save').click();
            // cy.get('.btn').contains('Edit').click();
            // cy.get('.btn').contains('Save').click();
            cy.get('.btn').contains('<< Back to').click(); 
        })

    })
})