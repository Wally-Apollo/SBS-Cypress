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

context('Misc -> Miscellaneous', () => {
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

    it('Validation of Miscellaneous page', () => {
        //Click Sales from the menu
        navigateToModule('Misc');

        //Click Report Generator from menu list
        navigateToSubModule('Miscellaneous');

        //Validate that there will be no Error message displayed
        validateModule();
    })    


    it('Generate POS DB', () => {
        //Click Sales from the menu
        navigateToModule('Misc');

        //Click Report Generator from menu list
        navigateToSubModule('Miscellaneous');

        //Validate that there will be no Error message displayed
        validateModule();

        // cy.get('.btn').contains('Generate POS Database').click();
        // cy.get('form').contains("Still generating Pos Database, please refresh the browser to see if it's finished.")
        // const dateTriggered = new Date();
        // cy.log("DATE TRIGGERED: " + dateTriggered);
        // var isGenerating = 1;
        // //wait for 15 mins or more
        // for(let i = 0; i < 10; i++){
        //     cy.wait(60000);
        //     cy.reload();
        //     // cy.get('form').then($input =>{
        //     //     var inputText = $input.text();
        //     //     cy.log("INPUT TEXT: " + inputText);
        //     //     if(inputText === ""){
        //     //         cy.log("TRUE!");
        //     //     }else{
        //     //         cy.log("FALSE");
        //     //     }
        //     // })
        // }
        //validate the directory if the 29 files are generated and >= the datetime the generation was triggered.
        const posDataFolder = "C:\pos_db"
        const fs = require('fs');
        fs.readdirSync(posDataFolder).forEach(file =>{
            cy.log(file);
        });

    })    

})