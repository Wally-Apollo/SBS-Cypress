// Common Functions
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
    
    function searchWithOneField(fieldId, value) {
      const field = `[data-cy=${fieldId}]`;
      cy.get(field).type(value);
      cy.get('[data-cy="search-btn"]').click();
    }
    
    function validateModule() {
      cy.get('[data-cy="title"]').contains('Module Validation List');
      cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
      cy.get('[data-cy="status-select"]').should('exist').should('be.visible');
      cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
      cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
      cy.get('[data-cy="search-btn"]').contains('Search');
      cy.get('[data-cy="clear-btn"]').contains('Clear');
    
      cy.get('[data-cy="sales-table"]').contains('Business Date');
      cy.get('[data-cy="sales-table"]').contains('Prepared By');
      cy.get('[data-cy="sales-table"]').contains('Status');
    }
    
    context('Sales -> Module Validation', () => {
      beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
          cy.visit(sbs_credentials.url);
          cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
          cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
          cy.get('[data-cy="button-login"]').click();
        });
      });
    
      it('Validation of Module Validation List page', () => {
        // Click Sales from the menu
        navigateToModule('Sales');
    
        // Click Module Validation from menu list
        navigateToSubModule('Module Validation');
    
        // Validate that there will be no error message displayed
        validateModule();
      });
    
      it('Search Module Validation', () => {
        // Click Sales from the menu
        navigateToModule('Sales');
    
        // Click Module Validation from menu list
        navigateToSubModule('Module Validation');
    
        // Validate that there will be no error message displayed
        validateModule();
    
        cy.fixture('sales/service_sales/search_service_sales_list_data').then(() => {
          // Search Using Status
          cy.get('[data-cy="status-select"]').click();
          cy.get('.q-menu .q-item').contains('Created').click();
          cy.get('[data-cy="search-btn"]').click();
          cy.wait(2000);
          cy.get('[data-cy="clear-btn"]').click();
        });
    
        cy.fixture('sales/service_sales/search_service_sales_list_data').then(() => {
          // Search Using Status
          cy.get('[data-cy="status-select"]').click();
          cy.get('.q-menu .q-item').contains('Approved').click();
          cy.get('[data-cy="search-btn"]').click();
          cy.wait(2000);
          cy.get('[data-cy="clear-btn"]').click();
        });
    
        cy.fixture('sales/service_sales/search_service_sales_list_data').then(() => {
          // Search Using Status
          cy.get('[data-cy="status-select"]').click();
          cy.get('.q-menu .q-item').contains('Cancelled').click();
          cy.get('[data-cy="search-btn"]').click();
          cy.wait(2000);
          cy.get('[data-cy="clear-btn"]').click();
        });
    
        cy.fixture('sales/service_sales/search_service_sales_list_data').then(() => {
          // Search Using From Date
          cy.get('[data-cy="from-date-input"]').type('20240101');
          cy.wait(2000);
          cy.get('[data-cy="search-btn"]').click();
          cy.wait(2000);
          cy.get('[data-cy="clear-btn"]').click();
        });
    
        cy.fixture('sales/service_sales/search_service_sales_list_data').then(() => {
          // Search Using Thru Date
          cy.get('[data-cy="to-date-input"]').type('20240101');
          cy.wait(2000);
          cy.get('[data-cy="search-btn"]').click();
          cy.wait(2000);
          cy.get('[data-cy="clear-btn"]').click();
        });
      });
    
      it('Create purchase order', () => {
        // Click Sales from the menu
        navigateToModule('Sales');
    
        // Click Module Validation from menu list
        navigateToSubModule('Module Validation');
    
        // Validate that there will be no error message displayed
        validateModule();
    
        cy.get('[data-cy="create-module-btn"]').click();
        cy.get('[data-cy="business-date"]').type(20240101);
        cy.get('[data-cy="save-btn"]').click();
      });
    });
    