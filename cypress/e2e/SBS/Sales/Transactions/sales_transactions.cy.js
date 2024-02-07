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
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();

        cy.contains('Masterfile');
        cy.contains('Matrix');
        cy.contains('Inventory');
        cy.contains('Sales');
        cy.contains('Report');
        cy.contains('Misc');
        cy.contains('Sign out');
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
            searchWithOneField('receiptNumber',data.receipt_number);
            var totalRows = 0;
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(0).contains(data.receipt_number);
                }
            })
            cy.get('.btn').contains('Clear').click();

            //Search Using POS Number
            cy.get('[name="f_pos"]').type(data.pos_number);
            const posNumber = 'POS ' + data.pos_number;
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(1).contains(posNumber);
                }
            })
            cy.get('.btn').contains('Clear').click();

            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(6).contains(data.status);
                }
            })
        })
    })

    it('Validation of Show Transaction page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Transactions');

        //Validate that there will be no Error message displayed
        validateTransactionModule();

        cy.fixture('sales/transactions/show_transaction_data').then((data) => {
            //Select any transaction from the list
            cy.get('td').find('a').contains(data.receipt_number).click();
        })

        //Validate Show Transaction
        cy.get('h3').contains('Show Transaction');
        cy.get('li').find('a').contains('Transaction Items');
        cy.get('li').find('a').contains('Transaction Return');
    })
})