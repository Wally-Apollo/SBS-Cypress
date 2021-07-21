/// <reference types="cypress" />
import 'cypress-file-upload';

//Common Functions
function navigateToModule(module){
    cy.get('ul').contains(module).click();
}

function navigateToSubModule(subModule){
    cy.get('li').contains(subModule).click();
}

function navigateToSubModule2(subModule2){
    cy.get('li').contains(subModule2).last().click();
}

function searchWithOneField(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('.btn').contains('Search').click();
}

context('AUDIT COUNT', () => {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.visit(sbs_credentials.url)
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
          cy.get('[id^=username]').type(sbs_credentials.audit_username)
          cy.get('[id^=password]').type(sbs_credentials.audit_password)
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

    it('Validation of Audit Count List page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Order from the submenu
        navigateToSubModule('Audit Count')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Audit Count List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Document Id')
          .and('contain', 'Facility')
          .and('contain', 'Status')
          .and('contain', 'Date Counted From')
          .and('contain', 'Date Counted To');

        //Fields
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')

        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.nav-buttons').find('a').should('contain', 'Download DAT Files')
          .and('contain', 'Upload Item Count')

        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
          .and('contain', 'Count Date') 
          .and('contain', 'Status')
      })  

      it('Upload Audit Count File', ()=> { 

        cy.fixture('inventory/audit_count_data/audit_count_data').then((audit_count_data) => {        
          //Click Inventory file from the menu
          navigateToModule('Inventory')
          //Click Order from the submenu
          navigateToSubModule('Audit Count')

          //Validate that there will be no Error message displayed
          cy.get('h3').contains('Audit Count List');

          //Upload Audit File
          cy.get('.pull-right').find('a').contains('Upload Item Count').click(); //Click Upload Item Count button
          const auditFile = 'inventory/audit_count_data/audit_count_file.txt'
          cy.get('#myFile').attachFile(auditFile)
          cy.get('#submitFileBtn').click().wait(2000)

          //Validate Successful upload of audit count file
          cy.reload().get('.popoutDiv').find('.alert1').should('to.include.text', 'Item Count successfully uploaded');

            cy.get('.even').find('a').eq(0).then($documentId => {
              const documentIdValue = $documentId.text()
              cy.log(documentIdValue)
            
              cy.get('.even').find('a').eq(2).contains(audit_count_data.new_status)
          })
        })
       })

       it('Search Audit Count', () => {

          navigateToModule('Inventory')
          //Click Order from the submenu
          navigateToSubModule('Audit Count')

          //Validate that there will be no Error message displayed
          cy.get('h3').contains('Audit Count List');
          cy.fixture('inventory/audit_count_data/audit_count_data').then((audit_count_data) => {
          cy.get('#documentId').type(audit_count_data.document_id)

          //Click Search Button
          cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click()

          //Validate Search Result
          cy.get('.even').find('a').should('contain', audit_count_data.document_id)
            .and('contain', audit_count_data.document_id)
        })
       })

       it('Validation of Show Audit Count Page', () => {
        navigateToModule('Inventory')
        //Click Order from the submenu
        navigateToSubModule('Audit Count')

        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Audit Count List');
        cy.fixture('inventory/audit_count_data/audit_count_data').then((audit_count_data) => {
          cy.get('#documentId').type(audit_count_data.document_id)
          cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').click()
          cy.get('tbody').find('a').contains(audit_count_data.document_id).click()
          
          //Validate Show Audit Count page
          cy.get('h3').contains('Show Audit Count');
          //Labels
          cy.get('.sbsdiv2').find('.property-label2').should('contain', 'Id:')
            .and('contain', 'Facility:')
            .and('contain', 'Count Date:')
            .and('contain', 'Status:')
            .and('contain', 'Active SKU:')
            .and('contain', 'Carried SKU:')
            .and('contain', 'Date Created:')
            .and('contain', 'Created By:')
            .and('contain', 'Last Updated:')
            .and('contain', 'Updated By:')
            .and('contain', 'Total Retail Price:')
          cy.get('.active').find('a').contains('Audit Count Item')
          cy.get('h5').contains('Audit Count Item')
          //Labels under tab
          cy.get('.roTdPadding').find('b').should('contain', 'Type Location Code:')
            .and('contain', 'Type Sequence ID:')
            .and('contain', 'Total Retail:')
            .and('contain', 'Items Counted')
          //Fields
          cy.get('.roTdPadding').find('input[name="locationSelection"]').should('be.visible')
          cy.get('.roTdPadding').find('input[name="sequenceSelection"]').should('be.visible')
          //Table
          cy.get('thead').find('.sortable').should('contain', 'Cat ID')
            .and('contain', 'Location')
            .and('contain', 'Seq ID')
            .and('contain', 'Product')
            .and('contain', 'GTIN')
            .and('contain', 'Product Name')
            .and('contain', 'HT Count')
            .and('contain', 'SBS Count')
            .and('contain', 'Unit Retail')
            .and('contain', 'Auditor')
            .and('contain', 'Count Time')
          cy.get('thead').find('th').should('contain', 'Adjustment')
            .and('contain', 'Total Retail')
        })
       })

       it('Download DAT Files', () => {
          navigateToModule('Inventory')
          navigateToSubModule('Audit Count')

          //Click Download DAT Fies
          cy.get('.pull-right').find('a').contains('Download DAT Files').click();
          //Validate Successful message
          cy.get('.popoutDiv').find('.alert1').should('contain', 'DAT files successfully generated in C:/audit/download')


       })
      
})

