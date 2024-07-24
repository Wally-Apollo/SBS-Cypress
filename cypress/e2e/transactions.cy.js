///<reference types="Cypress" />

context('M01 - User Logon and Search Merchant Module', () => {
  beforeEach(() => {
    cy.visit('https://vm2-test-dashpay.apollo.com.ph/login/auth');
  });

  it('TC01: S01 - S06 - Search Merchant', () => {
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
      cy.wait(1000);

      // Hover over the Transactions module
      cy.get(':nth-child(4) > .accessible[href="/transaction/index"]').trigger('mouseover');
      cy.wait(1000); // Wait for the dropdown to be visible

      // Click on the Search Transactions link
      cy.get('li.accessible ul > li > a[href="/"]').click();
      cy.wait(2000);
      
      // Optionally, verify the URL (adjust the expected path based on your application)
      cy.url().should('include', 'https://vm2-test-dashpay.apollo.com.ph/');


      cy.get('#sevenPayID').click().type("2420-0000-0040");
      cy.wait(2000);

      cy.get(':nth-child(1) > .search').click(); 
      cy.wait(2000);
      cy.get('.odd > :nth-child(1) > a').click();
      cy.wait(2000);
      
      cy.get('.back').click({ force: true });
      cy.wait(2000);


      cy.get('#reseller', { timeout: 10000 }).select('Apollo');
      cy.get(':nth-child(1) > .search').click();
      cy.get('#reseller').select('-Select Reseller-'); 
      cy.wait(2000);
      {
      cy.get('#merchant').select('Xendit');
      cy.wait(2000); 
      cy.get('#clearDateCreatedFrom').click();
      cy.wait(2000);
     }
     cy.get(':nth-child(1) > .search').click();
     cy.get('#merchant').select('-Select Merchant-'); 


     {
      cy.get('#merchant').select('Xendit'); 
      cy.wait(2000);
      cy.get('#merchantReferenceNo').type('RAUTMAH2D2JE46'); 
      cy.wait(2000);
      cy.get('#clearDateCreatedFrom').click();
      cy.wait(2000);
     }
     cy.get(':nth-child(1) > .search').click();
     cy.get('.odd > :nth-child(1)').click();
     cy.wait(2000);
     cy.get('.back').click({ force: true });
     cy.wait(2000);


    
    {
     const fromDate = '07/01/2024'; // Replace with the desired from date
     const toDate = '07/5/2024';   // Replace with the desired to date

     cy.get('input[id="dateCreatedFrom"]').clear().type(fromDate);
     cy.get('input[id="dateCreatedTo"]').clear().type(toDate);
     
     cy.get('#paymentStatus').select('POSTED');

     cy.get(':nth-child(1) > .search').click();
     cy.wait(2000);
     
     cy.get('#paymentStatus').select('PAID');
     cy.wait(2000);
     cy.get(':nth-child(1) > .search').click();



     cy.get('#paymentStatus').select('POSTED');
     cy.get(':nth-child(2) > .search').click();
     cy.wait(2000);


    cy.get('.reset').click();
    }


    


    });
  });
});
