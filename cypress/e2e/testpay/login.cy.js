///<reference types = "Cypress" />


context('M01 - User Logon', () => {
    beforeEach(() => {
      cy.visit('https://testpay.cliqq.net/login/auth');
    });
   
    it('TC01: S01 - S06', () => {
  
      //for valid credentials
      cy.fixture('sbs_credentials/valid_credentials.json').each((credentials) => {
        cy.get('[id^=username]').clear().type("qatest");
        cy.wait(1000);
        cy.get('[id^=password]').clear().type("ap0ll0");
        cy.wait(1000);
        cy.get('.ui-button').click();
        cy.visit("https://testpay.cliqq.net");
      });
  
    });
  });