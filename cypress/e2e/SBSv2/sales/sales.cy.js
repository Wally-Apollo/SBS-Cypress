

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

function searchSuccess(data,  category = false) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") { 
            if(category) {
                searchWithCategory(key, data[key]);
            } else {
                searchWithOneField(key, data[key]);
            }


            cy.get('tbody').then($tbody=>{
                if($tbody.find('tr').length>0){
                    cy.get('table').should('have.descendants', 'td');
                }else{
                    cy.get('.message').should('contain', 'Result not found.');
                }
            })


            cy.get('.btn').contains('Clear').click();
        }
    });
}

function searchClear(check = false) {
    cy.get('.btn').contains('Search').click();
    cy.get('tbody').then($tbody=>{
        if($tbody.find('tr').length>0){
            cy.get('table').should('have.descendants', 'td');
        }else{
            cy.get('.message').should('contain', 'Result not found.');
        }
    })
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
    cy.get('h3').contains('Refund List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Receipt Number');
    cy.get('label').contains('Customer:');
    cy.get('label').contains('Returned Date From:');
    cy.get('label').contains('Returned Date To:');
    cy.get('label').contains('Status:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('th').contains('Receipt Number/Reference ID');
    cy.get('th').contains('Refund Date');
    cy.get('th').contains('Customer');
    cy.get('th').contains('Status');
    cy.get('th').contains('Amount');
}

context('Sales -> Modules Validation', () => {
    login()

    it('Validation of Refund List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Refunds from menu list
        navigateToSubModule('Refunds');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S06', ()=> {
        navigateToModule('Sales');
        navigateToSubModule('Refunds');
        
        cy.fixture('sales/refund/m24-sales-refund').then((data) => {
            searchSuccess(data[0]);
            
            cy.get('#returnDateFrom').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('#returnDateTo').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            searchSuccess(data[1].data[0], false, true)
            searchSuccess(data[1].data[1], false, true)
            searchSuccess(data[1].data[2], false, true)
        })
    })
})