///<reference types="Cypress" />

context('M01 - User Logon and transactionpayment', () => {
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

      // Click on the Merchant Transaction for Matching link using contains
      cy.contains('Merchant Transaction for Matching').click({ force: true });
      cy.wait(2000);
      
      // Verify the URL to ensure correct navigation
      cy.url().should('include', '/report/merchantTransactionMatching');

      // Helper function to generate a random date within the specified range
      function getRandomDate(start, end) {
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      }

      // Generate random date range for filtering transactions
      const startDate = new Date(2018, 0, 1); // January 1, 2024
      const endDate = new Date(2018, 10, 31); // July 20, 2024

      // Loop to filter by random dates 3 times
      for (let i = 0; i < 3; i++) {
        // Generate random date range for filtering
        const fromDate = getRandomDate(startDate, endDate);
        const toDate = getRandomDate(new Date(fromDate), endDate);

        // Input the random date range for filtering
        cy.get('input[id="businessDateFrom"]').clear().type(fromDate);
        cy.get('input[id="businessDateTo"]').clear().type(toDate);

        // Perform search with the random date range
        cy.get('.search').click();
        cy.wait(2000); // Wait for search results to load
        // Assuming you still want to verify the presence of some element to confirm the search worked
        cy.get('table tbody tr', { timeout: 20000 }).should('have.length.at.least', 1);

        // Download report based on the filtered date
        // Adjust the nth-child selector as per the actual structure of your page
        cy.get(`:nth-child(${i+1}) > :nth-child(4) > form > span.download > .download`).click();
        cy.wait(1000);
      }

      const fromDate = getRandomDate(startDate, endDate);
      const toDate = getRandomDate(new Date(fromDate), endDate);
      

      // Input the random date range for filtering
      cy.get('input[id="dateCreatedFrom"]').clear().type(fromDate);
      cy.get('input[id="dateCreatedTo"]').clear().type(toDate);

      cy.get('.search').click();
        cy.wait(2000);
        cy.get('table tbody tr', { timeout: 20000 }).should('have.length.at.least', 1);

        // Download report based on the filtered date
        // Adjust the nth-child selector as per the actual structure of your page
        cy.get(`:nth-child(1) > :nth-child(4) > form > span.download > .download`).click();


        cy.get('#merchant').select('gcash_test');
        cy.wait(2000);
        cy.get('input[id="dateCreatedFrom"]').clear().type(fromDate);
        cy.wait(2000);
        cy.get('input[id="dateCreatedTo"]').clear().type(toDate);
        cy.wait(2000);
        cy.get('.reset').click();
        cy.wait(2000);

        cy.get('#merchant').select('gcash_test');
        cy.wait(2000);
        cy.get('.search').click();




      
    });
  });
});
