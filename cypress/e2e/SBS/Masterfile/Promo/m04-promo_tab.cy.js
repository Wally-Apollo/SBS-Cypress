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
                // cy.get('td').find('a').contains(data[key]);
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

function login() {
    beforeEach(() => {
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password);
        })
        cy.get('[id^=submit]').click();

        cy.contains('Masterfile');
        cy.contains('Matrix');
        cy.contains('Inventory');
        cy.contains('Sales');
        cy.contains('Report');
        cy.contains('Misc');
        cy.contains('Sign out');
    })
}

context('Masterfile -> Promo', () => {
    login();

    it('TC01: S01 - S15', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('Promo'); 

        cy.fixture('masterfile/promo/search_promo_tab_data').then((data) => {
            searchSuccess(data[0]);
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