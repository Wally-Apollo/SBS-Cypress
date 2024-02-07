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

context('MATRIX', () => {
    beforeEach(() => {
        cy.visit('http://192.168.64.3:8080/RetailPlusStoreBackend/login/auth')
        cy.contains('Username');
        cy.contains('Password');
        cy.contains('Login');

        //Call Login data file
        cy.fixture('sbs_credentials/sbs_credentials.json').then((login_data) =>{
            cy.get('[id^=username]').type(login_data.username);
            cy.get('[id^=password]').type(login_data.password)
            cy.get('[id^=submit]').click()
            //Validate Home page
            cy.contains('Masterfile');
            cy.contains('Matrix');
            cy.contains('Inventory');
            cy.contains('Sales');
            cy.contains('Report');
            cy.contains('Misc');
            cy.contains('Sign out');
    })

    })
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

      it('Search Planogram', () => {
        //Click Matrix from the menu
        navigateToModule('Matrix');

        //Click Planogram from the menu list
        navigateToSubModule('Planogram'); 

        //Call data file
        cy.fixture('matrix/planogram_data/search_planogram_data').then((planogram_data) => {

        //Search Using Document Id
        searchWithOneField('f_documentId', planogram_data.document_id);
        cy.get('td').find('a').contains(planogram_data.document_id);
        cy.get('.btn').contains('Clear').click();

        //Search Using Status
        cy.get('[id^=f_status]').select(planogram_data.status)
        cy.get('tbody').find('a').contains(planogram_data.status);
        cy.get('.btn').contains('Clear').click();

        //Search using all field
        cy.get('[id^=f_documentId]').type(planogram_data.document_id);
        cy.get('[id^=f_status]').type(planogram_data.status);
        //Assert search result
        cy.get('td').find('a').contains(planogram_data.document_id);
        cy.get('td').find('a').contains(planogram_data.status);
        })

      })

      it('Validate Planogram Details',() => {
          //Click Matrix from the menu
        navigateToModule('Matrix');

        //Click Planogram from the menu list
        navigateToSubModule('Planogram'); 

        //Call data file
        cy.fixture('matrix/planogram_data/search_planogram_data').then((planogram_data) => {
        searchWithOneField('f_documentId', planogram_data.document_id);
        cy.get('td').find('a').contains(planogram_data.document_id).click()
      

        //Validate Planogram Details page

        //Validate Details
        cy.get('.property-label2').contains('Id:');
        cy.get('span[class="property-label2"]').contains('Document Id:');
        cy.get('.property-value2').contains(planogram_data.document_id);
        cy.get('.property-label2').contains('Reference Id:');
        cy.get('.property-label2').contains('Description:');
        cy.get('.property-label2').contains('Status:');
        cy.get('.property-value2').contains(planogram_data.status);
        cy.get('.property-label2').contains('Date Created:');
        cy.get('.property-label2').contains('Last Updated:');
        cy.get('.property-label2').contains('Updated By:');    
        
        //Validate Buttons
        cy.get('.pull-down').find('a').contains('Print')
        //Validate Tabs
        cy.get('.active').find('a').contains('Location')
        cy.get('.nav-tabs').find('a').contains('Product')    

        //Validate Search Field
        cy.get('fieldset').find('input[name="locationSearchCriteria"]').should('be.visible') //Location tab
        cy.get('.icon-search').should('be.visible')
        cy.get('.nav-tabs').find('a').contains('Product').click()
        cy.get('fieldset').find('input[name="planogramLocationSearchCriteria"]').should('be.visible') 
        cy.get('.icon-search').should('be.visible')

     })
      })

      it('Search Location',() => {
        //Click Matrix from the menu
         navigateToModule('Matrix');

         //Click Planogram from the menu list
         navigateToSubModule('Planogram'); 

         //Call data file
        cy.fixture('matrix/planogram_data/search_planogram_data').then((planogram_data) => {
        searchWithOneField('f_documentId', planogram_data.document_id);
        cy.get('td').find('a').contains(planogram_data.document_id).click();

         })

        cy.fixture('matrix/planogram_data/search_planogram_data').then((planogram_data) => {
        cy.get('fieldset').find('input[name="locationSearchCriteria"]').type(planogram_data.location_id)
        cy.get('.icon-search').click();

        //Validate Search result
        cy.get('tbody').find('a').contains(planogram_data.location_id)
        })

        })

        it('Search Product',() => {
            //Click Matrix from the menu
             navigateToModule('Matrix');
    
             //Click Planogram from the menu list
             navigateToSubModule('Planogram'); 
    
             //Call data file
            cy.fixture('matrix/planogram_data/search_planogram_data').then((planogram_data) => {
            searchWithOneField('f_documentId', planogram_data.document_id);
            cy.get('td').find('a').contains(planogram_data.document_id).click();
    
             

            cy.get('.nav-tabs').find('a').contains('Product').click()   
            cy.get('fieldset').find('input[name="planogramLocationSearchCriteria"]').type(planogram_data.product_id)
            cy.get('.icon-search').click();
            
            //Validate Search result
            cy.get('tbody').find('td').contains(planogram_data.product_id)
            cy.get('tbody').find('td').contains(planogram_data.product_name)

        })
    
            })
})

