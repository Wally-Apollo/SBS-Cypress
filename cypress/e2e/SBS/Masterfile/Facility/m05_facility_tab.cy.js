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

const navigateAndPerformActions = (status) => {
    cy.get('[id^=facilityStatus]').select(status);
    cy.get('.btn').contains('Search').click();
    cy.get('tbody>tr').eq(0).find('a').eq(0).click();  
    cy.get('span').contains(status);
    cy.get('.btn').contains('<< Back to Facility List').click();
};

function validateFacilityModule(){
    //Validate user module content
    cy.get('h3').contains('Facility List');
    cy.get('label').contains('Facility Id');
    cy.get('label').contains('Facility Name');
    cy.get('label').contains('Global Location Number');
    cy.get('label').contains('Status');
    cy.get('label').contains('Facility Type');
    cy.get('.btn').contains('Search');
    cy.get('.btn').contains('Clear');
    cy.get('.sortable').contains('Facility Id');
    cy.get('.sortable').contains('GLN');
    cy.get('.sortable').contains('Facility Name');
    cy.get('.sortable').contains('Facility Type');
    cy.get('.sortable').contains('Updated By');
    cy.get('.sortable').contains('Last Updated');
}

context('M05 - Masterfile (Facility Tab)', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/RetailPlusStoreBackend/login/auth')
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

    it('TC01: S01', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click User from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();
    })

    it('TC01: S02 - S03', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Facility from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();
        
        cy.fixture('masterfile/facility/m05_facility_invalid_data.json').then((data) => {
            //Search Using Facility Id
            searchWithOneField('externalId',data.external_id);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click();

            //Search Using Facility Name
            searchWithOneField('groupName',data.group_name);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click();

            //Search Using GLN
            searchWithOneField('gln',data.gln);
            cy.get('.message').should('contain', 'Result not found.').wait(1000);
            cy.get('.btn').contains('Clear').click();

            // //Search Using Status
            // cy.get('[id^=facilityStatus]').select(data.facility_status);
            // cy.get('.btn').contains('Search').click();
            // cy.get('tbody>tr').eq(0).find('a').eq(0).click(); 
            // cy.get('span').contains(data.facility_status);
            // cy.get('.btn').contains('<< Back to Facility List').click();

            // //Search Using Facility Type
            // cy.get('[id^=autoFTParentList]').click().type('{downarrow}').type('{enter}');
            // cy.get('.btn').contains('Search').click();
            // for(let i = 0; i < 10; i ++){
            //     cy.get('tbody>tr').eq(i).find('a').eq(3).contains('Corporate');
            // }
        })
    })

    it('TC01: S05 - S07, S10 - S11', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');

        //Click Facility from menu list
        navigateToSubModule('Facility');

        //Validate that there will be no Error message displayed
        validateFacilityModule();
        
        cy.fixture('masterfile/facility/m05_facility_valid_data.json').then((data) => {
            //Search Using Facility Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').should('contain',data.external_id);
            cy.wait(1500);
            cy.get('.btn').contains('Clear').click();
            cy.wait(1500);
            //Search Using Facility Name
            searchWithOneField('groupName',data.group_name);
            cy.get('td').find('a').should('contain',data.group_name);
            cy.wait(1500);
            cy.get('.btn').contains('Clear').click();
            cy.wait(1500);
            //Search Using GLN
            searchWithOneField('gln',data.gln);
            cy.get('td').find('a').should('contain',data.gln);
            cy.wait(1500);
            cy.get('.btn').contains('Clear').click();
            cy.wait(1500);
            //Search Using Status
            cy.get('[id^=facilityStatus]').select(data.facility_status);
            cy.get('.btn').contains('Search').click();
            cy.wait(1500);
            cy.get('tbody>tr').eq(0).find('a').eq(0).click(); 
            cy.get('span').contains(data.facility_status);
            cy.get('.btn').contains('<< Back to Facility List').click();
            cy.wait(1500);
        })
    })


    it('TC01: S08', () => {
        navigateToModule('Masterfile');
        cy.wait(1000);
        navigateToSubModule('Facility');
        cy.wait(1000);
        validateFacilityModule();
        cy.wait(1000);
    
        const statuses = ['Closed', 'Active', 'Open', 'Inactive'];
        statuses.forEach(status => {
            navigateAndPerformActions(status);
        });
    });

    it('TC01: S09', () => {
        navigateToModule('Masterfile');
        cy.wait(1000);
        navigateToSubModule('Facility');
        cy.wait(1000);
        validateFacilityModule();
        cy.wait(1000);

        //Search Using Corporate facility Type
        cy.get('[id^=autoFTParentList]').click().type('{downarrow}').type('{enter}');
        cy.wait(1500);
        cy.get('.btn').contains('Search').click();
        for(let i = 0; i < 10; i ++){
            cy.get('tbody>tr').eq(i).find('a').eq(3).contains('Corporate');
        }
        cy.get('.btn').contains('Clear').click();
        cy.wait(2000);
        //Search Using Franchise facility Type
        cy.get('[id^=autoFTParentList]').click().type('{downarrow}').type('{downarrow}').type('{enter}');
        cy.wait(1500);
        cy.get('.btn').contains('Search').click();
        for(let i = 0; i < 10; i ++){
            cy.get('tbody>tr').eq(i).find('a').eq(3).contains('Franchise');
        }
        cy.wait(2000);
    });

    it('TC01: S10', () => {
        //Click Master file from the menu
        navigateToModule('Masterfile');
        cy.wait(1000);
        //Click Facility from menu list
        navigateToSubModule('Facility');
        cy.wait(1000);
        //Validate that there will be no Error message displayed
        validateFacilityModule();
        cy.wait(1000);
        cy.fixture('masterfile/facility/show_facility_data').then((data) => {
            //Select any facility from the list
            cy.get('td').find('a').contains(data.external_id).click();
        })
        cy.wait(1500);
        //Validate Show Facility
        cy.get('h3').contains('Show Facility');
        cy.wait(1500);
        cy.get('li').find('a').contains('Contact Info');
        cy.wait(1500);
    })

    it('TC01: S12', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');
        cy.wait(1000);
        //Click Facility from menu list
        navigateToSubModule('Facility');
        cy.wait(1000);
        //Validate that there will be no Error message displayed
        validateFacilityModule();
        cy.wait(1000);
        cy.fixture('masterfile/facility/search_facility_contact_info_data').then((data) => {
            //Search Using Facility Id
            searchWithOneField('externalId',data.external_id);
            cy.get('td').find('a').contains(data.external_id).click();
            cy.wait(1500);
            //Validate Show Facility
            cy.get('h3').contains('Show Facility');
            cy.wait(1500);
            cy.get('li').find('a').contains('Contact Info').click();
            cy.wait(1500);
            cy.get('[name="contactMechSearchCriteria"]').type(data.contact_mech_search_criteria);
            cy.wait(1500);
            cy.get('*[class^="search btn"]').click();
            cy.wait(1500);
            cy.get('td').find('a').contains(data.contact_mech_search_criteria);
            cy.wait(1500);
            cy.get('.navbar-text > a').click();
            cy.wait(500);
        })
    })


    it('TC01: S13', ()=> {
        //Click Master file from the menu
        navigateToModule('Masterfile');
        cy.wait(1000);
        //Click Facility from menu list
        navigateToSubModule('Facility');
        cy.wait(1000);
        //Validate that there will be no Error message displayed
        validateFacilityModule();
        cy.wait(1000);
        cy.get('.pagination > :nth-child(2)').click();
        cy.wait(1500);
        cy.get('.navbar-text > a').click();
        cy.wait(500);
    })
    
})