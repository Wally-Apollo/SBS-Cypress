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

function validateModule(){
    cy.get('h3').contains('Disbursement List');
    cy.get('label').contains('Document No.');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Status');
    cy.get('label').contains('Business Date From');
    cy.get('label').contains('Business Date To');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Document ID');
    cy.get('.sortable').contains('Document No.');
    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('Total Amount');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Store Disbursement', () => {
    login()

    it('Validation of Service List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Store Disbursement from menu list
        navigateToSubModule('Store Disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S10', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Store Disbursement from menu list
        navigateToSubModule('Store Disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/store_disbursement/m22-sales-store_disbursement').then((data) => {
            searchSuccess(data[0])

            searchSuccess(data[1].data[0], false, true)
            searchSuccess(data[1].data[1], false, true)
            searchSuccess(data[1].data[2], false, true)
            

            cy.get('#businessDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].wsSlipDateFrom);

            cy.get('#businessDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].wsSlipDateFrom);

            // new disbursement
            cy.get('.pull-right > .btn').click()

            cy.get('#referenceId').type(data[2].referenceId)
            cy.get('#businessDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();

            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Print').click(); 
            cy.get('.btn').contains('Cancel').click(); 
            cy.get('.btn').contains('<< Back to').click(); 
        

            // new disbursement
            cy.get('.pull-right > .btn').click()

            cy.get('#referenceId').type(data[2].referenceId)
            cy.get('#businessDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Edit').click(); 
            cy.get('#autoAccountList').click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#autoParticularsList').click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#amount').type(data[2].amount)
            cy.get('#vatStatus').select(data[2].vat)

            cy.get('.btn').contains('Add').click(); 
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Approve').click(); 
            cy.get('.btn').contains('<< Back to').click(); 
        })
    })
})