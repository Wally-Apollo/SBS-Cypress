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
    login()

    it('Validation of Cash Add List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Cash Add from menu list
        navigateToSubModule('Cash Add');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Cash Add', ()=> {
        navigateToModule('Sales');
        navigateToSubModule('Cash Add');
        
        cy.fixture('sales/cash_add/m25-sales-cash_add').then((data) => {
            //Search Using POS Number
            searchSuccess(data[0])
            
            for (let i =  0; i <  data[0].data.length; i++) {
                searchSuccess(data[1].data[i], false, true)
            }

            cy.get('#fromDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('#thruDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();
        })
    })
})