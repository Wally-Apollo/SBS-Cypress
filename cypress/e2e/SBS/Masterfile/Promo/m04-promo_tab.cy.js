/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function navigateToTableModule(tableName) {
    cy.get('h3').contains('Show User');
    cy.get('li').find('a').contains(tableName).click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

function searchSuccess(data, check = false) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") { 
            searchWithOneField(key, data[key]);
            if(check) {
                cy.get('table').should('have.descendants', 'td');
            } else {
                cy.get('.message').should('contain', 'Result not found.');
            }
            cy.get('.btn').contains('Clear').click();
        }
    });
}

function navigateThenBack(data) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") {
            cy.get('td').find('a').contains(data[key]).click(); 
            cy.get('.btn').contains('<< Back to').click(); 
        }
    });
}

function validatePromoModule(){
    //Validate user module content
    cy.get('h3').contains('Promo List');
    cy.get('label').contains('Promo ID');
    cy.get('label').contains('Promo Name');
    cy.get('label').contains('Non Cash Master Code');
    cy.get('label').contains('Non Cash Code');
    cy.get('.btn').contains('Search');


    cy.get('.sortable').contains('Promo Id');
    cy.get('.sortable').contains('Promo Name');
    cy.get('.sortable').contains('Description');
    cy.get('.sortable').contains('Limit Per Customer');
    cy.get('.sortable').contains('Updated By');
    cy.get('.sortable').contains('Last Updated');
}

function login() {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
            cy.visit(sbs_credentials.url)
            cy.contains('Username');
            cy.contains('Password');
            cy.contains('Login');
            cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
                cy.get('[id^=username]').type(sbs_credentials.username)
                cy.get('[id^=password]').type(sbs_credentials.password)
                cy.get('[id^=submit]').click()

                cy.contains('Masterfile');
                cy.contains('Matrix');
                cy.contains('Inventory');
                cy.contains('Sales');
                cy.contains('Report');
                cy.contains('Misc');
                cy.contains('Sign out');
            })
        })
    })
}

context('Masterfile -> Promo', () => {
    login();

    it('Validation of Promo List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Promo from menu list
        navigateToSubModule('Promo');

        //Validate that there will be no Error message displayed
        validatePromoModule();
      })

    it('TC01: S01 - S05', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('Promo'); 

        cy.fixture('masterfile/promo/m04-search_promo_tab_data').then((data) => {
            searchSuccess(data[0]);
        });
    });

    it('TC01: S05 - S15', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('Promo'); 

        cy.fixture('masterfile/promo/m04-search_promo_tab_data').then((data) => {
            searchSuccess(data[1], true);

            cy.get('td').find('a').contains(data[2].id).click();
            cy.get('.btn').contains('<< Back to').click(); 

            cy.get('td').find('a').contains(data[2].promoName).click(); 
            cy.get('.btn').contains('<< Back to').click(); 
            
            cy.get('td').find('a').contains(data[2].description).click();
            cy.get('td').find('a').contains(data[2].facility).click(); 

        });

        navigateToModule('Masterfile');
        navigateToSubModule('Promo'); 
        
        cy.get('.pagination > :nth-child(2)').click()
    });
})