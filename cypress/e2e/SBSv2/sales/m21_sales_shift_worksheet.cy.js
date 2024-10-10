

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


function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

function validateShiftWorksheetModule(){
    cy.get('h3').contains('Shift Work Sheet List');
    cy.get('label').contains('Facility');
    cy.get('label').contains('Pos:');
    cy.get('label').contains('Shift:');
    cy.get('label').contains('Business Date From:');
    cy.get('label').contains('Business Date To:');
    cy.get('label').contains('Status:');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');

    cy.get('.sortable').contains('Business Date');
    cy.get('.sortable').contains('POS');
    cy.get('.sortable').contains('Shift');
    cy.get('.sortable').contains('Cashier');
    cy.get('.sortable').contains('Status');

    cy.get('[data-cy="title"]').contains('Shift Worksheet');
    cy.get('[data-cy="pos-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="erc-number-input"]').should('exist').should('be.visible');
   
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
 
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="shift-worksheet-table"]').contains('POS');
    cy.get('[data-cy="shift-worksheet-table"]').contains('Facility');
    cy.get('[data-cy="shift-worksheet-table"]').contains('ERC Number');
    cy.get('[data-cy="shfit-worksheet-table"]').contains('Total Amount');
    cy.get('[data-cy="order-table"]').contains('Claim Date');
    cy.get('[data-cy="order-table"]').contains('Date Created');
}

context('Sales -> Shift Worksheet', () => {
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

    it('Validation of Shift Worksheet List page', () => {
     navigateNavBar('Sales', 'Shift-Worksheet');

        //Validate that there will be no Error message displayed
        validateShiftWorksheetModule();
    })

    it('Search Shift Worksheet', ()=> {
       navigateNavBar('Sales', 'Shift-Worksheet');

        //Validate that there will be no Error message displayed
        validateShiftWorksheetModule();
        
        cy.fixture('sales/shift_worksheet/search_shift_worksheet_list_data').then((data) => {
            
            //Search Using POS Number
             cy.get('#autoPosTerminal').type(data.pos_number);
             cy.get('.btn').contains('Search').click();
             cy.wait(2000)
             cy.get('.btn').contains('Clear').click();

            //Search Using shift number
            cy.then(() => {
                for (let i = 1; i < 11; i++) {
                    cy.get('#shift').select(i);
                    cy.get('.btn').contains('Search').click();
                    cy.wait(2000)
                    cy.get('.btn').contains('Clear').click();
                }
              });

            //Search using date from
            cy.get('#businessDateFromSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search using date to
            cy.get('#businessDateToSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click()
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            //Search Using Status
            cy.get('[id^=f_status]').select('IN PROCESS');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();

            cy.get('[id^=f_status]').select('APPROVED');
            cy.get('.btn').contains('Search').click();
            cy.wait(2000)
            cy.get('.btn').contains('Clear').click();
        })
    })
})