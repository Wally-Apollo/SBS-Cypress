/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function navigateToTableModule(tableName) {
    cy.get('h3').contains('Show Planogram');
    cy.get('.nav-tabs').find('a').contains(tableName).click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

function searchWithCategory(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get('.btn').contains('Search').click();
}

function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") { 
            if(category) {
                searchWithCategory(key, data[key]);
            } else {
                searchWithOneField(key, data[key]);
            }
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

context('Matrix -> Planogram', () => {
    login();

    it('Validation of Planogram List page', () => {
        //Click Master file from the menu
        navigateToModule('Matrix');

        //Click Planogram from menu list
        navigateToSubModule('Planogram');

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Planogram List');
        cy.get('label').contains('Document ID');
        cy.get('label').contains('Reference Id');
        cy.get('label').contains('Status');
        cy.get('.sortable').contains('Document Id');
        cy.get('.sortable').contains('Reference Id');
        cy.get('.sortable').contains('Status');
      })

    it('TC01: S01 - S05', () => {
        navigateToModule('Matrix');
        navigateToSubModule('Planogram'); 

        cy.fixture('matrix/planogram_data/m06-search_planogram_tab_data').then((data) => {
            searchSuccess(data[0]); // incorrect
            searchSuccess(data[1], true); // correct
            searchSuccess(data[2], true, true); // correct, category

            searchSuccess(data[4].data[0], data[4].check[0].null, true);
            searchSuccess(data[4].data[1], data[4].check[1].null, true);
            searchSuccess(data[4].data[2], data[4].check[2].null, true);
            searchSuccess(data[4].data[3], data[4].check[3].null, true);
            searchSuccess(data[4].data[4], data[4].check[4].null, true);
            searchSuccess(data[4].data[5], data[4].check[5].null, true);

            searchWithOneField('f_documentId', data[1].f_documentId);
            cy.get('td').find('a').contains(data[1].f_documentId).click();

            cy.get('.btn').contains('Print').click(); 
        
            cy.get('td').find('a').contains(data[3].f_locationId).click();
            cy.get('.errors').should('contain', "Sorry, you're not authorized to view this page.");
        });
        
    });

    it('TC01: S06 - S08', () => {
        navigateToModule('Matrix');
        navigateToSubModule('Planogram'); 

        cy.fixture('matrix/planogram_data/m06-search_planogram_tab_data').then((data) => {
            navigateToModule('Matrix');
            navigateToSubModule('Planogram'); 
            searchWithOneField('f_documentId', data[1].f_documentId);
            cy.get('td').find('a').contains(data[1].f_documentId).click();
            cy.get('.pagination > :nth-child(2)').click()
                
            navigateToTableModule('Product');
            cy.get('.pagination > :nth-child(2)').click()

            cy.get('.btn').contains('<< Back to').click();
            cy.get('.pagination > :nth-child(2)').click() 
        });
    });
})