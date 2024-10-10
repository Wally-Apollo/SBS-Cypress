

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
    
    cy.get('.sortable').contains('Status');

    cy.get('[data-cy="title"]').contains('Shift Worksheet List');
    cy.get('[data-cy="pos-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="shift-select"]').should('exist').should('be.visible');
    cy.get('[data-cy="status-select"]').should('exist').should('be.visible');
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
 
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="shift-worksheet-table"]').contains('Business Date');
    cy.get('[data-cy="shift-worksheet-table"]').contains('POS');
    cy.get('[data-cy="shift-worksheet-table"]').contains('Shift');
    cy.get('[data-cy="shift-worksheet-table"]').contains('Cashier');
    cy.get('[data-cy="shift-worksheet-table"]').contains('Status');

}

context('Sales -> Shift Worksheet', () => {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
            cy.visit(sbs_credentials.url)
            cy.contains('Username');
            cy.contains('Password');
           
            cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
                cy.visit(sbs_credentials.url);
               
                cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
                cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
                cy.get('[data-cy="button-login"]').click();
            })
        })
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
             cy.get('[data-cy="pos-input"]').type(data.pos_number);
             cy.get('[data-cy="search-btn"]').contains('Search').click();
             cy.wait(2000)
             cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search Using shift number
            cy.then(() => {
                for (let i = 1; i < 11; i++) {
                    
                    cy.get('[data-cy="shift-select"]').click();
                    cy.get('.q-menu .q-item').contains(i).click();
                    cy.get('[data-cy="search-btn"]').contains('Search').click();
                    cy.wait(2000)
                    cy.get('[data-cy="clear-btn"]').contains('Clear').click();
       
                }
              });

            //Search using date from
            cy.get('[data-cy="from-date-input"]').type('20210901');
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search using date to
            cy.get('[data-cy="to-date-input"]').click()
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search Using Status
            cy.get('[data-cy="status-select"]').click();
            cy.get('.q-menu .q-item').contains('In Process').click();
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            cy.get('[data-cy="status-select"]').click();
            cy.get('.q-menu .q-item').contains('Approved').click();
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();
        })
    })
})