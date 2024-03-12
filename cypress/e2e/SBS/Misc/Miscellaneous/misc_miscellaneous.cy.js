/// <reference types="cypress" />
import * as fs from 'fs';


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
    cy.get('h3').contains('Miscellaneous');
    cy.get('.btn').contains('Generate POS Database')
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

context('Misc -> Miscellaneous', () => {
    login()

    it('Validation of Miscellaneous page', () => {
        //Click Sales from the menu
        navigateToModule('Misc');

        //Click Report Generator from menu list
        navigateToSubModule('Miscellaneous');

        //Validate that there will be no Error message displayed
        validateModule();
    })    


    it('Generate POS DB', () => {
        navigateToModule('Misc');
        navigateToSubModule('Miscellaneous');

        cy.get('.btn').contains('Generate POS Database').click(); 
        // const posDataFolder = "C:\pos_db"
        // const fs = require('fs');
        // fs.readdirSync(posDataFolder).forEach(file =>{
        //     cy.log(file);
        // });
        
    })    

})