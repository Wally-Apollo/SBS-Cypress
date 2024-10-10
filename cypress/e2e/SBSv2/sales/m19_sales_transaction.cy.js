

//Common Functions
function navigateNavBar(navBarName, subNavBarName) {
    cy.get('[data-cy="left-drawer"]').trigger("mouseover");
  
    //dropdown
    cy.get('[data-cy="nav-links"]')
      .find("div")
      .contains(navBarName)
      .parent()
      .click();
  
    cy.get(
      `[data-cy="link-${subNavBarName.replace(/ /g, "-").toLowerCase()}"]`
    ).click();
  }
  function navigateToModule(module) {
    cy.get('[data-cy="left-drawer"]').trigger('mouseover').contains(module).click();
  }
  
  function navigateToSubModule(subModule) {
    cy.get('[data-cy="nav-links"]').contains(subModule).click();
  }
function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

function validateTransactionModule(){
    cy.get('[data-cy="title"]').contains('Transaction List');
    cy.get('[data-cy="receipt-number-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="pos-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="erc-number-input"]').should('exist').should('be.visible');
   
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
 
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="transaction-table"]').contains('Receipt #');
    cy.get('[data-cy="transaction-table"]').contains('POS');
    cy.get('[data-cy="transaction-table"]').contains('Shift');
    cy.get('[data-cy="transaction-table"]').contains('Total Amount');
    cy.get('[data-cy="transaction-table"]').contains('Date Ordered');
    cy.get('[data-cy="transaction-table"]').contains('Date Created');
    cy.get('[data-cy="transaction-table"]').contains('Status');
}

context('Sales -> Transactions', () => {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
            cy.visit(sbs_credentials.url);
            cy.contains('Username');
            cy.contains('Password');
            cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
            cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
            cy.get('[data-cy="button-login"]').click();
        })
       
    })

    it('Validation of Transaction List page', () => {
       navigateNavBar('Sales', 'Transaction');

        //Validate that there will be no Error message displayed
        validateTransactionModule();
    })
    
    it('Search Transaction', ()=> {
        navigateNavBar('Sales', 'Transaction');
        //Click Sales from the menu
       

        //Validate that there will be no Error message displayed
        validateTransactionModule();
        
        cy.fixture('sales/transactions/search_transaction_list_data').then((data) => {
            
            // //Search Using Receipt Number
            cy.get('[data-cy="receipt-number-input"]').type(data.receipt_number);
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search Using POS Number
            const posNumber = 'POS ' + data.pos_number;
            cy.get('[data-cy="pos-input"]').type(posNumber);
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search Using ERC Number
            cy.get('[data-cy="erc-number-input"]').type('1');
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search using date from
            cy.get('[data-cy="from-date-input"]').type('20210101');
            
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search using date to
            cy.get('[data-cy="to-date-input"]').type('20210101');
            
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search Using Status
            cy.get('[data-cy="status-select"]').click();
            cy.get('.q-menu .q-item').contains('Created').click();
            cy.get('[data-cy="search-btn"]').click();
            cy.wait(2000);
            cy.get('[data-cy="clear-btn"]').click();

            cy.get('[data-cy="status-select"]').click();
            cy.get('.q-menu .q-item').contains('Approved').click();
            cy.get('[data-cy="search-btn"]').click();
            cy.wait(2000);
            cy.get('[data-cy="clear-btn"]').click();

            cy.get('[data-cy="status-select"]').click();
            cy.get('.q-menu .q-item').contains('Cancelled').click();
            cy.get('[data-cy="search-btn"]').click();
            cy.wait(2000);
            cy.get('[data-cy="clear-btn"]').click();
        })
    })
})