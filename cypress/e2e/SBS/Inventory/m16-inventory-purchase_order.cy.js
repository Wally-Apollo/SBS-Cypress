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

function validatePage() {
    it('Validation of Price Change List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Purchase Order')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Purchase Order List');
        
        //Labels
        cy.get('.sbs-label').should('contain', 'Document ID')
            .and('contain', 'Order Date From:')
            .and('contain', 'Order Date To:')
            .and('contain', 'Facility')
            .and('contain', 'Supplier:')
            .and('contain', 'Status:')

        //Fields
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('input[id="orderDateFromSearch"]').should('be.visible')
        cy.get('input[id="orderDateToSearch"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="autoSeller"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Purchase Order')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document ID')
            .and('contain', 'Order Date') 
            .and('contain', 'Supplier')
            .and('contain', 'Delivery Date')
            .and('contain', 'Total Number of Items')
            .and('contain', 'Total Cost')
            .and('contain', 'Total Retail Price')
            .and('contain', 'Status')
    }) 
}

context('PURCHASE ORDER', () => {
    login()

    validatePage()

    it('TC01: S01 - S06', () => {
        navigateToModule('Inventory');
        navigateToSubModule('Purchase Order')
        cy.fixture('/inventory/purchase_order_data/m16-purchase_order_tab_data').then((data) =>{
            searchSuccess(data[0])
            searchSuccess(data[1].data[0], data[1].check[0].null, true)
            searchSuccess(data[1].data[1], data[1].check[1].null, true)
            searchSuccess(data[1].data[2], data[1].check[2].null, true)
            searchSuccess(data[1].data[3], data[1].check[3].null, true)
            searchSuccess(data[1].data[4], data[1].check[4].null, true)
            
            cy.get('#orderDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].orderDateFromSearch);

            cy.get('#orderDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear(data[1].orderDateToSearch);

            cy.get('#autoSeller').type(data[1].autoSeller).click().click().wait(5000).type('{downArrow}').type('{enter}')
        });
    })

    it('TC01: S07 - S11', () => {
        navigateToModule('Inventory');
        navigateToSubModule('Purchase Order')
        cy.fixture('/inventory/purchase_order_data/m16-purchase_order_tab_data').then((data) =>{
            cy.get('[href="/RetailPlusStoreBackend/purchaseOrder/create"]').click();
            cy.get('#autoSeller').type(data[1].autoSeller).click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#orderDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#deliveryDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#cancelIfNotDeliveredBy').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#referenceId').type(data[1].comment)

            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Print').click();
            cy.get('.btn').contains('Cancel').click();
            cy.get('.btn').contains('<< Back to').click(); 

            cy.get('[href="/RetailPlusStoreBackend/purchaseOrder/create"]').click();
            cy.get('#autoSeller').type(data[2].autoSeller).click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#orderDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#deliveryDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#cancelIfNotDeliveredBy').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#referenceId').type(data[2].comment)

            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Edit').click(); 
            cy.get('#autoFilteredProduct').click().click().wait(5000).type('{downArrow}').type('{enter}')
            cy.get('#orderQuantity').type(data[2].quantity)
            cy.get('.btn').contains('Add').click(); 
            cy.get('.btn').contains('Save').click(); 
            cy.get('.btn').contains('Download').click(); 
            cy.get('.btn').contains('Approve').click(); 
            cy.get('.btn').contains('Complete').click(); 

            cy.get('.nav-tabs > :nth-child(2) > a').click();
            cy.get('.btn').contains('<< Back to').click(); 
        });
    })
})

