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
    const field = `[name^=${fieldId}]`;
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

function validateModule(){
    //Validate user module content
        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Cycle Count List');

        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
        .and('contain', 'Document Id')
        .and('contain', 'Type')
        .and('contain', 'Date Counted From')
        .and('contain', 'Date Counted To')
        .and('contain', 'Status')

        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('select[name^="f_type"]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateToSearch"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Cycle Count Variance')
        cy.get('.pull-right').contains('New Cycle Count')


        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
        .and('contain', 'Count Date')
        .and('contain', 'Type')
        .and('contain', 'Total Cost')
        .and('contain', 'Total Retail Price')
        .and('contain', 'Status');
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

context('CYCLE COUNT', () => {
    login();

    it('Validation of Cycle Count page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();
    })

    // it('TC01: S01 - S05', ()=>{
    //     navigateToModule('Inventory');
    //     navigateToSubModule('Cycle Count')

    //     cy.fixture('inventory/cycle_count/m10-cycle_count_tab_data').then((data) => {
    //         searchSuccess(data[0]);
            
    //         searchSuccess(data[1].type[0], false, true);
    //         searchSuccess(data[1].type[1], false, true);

    //         searchSuccess(data[1].status[0], false, true);
    //         searchSuccess(data[1].status[1], false, true);
    //         searchSuccess(data[1].status[2], false, true);

    //         cy.get('[href="/RetailPlusStoreBackend/cycleCount/createCycleCountVariance"]').click();
    //         cy.get('#countDate').click();
    //         cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
    //         cy.get('#referenceId').type(data[2].referenceId);
    //         cy.get(':nth-child(4) > .btn').click();
    //         cy.get('.btn').contains('Edit').click(); 
    //         cy.get('.btn').contains('Cancel').click(); 
    //         cy.get('.btn').contains('Edit').click(); 
    //         // cy.get('#autoProductListVariance').click().click()
    //         cy.get('#autoProductListVariance').click().click().wait(5000).type('{downArrow}').type('{enter}')
    //         cy.get('#countedQuantity').type(data[2].quantity);
    //         cy.get('#reason').select(data[2].reason);
    //         cy.get('.btn').contains('Add').click(); 
    //         cy.get('.btn').contains('Save').click(); 
    //         cy.get('.btn').contains('Complete').click(); 
    //         cy.get('.btn').contains('Print').click(); 
    //         cy.get('.btn').contains('<< Back to').click(); 
    //     });

    // })

    it('TC01: S06', ()=>{
        navigateToModule('Inventory');
        navigateToSubModule('Cycle Count')

        cy.fixture('inventory/cycle_count/m10-cycle_count_tab_data').then((data) => {
            // cy.get('[href="/RetailPlusStoreBackend/cycleCount/createCycleCount"]').click();
            // cy.get('#countDate').click();
            // cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            // cy.get('#referenceId').type(data[3].referenceId);
            // cy.get('.btn').contains('Save').click(); 
            // cy.get('.btn').contains('Cancel').click(); 

            cy.get('[href="/RetailPlusStoreBackend/cycleCount/createCycleCount"]').click();
            cy.get('#countDate').click();
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#referenceId').type(data[4].referenceId);

            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Cancel').click(); 

            cy.get('td').find('a').contains("DH").then(element => {
                const myValue = element.text();
                cy.get('td').find('a').contains(myValue).click();
            });

            cy.get('#autoProductList').wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#countedQuantity').type(10)

            cy.get('.btn').contains('Add').click()
            cy.get('.btn').contains('Save').click()
            cy.get('.btn').contains('Completed').click()
            cy.get('.btn').contains('Print').click()
            cy.get('.btn').contains('<< Back to').click(); 

        });
    })
})