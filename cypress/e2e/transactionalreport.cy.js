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
      cy.get('.jd_menu > :nth-child(5)').trigger('mouseover');
      cy.wait(1000);

      // Click on the Merchant Transactional Report link using contains
      cy.contains('Merchant Transactional Report').click({ force: true });
      cy.wait(2000);
      
      // Verify the URL to ensure correct navigation
      cy.url().should('include', '/report/merchantTransactionalReport');

      // Additional check to ensure the correct page content
      cy.get('h1').should('contain', 'Merchant Transactional Report');

      // Helper function to generate a random date within the specified range
      function getRandomDate(start, end) {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }

      // Generate random date range for filtering transactions
      const startDate = new Date(2024, 0, 1); // January 1, 2024
      const endDate = new Date(2024, 6, 20); // July 20, 2024

      // List of merchants
      const searchMerchants = [
        'Munchpunch', 'Lazada', 'Zeus.ph', 'Tomato.ph', 'Zalora', 
        'dummyeload', 'k_ecpay', 'FastLoan', 'Xendit'
      ];

      // Loop to filter random merchants and dates 3 times
      for (let i = 0; i < 3; i++) {
        // Select a random merchant
        const randomMerchant = searchMerchants[Math.floor(Math.random() * searchMerchants.length)];

        // Generate random date range for filtering
        const fromDate = getRandomDate(startDate, endDate);
        const toDate = getRandomDate(new Date(fromDate), endDate);

        // Input the random date range for filtering
        cy.get('input[id="transactionDateFrom"]').clear().type(fromDate);
        cy.get('input[id="transactionDateTo"]').clear().type(toDate);

        // Perform merchant search with the random merchant and date range
        cy.get('#merchant').select(randomMerchant);
        cy.get('.search').click();
        cy.wait(2000); // Wait for search results to load
        cy.get('table tbody tr', { timeout: 20000 }).should('contain', randomMerchant);
        cy.get(':nth-child(1) > :nth-child(5) > form > span.download > .download').click();
        cy.wait(1000);
      }

      cy.get('#loginInfo > a').click();
    });
  });
});
