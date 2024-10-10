
    function navigateToModule(module) {
        cy.get('[data-cy="left-drawer"]').trigger('mouseover').contains(module).click();
    }
    
    function navigateToSubModule(subModule) {
        cy.get('[data-cy="nav-links"]').contains(subModule).click();
    }
    
    function searchWithOneField(fieldId, value) {
        const field = `[data-cy=${fieldId}]`;
        cy.get(field).click();
        cy.get('.q-menu .q-item').contains(value).click();
        cy.get('[data-cy="search-btn"]').click();
    }
    function searchWithCategory(fieldId,value){
        const field = `[data-cy=${fieldId}]`;
        cy.get(field).click();
        cy.get('.q-menu .q-item').contains(value).click();
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
                            cy.get('[data-cy="events-table"]').should('have.descendants', 'td');
                        }else{cy.get('.q-table__bottom').should('contain', 'No data available');}
                    })
                })
    
                cy.get('[data-cy="clear-btn"').contains('Clear').click();
            }
        });
    }
    
    function searchClear() {
        let check;
        cy.get('clear-btn').contains('Search').click();
        cy.get('table tbody').then($tbody=>{
            check = $tbody.find('tr').length;
            cy.log(`Rows inside tbody ${check}`)
        }).then(()=>{
            cy.wrap(check).then(value=>{
                if(value>0){
                    cy.get('events-table').should('have.descendants', 'td');
                }else{
                    cy.get('events-table').should('contain', 'No data available');
                }
            })
        })
    
    
       
     
        cy.get('.btn').contains('Clear').click();
    }
    
    function validateEventModule(){
        cy.get('[data-cy="title"]').contains('Event List');
        cy.get('[data-cy="facility-input"]').should('exist').should('be.visible');
        cy.get('[data-cy="event-select"]').should('exist').should('be.visible');
        cy.get('[data-cy="pos-input"]').should('exist').should('be.visible');
        cy.get('[data-cy="from-date-input"]').should('exist').should('be.visible');
        cy.get('[data-cy="to-date-input"]').should('exist').should('be.visible');
        cy.get('[data-cy="search-btn"]').contains('Search');
        cy.get('[data-cy="clear-btn"]').contains('Clear');

        cy.get('[data-cy="event-table"]').contains('Date Created');
        cy.get('[data-cy="event-table"]').contains('Business Date');
        cy.get('[data-cy="event-table"]').contains('Type'); 
        cy.get('[data-cy="event-table"]').contains('POS');
        cy.get('[data-cy="event-table"]').contains('Shift');
        cy.get('[data-cy="event-table"]').contains('Receipt'); 
        cy.get('[data-cy="event-table"]').contains('Description'); 
    
    }
    
    function performSearch() {
        cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click().wait(700);
    }
    
    
    beforeEach(() => {
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.visit(sbs_credentials.url)
        cy.contains('Username');
        cy.contains('Password');
       
        cy.fixture('sbs_credentials/sbs_credentials').then((sbs_credentials) => {
        cy.get('[data-cy="input-username"]').type(sbs_credentials.username);
        cy.get('[data-cy="input-password"]').type(sbs_credentials.password);
        cy.get('[data-cy="button-login"]').click();
    
       
        
        })
      })
    })
    it('Validation of Event List page', () => {
        //Click Sales from the menu
        navigateToModule('Sales');
    
        //Click Transactions from menu list
        navigateToSubModule('Events');
    
        //Validate that there will be no Error message displayed
        validateEventModule();
    })
    
    it('TC01: S01 - S05', ()=> {
    
    
         //Click Sales from the menu
         navigateToModule('Sales');
    
        //Click Transactions from menu list
        navigateToSubModule('Events');
    
        cy.fixture('sales/events/m18-sales-events').then((data) => {
            for (let i =  0; i <  data[0].eventType.length; i++) {
                searchSuccess(data[0].eventType[i], true);
            }
            
            cy.get('#autoPosTerminal').type("1")
            searchClear();
    
            cy.get('#fromDateSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();
    
            cy.get('#thruDateSearch').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            searchClear();
        })
    })
    
    it('TC02: S01 - S03', ()=> {
         //Click Sales from the menu
         navigateToModule('Sales');
    
        //Click Transactions from menu list
        navigateToSubModule('Events');
        
    
    
        //SO1
            cy.get('#f_type').within(()=>{
            cy.get('[value="Sale"]').should("exist")
            })
            cy.wait(700);
    
            searchWithCategory('f_type', 'Sale');
            cy.wait(700);
    
            searchWithOneField('autoPosTerminal', '1');
            cy.wait(700);
            cy.get('tbody').find("tr").then((row) =>{
                for(let i = 0; i< row.length; i++){
                    cy.get('tbody>tr').eq(i).find('a').eq(3).contains('POS 1');
                }
            })
    
            cy.get('#fromDateSearch').click();
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            performSearch();
            
            cy.get('#thruDateSearch').click();
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            performSearch();
           
        //SO2
            cy.wait(700);
            cy.get('[name="_action_downloadAll"]').click();
        //SO3
            cy.wait(700);
            cy.get('[name="_action_printAll"]').click();
            cy.get('.sbs-button').contains('Clear').click();
    })
    
    it('TC03: S04 - S06', () => {
    
    
         //Click Sales from the menu
         navigateToModule('Sales');
    
        //Click Transactions from menu list
        navigateToSubModule('Events');
     cy.fixture('sales/events/search_event_list_data').then((data)=>{
    
    //Check PrinzReport Exist
    cy.get('#f_type').within(()=>{
      cy.get('[value="PrintZReport"]').should("exist")
    })
    cy.wait(700) 
    
    //Select PrintZReport Option
    cy.get('#f_type').select('PrintZReport')
    cy.wait(700) 
    
    //Click Search
    cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click()
    cy.wait(700) 
    
    //Input POS
    cy.get('#autoPosTerminal').type(data.pos_number)
    cy.wait(700) 
    
    
     //Click Search
    cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click()
    cy.wait(700) 
    
    //input date from
    cy.get('#fromDateSearch').invoke('removeAttr', 'readonly').type(data.businessDateFrom);
    cy.wait(700) 
    
    //Click Search
    cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click()
    cy.wait(700) 
    
    //input date to
    cy.get('#thruDateSearch').invoke('removeAttr', 'readonly').type(data.businessDateTo);
    cy.wait(700) 
    
    //Click Search
    cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click()
    cy.wait(700) 
    
    })
    
    //Click Download All
    cy.wait(700)
    cy.get('[name="_action_downloadAll"]').click()
    
    
    //Click Print All
    cy.wait(700)
    cy.get('[name="_action_printAll"]').click()
    cy.get('.sbs-button').contains('Clear').click();
    cy.get('.navbar-text > a').click();
    })
