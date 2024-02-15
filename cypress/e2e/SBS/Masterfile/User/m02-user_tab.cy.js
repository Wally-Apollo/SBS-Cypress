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

function validateUserModule(){
    //Validate user module content
    cy.get('h3').contains('User List');
    cy.get('label').contains('User Id:');
    cy.get('label').contains('Username:');
    cy.get('label').contains('First Name:');
    cy.get('label').contains('Last Name:');
    cy.get('.btn').contains('Search');
    cy.get('.sortable').contains('User Id');
    cy.get('.sortable').contains('First Name');
    cy.get('.sortable').contains('Last Name');
    cy.get('.sortable').contains('Username');
    cy.get('.sortable').contains('Status');
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

context('Masterfile -> User', () => {
    login();

    it('Validation of User List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('User');

        //Validate that there will be no Error message displayed
        validateUserModule();
      })

    it('TC01: S01 - S05', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('User'); 

        cy.fixture('masterfile/user/m02-search_user_tab_data').then((data) => {
            searchSuccess(data[0]);
        });
    });

    it('TC01: S06 - S09', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('User'); 

        cy.fixture('masterfile/user/m02-search_user_tab_data').then((data) => {
            searchSuccess(data[1], true);
        });
    });

    it('TC01: S10 - S29', () => {
        navigateToModule('Masterfile');
        navigateToSubModule('User'); 

        cy.fixture('masterfile/user/m02-search_user_tab_data').then((data) => {
            cy.get('td').find('a').contains(data[2].externalId).click();

            // Go to Contact Info
            navigateToTableModule('Contact Info');
            navigateThenBack(data[2].data[0]);

            // Go to Facility User Role
            navigateToTableModule('Facility User Role');
            navigateThenBack(data[2].data[1]);

            // Go to Party Info
            navigateToTableModule('Party Info');
            navigateThenBack(data[2].data[2]);

            cy.get('.btn').contains('<< Back to').click(); 
        });
    });
})