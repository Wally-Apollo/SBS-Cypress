// Common Functions
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
    cy.get('[data-cy="title"]').contains('Service Sales List');
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="sales-table"]').contains('Business Date');
    cy.get('[data-cy="sales-table"]').contains('Prepared By');
    cy.get('[data-cy="sales-table"]').contains('Status');
  }
  
  context('Sales -> Service Sales', () => {
    beforeEach(() => {
      cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
        cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
        cy.get('[data-cy="button-login"]').click();
      });
    });
  
    it('Validation of Service Sales List page', () => {
      // Click Sales from the menu
      navigateToModule('Sales');
  
      // Click Service Sales from menu list
      navigateToSubModule('Service Sales');
  
      // Validate that there will be no error message displayed
      validateModule();
    });
  
    it('Search service sales', () => {
      // Click Sales from the menu
      navigateToModule('Sales');
  
      // Click Service Sales from menu list
      navigateToSubModule('Service Sales');
  
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
  
      // Click Service Sales from menu list
      navigateToSubModule('Service Sales');
  
      // Validate that there will be no error message displayed
      validateModule();
  
      cy.get('[data-cy="create-service-sales-btn"]').click();
      cy.get('[data-cy="business-date"]').type(20240101);
      cy.get('[data-cy="save-btn"]').click();
    });
  });
  