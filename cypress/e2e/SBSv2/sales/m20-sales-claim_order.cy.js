
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
                        cy.get('[data-cy="order-table"]').should('have.descendants', 'td');
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
        cy.get('[data-cy="events-table"]').should('have.descendants', 'td');
    } 
    cy.get('[data-cy="clear-btn"]').contains('Clear').click();
}

function validateModule(){

    
    cy.get('[data-cy="title"]').contains('Claim Order List');
    cy.get('[data-cy="document-id-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="erc-number-input"]').should('exist').should('be.visible');
 
   
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
 
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    cy.get('[data-cy="order-table"]').contains('Document ID');
    cy.get('[data-cy="order-table"]').contains('Buyer');
    cy.get('[data-cy="order-table"]').contains('Total Items');
    cy.get('[data-cy="order-table"]').contains('Total Amount');
    cy.get('[data-cy="order-table"]').contains('Claim Date');
    cy.get('[data-cy="order-table"]').contains('Date Created');
    
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
        navigateNavBar('Sales', 'Claim-Order');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        //Click Sales from the menu
       navigateNavBar('Sales', 'Claim Order');

        //Validate that there will be no Error message displayed
        validateModule();
        
        cy.fixture('sales/claim_order/m20-sales-claim_order.json').then((data) => {
            searchSuccess(data[0])

            cy.get('[data-cy="from-date-input"]').type('20210101');
            
            searchClear();

            cy.get('[data-cy="to-date-input"]').type('20210101');
            searchClear();
        })
    })
})