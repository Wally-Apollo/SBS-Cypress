/// <reference types="cypress" />

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

function validateModule(){
    cy.get('h3').contains('Report List');
    cy.get('th').contains('Audit Report');
    cy.get('th').contains('Inventory Report');
    cy.get('th').contains('Pos Report');
    cy.get('th').contains('Sales Report');
    cy.get('th').contains('Take-on Report');
}

function validateShowReport(report){
    cy.get('tr').find('td').contains(report).click();
    cy.get('h3').contains('Show Report');
    cy.get('.btn').contains('Back to Report List').click();     
}

context('Reports -> Report Generator', () => {
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

    it('Validation of Report List page', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Validation of Retail Book Inventory Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     
        
        cy.get('tr').find('td').contains('Retail Book Inventory').click();
        cy.get('h3').contains('Show Report');
        cy.get('.btn').contains('Back to Report List').click();     
    })

    it('Validation of TRR Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('TRR');  
    })

    it('Validation of Total Purchases Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Total Purchases Report');  
    })

    it('Validation of Tender Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Tender Report');  
    })

    it('Validation of SWS Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('SWS');  
    })
    it('Validation of Store Inventory Audit Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Store Inventory Audit');  
    })
    
    it('Validation of STD Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('STD');  
    })

    it('Validation of Shift Recap Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Shift Recap');  
    })

    it('Validation of Shelf Tags Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Shelf Tags');  
    })

    it('Validation of Shelf Tags - Price Change Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Shelf Tags - Price Change');  
    })

    it('Validation of Sales Report (formerly Cash Report)', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Sales Report (formerly Cash Report)');  
    })

    it('Validation of Rewards Redemption Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Rewards Redemption Report');  
    })

    it('Validation of Refunds Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Refunds Report');  
    })

    it('Validation of Product Movement Analysis Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Product Movement Analysis');  
    })

    it('Validation of Per Item Location Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Per Item Location Report');  
    })

    it('Validation of Per Item Location - Manual Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Per Item Location Report - Manual');  
    })

    it('Validation of Per Item Hit Rate Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Per Item Hit Rate Report');  
    })
    
    it('Validation of PCM Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('PCM');  
    })

    it('Validation of Ordering Tool Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Ordering Tool');  
    })

    it('Validation of OR Sales Monitor by Quantity Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('OR Sales Monitor by Quantity');  
    })

    it('Validation of OR Sales Monitor by Amount Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('OR Sales Monitor by Amount');  
    })

    it('Validation of On Hand Inventory Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('On Hand Inventory');  
    })

    it('Validation of NCI Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('NCI');  
    })

    it('Validation of Item Void Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Item Void');  
    })

    it('Validation of Inventory Log (formerly Receiving Log) Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Inventory Log (formerly Receiving Log)');  
    })

    it('Validation of In Stock Rate Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('In Stock Rate');  
    })

    it('Validation of Hourly Sales Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Hourly Sales');  
    })

    it('Validation of Hit Rate Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Hit Rate');  
    })

    it('Validation of Gondola Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('Gondola Report');  
    })

    it('Validation of GCI Report', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Refunds from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();     

        validateShowReport('GCI');  
    })

    
    


})