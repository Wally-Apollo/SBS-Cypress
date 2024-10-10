
//Common Functions
function navigateNavBar(navBarName, subNavBarName) {
    cy.get('[data-cy="left-drawer"]').trigger("mouseover");
  
    //dropdown
    cy.get('[data-cy="nav-links"]')
      .find("div")
      .contains(navBarName)
      .parent()
      .click();
  
    cy.get(
      `[data-cy="link-${subNavBarName.replace(/ /g, "-").toLowerCase()}"]`
    ).click();
  }
  function navigateToModule(module) {
    cy.get('[data-cy="left-drawer"]').trigger('mouseover').contains(module).click();
  }
  
  function navigateToSubModule(subModule) {
    cy.get('[data-cy="nav-links"]').contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[data-cy=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('[data-cy="search-btn"]').click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[data-cy=${fieldId}]`;
    cy.get(field).type(value);
    cy.get('[data-cy="search-btn"]').click();
  }
 
  function searchSuccess(data,  category = false) {
    const keys = Object.keys(data); 
    let check;
    keys.forEach(key => {
        if(data[key] != "") { 
            if(category) {
                searchWithCategory(key, data[key]);
            } else {
                searchWithOneField(key, data[key]);
            }


            cy.get('table tbody').then($tbody=>{
                check = $tbody.find('tr').length;
                cy.log(`Rows inside tbody ${check}`)
            }).then(()=>{
                cy.wrap(check).then(value=>{
                    if(value>0){
                        cy.get('[data-cy="store-disbursement-table"]').should('have.descendants', 'td');
                    }
                })
            })

            cy.get('[data-cy="clear-btn"').contains('Clear').click();
        }
    });
}

function searchClear(check = false) {
    cy.get('[data-cy="search-btn"]').contains('Search').click();
    if(check) {
        cy.get('[data-cy="store-disbursement-table"]').should('have.descendants', 'td');
    } 
    cy.get('[data-cy="clear-btn"]').contains('Clear').click();
}

function validateModule(){

    
    cy.get('[data-cy="title"]').contains('Disbursement List');
    cy.get('[data-cy="document-number-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="status-select"]').should('exist').should('be.visible');
   
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
 
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="store-disbursement-table"]').contains('Document ID');
    cy.get('[data-cy="store-disbursement-table"]').contains('Document Number');
    cy.get('[data-cy="store-disbursement-table"]').contains('Business Date');
    cy.get('[data-cy="store-disbursement-table"]').contains('Total Amount');
    cy.get('[data-cy="store-disbursement-table"]').contains('Status');
    cy.get('[data-cy="store-disbursement-table"]').contains('Date Created');
    
}

function login() {
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
            cy.visit(sbs_credentials.url)
            cy.contains('Username');
            cy.contains('Password');
           
            cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
                cy.visit(sbs_credentials.url);
               
                cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
                cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
                cy.get('[data-cy="button-login"]').click();
            })
        })
    })
}

context('Sales -> Claim Order List', () => {
    login()

    it('Validation of Claim Order List page', () => {
        //Click Sales from the menu
        navigateNavBar('Sales', 'store-disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        //Click Sales from the menu
       navigateNavBar('Sales', 'store-disbursement');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/store_disbursement/m22-sales-store_disbursement').then((data) => {
            searchSuccess(data[0])

            searchSuccess(data[1].data[0], false, true)
            searchSuccess(data[1].data[1], false, true)
            searchSuccess(data[1].data[2], false, true)
            

            cy.get('[data-cy="from-date-input"]').type('20210101')
            searchClear(data[1].wsSlipDateFrom);

            cy.get('[data-cy="to-date-input"]').type('20210101')
        
            searchClear(data[1].wsSlipDateFrom);

            // new disbursement
            cy.get('[data-cy="create-store-disbursement-btn"]').click();

          

          
        })
    })
})