/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function navigateToSubModule2(subModule2){
    cy.get('li').contains(subModule2).last().click();
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

function validateWeeklySupplies() {
    it('Validation of Weekly Supplies List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Weekly Supplies')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Weekly Supplies List');
        
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
            .and('contain', 'Facility')
            .and('contain', 'Status')
            .and('contain', 'WS Slip Date From')
            .and('contain', 'WS Slip Date To')

        //Fields
        cy.get('input[id="wsSlipNo"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateToSearch"]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Weekly Supplies')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
            .and('contain', 'WS Slip Date') 
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail Price')
            .and('contain', 'Status')
        cy.get('thead').find('th').contains('Total No. of Items')
    })  
}

context('ORDER', () => {
    login();

    validateWeeklySupplies()

    it('TC01: S01 - S04', () => {
        navigateToModule('Inventory')
        navigateToSubModule('Weekly Supplies')
        cy.fixture('inventory/weekly_supplies_data/m14-weekly_supplies_tab_data').then((data) =>{
            searchSuccess(data[0])
            searchSuccess(data[1].data[0], data[1].check[0].null, true)
            searchSuccess(data[1].data[1], data[1].check[1].null, true)
            searchSuccess(data[1].data[2], data[1].check[2].null, true)
            
            cy.get('#countDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].wsSlipDateFrom);

            cy.get('#countDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].wsSlipDateFrom);

            cy.get('.pull-right > .btn').click()
            cy.get('#countDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Print').click();
            cy.get('.btn').contains('Cancel').click();
            cy.get('.btn').contains('<< Back to').click(); 
            
            cy.get('.pull-right > .btn').click()
            cy.get('#countDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Edit').click(); 
            cy.get('#autoWeeklySuppliesProductList').click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#countedQuantity').type(data[1].quantity);

            cy.get('.btn').contains('Add').click(); 
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Complete').click();
            cy.wait(2000)
            cy.get('.btn').contains('<< Back to').click(); 
        
        });
    })

})

