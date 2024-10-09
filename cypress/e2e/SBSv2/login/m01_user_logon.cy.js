

context('M01 - User Logon', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081/#/');
  });
 
  it('TC01: S01 - S06', () => {
      cy.contains('Username');
      cy.contains('Password');
      

    // for invalid credentials
    cy.fixture('sbs_credentials/invalid_credentials.json').each((credentials) => {
      cy.get('[data-cy="input-username"]').clear().type(credentials.username);
      cy.wait(1000);
      cy.get('[data-cy="input-password"]').clear().type(credentials.password);
      cy.wait(1000);
      cy.get('[data-cy="button-login"]').click();
      cy.wait(1500);
      cy.get('.q-dialog__message').should('contain','Invalid username or password. Please try again.')
      cy.wait(1500);
      cy.contains('button', 'OK').click();
      cy.wait(1500);
    });

    //for valid credentials
   
      cy.get('[data-cy="input-username"]').clear().type('711001');
      cy.wait(1000);
      cy.get('[data-cy="input-password"]').clear().type('711001');
      cy.wait(1000);
      cy.get('[data-cy="button-login"]').click();
      cy.wait(1500);
      cy.get(':nth-child(2) > .q-expansion-item > .q-expansion-item__container > .q-item').click();
      cy.wait(1500);
      cy.contains('button', 'OK').click();
   
   

    // cy.fixture('sbs_credentials/valid_credentials.json').each((credentials) => {
    //   cy.get('[data-cy="input-username"]').clear().type(credentials.username);
    //   cy.wait(1000);
    //   cy.get('[data-cy="input-password"]').clear().type(credentials.password);
    //   cy.wait(1000);
    //   cy.get('[data-cy="button-login"]').click();
    //   cy.wait(1500);
    //   // cy.get('.navbar-text').should('contain',credentials.username).get('[href="/RetailPlusStoreBackend/logout/index"]').wait(1500).click();
    //   // cy.wait(1500);
    //   // cy.contains('Username');
    //   // cy.contains('Password');
    //   // cy.contains('Login');
    // });

  });
});