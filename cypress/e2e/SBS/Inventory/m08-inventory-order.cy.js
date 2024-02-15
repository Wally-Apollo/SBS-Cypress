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

context('ORDER', () => {
    login();

    it('Validation of Order List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Order')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Replenishment Order');
        
        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
            .and('contain', 'Document ID')
            .and('contain', 'Status');
        cy.get('.sbs-label-replenishment').should('contain', 'Replenishment Order Date From')
            .and('contain', 'Replenishment Order Date From');
        
        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')
        cy.get('input[id="fromDateSearch"]').should('be.visible')
        cy.get('input[id="thruDateSearch"]').should('be.visible');

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.btn').should('contain', 'New Replenishment Order');

        //Table
        cy.get('thead').find('.sortable').should('contain', 'Document ID')
            .and('contain', 'Date Created')
            .and('contain', 'Order Date')
            .and('contain', 'Number of Item Ordered')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail')
            .and('contain', 'Status');
    })

    it('TC01: S01 - S04', () => {
        navigateToModule('Inventory');
        navigateToSubModule('Order')

        cy.get('.pull-right').contains('New Replenishment Order').click();
        cy.get('a.btn').click()

        cy.get('.pull-right').contains('New Replenishment Order').click();
        cy.get('#orderDate').click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
        cy.get('.button-align-right > input.btn').click();

        cy.fixture('inventory/order_data/m08-order_tab_data').then((data) => {
            cy.get('#categorySelection').select(data[0].data[0].categorySelection);
            cy.get('.btn').contains('Edit').click(); 
            cy.get('.btn').contains('Suggest').click(); 
            
            cy.get('tbody').find(data[0].data[1].id).clear().type(data[0].data[1].type)
            
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Print').click();
            cy.get('.btn').contains('Complete').click();  
            cy.get('.nav-tabs > :nth-child(2) > a').click();

            cy.get('.btn').contains('<< Back to').click(); 
            
            cy.get('td').find('a').contains("DG").then(element => {
                // Capture the value directly
                const myValue = element.text();
                cy.get('td').find('a').contains(myValue).click();
            });
            
        });
    })

    it('TC01: S05 - S06', () => {
        navigateToModule('Inventory');
        navigateToSubModule('Order')

        cy.fixture('inventory/order_data/m08-order_tab_data').then((data) => {
            searchSuccess(data[1]);
            searchSuccess(data[2].data[0], data[2].check[0].null, true);
            searchSuccess(data[2].data[1], data[2].check[1].null, true);
            searchSuccess(data[2].data[2], data[2].check[2].null, true);
        });
    })
})

