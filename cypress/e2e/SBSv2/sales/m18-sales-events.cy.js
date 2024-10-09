
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
    
    function searchWithCategory(fieldId,value){
        const field = `[id^=${fieldId}]`;
        cy.get(field).select(value);
        cy.get('.btn').contains('Search').click();
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
                            cy.get('table').should('have.descendants', 'td');
                        }else{
                            cy.get('.message').should('contain', 'Result not found.');
                        }
                    })
                })
    
                cy.get('.btn').contains('Clear').click();
            }
        });
    }
    
    function searchClear() {
        let check;
        cy.get('.btn').contains('Search').click();
        cy.get('table tbody').then($tbody=>{
            check = $tbody.find('tr').length;
            cy.log(`Rows inside tbody ${check}`)
        }).then(()=>{
            cy.wrap(check).then(value=>{
                if(value>0){
                    cy.get('table').should('have.descendants', 'td');
                }else{
                    cy.get('.message').should('contain', 'Result not found.');
                }
            })
        })
    
    
       
     
        cy.get('.btn').contains('Clear').click();
    }
    
    function validateEventModule(){
        cy.get('h3').contains('Event List');
        cy.get('label').contains('Facility');
        cy.get('label').contains('Event Type');
        cy.get('label').contains('Pos :');
        cy.get('label').contains('Business Date From');
        cy.get('label').contains('Business Date To');
        cy.get('.btn').contains('Search');
        cy.get('.btn').contains('Clear');
    
        cy.get('.sortable').contains('Date Created');
        cy.get('.sortable').contains('Business Date');
        cy.get('.sortable').contains('Type');
        cy.get('.sortable').contains('POS');
        cy.get('.sortable').contains('Shift');
        cy.get('.sortable').contains('Receipt');
    }
    
    function performSearch() {
        cy.get(':nth-child(4) > .sbs-searchbtn-alignment > input.btn').click().wait(700);
    }
    
    
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
