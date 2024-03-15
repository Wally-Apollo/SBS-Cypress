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

function validateTransactionModule(){
    cy.get('h3').contains('Transaction List');
    cy.get('label').contains('Receipt Number');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Pos');
    cy.get('label').contains('ERC Number:');
    cy.get('label').contains('Sales Date From:');
    cy.get('label').contains('Sales Date To:');
    cy.get('label').contains('Status:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Receipt #');
    cy.get('.sortable').contains('Pos');
    cy.get('.sortable').contains('Shift');
    cy.get('.sortable').contains('Total Amount');
    cy.get('.sortable').contains('Date Ordered');
    cy.get('.sortable').contains('Date Created');
    cy.get('.sortable').contains('Status');
}

context('Sales -> Transactions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();
    })

    it('Validation of Transaction List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Transactions');

        //Validate that there will be no Error message displayed
        validateTransactionModule();
    })
    
    it('Search Transaction', ()=> {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Transactions');

        //Validate that there will be no Error message displayed
        validateTransactionModule();
        
        cy.fixture('sales/transactions/search_transaction_list_data').then((data) => {
            
            //Search Using Receipt Number
            cy.get('#receiptNumber').type(data.receipt_number);
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search Using POS Number
            const posNumber = 'POS ' + data.pos_number;
            cy.get('.numberInput').type(posNumber);
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search Using ERC Number
            cy.get('#loyaltyCardNumber').type('1');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search using date from
            cy.get('#salesDateFrom').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search using date to
            cy.get('#salesDateTo').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search Using Status
            cy.get('[id^=f_status]').select('Created');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            cy.get('[id^=f_status]').select('Completed');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            cy.get('[id^=f_status]').select('Cancelled');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click(); 
        })
    })
})