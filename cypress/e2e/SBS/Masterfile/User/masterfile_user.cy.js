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

context('Masterfile -> User', () => {
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

    it('Validation of User List page', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('User');

        //Validate that there will be no Error message displayed
        validateUserModule();
      })

      it('Search User', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('User'); 
        validateUserModule();

        cy.fixture('masterfile/user/search_user_data').then((data) => {
          
          //Search Using User Id
          searchWithOneField('externalId',data.external_id);
          cy.get('td').find('a').contains(data.external_id);
          cy.get('.btn').contains('Clear').click();
  
          //Search Using Username
          searchWithOneField('username',data.user_name);
          cy.get('td').find('a').contains(data.user_name);
          cy.get('.btn').contains('Clear').click();
  
          //Search Using Firstname
          searchWithOneField('firstName',data.first_name);
          cy.get('td').find('a').contains(data.first_name);
          cy.get('.btn').contains('Clear').click();
  
          //Search Using Last name
          searchWithOneField('lastName',data.last_name);
          cy.get('td').find('a').contains(data.last_name);
          cy.get('.btn').contains('Clear').click();
  
          //Search using all field
          cy.get('[id^=externalId]').type(data.external_id);
          cy.get('[id^=username]').type(data.user_name);
          cy.get('[id^=firstName]').type(data.first_name);
          cy.get('[id^=lastName]').type(data.last_name);
          cy.get('.btn').contains('Search').click();
  
          cy.get('td').find('a').contains(data.external_id);
          cy.get('td').find('a').contains(data.user_name);
          cy.get('td').find('a').contains(data.first_name);
          cy.get('td').find('a').contains(data.last_name);
        })
      })

      it('Validation of Show User page', () =>{
        
        //Click Master file from the menu
        navigateToModule('Masterfile');
        //Click User from menu list
        navigateToSubModule('User'); 
        //Validate that there will be no Error message displayed
        validateUserModule();

        //Select any user from the list
        cy.fixture('masterfile/user/show_user_page_data').then((data) => {
          cy.get('td').find('a').contains(data.external_id).click();
        })
        //Validate Show user
        cy.get('h3').contains('Show User');
        cy.get('li').find('a').contains('Facility User Role');
        cy.get('li').find('a').contains('Contact Info');
        cy.get('li').find('a').contains('Party Info');
      })

      it('Search Facility User Role', () =>{

        //Click Master file from the menu
        navigateToModule('Masterfile');
        //Click User from menu list
        navigateToSubModule('User'); 
        //Validate that there will be no Error message displayed
        validateUserModule();

        cy.fixture('masterfile/user/search_facility_user_role_data').then((data) => {
          //Select any user from the list
          cy.get('td').find('a').contains(data.external_id).click();

          //Validate Show user
          cy.get('h3').contains('Show User');
          cy.get('li').find('a').contains('Facility User Role').click();
          
          cy.get('[name="facilityUserRoleSearchCriteria"]').type(data.facility_user_role_criteria);
          cy.get('*[class^="search btn"]').click();
          cy.get('td').find('a').contains(data.facility_user_role_criteria);      
        })
      })

      it('Search Contact Info', () =>{

        //Click Master file from the menu
        navigateToModule('Masterfile');
        //Click User from menu list
        navigateToSubModule('User'); 
        //Validate that there will be no Error message displayed
        validateUserModule();

        cy.fixture('masterfile/user/search_contact_info_data').then((data) => {
          //Select any user from the list
          cy.get('td').find('a').contains(data.external_id).click();

          //Validate Show user
          cy.get('h3').contains('Show User');
          cy.get('li').find('a').contains('Contact Info').click();
          
          cy.get('[name="contactMechSearchCriteria"]').type(data.contact_mech_search_criteria);
          cy.get('*[class^="search btn"]').click();
          cy.get('td').find('a').contains('sad');        
        })
      })

      it('Search Party Info', () =>{

        //Click Master file from the menu
        navigateToModule('Masterfile');
        //Click User from menu list
        navigateToSubModule('User'); 
        //Validate that there will be no Error message displayed
        validateUserModule();

        cy.fixture('masterfile/user/search_party_info_data').then((data) => {
          //Select any user from the list
          cy.get('td').find('a').contains(data.external_id).click();

          //Validate Show user
          cy.get('h3').contains('Show User');
          cy.get('li').find('a').contains('Party Info').click();
          
          cy.get('[name="partyInfoSearchCriteria"]').type(data.party_info_search_criteria);
          cy.get('*[class^="search btn"]').click();
          cy.get('td').find('a').contains(data.party_info_search_criteria);
        })
      })
})