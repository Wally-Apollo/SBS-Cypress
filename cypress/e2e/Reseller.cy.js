///<reference types="Cypress" />

context('M01 - User Logon and Search Merchant Module', () => {
  beforeEach(() => {
    cy.visit('https://vm2-test-dashpay.apollo.com.ph/login/auth');
  });

  it('TC01: S01 - S06 - Search Merchant and Filter by Date', () => {
    // Load credentials
    cy.fixture('sbs_credentials/valid_credentials.json').then((credentials) => {
      // Enter valid username
      cy.get('[id=username]', { timeout: 20000 }).should('be.visible').clear().type("qatest");
      cy.wait(1000);

      // Enter valid password
      cy.get('[id=password]').clear().type("ap0ll0");
      cy.wait(1000);

      // Click login button
      cy.get('.ui-button').click();
      cy.wait(3000);

      // Hover over the Reports module
      cy.get(':nth-child(2) > .accessible').trigger('mouseover');
      cy.wait(1000);

      // Click on the Search link using contains
      cy.contains('Search').should('be.visible').click({ force: true });
      cy.wait(2000);

      // Verify the URL to ensure correct navigation
      cy.url().should('include', '/reseller/search');

      const searchMerchants = [
        'ecpay3', 'Apollo', 'testCJReseller', 'CJ_Reseller', 'Cesar_reseller', 'PlentinaReseller', 'PentestReseller', 'autotest1',
        'a', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test_Cloud', 'Reseller_Achelle', 'iamnew', 'test', 'abcdefgh', 'test_create_reseller',
        'testing', 'WSGzrZ', 'test6', 'testtest', 'testtest1'
      ];

      // Function to get a random sample from an array
      function getRandomSample(arr, num) {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      }

      // Get 4 random merchants
      const randomMerchants = getRandomSample(searchMerchants, 4);

      randomMerchants.forEach((merchant) => {
        cy.get('#name').clear().type(merchant);
        cy.get('.search').click();
        cy.wait(2000); // Wait a bit longer for search results to load

        // Ensure results are visible before attempting to interact
        cy.get('.odd > :nth-child(1) > a').first().should('be.visible').click({ force: true });
        cy.wait(1000);

        // Ensure the back button is visible before clicking
        cy.get('.back').first().scrollIntoView().should('be.visible').click({ force: true });
        cy.wait(1000);
      });

      // Click on the 'Enabled' dropdown and select 'True'
      cy.get(':nth-child(2) > .value').click();
      cy.get('#enabled').select('Enabled');
      cy.wait(2000); 
      cy.get('.search').click();
      cy.wait(3000); 
      // Click on the appropriate element
      cy.get(':nth-child(4) > :nth-child(1) > a').first().scrollIntoView().should('be.visible').click({ force: true });
      cy.wait(3000);

      // Click the 'Back' button
      cy.get('.back').first().scrollIntoView().should('be.visible').click({ force: true });
      cy.wait(3000);

      // Click on the 'Disabled' option
      cy.get('#enabled').select('Disabled');
      cy.wait(3000); 
      cy.get('.search').click();
      cy.wait(3000); 
      // Click on the appropriate element
      cy.get('.odd > :nth-child(1) > a').first().scrollIntoView().should('be.visible').click({ force: true });
      cy.wait(3000);

      // Click the 'Back' button
      cy.get('.back').first().scrollIntoView().should('be.visible').click({ force: true });
      cy.wait(1000);

      // Log out
      cy.get('#loginInfo > a').first().scrollIntoView().should('be.visible').click();
    });
  });
});
