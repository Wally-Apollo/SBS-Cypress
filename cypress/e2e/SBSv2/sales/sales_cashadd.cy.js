
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
                        cy.get('[data-cy="cash-add-table"]').should('have.descendants', 'td');
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
        cy.get('[data-cy="cash-add-table"]').should('have.descendants', 'td');
    } 
    cy.get('[data-cy="clear-btn"]').contains('Clear').click();
}

function validateModule(){

    
    cy.get('[data-cy="title"]').contains('Cash Add List');
    cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="pos-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="shift-select"]').should('exist').should('be.visible');
   
    cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
    cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
    
    cy.get('[data-cy="search-btn"]').contains('Search');
    cy.get('[data-cy="clear-btn"]').contains('Clear');
  
    
    cy.get('[data-cy="cash-add-table"]').contains('Business Date');
    cy.get('[data-cy="cash-add-table"]').contains('POS');
    cy.get('[data-cy="cash-add-table"]').contains('Shift');
    cy.get('[data-cy="cash-add-table"]').contains('Amount');
    
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

context('Sales -> Cash Add List', () => {
    login()

    it('Validation of Cash Add List page', () => {
        //Click Sales from the menu
        navigateNavBar('Sales', 'cash-add');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('Search Cash Add', ()=> {
        //Click Sales from the menu
       navigateNavBar('Sales', 'cash-add');

        //Validate that there will be no Error message displayed
    
        
     
            //Search Using Document No.
            cy.get('[data-cy="pos-input"]').type('REF001')
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

        

            
             //Search Using Status
             for(let i=1; i<11; i++) {
             cy.get('[data-cy="shift-select"]').click();
             cy.get('.q-menu .q-item').contains(i).click();
             cy.get('[data-cy="search-btn"]').contains('Search').click();
             cy.wait(2000)
             cy.get('[data-cy="clear-btn"]').contains('Clear').click();
            }
           
           
            //Search using date from
            cy.get('[data-cy="from-date-input"]').type('20210901');
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

            //Search using date to
            cy.get('[data-cy="to-date-input"]').type('20210901');
            cy.get('[data-cy="search-btn"]').contains('Search').click();
            cy.wait(2000)
            cy.get('[data-cy="clear-btn"]').contains('Clear').click();

       
    })
})