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

context('Sales -> Transactions', () => {
    login()

    it('Validation of Transaction List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');

        //Click Transactions from menu list
        navigateToSubModule('Transactions');

        //Validate that there will be no Error message displayed
        validateTransactionModule();
    })

    describe('Transaction Search and Validation', () => {
        for (let i =  0; i <  5; i++) {

            it('Search Transaction', ()=> {
                //Click Sales from the menu
                navigateToModule('Sales');
        
                //Click Transactions from menu list
                navigateToSubModule('Transactions');
                
                cy.fixture('sales/transactions/integrated_sales_transactions').then((data) => {
                    
                    //Search Using Receipt Number
                    searchWithOneField('receiptNumber',data[i].search.receipt_number);
                    var totalRows = 0;
                    cy.get('tbody').find("tr").then((row) =>{
                        for(let j = 0; j< row.length; j++){
                            cy.get('tbody>tr').eq(j).find('a').eq(0).contains(data[i].search.receipt_number);
                        }
                    })
                    cy.get('.btn').contains('Clear').click();
        
                    //Search Using POS Number
                    cy.get('[name="f_pos"]').type(data[i].search.pos_number);
                    const posNumber = 'POS ' + data[i].search.pos_number;
                    cy.get('tbody').find("tr").then((row) =>{
                        for(let j = 0; j< row.length; j++){
                            cy.get('tbody>tr').eq(j).find('a').eq(1).contains(posNumber);
                        }
                    })
                    cy.get('.btn').contains('Clear').click();
        
                    //Search Using Status
                    cy.get('[id^=f_status]').select(data[i].search.status);
                    cy.get('.btn').contains('Search').click();
                    cy.get('tbody').find("tr").then((row) =>{
                        for(let j = 0; j< row.length; j++){
                            cy.get('tbody>tr').eq(j).find('a').eq(6).contains(data[i].search.status);
                        }
                    })
                })
            })
        
            it('Validation of Show Transaction page', () => {
                //Click Sales from the menu
                navigateToModule('Sales');
        
                //Click Transactions from menu list
                navigateToSubModule('Transactions');
        
                cy.fixture('sales/transactions/integrated_sales_transactions').then((data) => {
                    //Select any transaction from the list
                    cy.get('td').find('a').contains(data[i].show.receipt_number).click();
                    cy.get(':nth-child(5) > .property-value2').contains(data[i].show.total_amount)
                })
        
                //Validate Show Transaction
                cy.get('h3').contains('Show Transaction');
                cy.get('li').find('a').contains('Transaction Items');
                cy.get('li').find('a').contains('Transaction Return');
            })

        }
    });
})