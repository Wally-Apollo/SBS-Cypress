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


function searchWithCategory(fieldId,value){
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get('.btn').contains('Search').click();
}

function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data); 
    keys.forEach(key => {
        if(data[key] != "") { 
            if(category) {
                searchWithCategory(key, data[key]);
            } else {
                searchWithOneField(key, data[key]);
            }
            if(check) {
                cy.get('table').should('have.descendants', 'td');
            } else {
                cy.get('.message').should('contain', 'Result not found.');
            }
            cy.get('.btn').contains('Clear').click();
        }
    });
}

function searchClear(check = false) {
    cy.get('.btn').contains('Search').click();
    if(check) {
        cy.get('table').should('have.descendants', 'td');
    } else {
        cy.get('.message').should('contain', 'Result not found.');
    }
    cy.get('.btn').contains('Clear').click();
}

function validateModule(){
    cy.get('h3').contains('Report List');
    cy.get('th').contains('Audit Report');
    cy.get('th').contains('Inventory Report');
    cy.get('th').contains('Pos Report');
    cy.get('th').contains('Sales Report');
    cy.get('th').contains('Take-on Report');
}

function validateShowReport(report){
    cy.get('tr').find('td').contains(report).click();
    cy.get('h3').contains('Show Report');
    cy.get('.btn').contains('Generate').click()
    // cy.get('.btn').contains('Back to Report List').click();     
}

function checkReportByDateOnly(report, check = true, dateId = "#AUDIT_DATE") {
    validateShowReport(report);  
    if(check) {
        cy.get(dateId).click()
        cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
    }
    printCancelBack()
}

function printCancelBack() {
    cy.get('.btn').contains('Print').click()
    cy.get('.btn').contains('Cancel').click()
    cy.get('.btn').contains('Back to Report List').click(); 
}

function login() {
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
}

context('Reports -> Report Generator', () => {
    login()

    it('Validation of Report List page', () => {
        //Click Sales from the menu
        navigateToModule('Report');

        //Click Report Generator from menu list
        navigateToSubModule('Report Generator');

        //Validate that there will be no Error message displayed
        validateModule();
    })

    it('TC01: S01 - S05', ()=> {
        navigateToModule('Report');
        navigateToSubModule('Report Generator');

        cy.fixture('reports/m28-report_generator').then((data) => {
            searchSuccess(data[0].rn[0])
            searchSuccess(data[0].rn[1], true)

            searchSuccess(data[0].data[0], true, true)
            searchSuccess(data[0].data[1], true, true)
            searchSuccess(data[0].data[2], true, true)
            searchSuccess(data[0].data[3], true, true)
            searchSuccess(data[0].data[4], true, true)
            searchSuccess(data[0].data[5], true, true)

            cy.get('.btn').contains('Clear').click();
            cy.get('.btn').contains('Search').click();

            // go to page 2 but theres no page 2

            validateShowReport('Per Item Location Report');  
            cy.get('#ID_LIST').type('1')
            printCancelBack()

            checkReportByDateOnly('Per Item Location Report - Manual');  

            validateShowReport('Store Inventory Audit Report');  
            cy.get('#50_OF_SALES').type(data[1].percent_of_sales)
            cy.get('#AUDIT_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#BEGINNING_SALES').type(data[1].beginning_sales)
            cy.get('#BM').type(data[1].bm)
            cy.get('#PT').type(data[1].pt)
            cy.get('#RL').type(data[1].rl)
            cy.get('#STS').type(data[1].sts)
            cy.get('#SU').type(data[1].su)
            printCancelBack()

            checkReportByDateOnly('In Stock Rate Report', true, '#COUNT_DATE')
            checkReportByDateOnly('Per Item Hit Rate Report')
            checkReportByDateOnly('On Hand Inventory Report', false)
            checkReportByDateOnly('Hit Rate Report', false)
            checkReportByDateOnly('Consolidated Audit Report')

            validateShowReport('Inventory Log (formerly Receiving Log)');  
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport('Shelf Tags');  
            cy.get('#CATEGORY_ID').type('10')
            cy.get('#DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            checkReportByDateOnly("Shelf Tags - Price Change", true, '#DATE')
            checkReportByDateOnly("Cycle Count Report", false)

            validateShowReport("Bad Merchandise Report")
            cy.get('#FROM_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#TO_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Total Purchases Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('.option').contains('A').click()
            printCancelBack()

            validateShowReport("Retail Book Inventory")
            cy.get('#listCategory').select(data[1].adjustment);
            cy.get('#AUDIT_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].count_per_audit);
            cy.get('#INVENTORY_AS_OF').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].merchandise);
            printCancelBack()

            validateShowReport("Product Movement Analysis")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Gondola Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            checkReportByDateOnly("Ordering Tool", true, '#ORDER_DATE')

            validateShowReport("DLV Monitoring - Created")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("DLV Monitoring - Completed")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("DTSD Monitoring - Created")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            checkReportByDateOnly("DTSD Monitoring - Completed", false)
            
            validateShowReport("OR Sales Monitor by Quantity")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("OR Sales Monitor by Amount")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("AR Sales Monitor - Per POS (ServiceSale)")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("AR Sales Monitor - Per Shift")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Hourly Sales")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Rewards Redemption Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("ABC Report by Quantity")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("ABC Report by Amount")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("CBA Report by Quantity")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("CBA Report by Amount")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#listCategory').select(data[1].listCategory);
            printCancelBack()

            validateShowReport("Consignment Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Product Sales Analysis")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()
            
            validateShowReport("City Blends Category Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            checkReportByDateOnly("CLiQQMas Report", false)
            printCancelBack()

            // checkReportByDateOnly("Sales Report (formerly Cash Report)")

            validateShowReport("Shift Report")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#POS').type(data[1].pos)
            printCancelBack()
            
            validateShowReport("Shift Recap")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Discount Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("MS Report")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Tender Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            checkReportByDateOnly("Beep Report", false)
            printCancelBack()

            validateShowReport("Cash Variation - Employee")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#EMPLOYEE_ID').type(data[1].pos)
            printCancelBack()

            validateShowReport("Cash Variation - Store")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Cash Drop Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Funds Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Cash Added Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Flash Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Refunds Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Cancelled Transaction Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("Item Void Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CLiQQ Wallet Report")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("GCash E-Payment Report")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CLiQQ Wallet History")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("E-Payment Report")
            cy.get('#DATE_FROM').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#DATE_TO').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            checkReportByDateOnly("Gross Sales with  711 Product", false)
            checkReportByDateOnly("Ending Sales Update", false)
            checkReportByDateOnly("Ending Sales Update (For No  711 Amount)", false)
            checkReportByDateOnly("AR Sales with  711 Product", false)
            
            validateShowReport("Ending AR Sales Update")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            cy.get('#POS_ID').type(data[1].pos)
            cy.get('#SHIFT').type(data[1].pos)
            printCancelBack()

            validateShowReport("STD")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("PCM")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("GCI")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("SWS")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CRD  1")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CRD  2")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CRD  3")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CRD")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("CLK")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("TRR")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()

            validateShowReport("NCI")
            cy.get('#BUSINESS_DATE').click()
            cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
            printCancelBack()
        })
    })
})