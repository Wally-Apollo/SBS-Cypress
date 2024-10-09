

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

function searchSuccess(data, category = false) {
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

function validateModule(){
    cy.get('h3').contains('Cash Drop List');
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

context('Sales -> Cash Drop', () => {
    login()

    it('Validation of Cash Drop List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Funds from menu list
        navigateToSubModule('Cash Drop');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        navigateToModule('Sales');
        navigateToSubModule('Cash Drop');
        
        cy.fixture('sales/cash_drop/m26-sales-cash_drop').then((data) => {
            searchSuccess(data[0]);
            
            cy.wrap(data[1].data).each((item) => {
                searchSuccess(item, false, true);
            });

            cy.get('#fromDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();

            cy.get('#thruDate').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();
        })
    })
})