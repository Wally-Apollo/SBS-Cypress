///<reference types = "Cypress" />
import DatePickerPage from "../../support/pageObjects/DatePickerPage";

// cypress\support\pageObjects\DatePickerPage.js

function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

// function navigateToSubModule(subModule){
//     cy.get('li').contains(subModule).last().click();
// }

// function getDatePicker(){
//     cy.get('input#receiveDateFromSearch').click()
// }

// function getCalendar(){
//     cy.get('div#ui-datepicker-div')
// }

// function getBackButton(){
// cy.get('a.ui-datepicker-prev')
// }

// function getForwardButton(){
//     return cy.get('a.ui-datepicker-next') 
// }

// function getMonthName(){
//     cy.get('.ui-datepicker-year')
// }

// function getYearName(){
//     cy.get('.ui-datepicker-month') 
// }

// function getCalendarDays(){
//     cy.get('table.ui-datepicker-calendar a.ui-state-default')   
// }

describe('Test Date Picker', function() {
    var datePickerPage = new DatePickerPage();

    before(function() {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.visit(sbs_credentials.url)
          cy.get('[id^=username]').type(sbs_credentials.audit_username)
          cy.get('[id^=password]').type(sbs_credentials.audit_password)
          cy.get('[id^=submit]').click()
        })
    })

    it('test', function() {
        cy.fixture('sbs_credentials/date_data').then((date_data) => {
        navigateToModule('Inventory');
        navigateToSubModule('Receiving Advice')
        
        datePickerPage.getDatePicker();



        })
    })
})
