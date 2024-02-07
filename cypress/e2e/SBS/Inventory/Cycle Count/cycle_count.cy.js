/// <reference types="cypress" />

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

function validateModule(){
    //Validate user module content
        //Validate that there will be no Error message displayed
        cy.get('h3').contains('Cycle Count List');
       
        //Labels
        cy.get('.sbs-label').should('contain', 'Facility')
          .and('contain', 'Document Id')
          .and('contain', 'Type')
          .and('contain', 'Date Counted From')
          .and('contain', 'Date Counted To')
          .and('contain', 'Status')

        //Fields
        cy.get('input[id="facility"]').should('be.visible')
        cy.get('input[id="documentId"]').should('be.visible')
        cy.get('select[name^="f_type"]').should('be.visible')
        cy.get('input[id="countDateFromSearch"]').should('be.visible')
        cy.get('input[id="countDateToSearch"]').should('be.visible')
        cy.get('[id^=f_status]').should('be.visible')


        //Buttons
        cy.get('.sbs-searchbtn-alignment').find('input[name="_action_list"]').should('be.visible') //Search button
        cy.get('.sbs-searchbtn-alignment').find('a').should('contain', 'Clear') //Clear Button
        cy.get('.pull-right').contains('New Cycle Count Variance')
        cy.get('.pull-right').contains('New Cycle Count')


        //Table
        cy.get('.sortable').find('a').should('contain', 'Document Id')
          .and('contain', 'Count Date')
          .and('contain', 'Type')
          .and('contain', 'Total Cost')
          .and('contain', 'Total Retail Price')
          .and('contain', 'Status');
}


context('CYCLE COUNT', () => {
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

    it('Validation of Cycle Count page', () => {
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();
      })
      
      it('Search Cycle Count', () =>{
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();
        
        cy.fixture('inventory/cycle_count/search_cycle_count_data').then((data) => {
            
            //Search Using Document Id
            searchWithOneField('documentId',data.document_id);
            cy.get('td').find('a').contains(data.document_id);
            cy.get('.btn').contains('Clear').click();

            //Search Using Type
            cy.get('[name="f_type"]').select(data.type);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(2).contains(data.type);
                }
            })

            //Search Using Status
            cy.get('[id^=f_status]').select(data.status);
            cy.get('.btn').contains('Search').click();
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(5).contains(data.status);
                }
            })
        })

      })

      it('Validation of Show Cycle Count page', ()=>{
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();


        cy.fixture('inventory/cycle_count/show_cycle_count_data').then((data) => {
            
          //Search Using Document Id
          searchWithOneField('documentId',data.document_id);
          cy.get('td').find('a').contains(data.document_id).click();

          cy.get('h3').contains('Show Cycle Count');

          //Labels
          cy.get('.property-label2').should('contain', 'Document Id:')
            .and('contain', 'Reference ID:')
            .and('contain', 'Count Date:')
            .and('contain', 'Status:')
            .and('contain', 'Type:')
          
          cy.get('li').find('a').contains('Cycle Count Item');
        })

      })

      it('Search Cycle Count Item', () => {

        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();


        cy.fixture('inventory/cycle_count/search_cycle_count_item_data').then((data) => {
            
          //Search Using Document Id
          searchWithOneField('documentId',data.document_id);
          cy.get('td').find('a').contains(data.document_id).click();

          cy.get('h3').contains('Show Cycle Count');

          //Labels
          cy.get('.property-label2').should('contain', 'Document Id:')
            .and('contain', 'Reference ID:')
            .and('contain', 'Count Date:')
            .and('contain', 'Status:')
            .and('contain', 'Type:')
          
          cy.get('li').find('a').contains('Cycle Count Item');

          cy.get('[name="cycleCountItemSearchCriteria"]').type(data.product_id);
          cy.get('*[class^="search btn"]').click();
          cy.get('td').contains(data.product_id);
        })


      })

      it('Search Cycle Count Category', () =>{

        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();


        cy.fixture('inventory/cycle_count/search_cycle_count_category_data').then((data) => {
            
          //Search Using Document Id
          searchWithOneField('documentId',data.document_id);
          cy.get('td').find('a').contains(data.document_id).click();

          cy.get('h3').contains('Show Cycle Count');

          //Labels
          cy.get('.property-label2').should('contain', 'Document Id:')
            .and('contain', 'Reference ID:')
            .and('contain', 'Count Date:')
            .and('contain', 'Status:')
            .and('contain', 'Type:')
          
          cy.get('li').find('a').contains('Cycle Count Item');

          //Search Using Status
          cy.get('[id^=categorySelection]').eq(0).select(data.category);
          cy.get('tbody').find("tr").then((row) =>{
              for(let i = 0; i< row.length; i++){
                  cy.get('tbody>tr').eq(i).should('be.visible');
              }
          })
        })


      })

      it('Create Cycle Count',() =>{
        
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();

        cy.get('.btn').contains('New Cycle Count').click();

        cy.get('h3').contains('Create Cycle Count');

        cy.get('[name="countDate"]').click();

        cy.fixture('inventory/cycle_count/create_cycle_count_data').then((data) => {
          cy.get('td').find('a').contains(data.date).click();

          cy.get('.btn').contains('Save').click();

          cy.get('span').contains('Cycle Count created');
        })
      })

      it('Create Cycle Count Variance',() =>{
        
        //Click Inventory file from the menu
        navigateToModule('Inventory');
        //Click Cycle Count from the submenu
        navigateToSubModule('Cycle Count')

        validateModule();

        cy.get('.btn').contains('New Cycle Count Variance').click();

        cy.get('h3').contains('Create Cycle Count Variance');

        cy.get('[name="countDate"]').click();

        cy.fixture('inventory/cycle_count/create_cycle_count_data').then((data) => {
          cy.get('td').find('a').contains(data.date).click();

          cy.get('.btn').contains('Save').click();

          cy.get('span').contains('Cycle Count created');
        })
      })
      
})