///<reference types="Cypress" />

context('M01 - User Logon and Search Merchant Module', () => {
  beforeEach(() => {
    cy.visit('https://vm2-test-dashpay.apollo.com.ph/login/auth');
  });

  it('TC01: S01 - S06 - Search Merchant', () => {
    // Load credentials
    cy.fixture('sbs_credentials/valid_credentials.json').then((credentials) => {
      // Login with valid credentials
      cy.get('[id=username]', { timeout: 20000 }).should('be.visible').clear().type('qatest');
      cy.get('[id=password]').clear().type('ap0ll0');
      cy.get('.ui-button').click();
      cy.wait(3000);

      // Hover over all menu items
      const menuItems = [
        '.jd_menu > :nth-child(1) > a',
        ':nth-child(2) > .accessible',
        ':nth-child(3) > .accessible',
        ':nth-child(4) > .accessible',
        ':nth-child(5) > .accessible',
        ':nth-child(6) > .accessible'
      ];

      menuItems.forEach((selector) => {
        cy.get(selector).trigger('mouseover');
        cy.wait(1000);
      });

      cy.get('#loginInfo > a').click();
      cy.wait(1000);

      // Test login with invalid credentials
      cy.get('[id=username]').clear().type('qatest');
      cy.get('[id=password]').clear().type('test');
      cy.get('.ui-button').click();
      cy.wait(1000);

      cy.get('[id=username]').clear().type('testtest');
      cy.get('[id=password]').clear().type('ap0ll0');
      cy.get('.ui-button').click();
      cy.wait(1000);

      // Login again with valid credentials
      cy.get('[id=username]').clear().type('qatest');
      cy.get('[id=password]').clear().type('ap0ll0');
      cy.get('.ui-button').click();
      cy.wait(1000);

      // Verify login by checking for a specific element on the post-login page
      cy.visit('https://vm2-test-dashpay.apollo.com.ph/merchant/search');
      cy.wait(1000);

      // Perform merchant searches
      const searchMerchants = ['gcash_test', 'Ensogo', 'Test Merchant'];
      searchMerchants.forEach((merchant) => {
        cy.get('#name').clear().type(merchant);
        cy.get('.search').click();
        cy.wait(2000); // Wait a bit longer for search results to load
        cy.get('table tbody tr', { timeout: 20000 }).should('contain', merchant);
        cy.get('tbody > :nth-child(1) > :nth-child(1) > a').click();
        cy.wait(1000);
        cy.get('.backButton').click();
        cy.wait(1000);
      });

      // Test dropdown selections and searches
      const dropdowns = [
        { selector: '#enabled', values: ['Disabled', 'Enabled', '-Select Status-'] },
        { selector: '#validateSevenPay', values: ['True', 'False', '-Select Validate-'] },
        { selector: '#featured', values: ['True', 'False', '-Select Featured-'] },
        { selector: '#stip', values: ['True', 'False', '-Select STIP-'] }
      ];

      dropdowns.forEach((dropdown) => {
        dropdown.values.forEach((value) => {
          cy.get(dropdown.selector).select(value);
          cy.wait(2000);
          cy.get('.search').click();
          cy.wait(2000);
        });
      });

      // Reset all fields
      cy.get('#name').type('gcash_test');
      cy.get('#merchantID').clear().type('7-Eleven');
      cy.get('#stip').select('True');
      cy.get('#featured').select('True');
      cy.get('#validateSevenPay').select('True');
      cy.get('#enabled').select('Disabled');
      cy.wait(2000);
      cy.get('.reset').click();
      cy.wait(2000);
    });

    cy.get('#loginInfo > a').click();
    cy.wait(1000);
  });
});
