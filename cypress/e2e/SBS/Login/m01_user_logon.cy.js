///<reference types = "Cypress" />


context('M01 - User Logon', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/RetailPlusStoreBackend/login/auth');
  });
 
  it('TC01: S01 - S06', () => {
      cy.contains('Username');
      cy.contains('Password');
      cy.contains('Login');

    // for invalid credentials
    cy.fixture('sbs_credentials/invalid_credentials.json').each((credentials) => {
      cy.get('[id^=username]').clear().type(credentials.username);
      cy.wait(1000);
      cy.get('[id^=password]').clear().type(credentials.password);
      cy.wait(1000);
      cy.get('[id^=submit]').click();
      cy.wait(1500);
      cy.get('.login_message').should('contain','Sorry, we were not able to find a user with that username and password.')
      cy.wait(1500);
    });

    //for valid credentials
    cy.fixture('sbs_credentials/valid_credentials.json').each((credentials) => {
      cy.get('[id^=username]').clear().type(credentials.username);
      cy.wait(1000);
      cy.get('[id^=password]').clear().type(credentials.password);
      cy.wait(1000);
      cy.get('[id^=submit]').click();
      cy.wait(1500);
      cy.get('.navbar-text').should('contain',credentials.username).get('[href="/RetailPlusStoreBackend/logout/index"]').wait(1500).click();
      cy.wait(1500);
      cy.contains('Username');
      cy.contains('Password');
      cy.contains('Login');
    });

  });
});