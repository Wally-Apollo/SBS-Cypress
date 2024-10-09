import "cypress-file-upload";

context("M01 - User Logon", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
  });

  it("TC01: S01 - S06", () => {
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");

    // for invalid credentials
    cy.fixture("sbs_credentials/invalid_credentials.json").each(
      (credentials) => {
        cy.get("[id^=username]").clear().type(credentials.username);
        cy.wait(1000);
        cy.get("[id^=password]").clear().type(credentials.password);
        cy.wait(1000);
        cy.get("[id^=submit]").click();
        cy.wait(1500);
        cy.get(".login_message").should(
          "contain",
          "Sorry, we were not able to find a user with that username and password."
        );
        cy.wait(1500);
      }
    );

    //for valid credentials
    cy.fixture("sbs_credentials/valid_credentials.json").each((credentials) => {
      cy.get("[id^=username]").clear().type(credentials.username);
      cy.wait(1000);
      cy.get("[id^=password]").clear().type(credentials.password);
      cy.wait(1000);
      cy.get("[id^=submit]").click();
      cy.wait(1500);
      cy.get(".navbar-text")
        .should("contain", credentials.username)
        .get('[href="/RetailPlusStoreBackend/logout/index"]')
        .wait(1500)
        .click();
      cy.wait(1500);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
    });
  });
});

context("M02 - User Tab", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToTableModule(tableName) {
    cy.get("h3").contains("Show User");
    cy.get("li").find("a").contains(tableName).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, check = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        searchWithOneField(key, data[key]);

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function navigateThenBack(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        cy.get("td").find("a").contains(data[key]).click();
        cy.get(".btn").contains("<< Back to").click();
      }
    });
  }

  function validateUserModule() {
    //Validate user module content
    cy.get("h3").contains("User List");
    cy.get("label").contains("User Id:");
    cy.get("label").contains("Username:");
    cy.get("label").contains("First Name:");
    cy.get("label").contains("Last Name:");
    cy.get(".btn").contains("Search");
    cy.get(".sortable").contains("User Id");
    cy.get(".sortable").contains("First Name");
    cy.get(".sortable").contains("Last Name");
    cy.get(".sortable").contains("Username");
    cy.get(".sortable").contains("Status");
    cy.get(".sortable").contains("Updated By");
    cy.get(".sortable").contains("Last Updated");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  context("Masterfile -> User", () => {
    login();

    it("Validation of User List page", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("User");

      //Validate that there will be no Error message displayed
      validateUserModule();
    });

    it("TC01: S01 - S05", () => {
      navigateToModule("Masterfile");
      navigateToSubModule("User");

      cy.fixture("masterfile/user/m02-search_user_tab_data").then((data) => {
        searchSuccess(data[0]);
      });
    });

    it("TC01: S06 - S09", () => {
      navigateToModule("Masterfile");
      navigateToSubModule("User");

      cy.fixture("masterfile/user/m02-search_user_tab_data").then((data) => {
        searchSuccess(data[1], true);
      });
    });

    it("TC01: S10 - S29", () => {
      navigateToModule("Masterfile");
      navigateToSubModule("User");

      cy.fixture("masterfile/user/m02-search_user_tab_data").then((data) => {
        cy.get("td").find("a").contains(data[2].externalId).click();

        // Go to Contact Info
        navigateToTableModule("Contact Info");
        navigateThenBack(data[2].data[0]);

        // Go to Facility User Role
        navigateToTableModule("Facility User Role");
        navigateThenBack(data[2].data[1]);

        // Go to Party Info
        navigateToTableModule("Party Info");
        navigateThenBack(data[2].data[2]);

        cy.get(".btn").contains("<< Back to").click();
      });
    });
  });
});

context("M03 - Product Tab", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function validateProductModule() {
    //Validate user module content
    cy.get("h3").contains("Product List");
    cy.get("label").contains("Short Name :");
    cy.get("label").contains("Long Name :");
    cy.get("label").contains("GTin :");
    cy.get("label").contains("Product Id:");
    cy.get("label").contains("Description:");
    cy.get("label").contains("Introduction Date:");
    cy.get("label").contains("Discontinuation Date:");
    cy.get(".btn").contains("Search");

    cy.get("th").contains("Product Id");
    cy.get("th").contains("GTIN");
    cy.get("th").contains("Short Name");
    cy.get("th").contains("Long Name");
    cy.get("th").contains("Description");
    cy.get("th").contains("Introduction Date");
    cy.get("th").contains("Discontinuation Date");
  }

  context("M03 - Masterfile (Product Tab)", () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials.json").then((login_data) => {
        cy.get("[id^=username]").type(login_data.username);
        cy.get("[id^=password]").type(login_data.password);
      });
      cy.get("[id^=submit]").click();

      cy.contains("Masterfile");
      cy.contains("Matrix");
      cy.contains("Inventory");
      cy.contains("Sales");
      cy.contains("Report");
      cy.contains("Misc");
      cy.contains("Sign out");
    });

    // it('Validation of Product List page', () => {
    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');

    //     //Click User from menu list
    //     navigateToSubModule('Product');

    //     //Validate that there will be no Error message displayed
    //     validateProductModule();
    //   })

    it("TC01: S01 - S07", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/m03_product_invalid_data.json").then(
        (data) => {
          //Search Using Short Name
          searchWithOneField("shortName", data.short_name);
          cy.get(".message").should("contain", "Result not found.").wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using Long Name
          searchWithOneField("longName", data.long_name);
          cy.get(".message").should("contain", "Result not found.").wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using GTIN
          searchWithOneField("gtin", data.gtin);
          cy.get(".message").should("contain", "Result not found.").wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get(".message").should("contain", "Result not found.").wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);
        }
      );
    });

    it("TC01: S08 - S14", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/m03_product_valid_data.json").then(
        (data) => {
          //Search Using Short Name
          searchWithOneField("shortName", data.short_name);
          cy.get("td").find("a").should("contain", data.short_name).wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using Long Name
          searchWithOneField("longName", data.long_name);
          cy.get("td").find("a").should("contain", data.long_name).wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using GTIN
          searchWithOneField("gtin", data.gtin);
          cy.get("td").find("a").should("contain", data.gtin).wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);

          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").should("contain", data.external_id).wait(1000);
          cy.get(".btn").contains("Clear").click().wait(1000);
        }
      );
    });

    // it('Validation of Show Product page', () =>{

    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');
    //     //Click User from menu list
    //     navigateToSubModule('Product');
    //     //Validate that there will be no Error message displayed
    //     validateProductModule();

    //     cy.fixture('masterfile/product/m03_product_valid_data.json').then((data) => {
    //         //Select any Product from the list
    //         cy.get('td').find('a').contains(data.external_id).click();

    //         //Validate Show Product
    //         cy.get('h3').contains('Show Product');
    //         cy.get('li').find('a').contains('Price');
    //         cy.get('li').find('a').contains('Supplier');
    //         cy.get('li').find('a').contains('Product Attribute');
    //         cy.get('li').find('a').contains('Product Price Commission');
    //         cy.get('li').find('a').contains('Product Identification');
    //         //recheck if needed on other product
    //         // cy.get('li').find('a').contains('Product Promo');
    //         cy.get('li').find('a').contains('Planogram Location');
    //     })
    // })

    it("TC01: S15- S16", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");
      cy.wait(1500);

      //Click User from menu list
      navigateToSubModule("Product");
      cy.wait(1500);
      validateProductModule();
      cy.wait(1500);

      cy.fixture("masterfile/product/search_product_price_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.wait(1500);
          cy.get("td").find("a").contains(data.external_id).click();
          cy.wait(1500);

          // cy.get('li').find('a').contains('Price').click();
          cy.get('[name="productPriceSearchCriteria"]').type(
            data.product_price_criteria
          );
          cy.wait(1500);
          cy.get('*[class^="search btn"]').click();
          cy.wait(1500);
          cy.get("#productPriceTable").then(($table) => {
            if ($table.find("tbody").length > 0) {
              cy.get($table)
                .find("tbody")
                .then(($tbody) => {
                  if (
                    $tbody.find("tr").length > 0 &&
                    $tbody
                      .find("tr")
                      .text()
                      .includes(data.product_price_criteria)
                  ) {
                    cy.get("td")
                      .find("a")
                      .contains(data.product_price_criteria);
                  }
                });
            }
          });

          cy.wait(1500);
        }
      );
    });

    it("TC01: S17 - S21", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/search_product_supplier_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").contains(data.external_id).click();

          cy.get("li").find("a").contains("Supplier").click();
          cy.get('[name="supplierProductSearchCriteria"]').type(
            data.supplier_product_criteria
          );
          cy.get('*[class^="search btn"]').click();
          cy.get("td").find("a").contains(data.supplier_product_criteria);
        }
      );
    });

    it("TC01: S22 - S25", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/search_product_attribute_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").contains(data.external_id).click();

          cy.get("li").find("a").contains("Product Attribute").click();
          cy.get('[name="productAttributeSearchCriteria"]').type(
            data.product_attribute_criteria
          );
          cy.get('*[class^="search btn"]').click();
          cy.get("td").find("a").contains(data.product_attribute_criteria);
        }
      );
    });

    it("TC01: S26", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture(
        "masterfile/product/search_product_price_commission_data"
      ).then((data) => {
        //Search Using Product Id
        searchWithOneField("externalId", data.external_id);
        cy.get("td").find("a").contains(data.external_id).click();

        cy.get("li").find("a").contains("Product Price Commission").click();
        cy.get('[name="productPriceCommissionSearchCriteria"]').type(
          data.product_price_commission_criteria
        );
        cy.get('*[class^="search btn"]').click();
        cy.get("td").find("a").contains(data.product_price_commission_criteria);
      });
    });

    it("TC01: S27 - S30", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/search_product_category_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").contains(data.external_id).click();

          cy.get("li").find("a").contains("Product Category").click();
          cy.get('[name="productCategoryMemberSearchCriteria"]').type(
            data.product_category_criteria
          );
          cy.get('*[class^="search btn"]').click();
          cy.get("td").find("a").contains(data.product_category_criteria);
        }
      );
    });

    it("TC01: S31 - S34", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/search_product_identification_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").contains(data.external_id).click();

          cy.get("li").find("a").contains("Product Identification").click();
          cy.get('[name="productIdentificationSearchCriteria"]').type(
            data.product_identification_criteria
          );
          cy.get('*[class^="search btn"]').click();
          cy.get("td").find("a").contains(data.product_identification_criteria);
        }
      );
    });

    // hidden in some data
    // it('Search Product Promo', () =>{
    //     //Click Master file from the menu
    //     navigateToModule('Masterfile');

    //     //Click User from menu list
    //     navigateToSubModule('Product');
    //     validateProductModule();

    //     cy.fixture('masterfile/product/search_product_promo_data').then((data) => {
    //         //Search Using Product Id
    //         searchWithOneField('externalId',data.external_id);
    //         cy.get('td').find('a').contains(data.external_id).click();

    //         cy.get('li').find('a').contains('Product Promo').click();
    //         cy.get('[name="productPromoProductSearchCriteria"]').type(data.product_promo_criteria);
    //         cy.get('*[class^="search btn"]').click();
    //         cy.get('td').find('a').contains(data.product_promo_criteria);
    //     })
    // })

    it("TC01: S35", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click User from menu list
      navigateToSubModule("Product");
      validateProductModule();

      cy.fixture("masterfile/product/search_planogram_location_data").then(
        (data) => {
          //Search Using Product Id
          searchWithOneField("externalId", data.external_id);
          cy.get("td").find("a").contains(data.external_id).click();

          cy.get("li").find("a").contains("Planogram Location").click();
          cy.get('[name="planogramLocationSearchCriteria"]').type(
            data.planogram_location_criteria
          );
          cy.get('*[class^="search btn"]').click();
          //change fixtures with something that has a value in planogram

          cy.get("#productPlacementTable").then(($tbody) => {
            if ($tbody.find("tr").length > 1) {
              cy.get("td").contains(data.planogram_location_criteria);
            } else {
              cy.log("report empty");
            }
          });
        }
      );
    });

    it("TC01: S36", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");
      cy.wait(1000);
      //Click Facility from menu list
      navigateToSubModule("Product");
      cy.wait(1000);
      //Validate that there will be no Error message displayed
      validateProductModule();
      cy.wait(1000);
      cy.get(".pagination > :nth-child(2)").click();
      cy.wait(1500);
      cy.get(".navbar-text > a").click();
      cy.wait(500);
    });

    // cy.get('.pagination > :nth-child(2)')
  });
});

context("M04 - Promo Tab", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToTableModule(tableName) {
    cy.get("h3").contains("Show User");
    cy.get("li").find("a").contains(tableName).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, check = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        searchWithOneField(key, data[key]);
        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });
        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function navigateThenBack(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        cy.get("td").find("a").contains(data[key]).click();
        cy.get(".btn").contains("<< Back to").click();
      }
    });
  }

  function validatePromoModule() {
    //Validate user module content
    cy.get("h3").contains("Promo List");
    cy.get("label").contains("Promo ID");
    cy.get("label").contains("Promo Name");
    cy.get("label").contains("Non Cash Master Code");
    cy.get("label").contains("Non Cash Code");
    cy.get(".btn").contains("Search");

    cy.get(".sortable").contains("Promo Id");
    cy.get(".sortable").contains("Promo Name");
    cy.get(".sortable").contains("Description");
    cy.get(".sortable").contains("Limit Per Customer");
    cy.get(".sortable").contains("Updated By");
    cy.get(".sortable").contains("Last Updated");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  context("Masterfile -> Promo", () => {
    login();

    it("Validation of Promo List page", () => {
      //Click Master file from the menu
      navigateToModule("Masterfile");

      //Click Promo from menu list
      navigateToSubModule("Promo");

      //Validate that there will be no Error message displayed
      validatePromoModule();
    });

    it("TC01: S01 - S05", () => {
      navigateToModule("Masterfile");
      navigateToSubModule("Promo");

      cy.fixture("masterfile/promo/m04-search_promo_tab_data").then((data) => {
        searchSuccess(data[0]);
      });
    });

    it("TC01: S05 - S15", () => {
      navigateToModule("Masterfile");
      navigateToSubModule("Promo");

      cy.fixture("masterfile/promo/m04-search_promo_tab_data").then((data) => {
        searchSuccess(data[1], true);

        cy.get("tbody").then(($tbody) => {
          if (
            $tbody.find("tr").length > 1 &&
            $tbody.find("tr").text().includes(data[2].id)
          ) {
            cy.get("td").find("a").contains(data[2].id).click();

            cy.get(".btn").contains("<< Back to").click();

            cy.get("td").find("a").contains(data[2].promoName).click();
            cy.get(".btn").contains("<< Back to").click();

            cy.get("td").find("a").contains(data[2].description).click();
            cy.get("td").find("a").contains(data[2].facility).click();
          }
        });
      });

      navigateToModule("Masterfile");
      navigateToSubModule("Promo");

      cy.get(".pagination > :nth-child(2)").click();
    });
  });
});
context("M05 - Facility Tab", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  const navigateAndPerformActions = (status) => {
    cy.get("[id^=facilityStatus]").select(status);
    cy.get(".btn").contains("Search").click();
    cy.get("tbody>tr").eq(0).find("a").eq(0).click();
    cy.get("span").contains(status);
    cy.get(".btn").contains("<< Back to Facility List").click();
  };

  function validateFacilityModule() {
    //Validate user module content
    cy.get("h3").contains("Facility List");
    cy.get("label").contains("Facility Id");
    cy.get("label").contains("Facility Name");
    cy.get("label").contains("Global Location Number");
    cy.get("label").contains("Status");
    cy.get("label").contains("Facility Type");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");
    cy.get(".sortable").contains("Facility Id");
    cy.get(".sortable").contains("GLN");
    cy.get(".sortable").contains("Facility Name");
    cy.get(".sortable").contains("Facility Type");
    cy.get(".sortable").contains("Updated By");
    cy.get(".sortable").contains("Last Updated");
  }

  beforeEach(() => {
    cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
    cy.fixture("sbs_credentials/sbs_credentials.json").then((login_data) => {
      cy.get("[id^=username]").type(login_data.username);
      cy.get("[id^=password]").type(login_data.password);
    });
    cy.get("[id^=submit]").click();

    cy.contains("Masterfile");
    cy.contains("Matrix");
    cy.contains("Inventory");
    cy.contains("Sales");
    cy.contains("Report");
    cy.contains("Misc");
    cy.contains("Sign out");
  });

  it("TC01: S01", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");

    //Click User from menu list
    navigateToSubModule("Facility");

    //Validate that there will be no Error message displayed
    validateFacilityModule();
  });

  it("TC01: S02 - S03", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");

    //Click Facility from menu list
    navigateToSubModule("Facility");

    //Validate that there will be no Error message displayed
    validateFacilityModule();

    cy.fixture("masterfile/facility/m05_facility_invalid_data.json").then(
      (data) => {
        //Search Using Facility Id
        searchWithOneField("externalId", data.external_id);
        cy.get(".message").should("contain", "Result not found.").wait(1000);
        cy.get(".btn").contains("Clear").click();

        //Search Using Facility Name
        searchWithOneField("groupName", data.group_name);
        cy.get(".message").should("contain", "Result not found.").wait(1000);
        cy.get(".btn").contains("Clear").click();

        //Search Using GLN
        searchWithOneField("gln", data.gln);
        cy.get(".message").should("contain", "Result not found.").wait(1000);
        cy.get(".btn").contains("Clear").click();

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
      }
    );
  });

  it("TC01: S05 - S07, S10 - S11", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");

    //Click Facility from menu list
    navigateToSubModule("Facility");

    //Validate that there will be no Error message displayed
    validateFacilityModule();

    cy.fixture("masterfile/facility/m05_facility_valid_data.json").then(
      (data) => {
        //Search Using Facility Id
        searchWithOneField("externalId", data.external_id);
        cy.get("td").find("a").should("contain", data.external_id);
        cy.wait(1500);
        cy.get(".btn").contains("Clear").click();
        cy.wait(1500);
        //Search Using Facility Name
        searchWithOneField("groupName", data.group_name);
        cy.get("td").find("a").should("contain", data.group_name);
        cy.wait(1500);
        cy.get(".btn").contains("Clear").click();
        cy.wait(1500);
        //Search Using GLN
        searchWithOneField("gln", data.gln);
        cy.get("td").find("a").should("contain", data.gln);
        cy.wait(1500);
        cy.get(".btn").contains("Clear").click();
        cy.wait(1500);
        //Search Using Status
        cy.get("[id^=facilityStatus]").select(data.facility_status);
        cy.get(".btn").contains("Search").click();
        cy.wait(1500);
        cy.get("tbody>tr").eq(0).find("a").eq(0).click();
        cy.get("span").contains(data.facility_status);
        cy.get(".btn").contains("<< Back to Facility List").click();
        cy.wait(1500);
      }
    );
  });

  it("TC01: S08", () => {
    navigateToModule("Masterfile");
    cy.wait(1000);
    navigateToSubModule("Facility");
    cy.wait(1000);
    validateFacilityModule();
    cy.wait(1000);

    const statuses = ["Closed", "Active", "Open", "Inactive"];
    statuses.forEach((status) => {
      navigateAndPerformActions(status);
    });
  });

  it("TC01: S09", () => {
    navigateToModule("Masterfile");
    cy.wait(1000);
    navigateToSubModule("Facility");
    cy.wait(1000);
    validateFacilityModule();
    cy.wait(1000);

    //Search Using Corporate facility Type
    cy.get("[id^=autoFTParentList]").type("Corporate");
    cy.wait(5000);
    cy.get("[id^=autoFTParentList]").type("{downArrow}").type("{enter}");

    cy.get(".btn").contains("Search").click();

    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 1) {
        for (let i = 0; i < 10; i++) {
          cy.get("tbody>tr").eq(i).find("a").eq(3).contains("Corporate");
        }
      } else {
        cy.log("report empty");
      }
    });

    cy.get(".btn").contains("Clear").click();
    cy.wait(2000);
    //Search Using Franchise facility Type
    cy.get("[id^=autoFTParentList]").type("Franchise");
    cy.wait(5000);
    cy.get("[id^=autoFTParentList]").type("{downArrow}").type("{enter}");

    cy.get(".btn").contains("Search").click();

    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        for (let i = 0; i < 10; i++) {
          cy.get("tbody>tr").eq(i).find("a").eq(3).contains("Franchise");
        }
      } else {
        cy.log("report empty");
      }
    });

    cy.wait(2000);
  });

  it("TC01: S10", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");
    cy.wait(1000);
    //Click Facility from menu list
    navigateToSubModule("Facility");
    cy.wait(1000);
    //Validate that there will be no Error message displayed
    validateFacilityModule();
    cy.wait(1000);
    cy.fixture("masterfile/facility/show_facility_data").then((data) => {
      //Select any facility from the list
      cy.get("td").find("a").contains(data.external_id).click();
    });
    cy.wait(1500);
    //Validate Show Facility
    cy.get("h3").contains("Show Facility");
    cy.wait(1500);
    cy.get("li").find("a").contains("Contact Info");
    cy.wait(1500);
  });

  it("TC01: S12", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");
    cy.wait(1000);
    //Click Facility from menu list
    navigateToSubModule("Facility");
    cy.wait(1000);
    //Validate that there will be no Error message displayed
    validateFacilityModule();
    cy.wait(1000);
    cy.fixture("masterfile/facility/search_facility_contact_info_data").then(
      (data) => {
        //Search Using Facility Id
        searchWithOneField("externalId", data.external_id);
        cy.get("td").find("a").contains(data.external_id).click();
        cy.wait(1500);
        //Validate Show Facility
        cy.get("h3").contains("Show Facility");
        cy.wait(1500);
        cy.get("li").find("a").contains("Contact Info").click();
        cy.wait(1500);
        cy.get('[name="contactMechSearchCriteria"]').type(
          data.contact_mech_search_criteria
        );
        cy.wait(1500);
        cy.get('*[class^="search btn"]').click();
        cy.wait(1500);
        cy.get("td").find("a").contains(data.contact_mech_search_criteria);
        cy.wait(1500);
        cy.get(".navbar-text > a").click();
        cy.wait(500);
      }
    );
  });

  it("TC01: S13", () => {
    //Click Master file from the menu
    navigateToModule("Masterfile");
    cy.wait(1000);
    //Click Facility from menu list
    navigateToSubModule("Facility");
    cy.wait(1000);
    //Validate that there will be no Error message displayed
    validateFacilityModule();
    cy.wait(1000);
    cy.get(".pagination > :nth-child(2)").click();
    cy.wait(1500);
    cy.get(".navbar-text > a").click();
    cy.wait(500);
  });
});

context("M06 - Matrix Planogram", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToTableModule(tableName) {
    cy.get("h3").contains("Show Planogram");
    cy.get(".nav-tabs").find("a").contains(tableName).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click().wait(1000);
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click().wait(1000);
  }

  function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }
        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });
        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function navigateThenBack(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        cy.get("td").find("a").contains(data[key]).click();
        cy.get(".btn").contains("<< Back to").click();
      }
    });
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Planogram List page", () => {
    //Click Master file from the menu
    navigateToModule("Matrix");

    //Click Planogram from menu list
    navigateToSubModule("Planogram");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Planogram List");
    cy.get("label").contains("Document ID");
    cy.get("label").contains("Reference Id");
    cy.get("label").contains("Status");
    cy.get(".sortable").contains("Document Id");
    cy.get(".sortable").contains("Reference Id");
    cy.get(".sortable").contains("Status");
  });

  it("TC01: S01 - S05", () => {
    navigateToModule("Matrix");
    navigateToSubModule("Planogram");

    cy.fixture("matrix/planogram_data/m06-search_planogram_tab_data").then(
      (data) => {
        searchSuccess(data[0]); // incorrect
        cy.wait(1500);
        searchSuccess(data[1], true); // correct
        cy.wait(1500);
        searchSuccess(data[2], true, true); // correct, category
        cy.wait(1500);

        searchSuccess(data[4].data[0], data[4].check[0].null, true);
        cy.wait(1500);
        searchSuccess(data[4].data[1], data[4].check[1].null, true);
        cy.wait(1500);
        searchSuccess(data[4].data[2], data[4].check[2].null, true);
        cy.wait(1500);
        searchSuccess(data[4].data[3], data[4].check[3].null, true);
        cy.wait(1500);
        searchSuccess(data[4].data[4], data[4].check[4].null, true);
        cy.wait(1500);
        searchSuccess(data[4].data[5], data[4].check[5].null, true);
        cy.wait(1500);

        searchWithOneField("f_documentId", data[1].f_documentId);
        cy.get("td")
          .find("a")
          .contains(data[1].f_documentId)
          .click()
          .wait(1500);

        cy.get(".btn").contains("Print").click().wait(1500);

        cy.get("td")
          .find("a")
          .contains(data[3].f_locationId)
          .click()
          .wait(1500);
        cy.get(".errors")
          .should("contain", "Sorry, you're not authorized to view this page.")
          .wait(1500);
      }
    );
  });

  it("TC01: S06 - S08", () => {
    navigateToModule("Matrix");
    navigateToSubModule("Planogram");

    cy.fixture("matrix/planogram_data/m06-search_planogram_tab_data").then(
      (data) => {
        navigateToModule("Matrix");
        navigateToSubModule("Planogram");
        searchWithOneField("f_documentId", data[1].f_documentId);
        cy.get("td").find("a").contains(data[1].f_documentId).click();
        cy.get(".pagination > :nth-child(2)").click();

        navigateToTableModule("Product");
        cy.get(".pagination > :nth-child(2)").click();

        cy.get(".btn").contains("<< Back to").click();
        cy.get(".pagination").should("exist", "2").click();
      }
    );
  });
});
context("M07 -Inventory", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  beforeEach(() => {
    cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
    // // cy.get('[id^=password]').contains('Password');
    // const username = '0920013';
    // const password = '920013';
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.get("[id^=username]").type(sbs_credentials.username);
      cy.get("[id^=password]").type(sbs_credentials.password);
      cy.get("[id^=submit]").click();

      cy.contains("Masterfile");
      cy.contains("Matrix");
      cy.contains("Inventory");
      cy.contains("Sales");
      cy.contains("Report");
      cy.contains("Misc");
      cy.contains("Sign out");
    });
  });

  it("TC01: S01", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    cy.wait(1500);

    //Click Inventory from menu list
    //navigateToSubModule2('Inventory');
    cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();
    cy.wait(1500);

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Inventory List");
    cy.get("div#small-heading").contains("Product Details");
    cy.get("label").contains("Product Id");
    cy.get("label").contains("Product Name");
    cy.get("div#small-heading").contains("Facility Details");
    cy.get("label").contains("Facility ID");
    cy.get("label").contains("Facility");
    cy.get('input[name="_action_list"]').contains("Search");
    cy.get("a").contains("Clear");
    cy.get("th.sortable").contains("Product Id");
    cy.get("th.sortable").contains("Product");
    cy.get("th.sortable").contains("QOH");
    cy.get("th.sortable").contains("ATP");
    cy.wait(1000);
  });

  it("TC01: S02 - S04", () => {
    //Click Inventory from the menu
    navigateToModule("Inventory");
    cy.wait(1000);
    //Click Inventory from the menu list
    cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();
    cy.wait(1000);

    cy.fixture("inventory/inventory_data/m07_inventory_data.json").then(
      (data) => {
        cy.get('input[id="autoProductListById"]')
          .type(data.dummy_product_id)
          .wait(2000)
          .type("{downArrow}")
          .type("{enter}");
        cy.get('input[name="_action_list"]').click();
        cy.get(".message").should("contain", "Result not found.").wait(1000);
        cy.get(".btn").contains("Clear").click().wait(1000);

        //Search Using Document Id
        cy.get('input[id="autoProductListById"]')
          .type(data.product_id)
          .wait(2000)
          .type("{downArrow}")
          .type("{enter}");
        cy.get('input[name="_action_list"]').click();
        cy.wait(1000);
        //Validate Search Result

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length > 1) {
            cy.get("td").find("a").contains(data.product_id);
            cy.get("td").find("a").contains(data.product_name).click();
            cy.wait(1000);
          } else {
            cy.log("report empty");
          }
        });
      }
    );
  });

  it("TC01: S05", () => {
    //Click Inventory from the menu list
    navigateToModule("Inventory");
    cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();

    //Search Using Document Id
    cy.fixture("inventory/inventory_data/m07_inventory_data.json").then(
      (data) => {
        cy.get('input[id="autoProductListById"]')
          .type(data.product_id)
          .wait(2000)
          .type("{downArrow}")
          .type("{enter}");
        cy.get('input[name="_action_list"]').click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length > 1) {
            cy.get("td").find("a").contains(data.product_id).click();
            cy.wait(2000);

            cy.get('input[id="referenceId"]')
              .type(data.dummy_product_id)
              .wait(2000)
              .type("{downArrow}")
              .type("{enter}");
            cy.get('input[name="_action_list"]').click();
            cy.get(".message")
              .should("contain", "Result not found.")
              .wait(1000);
            cy.get(".btn").contains("Clear").click().wait(1000);
            // Validate Inventory Details
            cy.get("h3").contains("Inventory Detail List");
            cy.get(".sbs-label").contains("Type");
            cy.get(".sbs-input-alignment").first().click().wait(2000);
            cy.get("#type")
              .should("contain", "Receiving Advice")
              .and("contain", "Sales")
              .and("contain", "Refunds")
              .and("contain", "Cycle Count")
              .and("contain", "Dispatch Advice")
              .and("contain", "Returns")
              .and("contain", "Returns")
              .and("contain", "Bad Merchandise")
              .and("contain", "Product Transfer")
              .and("contain", "Weekly Supplies")
              .and("contain", "Claim Order")
              .and("contain", "Audit Count")
              .and("contain", "Purchase Order")
              .and("contain", "Purchase Order Return");
            cy.get(".sbs-label").contains("Document Id");
            cy.get('input[id="referenceId"]').should("be.visible");
            cy.get(".sbs-label").contains("Created Date From");
            cy.get('input[id="dateCreatedFrom"]').should("be.visible");
            cy.get(".sbs-label").contains(" Created Date To");
            cy.get('input[id="dateCreatedTo"]');
            cy.get('input[name="_action_list"]').should("be.visible");
            cy.get("a").contains("Clear");
            cy.get("a").contains("Print");
            cy.get("thead").contains("th", "Transaction Type");
            cy.get("thead").contains("th", "Transaction Date");
            cy.get("thead").contains("th", "Date Created");
            cy.get("thead").contains("th", "Document ID");
            cy.get("thead").contains("th", "Product ID");
            cy.get("thead").contains("th", "Product Name");
            cy.get("thead").contains("th", "Beginning Inventory");
            cy.get("thead").contains("th", "Adjustment");
            cy.get("thead").contains("th", "Ending Inventory");
            cy.wait(1000);

            cy.get(".pull-down > .btn").click();
            cy.wait(1000);
            cy.get(".navbar-text > a").click();
            cy.wait(1000);
          } else {
            cy.log("report empty");
          }
        });
      }
    );
  });

  //  it('Search Inventory Item', () => {
  //     //Click Inventory from the menu list
  //     navigateToModule('Inventory');
  //     cy.get('a[href="/RetailPlusStoreBackend/facilityInventory/list"]').click();

  //     //Search Using Document Id
  //     cy.get('input[id="autoProductListById"]').type('18500403').wait(2000).type('{downArrow}').type('{enter}');
  //     cy.get('input[name="_action_list"]').click()
  //     cy.get('td').find('a').contains('RDE Uni Ballpen 3s').click();

  //     // cy.get("tbody")
  //     // .find("tr")
  //     // .then((rows) => {
  //     //   rows.toArray().forEach((element) => {
  //     //     if (element.innerHTML.includes("Sales")) {
  //     //     //rows.index(element) will give you the row index
  //     //       cy.log(rows.index(element))
  //     //     }
  //     //   });

  //     //   for(let i = 0; i < rows; i ++){
  //     //     cy.get('tbody>tr').eq(i).find('tr').eq(0).contains('Sales');
  //     //     }
  //     // })
  //  });
});
context("M08 - Inventory Order", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Order List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Order");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Replenishment Order");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Facility")
      .and("contain", "Document ID")
      .and("contain", "Status");
    cy.get(".sbs-label-replenishment")
      .should("contain", "Replenishment Order Date From")
      .and("contain", "Replenishment Order Date From");

    //Fields
    cy.get('input[id="facility"]').should("be.visible");
    cy.get('input[id="documentId"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");
    cy.get('input[id="fromDateSearch"]').should("be.visible");
    cy.get('input[id="thruDateSearch"]').should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".btn").should("contain", "New Replenishment Order");

    //Table
    cy.get("thead")
      .find(".sortable")
      .should("contain", "Document ID")
      .and("contain", "Date Created")
      .and("contain", "Order Date")
      .and("contain", "Number of Item Ordered")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail")
      .and("contain", "Status");
  });

  // it('TC01: S01 - S04', () => {
  //     navigateToModule('Inventory');
  //     navigateToSubModule('Order')

  //     cy.get('.pull-right').contains('New Replenishment Order').click();
  //     cy.get('a.btn').click()

  //     cy.get('.pull-right').contains('New Replenishment Order').click();
  //     cy.get('#orderDate').click()
  //     cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
  //     cy.get('.button-align-right > input.btn').click();

  //     cy.fixture('inventory/order_data/m08-order_tab_data').then((data) => {
  //         cy.get('#categorySelection').select(data[0].data[0].categorySelection);
  //         cy.get('.btn').contains('Edit').click();
  //         cy.get('.btn').contains('Suggest').click();

  //         cy.get('tbody').find(data[0].data[1].id).clear().type(data[0].data[1].type)

  //         cy.get('.btn').contains('Save').click();
  //         cy.get('.btn').contains('Print').click();
  //         cy.get('.btn').contains('Complete').click();
  //         cy.get('.nav-tabs > :nth-child(2) > a').click();

  //         cy.get('.btn').contains('<< Back to').click();

  //         cy.get('td').find('a').contains("DG").then(element => {
  //             // Capture the value directly
  //             const myValue = element.text();
  //             cy.get('td').find('a').contains(myValue).click();
  //         });

  //     });
  // })

  it("TC01: S05 - S06", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Order");

    cy.fixture("inventory/order_data/m08-order_tab_data").then((data) => {
      searchSuccess(data[1]);
      searchSuccess(data[2].data[0], data[2].check[0].null, true);
      searchSuccess(data[2].data[1], data[2].check[1].null, true);
      searchSuccess(data[2].data[2], data[2].check[2].null, true);
    });
  });
});
context("M09 - Receiving Advice", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function createPurchaseOrder(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value).type("{downArrow}").type("{enter}");
    cy.get('input[name="_action_save"]').contains("Search").click();
  }

  function computeTotals(number1, number2) {
    var total = number1 * number2;
    cy.log(total);
  }

  function generateRandomString(string_length) {
    let text = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < string_length; i++)
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return text;
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });

  it("Validation of Receiving Advice List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Receiving Advice");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Receiving Advice List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Document No")
      .and("contain", "Facility")
      .and("contain", "Received From")
      .and("contain", "Received Date From")
      .and("contain", "Received Date To")
      .and("contain", "Status");
    cy.get(".pull-right").contains("Receiving Advice for:");

    //Fields
    cy.get('input[id="referenceId"]').should("be.visible");
    cy.get('input[id="facility"]').should("be.visible");
    cy.get('input[id="autoReceivedFrom"]').should("be.visible");
    cy.get('input[id="receiveDateFromSearch"]').should("be.visible");
    cy.get('input[id="receiveDateToSearch"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button

    //Table
    cy.get("thead")
      .find(".sortable")
      .should("contain", "Document ID")
      .and("contain", "Document No")
      .and("contain", "Date Received")
      .and("contain", "From")
      .and("contain", "To")
      .and("contain", "Total No. of Items")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail Price")
      .and("contain", "Status");
  });

  it("Receiving Advice - Create Purchase Order", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Purchase Order");

    //Create Purchase Order
    cy.fixture("/inventory/purchase_order_data/purchase_order_data").then(
      (purchase_order_data) => {
        cy.get('div[class="pull-right nav nav-buttons"]')
          .find("a")
          .contains("New Purchase Order")
          .click();
        cy.get("#autoSeller").type(purchase_order_data.supplier);
        cy.wait(5000);
        cy.get("#autoSeller").type("{downArrow}").type("{enter}");
        cy.wait(5000);

        cy.get("input#orderDate").click();
        cy.get("div#ui-datepicker-div").should("be.visible");
        cy.get(".ui-datepicker-year").select(purchase_order_data.po_year);
        cy.get(".ui-datepicker-month").select(purchase_order_data.po_month);
        cy.get("table.ui-datepicker-calendar a.ui-state-default")
          .contains(purchase_order_data.po_day)
          .click();

        //Click Save button
        cy.get(".button-align-right")
          .find('input[name="_action_save"]')
          .click();
        cy.get(".fieldcontain")
          .find('span[aria-labelledby="documentId-label"]')
          .then(($documentId) => {
            const documentIdValue = $documentId.text();
            cy.log(documentIdValue);

            //Edit Purchase Order
            cy.get(".pull-down").contains("Edit").click();
            cy.get("h3").contains("Edit Purchase Order");
            cy.get("tbody")
              .find("#autoFilteredProduct")
              .type(purchase_order_data.product)
              .wait(1000)
              .type("{downArrow}")
              .type("{enter}");
            cy.get("tbody")
              .find("#orderQuantity")
              .type(purchase_order_data.order_qty);
            cy.get("tbody>tr")
              .find('input[name="_action_purchaseOrderItemSave"]')
              .click()
              .wait(2000);
            cy.get('div[class="pull-right bottom-buttons"]')
              .find('input[name="_action_update"]')
              .click();
            cy.get(".pull-down").contains("Approve").click();

            //Log Product Name
            cy.get("tbody>tr")
              .find("td")
              .eq(1)
              .then(($productId) => {
                const productIdValue = $productId.text();
                cy.log(productIdValue);

                //Log Order Qty
                cy.get("tbody>tr")
                  .find("td")
                  .eq(5)
                  .then(($orderQty) => {
                    const orderQtyValue = $orderQty.text();
                    cy.log(orderQtyValue);

                    //Compute Total Cost
                    cy.get("tbody>tr")
                      .find("td")
                      .eq(13)
                      .then(($unitCost) => {
                        const unitCostValue = $unitCost.text();
                        cy.log(unitCostValue);

                        computeTotals(orderQtyValue, unitCostValue);
                        cy.log(computeTotals);

                        //Log Unit Price
                        cy.get("tbody>tr")
                          .find("td")
                          .eq(14)
                          .then(($unitPrice) => {
                            const unitPriceValue = $unitPrice.text();
                            cy.log(unitPriceValue);

                            //Log Total
                            cy.get("tbody>tr")
                              .find("td")
                              .eq(15)
                              .then(($total) => {
                                const totalValue = $total.text();
                                cy.log(totalValue);

                                navigateToModule("Inventory");
                                navigateToSubModule("Receiving Advice");

                                cy.fixture(
                                  "inventory/receiving_advice_data/receiving_advice_data"
                                ).then((receiving_advice_data) => {
                                  cy.get("#createType").select(
                                    "Purchase Order"
                                  );
                                  cy.get(
                                    'input[name="_action_create"]'
                                  ).click();
                                  cy.get("#autoPOApproved").type(
                                    documentIdValue
                                  );
                                  cy.wait(1000);
                                  cy.get("#autoPOApproved")
                                    .type("{downArrow}")
                                    .type("{enter}");

                                  cy.get('input[name="referenceId"]').type(
                                    receiving_advice_data.document_number
                                  );
                                  cy.get("input#receiveDate").click();
                                  cy.get("div#ui-datepicker-div").should(
                                    "be.visible"
                                  );
                                  cy.get(".ui-datepicker-year").select(
                                    receiving_advice_data.ra_year
                                  );
                                  cy.get(".ui-datepicker-month").select(
                                    receiving_advice_data.ra_month
                                  );
                                  cy.get(
                                    "table.ui-datepicker-calendar a.ui-state-default"
                                  )
                                    .contains(receiving_advice_data.ra_day)
                                    .click();
                                  cy.get(".controls")
                                    .find("#receiveDate")
                                    .then(($raDate) => {
                                      const raDateValue = $raDate.val();
                                      cy.log(raDateValue);
                                      //Click Save button
                                      cy.get(
                                        'input[name="_action_save"]'
                                      ).click();
                                      //Validate Created Receiving Advice
                                      cy.get(".popoutDiv")
                                        .find(".alert1")
                                        .contains("Receiving Advice created");
                                      cy.get(".sbsdiv3")
                                        .find(".property-value2")
                                        .eq(0)
                                        .contains(documentIdValue); //Purchase Order ID
                                      cy.get(".sbsdiv3")
                                        .find(".property-value2")
                                        .eq(1)
                                        .should(
                                          "contain",
                                          receiving_advice_data.document_number
                                        ); //Document ID
                                      cy.get(".sbsdiv3")
                                        .find(".property-value2")
                                        .eq(2)
                                        .contains(raDateValue); //Receiving Advice Date
                                      cy.get(".sbsdiv3")
                                        .find(".property-value2")
                                        .contains("Created"); //Status

                                      cy.get("tbody > tr")
                                        .find("td")
                                        .eq(1)
                                        .contains(productIdValue);
                                      cy.get("tbody > tr")
                                        .find("td")
                                        .eq(2)
                                        .should(
                                          "contain",
                                          purchase_order_data.product
                                        );

                                      cy.get("tbody > tr")
                                        .find("td")
                                        .eq(8)
                                        .contains(totalValue);

                                      cy.get(".pull-down")
                                        .contains("Complete")
                                        .click();
                                      cy.get(".popoutDiv")
                                        .find(".alert1")
                                        .contains(
                                          "Successfully updated status of Receiving Advice"
                                        );
                                      cy.get(".sbsdiv3")
                                        .find(".property-value2")
                                        .contains("Completed"); //Status
                                    });
                                });
                              });
                          });
                      });
                  });
              });
          });
      }
    );
  });

  it("Create Receiving Order - Unordered", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Receiving Advice");

    cy.fixture("inventory/receiving_advice_data/receiving_advice_data").then(
      (receiving_advice_data) => {
        // cy.get('.pull-right').find('#createType').select('Unordered')
        cy.get('input[name="_action_create"]').click();

        //Populate Received From field
        cy.get("#autoSellerForUnordered")
          .type(receiving_advice_data.received_from)
          .type("{downArrow}")
          .type("{enter}");
        //Populate Date Received

        cy.get("input#receiveDate").click();
        cy.get("div#ui-datepicker-div").should("be.visible");
        cy.get(".ui-datepicker-year").select(receiving_advice_data.ra_year);
        cy.get(".ui-datepicker-month").select(receiving_advice_data.ra_month);
        cy.get("table.ui-datepicker-calendar a.ui-state-default")
          .contains(receiving_advice_data.ra_day)
          .click();

        cy.wait(2000);
        //Populate Document No
        const documentNumber = generateRandomString(7);
        cy.get('input[name="referenceId"]').type(documentNumber);
        cy.log(documentNumber);

        //Save
        cy.get('input[name="_action_save"]').click();

        //Validate Created Receiving Advice - Unordered

        cy.get(".popoutDiv")
          .find(".alert1")
          .then(($alert) => {
            if ($alert.text().includes("Receiving Advice created")) {
              cy.get(".popoutDiv")
                .find(".alert1")
                .contains("Receiving Advice created");
              cy.get(".fieldcontain")
                .eq(0)
                .find(".property-value2")
                .eq(0)
                .contains(documentNumber);
              cy.get(".fieldcontain")
                .eq(3)
                .find(".property-value2")
                .eq(0)
                .contains(receiving_advice_data.received_from);

              //Buttons
              cy.get(".pull-down")
                .find("a")
                .should("contain", "Print")
                .and("contain", "Cancel")
                .and("contain", "Edit");

              //Edit Receiving Advice
              cy.get(".pull-down").find("a").contains("Edit").click();
              cy.get("h3").contains("Edit Receiving Advice");
              cy.get("#autoFilteredProduct").type(
                receiving_advice_data.product_name
              );
              cy.wait(5000);
              cy.get("#autoFilteredProduct")
                .type("{downArrow}")
                .type("{enter}");
              cy.get("#receivedQuantity").type(
                receiving_advice_data.received_qty
              );
              cy.get('input[name="_action_receivingAdviceItemSave"]').click();

              //Validate successful creation of unordered RA
              cy.get(".popoutDiv").contains("Receiving Advice Item created");
              cy.get("tbody>tr")
                .eq(1)
                .find("td")
                .eq(2)
                .contains(receiving_advice_data.product_name);
              cy.get("tbody>tr")
                .eq(1)
                .find("td")
                .eq(3)
                .contains(receiving_advice_data.received_qty);
              cy.get('input[name="_action_update"]').click();
              cy.get(".popoutDiv").contains("Receiving Advice updated");

              //Complete Receiving Advice
              cy.get(".pull-down").find("a").contains("Complete").click();
              cy.get(".popoutDiv")
                .find(".alert1")
                .contains("Successfully updated status of Receiving Advice");
              cy.get(".sbsdiv3")
                .eq(2)
                .find(".property-value2")
                .eq(0)
                .contains("Completed");
            } else {
              cy.get(".popoutDiv")
                .find(".alert1")
                .contains("System has experienced an unexpected exception");
            }
          });
      }
    );
  });

  it("Search Receiving Advice", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Receiving Advice");
    cy.fixture("/inventory/receiving_advice_data/receiving_advice_data").then(
      (receiving_advice_data) => {
        //Search Document Number
        cy.get(".controls")
          .find("#referenceId")
          .type(receiving_advice_data.document_no);
        cy.get(".sbs-searchbtn-alignment")
          .find('input[name="_action_list"]')
          .click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("tbody")
              .find("tr")
              .then((row) => {
                for (let i = 0; i < row.length; i++) {
                  cy.get("tbody>tr")
                    .eq(i)
                    .find("a")
                    .eq(1)
                    .contains(receiving_advice_data.document_no);
                }
              });
          } else {
            cy.log("report empty");
          }
        });

        cy.get(".sbs-searchbtn-alignment").find("a").contains("Clear").click();

        //Search Received From
        cy.get(".controls")
          .find("#autoReceivedFrom")
          .type(receiving_advice_data.received_from)
          .wait(1000)
          .type("{downArrow}")
          .type("{enter}");
        cy.get(".sbs-searchbtn-alignment")
          .find('input[name="_action_list"]')
          .click();
        cy.get("tbody")
          .find("tr")
          .then((row) => {
            for (let i = 0; i < row.length; i++) {
              cy.get("tbody>tr")
                .eq(i)
                .find("a")
                .eq(3)
                .contains(receiving_advice_data.received_from);
            }
          });

        cy.get(".sbs-searchbtn-alignment").find("a").contains("Clear").click();

        //Search Status
        cy.get(".controls")
          .find("#f_status")
          .select(receiving_advice_data.status);
        cy.get(".sbs-searchbtn-alignment")
          .find('input[name="_action_list"]')
          .click();
        cy.get("tbody")
          .find("tr")
          .then((row) => {
            for (let i = 0; i < row.length; i++) {
              cy.get("tbody>tr")
                .eq(i)
                .find("a")
                .eq(8)
                .contains(receiving_advice_data.status);
            }
          });
      }
    );
  });
});
context("M10 - Cycle Count", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[name^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function validateModule() {
    //Validate user module content
    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Cycle Count List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Facility")
      .and("contain", "Document Id")
      .and("contain", "Type")
      .and("contain", "Date Counted From")
      .and("contain", "Date Counted To")
      .and("contain", "Status");

    //Fields
    cy.get('input[id="facility"]').should("be.visible");
    cy.get('input[id="documentId"]').should("be.visible");
    cy.get('select[name^="f_type"]').should("be.visible");
    cy.get('input[id="countDateFromSearch"]').should("be.visible");
    cy.get('input[id="countDateToSearch"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".pull-right").contains("New Cycle Count Variance");
    cy.get(".pull-right").contains("New Cycle Count");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document Id")
      .and("contain", "Count Date")
      .and("contain", "Type")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail Price")
      .and("contain", "Status");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Cycle Count page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Cycle Count from the submenu
    navigateToSubModule("Cycle Count");

    validateModule();
  });

  it("TC01: S01 - S05", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Cycle Count");

    cy.fixture("inventory/cycle_count/m10-cycle_count_tab_data").then(
      (data) => {
        searchSuccess(data[0]);

        searchSuccess(data[1].type[0], true);
        searchSuccess(data[1].type[1], true);

        searchSuccess(data[1].status[0], true);
        searchSuccess(data[1].status[1], true);
        searchSuccess(data[1].status[2], true);

        cy.get(
          '[href="/RetailPlusStoreBackend/cycleCount/createCycleCountVariance"]'
        ).click();
        cy.get("#countDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get("#referenceId").type(data[2].referenceId);
        cy.get(":nth-child(4) > .btn").click();
        cy.get(".btn").contains("Edit").click();
        cy.get(".btn").contains("Cancel").click();
        cy.get(".btn").contains("Edit").click();
        // cy.get('#autoProductListVariance').click().click()
        cy.get("#autoProductListVariance")
          .click()
          .click()
          .wait(5000)
          .type("{downArrow}")
          .type("{enter}");
        cy.get("#countedQuantity").type(data[2].quantity);
        cy.get("#reason").select(data[2].reason);
        cy.get(".btn").contains("Add").click();
        cy.get(".btn").contains("Save").click();
        cy.get(".btn").contains("Complete").click();
        cy.get(".btn").contains("Print").click();
        cy.get(".btn").contains("<< Back to").click();
      }
    );
  });

  it("TC01: S06", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Cycle Count");

    cy.fixture("inventory/cycle_count/m10-cycle_count_tab_data").then(
      (data) => {
        // cy.get('[href="/RetailPlusStoreBackend/cycleCount/createCycleCount"]').click();
        // cy.get('#countDate').click();
        // cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
        // cy.get('#referenceId').type(data[3].referenceId);
        // cy.get('.btn').contains('Save').click();
        // cy.get('.btn').contains('Cancel').click();

        cy.get(
          '[href="/RetailPlusStoreBackend/cycleCount/createCycleCount"]'
        ).click();
        cy.get("#countDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get("#referenceId").type(data[4].referenceId);

        cy.get(".btn").contains("Save").click();
        cy.get(".btn").contains("Cancel").click();

        cy.get(".nav-buttons > .btn").click();

        cy.get(
          '[href="/RetailPlusStoreBackend/cycleCount/createCycleCount"]'
        ).click();
        cy.get("#countDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get("#referenceId").type(data[4].referenceId + 1);

        cy.get(".btn").contains("Save").click();
        cy.get(".nav-buttons > .btn").click();

        cy.get("#documentId").type(data[4].referenceId + 1);

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("tbody>tr").eq(0).find("a").eq(0).click();
          }
        });

        cy.get(".pull-down").contains("Edit").click();

        cy.get("#autoProductList").type(data[2].product);
        cy.wait(4000);
        cy.get("#autoProductList").type("{downArrow}").type("{enter}");
        cy.wait(1000);
        cy.get("#countedQuantity").type(data[2].quantity);

        cy.get(":nth-child(6) > .btn").click();
        cy.wait(1000);
        cy.get("div > input.btn").click();
        cy.wait(1000);
        cy.get(".pull-down").contains("Complete").click();
        cy.get(".pull-down").contains("Print").click();

        cy.get(".nav-buttons > .btn");
      }
    );
  });
});
context("M11 - Audit Count", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });

  it("Validation of Audit Count List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Audit Count");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Audit Count List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Document Id")
      .and("contain", "Facility")
      .and("contain", "Status")
      .and("contain", "Date Counted From")
      .and("contain", "Date Counted To");

    //Fields
    cy.get('input[id="documentId"]').should("be.visible");
    cy.get('input[id="countDateFromSearch"]').should("be.visible");
    cy.get('input[id="countDateFromSearch"]').should("be.visible");
    cy.get('input[id="facility"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".nav-buttons")
      .find("a")
      .should("contain", "Download DAT Files")
      .and("contain", "Upload Item Count");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document Id")
      .and("contain", "Count Date")
      .and("contain", "Status");
  });

  it("Upload Audit Count File", () => {
    cy.fixture("inventory/audit_count_data/audit_count_data").then(
      (audit_count_data) => {
        //Click Inventory file from the menu
        navigateToModule("Inventory");
        //Click Order from the submenu
        navigateToSubModule("Audit Count");

        //Validate that there will be no Error message displayed
        cy.get("h3").contains("Audit Count List");

        //Upload Audit File
        cy.get(".pull-right").find("a").contains("Upload Item Count").click(); //Click Upload Item Count button
        const auditFile = "inventory/audit_count_data/audit_count_file.txt";
        cy.get("#myFile").attachFile(auditFile);
        cy.get("#submitFileBtn").click().wait(2000);

        //Validate Successful upload of audit count file

        cy.get("body").then(($body) => {
          if ($body.find(".alert").length) {
            cy.log("Item Count not successfully uploaded");
          } else {
            cy.get(".popoutDiv")
              .find(".alert1")
              .then(($alert) => {
                if (
                  $alert.text().includes("Item Count successfully uploaded")
                ) {
                  cy.get(".even")
                    .find("a")
                    .eq(0)
                    .then(($documentId) => {
                      const documentIdValue = $documentId.text();
                      cy.log(documentIdValue);

                      cy.get(".even")
                        .find("a")
                        .eq(2)
                        .contains(audit_count_data.new_status);
                    });
                } else {
                  cy.log("Item Count not successfully uploaded");
                }
              });
          }
        });
      }
    );
  });

  it("Search Audit Count", () => {
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Audit Count");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Audit Count List");
    cy.fixture("inventory/audit_count_data/audit_count_data").then(
      (audit_count_data) => {
        cy.get("#documentId").type(audit_count_data.document_id);

        //Click Search Button
        cy.get(".sbs-searchbtn-alignment")
          .find('input[name="_action_list"]')
          .click();

        //Validate Search Result

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find(".even").length > 1) {
            cy.get("even")
              .find("a")
              .should("contain", audit_count_data.document_id)
              .and("contain", audit_count_data.document_id);
          } else {
            cy.log("report empty");
          }
        });
      }
    );
  });

  it("Validation of Show Audit Count Page", () => {
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Audit Count");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Audit Count List");
    cy.fixture("inventory/audit_count_data/audit_count_data").then(
      (audit_count_data) => {
        cy.get("#documentId").type(audit_count_data.document_id);
        cy.get(".sbs-searchbtn-alignment")
          .find('input[name="_action_list"]')
          .click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("a").length > 0) {
            cy.get("tbody")
              .find("a")
              .contains(audit_count_data.document_id)
              .click();
            cy.get(".sbsdiv2")
              .find(".property-label2")
              .should("contain", "Id:")
              .and("contain", "Facility:")
              .and("contain", "Count Date:")
              .and("contain", "Status:")
              .and("contain", "Active SKU:")
              .and("contain", "Carried SKU:")
              .and("contain", "Date Created:")
              .and("contain", "Created By:")
              .and("contain", "Last Updated:")
              .and("contain", "Updated By:")
              .and("contain", "Total Retail Price:");
            cy.get(".active").find("a").contains("Audit Count Item");
            cy.get("h5").contains("Audit Count Item");
            //Labels under tab
            cy.get(".roTdPadding")
              .find("b")
              .should("contain", "Type Location Code:")
              .and("contain", "Type Sequence ID:")
              .and("contain", "Total Retail:")
              .and("contain", "Items Counted");
            //Fields
            cy.get(".roTdPadding")
              .find('input[name="locationSelection"]')
              .should("be.visible");
            cy.get(".roTdPadding")
              .find('input[name="sequenceSelection"]')
              .should("be.visible");
            //Table
            cy.get("thead")
              .find(".sortable")
              .should("contain", "Cat ID")
              .and("contain", "Location")
              .and("contain", "Seq ID")
              .and("contain", "Product")
              .and("contain", "GTIN")
              .and("contain", "Product Name")
              .and("contain", "HT Count")
              .and("contain", "SBS Count")
              .and("contain", "Unit Retail")
              .and("contain", "Auditor")
              .and("contain", "Count Time");
            cy.get("thead")
              .find("th")
              .should("contain", "Adjustment")
              .and("contain", "Total Retail");
          } else {
            cy.log("report empty");
          }
        });

        //Labels
      }
    );
  });

  it("Download DAT Files", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Audit Count");

    //Click Download DAT Fies
    cy.get(".pull-right").find("a").contains("Download DAT Files").click();
    //Validate Successful message
    cy.get(".popoutDiv")
      .find(".alert1")
      .should(
        "contain",
        "DAT files successfully generated in C:/audit/download"
      );
  });
});
context("M12 - Inventory Returns", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();

    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });

    cy.get(".btn").contains("Clear").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Returns List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Returns");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Returns List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Facility")
      .and("contain", "Document ID")
      .and("contain", "Supplier")
      .and("contain", "Return Date From")
      .and("contain", "Return Date To")
      .and("contain", "Status");

    //Fields
    cy.get('input[id="facility"]').should("be.visible");
    cy.get('input[id="apoId"]').should("be.visible");
    cy.get('input[id="autoSupplier"]').should("be.visible");
    cy.get('input[id="returnDateFromSearch"]').should("be.visible");
    cy.get('input[id="returnDateToSearch"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".pull-right").contains("New Returns");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document Id")
      .and("contain", "Return Date")
      .and("contain", "Supplier")
      .and("contain", "Total No. of Items")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail Price")
      .and("contain", "Status");
  });

  it("TC01: S01 - S11", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Returns");

    cy.fixture("inventory/returns_data/m12-returns_tab_data").then((data) => {
      searchSuccess(data[0].docId, data[0].check[0].null);
      searchSuccess(data[0].supplier, data[0].check[1].null);

      searchSuccess(data[1].data[0], data[1].check[0].null, true);
      searchSuccess(data[1].data[1], data[1].check[1].null, true);
      searchSuccess(data[1].data[2], data[1].check[2].null, true);
      searchSuccess(data[1].data[3], data[1].check[3].null, true);
      searchSuccess(data[1].data[4], data[1].check[4].null, true);

      cy.get("#returnDateFromSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[0].returnDateFrom);

      cy.get("#returnDateToSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[0].returnDateTo);

      // new returns
      cy.get(".pull-right > .btn").click();
      cy.get("#autoSupplier").type(data[1].supplier[0].data);
      cy.wait(5000);
      cy.get("#autoSupplier").type("{downArrow}").type("{enter}");
      cy.get("input#returnDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();

      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Print").click();
      cy.get(".btn").contains("Cancel").click();
      cy.get(".btn").contains("<< Back to").click();

      // new returns
      cy.get(".pull-right > .btn").click();
      cy.get("#autoSupplier")
        .type(data[1].supplier[1].data)
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
      cy.get("#returnDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();

      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Edit").click();
      cy.get("#returnDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();

      cy.get("#autoFilteredProduct").type(data[1].supplier[1].name);
      cy.get("#returnQuantity").type(data[1].supplier[1].quantity);
      cy.wait(2000);
      cy.get(".btn").contains("Add").click();
      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Approve").click();
      cy.get(".btn").contains("Complete").click();
      cy.wait(2000);
      cy.get(".btn").contains("<< Back to").click();
    });
  });
});
context("M13 - Bad Merchandise", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });

  it("Validation of Bad Merchandise List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Bad Merchandise");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Bad Merchandise List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Document ID")
      .and("contain", "Facility")
      .and("contain", "Status")
      .and("contain", "BM Date From")
      .and("contain", "BM Date To");

    //Fields
    cy.get('input[id="documentId"]').should("be.visible");
    cy.get('input[id="facility"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");
    cy.get('input[id="countDateFromSearch"]').should("be.visible");
    cy.get('input[id="countDateToSearch"]').should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".pull-right").contains("New Bad Merchandise");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document ID")
      .and("contain", "BM Date");
  });

  it("Create New Bad Merchandise", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Bad Merchandise");
    cy.get("h3").contains("Bad Merchandise List");

    cy.get(".pull-right").find("a").contains("New Bad Merchandise").click();
    //Validate New Bad Merchandise page
    cy.get("h3").contains("Create Bad Merchandise");
    cy.get(".sbsborder")
      .find(".sbs-label")
      .should("contain", "BM Date")
      .and("contain", "Facility")
      .and("contain", "Reference ID");

    cy.fixture("/inventory/bad_merchandise_data/bad_merchandise_data").then(
      (bad_merchandise_data) => {
        cy.get("input#countDate").click();
        cy.get("div#ui-datepicker-div").should("be.visible");
        cy.get(".ui-datepicker-year").select(bad_merchandise_data.bm_year);
        cy.get(".ui-datepicker-month").select(bad_merchandise_data.bm_month);
        cy.get("table.ui-datepicker-calendar a.ui-state-default")
          .contains(bad_merchandise_data.bm_day)
          .click();
        cy.get(".controls")
          .find("#countDate")
          .then(($countDate) => {
            const countDateValue = $countDate.val();
            cy.log(countDateValue);

            //Click Save button
            cy.get(".button-align-right")
              .find('input[name="_action_save"]')
              .click();
            cy.get(".fieldcontain")
              .find('span[aria-labelledby="documentId-label"]')
              .then(($documentId) => {
                const documentIdValue = $documentId.text();
                cy.log(documentIdValue);

                //Validate successful Creation of Order
                cy.get("h3").contains("Show Bad Merchandise");
                cy.get(".popoutDiv")
                  .find('span[class="message alert1"]')
                  .contains("Bad Merchandise created");
                //Document Id
                cy.get(".sbsdiv2")
                  .find("#documentId-label")
                  .contains("Document ID");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .contains(documentIdValue);
                //Facility
                cy.get(".sbsdiv2").find("#status-label").contains("Facility");

                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .then(($el) => {
                    if ($el.text().includes(bad_merchandise_data.facility)) {
                      cy.log(
                        "Property contains",
                        bad_merchandise_data.facility
                      );
                    } else {
                      cy.log(
                        "Property doesnt contains",
                        bad_merchandise_data.facility
                      );
                    }
                  });

                //Reference ID:
                cy.get(".sbsdiv2").find("#status-label").should("be.visible");
                //BM date
                cy.get(".sbsdiv2").find("#countDate-label").contains("BM Date");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .contains(countDateValue);
                //Status
                cy.get(".sbsdiv2").find(".property-label2").contains("Status");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .contains(bad_merchandise_data.new_status);
                //Total Number of Items
                cy.get(".sbsdiv2")
                  .find("#numItems-label")
                  .contains("Total Number of Items");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Total Cost
                cy.get(".sbsdiv2")
                  .find("#totalCost-label")
                  .contains("Total Cost");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Total Retail Price
                cy.get(".sbsdiv2")
                  .find("#totalRetailPrice-label")
                  .contains("Total Retail Price");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Created By
                cy.get(".sbsdiv2")
                  .find("#createdBy-label")
                  .contains("Created By");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Date Created
                cy.get(".sbsdiv2")
                  .find("#dateCreated-label")
                  .contains("Date Created");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Updated By
                cy.get(".sbsdiv2")
                  .find("#updatedBy-label")
                  .contains("Updated By");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");
                //Last Updated
                cy.get(".sbsdiv2")
                  .find("#lastUpdated-label")
                  .contains("Last Updated");
                cy.get(".sbsdiv2")
                  .find(".property-value2")
                  .should("be.visible");

                //Buttons
                cy.get(".pull-down")
                  .find("a")
                  .should("contain", "Print")
                  .and("contain", "Cancel")
                  .and("contain", "Edit");
                cy.get(".pull-right")
                  .find("a")
                  .contains("<< Back to Bad Merchandise List");

                //Tabs
                cy.get(".nav-tabs").find("a").should("contain", "BM Items");

                //Table
                cy.get('table[class="table table-bordered font-small"]')
                  .find("th")
                  .should("contain", "Line No.")
                  .and("contain", "Product ID")
                  .and("contain", "Product")
                  .and("contain", "Quantity")
                  .and("contain", "Unit Cost")
                  .and("contain", "Unit Retail Price")
                  .and("contain", "Total Cost")
                  .and("contain", "Total Retail Price");
              });
          });
      }
    );
  });

  it("Edit Bad Merchandise", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Bad Merchandise");

    cy.get("tbody")
      .find("tr")
      .eq(0)
      .find("td")
      .eq(0)
      .then(($documentId) => {
        const documentIdValue = $documentId.text();
        cy.log(documentIdValue);
        cy.get("tbody")
          .find("a")
          .eq(0)
          .should("have.text", documentIdValue)
          .click();
      });

    cy.get("h3").contains("Show Bad Merchandise");
    cy.get(".pull-down").find("a").contains("Edit").click();
    //Validate Edit Bad Merchandise page
    cy.get("h3").contains("Edit Bad Merchandise");
    cy.get(".sbsborder").find(".sbs-label").contains("BM Date");
    cy.get(".sbsborder").find(".sbs-label").contains("Facility");
    cy.get(".sbsborder").find(".sbs-label").contains("Reference ID");
    cy.get('input[name="_action_update"]').should("be.visible");
    cy.get('input[name="_action_show"]').should("be.visible");
    cy.get("#cycleCountVarianceTable")
      .find("th")
      .should("contain", "Line No.")
      .and("contain", "Product ID")
      .and("contain", "Product")
      .and("contain", "Quantity")
      .and("contain", "Unit Cost")
      .and("contain", "Unit Retail Price")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail Price")
      .and("contain", "Actions");
    cy.get(".typeahead-wrapper")
      .find("#autoBMProductList")
      .should("be.visible");
    cy.get("tbody")
      .find('input[name="_action_badMerchandiseItemSave"]')
      .should("be.visible");

    //Add Product
    cy.fixture("/inventory/bad_merchandise_data/bad_merchandise_data").then(
      (bad_merchandise_data) => {
        cy.get(".typeahead-wrapper")
          .find("#autoBMProductList")
          .type(bad_merchandise_data.product);
        cy.wait(4000);
        cy.get(".typeahead-wrapper")
          .find("#autoBMProductList")
          .type("{downArrow}")
          .type("{enter}");
        //Log BM Item - to use in assertion
        cy.get(".typeahead-wrapper")
          .find("#autoBMProductList")
          .then(($bmItem) => {
            const bmItemName = $bmItem.val();
            cy.log(bmItemName);
            cy.get("tbody")
              .find("#countedQuantity")
              .type(bad_merchandise_data.qty);
            cy.get("tbody")
              .find('input[name="_action_badMerchandiseItemSave"]')
              .click();
            cy.get(".popoutDiv").find(".alert1").contains("BM Item created");
            cy.get('input[name="_action_update"]').click();

            //Validate Updated bad Merchandise
            cy.get(".popoutDiv")
              .find(".alert1")
              .contains("Bad Merchandise updated");
            cy.get("h3").contains("Show Bad Merchandise");
            cy.get("tbody").find("td").contains(bmItemName);

            //Complete Bad Merchandise
            cy.get(".pull-down").find("a").contains("Complete").click();
            cy.get(".popoutDiv")
              .find(".alert1")
              .should(
                "contain",
                "Successfully updated status of Bad Merchandise"
              );
            cy.get(".sbsdiv2").find(".property-value2").contains("Completed");
          });
      }
    );
  });

  it("Search Bad Merchandise", function () {
    cy.fixture("inventory/bad_merchandise_data/bad_merchandise_data").then(
      (bad_merchandise_data) => {
        navigateToModule("Inventory");
        navigateToSubModule("Bad Merchandise");

        //Search and Assert Document ID
        cy.get(".controls")
          .find("#documentId")
          .type(bad_merchandise_data.document_id);
        cy.get('input[name="_action_list"]').click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("tbody")
              .find("tr")
              .eq(0)
              .find("td")
              .eq(0)
              .contains(bad_merchandise_data.document_id);
          } else {
            cy.log("report empty");
          }
        });

        //Clear Search Result
        cy.get(".sbs-searchbtn-alignment").find("a").contains("Clear").click();

        //Search and Assert Status
        cy.get(".controls")
          .find("#f_status")
          .select(bad_merchandise_data.search_status);
        cy.get('input[name="_action_list"]').click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("tbody")
              .find("tr")
              .then((row) => {
                for (let i = 0; i < row.length; i++) {
                  cy.get("tbody>tr")
                    .eq(i)
                    .find("a")
                    .eq(2)
                    .contains(bad_merchandise_data.search_status);
                }
              });
          } else {
            cy.log("report empty");
          }
        });
      }
    );
  });

  it("Search Bad Merchandise Item", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Bad Merchandise");

    cy.fixture("inventory/bad_merchandise_data/bad_merchandise_data").then(
      (bad_merchandise_data) => {
        //Search Bad Merchandise
        cy.get(".controls")
          .find("#documentId")
          .type(bad_merchandise_data.document_id);
        cy.get('input[name="_action_list"]').click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("tbody")
              .find("tr")
              .eq(0)
              .find("td")
              .eq(0)
              .contains(bad_merchandise_data.document_id)
              .click();
            //Search bad Merchandise Product
            //Search via Product ID
            cy.get('span[class="pull-right form-inline"]')
              .find('input[name="cycleCountVarianceSearchCriteria"]')
              .type(bad_merchandise_data.bm_product_id);
            cy.get('button[class="search btn"]').find(".icon-search").click();
            cy.get("tbody")
              .find("tr")
              .eq(0)
              .find("td")
              .eq(1)
              .contains(bad_merchandise_data.bm_product_id);

            //Search via Product Name
            cy.get('span[class="pull-right form-inline"]')
              .find('input[name="cycleCountVarianceSearchCriteria"]')
              .type(bad_merchandise_data.bm_product_name);
            cy.get('button[class="search btn"]').find(".icon-search").click();
            cy.get("tbody")
              .find("tr")
              .eq(0)
              .find("td")
              .eq(2)
              .contains(bad_merchandise_data.bm_product_name);
          } else {
            cy.log("report empty");
          }
        });
      }
    );
  });
});
context("M14 - Inventory Weekly", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();

    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 1) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });

    cy.get(".btn").contains("Clear").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  function validateWeeklySupplies() {
    it("Validation of Weekly Supplies List page", () => {
      //Click Inventory file from the menu
      navigateToModule("Inventory");
      //Click Order from the submenu
      navigateToSubModule("Weekly Supplies");

      //Validate that there will be no Error message displayed
      cy.get("h3").contains("Weekly Supplies List");

      //Labels
      cy.get(".sbs-label")
        .should("contain", "Document ID")
        .and("contain", "Facility")
        .and("contain", "Status")
        .and("contain", "WS Slip Date From")
        .and("contain", "WS Slip Date To");

      //Fields
      cy.get('input[id="wsSlipNo"]').should("be.visible");
      cy.get('input[id="facility"]').should("be.visible");
      cy.get("[id^=f_status]").should("be.visible");
      cy.get('input[id="countDateFromSearch"]').should("be.visible");
      cy.get('input[id="countDateToSearch"]').should("be.visible");

      //Buttons
      cy.get(".sbs-searchbtn-alignment")
        .find('input[name="_action_list"]')
        .should("be.visible"); //Search button
      cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
      cy.get(".pull-right").contains("New Weekly Supplies");

      //Table
      cy.get(".sortable")
        .find("a")
        .should("contain", "Document ID")
        .and("contain", "WS Slip Date")
        .and("contain", "Total Cost")
        .and("contain", "Total Retail Price")
        .and("contain", "Status");
      cy.get("thead").find("th").contains("Total No. of Items");
    });
  }

  login();

  validateWeeklySupplies();

  it("TC01: S01 - S04", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Weekly Supplies");
    cy.fixture(
      "inventory/weekly_supplies_data/m14-weekly_supplies_tab_data"
    ).then((data) => {
      searchSuccess(data[0]);
      searchSuccess(data[1].data[0], data[1].check[0].null, true);
      searchSuccess(data[1].data[1], data[1].check[1].null, true);
      searchSuccess(data[1].data[2], data[1].check[2].null, true);

      cy.get("#countDateFromSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[1].wsSlipDateFrom);

      cy.get("#countDateToSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[1].wsSlipDateFrom);

      cy.get(".pull-right > .btn").click();
      cy.get("#countDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Print").click();
      cy.get(".btn").contains("Cancel").click();
      cy.get(".btn").contains("<< Back to").click();

      cy.get(".pull-right > .btn").click();
      cy.get("#countDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Edit").click();
      cy.get("#autoWeeklySuppliesProductList")
        .click()
        .click()
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
      cy.get("#countedQuantity").type(data[1].quantity);

      cy.get(".btn").contains("Add").click();
      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Complete").click();
      cy.wait(2000);
      cy.get(".btn").contains("<< Back to").click();
    });
  });
});
context("M15 - Price Change", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });

  it("Validation of Price Change List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Retail Price Change");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Price Change List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Document ID")
      .and("contain", "Facility")
      .and("contain", "Status")
      .and("contain", "Price Change Date From")
      .and("contain", "Price Change Date To");

    //Fields
    cy.get('input[id="id"]').should("be.visible");
    cy.get('input[id="facility"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");
    cy.get('input[id="priceChangeDateFromSearch"]').should("be.visible");
    cy.get('input[id="priceChangeDateToSearch"]').should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
    cy.get(".pull-right").contains("New Price Change");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document ID")
      .and("contain", "Price Change Date")
      .and("contain", "Total Price Change")
      .and("contain", "Status");
    cy.get("thead").find("th").contains("No. of Items");
  });

  // it('Create New Retail Price Change', function(){
  // navigateToModule('Inventory')
  // navigateToSubModule('Retail Price Change')
  // cy.fixture('inventory/retail_price_change_data/retail_price_change_data').then((price_change_data) =>{

  //     cy.get('.pull-right').find('a').contains('New Price Change').click()
  //     //Validate Create Price Change
  //     cy.get('h3').contains('Create Price Change')
  //     cy.get('.sbs-input-alignment').find('.sbs-label').should('contain', 'Facility')
  //       .and('contain', 'Price Change Date')
  //       .and('contain', 'Comments')
  //     cy.get('.button-align-right').find('input[name="_action_save"]').should('be.visible')
  //     cy.get('.button-align-right').find('a').contains('Cancel')

  //     //Create Price Change and Save
  //     cy.get('.controls').find('#priceChangeDate').click();
  //     cy.get('div#ui-datepicker-div').should('be.visible');
  //     cy.get('.ui-datepicker-year').select(price_change_data.pc_year);
  //     cy.get('.ui-datepicker-month').select(price_change_data.pc_month);
  //     cy.get('table.ui-datepicker-calendar a.ui-state-default').contains(price_change_data.pc_day).click();
  //     cy.get('.controls').find('#priceChangeDate').then($priceChangeDate => {
  //       const priceChangeDateValue = $priceChangeDate.val()
  //       cy.log(priceChangeDateValue)
  //       cy.get('.button-align-right').find('input[name="_action_save"]').click();

  //       //Validate Created Price Change
  //       cy.get('.popoutDiv').find('.alert1').contains('Product Transfer created');
  //       cy.get('div.sbsborder').find('span#documentId-label').contains('Document ID:')
  //       cy.get('div.sbsborder').find('span#countDate-label').contains('Price Change Date:')
  //       cy.get('div.sbsborder').find('span#facility-label').contains('Facility:')
  //       cy.get('div.sbsborder').find('span#status-label').contains('Status:')
  //       cy.get('div.sbsborder').find('span#dateCreated-label').contains('Total Price Change:')
  //       cy.get('div.sbsborder').find('span#createdBy-label').contains('Date Created:')
  //       cy.get('div.sbsborder').find('span#lastUpdated-label').contains('Created By:')
  //       cy.get('div.sbsborder').find('span#updatedBy-label').contains('Last Updated:')
  //       cy.get('div.sbsborder').find('span#updatedBy-label').contains('Updated By:')
  //       cy.get('div.sbsborder').find('span.property-value').contains(price_change_data.facility)
  //       //Buttons
  //       cy.get('.pull-down').find('a').should('contain', 'Print')
  //         .and('contain', 'Cancel')
  //         .and('contain', 'Complete')
  //         .and('contain', 'Edit');
  //       cy.get('.active').find('a').contains('Product List');
  //       //Table
  //       cy.get('#id="priceChangeItemTable"').find('th').should('contain', 'Line No')
  //         .and('contain', 'Product ID')
  //         .and('contain', 'Product Name')
  //         .and('contain', 'Current Price')
  //         .and('contain', 'New Price')
  //         .and('contain', 'Quantity')
  //         .and('contain', 'Price Difference')
  //         .and('contain', 'Total')
  //     })
  //   })
  // })

  it("Search Price Change", function () {
    cy.fixture(
      "inventory/retail_price_change_data/retail_price_change_data"
    ).then((price_change_data) => {
      navigateToModule("Inventory");
      navigateToSubModule("Price Change");

      //Search and Assert Document ID
      cy.get(".controls")
        .find('input[name="f_docId"]')
        .type(price_change_data.document_id);
      cy.get('input[name="_action_list"]').click();

      cy.get("tbody").then(($tbody) => {
        if ($tbody.find("tr").length > 1) {
          cy.get("tbody")
            .find("tr")
            .eq(0)
            .find("td")
            .eq(0)
            .contains(price_change_data.document_id);
        } else {
          cy.log("report empty");
        }
      });

      //Clear Search Result
      cy.get(".sbs-searchbtn-alignment").find("a").contains("Clear").click();

      //Search and Assert Status
      cy.get(".controls")
        .find("#f_status")
        .select(price_change_data.search_status);
      cy.get('input[name="_action_list"]').click();
      cy.get("tbody")
        .find("tr")
        .then((row) => {
          for (let i = 0; i < row.length; i++) {
            cy.get("tbody>tr")
              .eq(i)
              .find("a")
              .eq(4)
              .contains(price_change_data.search_status);
          }
        });
    });
  });
});
context("M15 - Product Transfer", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });

  it("Validation of Product Transfer List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Product Transfer");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Product Transfer List");

    //Labels
    cy.get(".sbs-label")
      .should("contain", "Document ID")
      .and("contain", "Facility")
      .and("contain", "Status")
      .and("contain", "PT Slip Date From")
      .and("contain", "PT Slip Date To");

    //Fields
    cy.get('input[id="id"]').should("be.visible");
    cy.get('input[id="facility"]').should("be.visible");
    cy.get("[id^=f_status]").should("be.visible");
    cy.get('input[id="productTransferFromSearch"]').should("be.visible");
    cy.get('input[id="productTransferToSearch"]').should("be.visible");

    //Buttons
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .should("be.visible"); //Search button
    cy.get(".sbs-searchbtn-alignment")
      .find('input[value="Clear"]')
      .should("be.visible"); //Clear Button
    cy.get(".pull-right").contains("New Product Transfer");

    //Table
    cy.get(".sortable")
      .find("a")
      .should("contain", "Document ID")
      .and("contain", "PT Slip Date")
      .and("contain", "Status")
      .and("contain", "Total Cost")
      .and("contain", "Total Retail Price");
    cy.get("thead").find("th").contains("Total No. of Items");
  });

  it("Create New Product Transfer", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Product Transfer");
    cy.fixture("inventory/product_transfer_data/product_transfer_data").then(
      (product_transfer_data) => {
        cy.get(".pull-right")
          .find("a")
          .contains("New Product Transfer")
          .click();
        //Validate Create Product Transfer
        cy.get("h3").contains("Create Product Transfer");
        cy.get(".sbs-input-alignment")
          .find(".sbs-label")
          .should("contain", "Facility")
          .and("contain", "PT Slip Date");
        cy.get(".button-align-right")
          .find('input[name="_action_save"]')
          .should("be.visible");
        cy.get(".button-align-right").find("a").contains("Cancel");

        //Create Return and Save
        cy.get(".controls").find('[name="countDate"]').click();
        cy.get("div#ui-datepicker-div").should("be.visible");
        cy.get(".ui-datepicker-year").select(product_transfer_data.pt_year);
        cy.get(".ui-datepicker-month").select(product_transfer_data.pt_month);
        cy.get("table.ui-datepicker-calendar a.ui-state-default")
          .contains(product_transfer_data.pt_day)
          .click();
        cy.get(".controls")
          .find('[name="countDate"]')
          .then(($productTransferDate) => {
            const productTransferDateValue = $productTransferDate.val();
            cy.log(productTransferDateValue);
            cy.get(".button-align-right")
              .find('input[name="_action_save"]')
              .click();

            //Validate Created Return
            cy.get(".popoutDiv")
              .find(".alert1")
              .contains("Product Transfer created");
            cy.get("div.sbsborder")
              .find("span#documentId-label")
              .contains("Document ID:");
            cy.get("div.sbsborder")
              .find("span#countDate-label")
              .contains("PT Slip Date:");
            cy.get("div.sbsborder")
              .find("span#facility-label")
              .contains("Facility:");
            cy.get("div.sbsborder")
              .find("span#status-label")
              .contains("Status:");
            cy.get("div.sbsborder")
              .find("span#dateCreated-label")
              .contains("Date Created:");
            cy.get("div.sbsborder")
              .find("span#createdBy-label")
              .contains("Created By:");
            cy.get("div.sbsborder")
              .find("span#lastUpdated-label")
              .contains("Last Updated:");
            cy.get("div.sbsborder")
              .find("span#updatedBy-label")
              .contains("Updated By:");

            cy.get("div.sbsborder")
              .find("span.property-value")
              .then(($el) => {
                if ($el.text().includes(product_transfer_data.facility)) {
                  cy.get("div.sbsborder")
                    .find("span.property-value")
                    .contains(product_transfer_data.facility);
                } else {
                  cy.log(
                    "Facility doesnt match to",
                    product_transfer_data.facility
                  );
                }
              });

            //Buttons
            cy.get(".pull-down")
              .find("a")
              .should("contain", "Print")
              .and("contain", "Cancel")
              .and("contain", "Edit");
            cy.get(".active").find("a").contains("Product List");
            //Table
            cy.get("#productTransferItemTable")
              .find("th")
              .should("contain", "Line No.")
              .and("contain", "Product")
              .and("contain", "Product Name")
              .and("contain", "Quantity")
              .and("contain", "Destination")
              .and("contain", "Unit Cost")
              .and("contain", "Unit Retail Price")
              .and("contain", "Total Cost")
              .and("contain", "Total Price");
          });
      }
    );
  });

  it("Edit Product Transfer", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Product Transfer");

    cy.get("#f_status").select("Created");
    cy.get('[type="submit"]').click();

    cy.get("tbody")
      .find("tr")
      .eq(0)
      .find("td")
      .eq(0)
      .then(($documentId) => {
        const documentIdValue = $documentId.text().trim();
        cy.log(documentIdValue);
        cy.get("tbody").find("a").eq(0).contains(documentIdValue).click();

        cy.get("h3").contains("Show Product Transfer");
        cy.get(".pull-down").find("a").contains("Edit").click();
        //Validate Edit Bad Merchandise page
        cy.get("h3").contains("Edit Product Transfer");
        cy.get(".sbs-input-alignment")
          .find(".sbs-label")
          .should("contain", "Facility")
          .and("contain", "PT Slip Date");
        cy.get('input[name="_action_update"]').should("be.visible");
        cy.get("#productTransferItemTable")
          .find("th")
          .should("contain", "Line No.")
          .and("contain", "Product")
          .and("contain", "Product Name")
          .and("contain", "Quantity")
          .and("contain", "Destination")
          .and("contain", "Unit Cost")
          .and("contain", "Unit Retail Price")
          .and("contain", "Total Cost")
          .and("contain", "Total Price")
          .and("contain", "Actions");
        cy.get("tbody").find("#autoFilteredProduct").should("be.visible");
        cy.get("tbody").find('input[name="variance"]').should("be.visible");
        cy.get("tbody")
          .find("input#autoFilteredProductDest")
          .should("be.visible");
        cy.get("tbody")
          .find('input[name="_action_productTransferItemSave"]')
          .should("be.visible");
      });

    //Add Product
    cy.fixture("/inventory/product_transfer_data/product_transfer_data").then(
      (product_transfer_data) => {
        cy.get(".typeahead-wrapper")
          .find("#autoFilteredProduct")
          .click()
          .wait(3000);
        cy.get(".typeahead-wrapper")
          .find("#autoFilteredProduct")
          .type(product_transfer_data.product);
        cy.wait(5000);
        cy.get(".typeahead-wrapper")
          .find("#autoFilteredProduct")
          .type("{downArrow}")
          .type("{enter}");
        //Log BM Item - to use in assertion
        cy.get("tbody")
          .find("#autoFilteredProduct")
          .then(($ptItem) => {
            const ptItemName = $ptItem.val();
            cy.log(ptItemName);
            cy.get("tbody")
              .find('input[id="variance"]')
              .type(product_transfer_data.qty);
            cy.get("tbody")
              .find('input[id="autoFilteredProductDest"]')
              .type(product_transfer_data.destination)
              .wait(1000)
              .type("{downArrow}")
              .wait(2000)
              .type("{enter}")
              .wait(1000);
            cy.get("tbody")
              .find('input[name="_action_productTransferItemSave"]')
              .click();
            cy.get(".popoutDiv")
              .find(".alert1")
              .contains("Product Transfer Item created");
            cy.get('input[name="_action_update"]').click();

            //Validate Updated Returns
            cy.get(".popoutDiv")
              .find(".alert1")
              .contains("Product Transfer updated");
            cy.get("h3").contains("Show Product Transfer");
            cy.get("tbody").find("td").contains(ptItemName);
            // cy.get('.fieldcontain').find('.property-value2').contains(documentIdValue)

            //Complete Product Transfer
            cy.get(".pull-down").find("a").contains("Complete").click();
            cy.get(".popoutDiv")
              .find(".alert1")
              .contains("Successfully updated status of Product Transfer");
            cy.get(".sbsdiv3").find(".property-value").contains("Completed");
          });
      }
    );
  });

  it("Search Product Transfer", function () {
    cy.fixture("inventory/product_transfer_data/product_transfer_data").then(
      (product_transfer_data) => {
        navigateToModule("Inventory");
        navigateToSubModule("Product Transfer");

        //Search and Assert Document ID
        cy.get(".controls").find("#id").type(product_transfer_data.document_id);
        cy.get('input[name="_action_list"]').click();

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("tbody")
              .find("tr")
              .eq(0)
              .find("td")
              .eq(0)
              .contains(product_transfer_data.document_id);
          } else {
            cy.log("report empty");
          }
        });

        //Clear Search Result
        cy.get(".sbs-searchbtn-alignment").find('input[value="Clear"]').click();

        //Search and Assert Status
        cy.get(".controls")
          .find("#f_status")
          .select(product_transfer_data.search_status);
        cy.get('input[name="_action_list"]').click();
        cy.get("tbody")
          .find("tr")
          .then((row) => {
            for (let i = 0; i < row.length; i++) {
              cy.get("tbody>tr")
                .eq(i)
                .find("a")
                .eq(5)
                .contains(product_transfer_data.search_status);
            }
          });
      }
    );
  });
});
context("M16 - Inventory Purchase", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 1) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 1) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });
    cy.get(".btn").contains("Clear").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  function validatePage() {
    it("Validation of Price Change List page", () => {
      //Click Inventory file from the menu
      navigateToModule("Inventory");
      //Click Order from the submenu
      navigateToSubModule("Purchase Order");

      //Validate that there will be no Error message displayed
      cy.get("h3").contains("Purchase Order List");

      //Labels
      cy.get(".sbs-label")
        .should("contain", "Document ID")
        .and("contain", "Order Date From:")
        .and("contain", "Order Date To:")
        .and("contain", "Facility")
        .and("contain", "Supplier:")
        .and("contain", "Status:");

      //Fields
      cy.get('input[id="documentId"]').should("be.visible");
      cy.get('input[id="orderDateFromSearch"]').should("be.visible");
      cy.get('input[id="orderDateToSearch"]').should("be.visible");
      cy.get('input[id="facility"]').should("be.visible");
      cy.get('input[id="autoSeller"]').should("be.visible");
      cy.get("[id^=f_status]").should("be.visible");

      //Buttons
      cy.get(".sbs-searchbtn-alignment")
        .find('input[name="_action_list"]')
        .should("be.visible"); //Search button
      cy.get(".sbs-searchbtn-alignment").find("a").should("contain", "Clear"); //Clear Button
      cy.get(".pull-right").contains("New Purchase Order");

      //Table
      cy.get(".sortable")
        .find("a")
        .should("contain", "Document ID")
        .and("contain", "Order Date")
        .and("contain", "Supplier")
        .and("contain", "Delivery Date")
        .and("contain", "Total Number of Items")
        .and("contain", "Total Cost")
        .and("contain", "Total Retail Price")
        .and("contain", "Status");
    });
  }

  login();

  validatePage();

  it("TC01: S01 - S06", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Purchase Order");
    cy.fixture(
      "/inventory/purchase_order_data/m16-purchase_order_tab_data"
    ).then((data) => {
      searchSuccess(data[0]);
      searchSuccess(data[1].data[0], data[1].check[0].null, true);
      searchSuccess(data[1].data[1], data[1].check[1].null, true);
      searchSuccess(data[1].data[2], data[1].check[2].null, true);
      searchSuccess(data[1].data[3], data[1].check[3].null, true);
      searchSuccess(data[1].data[4], data[1].check[4].null, true);

      cy.get("#orderDateFromSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[1].orderDateFromSearch);

      cy.get("#orderDateToSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear(data[1].orderDateToSearch);

      cy.get("#autoSeller")
        .type(data[1].autoSeller)
        .click()
        .click()
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
    });
  });

  it("TC01: S07 - S11", () => {
    navigateToModule("Inventory");
    navigateToSubModule("Purchase Order");
    cy.fixture(
      "/inventory/purchase_order_data/m16-purchase_order_tab_data"
    ).then((data) => {
      cy.get('[href="/RetailPlusStoreBackend/purchaseOrder/create"]').click();
      cy.get("#autoSeller")
        .type(data[1].autoSeller)
        .click()
        .click()
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
      cy.get("#orderDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#deliveryDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#cancelIfNotDeliveredBy").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#referenceId").type(data[1].comment);

      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Print").click();
      cy.get(".btn").contains("Cancel").click();
      cy.get(".btn").contains("<< Back to").click();

      cy.get('[href="/RetailPlusStoreBackend/purchaseOrder/create"]').click();
      cy.get("#autoSeller")
        .type(data[2].autoSeller)
        .click()
        .click()
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
      cy.get("#orderDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#deliveryDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#cancelIfNotDeliveredBy").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get("#referenceId").type(data[2].comment);

      cy.get(".btn").contains("Save").click();
      cy.get(".btn").contains("Edit").click();
      cy.get("#autoFilteredProduct")
        .click()
        .wait(5000)
        .type("{downArrow}")
        .type("{enter}");
      cy.get("#orderQuantity").type(data[2].quantity);
      cy.get(".btn").contains("Add").click();
      cy.get(".btn").contains("Save").click();
      //cy.get('.btn').contains('Download').click();
      cy.get(".btn").contains("Approve").click();
      cy.get(".btn").contains("Complete").click();

      cy.get(".nav-tabs > :nth-child(2) > a").click();
      cy.get(".btn").contains("<< Back to").click();
    });
  });
});

context("M17 - Dispatch Advice", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function navigateToSubModule2(subModule2) {
    cy.get("li").contains(subModule2).last().click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function generateRandomString(string_length) {
    let text = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < string_length; i++)
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return text;
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();
      });
    });
  });

  it("Validation of Dispatch Advice List page", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Order from the submenu
    navigateToSubModule("Dispatch Advice");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Dispatch Advice List");
  });

  it("Search dispatch advice", () => {
    //Click Inventory file from the menu
    navigateToModule("Inventory");
    //Click Dispatch Advice from the submenu
    navigateToSubModule("Dispatch Advice");

    //Validate that there will be no Error message displayed
    cy.get("h3").contains("Dispatch Advice List");

    //documentID
    cy.get('input[id="documentId"]').type("123456");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    //status
    cy.get("[id^=f_status]").select("Created");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    cy.get("[id^=f_status]").select("Approved");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    cy.get("[id^=f_status]").select("Received");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    cy.get("[id^=f_status]").select("Completed");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    cy.get("[id^=f_status]").select("Cancelled");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    //date
    cy.get('input[id="deliveryDateFrom"]').click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    cy.get('input[id="deliveryDateTo"]').click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button

    //destination
    cy.get('input[id="autoDispatchTo"]')
      .type("0352")
      .type("{downArrow}")
      .type("{enter}");
    cy.get(".sbs-searchbtn-alignment")
      .find('input[name="_action_list"]')
      .click(); //Search button
    cy.wait(2000);
    cy.get(".sbs-searchbtn-alignment").find("a").click(); //Clear Button
  });

  it("Create new disptach advice", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Dispatch Advice");
    const generatedRandomString = generateRandomString(7);
    cy.get(".pull-right").find("a").contains("New Dispatch Advice").click();
    //Validate Create Dispatch Advice
    cy.get("h3").contains("Create Dispatch Advice");
    cy.get(".sbs-input-alignment")
      .find(".sbs-label")
      .should("contain", "Document Id")
      .and("contain", "Destination")
      .and("contain", "Origin")
      .and("contain", "Dispatch Advice Date")
      .and("contain", "Reference Id")
      .and("contain", "Carrier Type")
      .and("contain", "Carrier Description");
    cy.get(".button-align-right")
      .find('input[name="_action_save"]')
      .should("be.visible");
    cy.get(".button-align-right")
      .find('input[name="_action_list"]')
      .should("be.visible");

    cy.fixture("inventory/dispatch_advice_data/dispatch_advice_data").then(
      (dispatch_advice_data) => {
        //Create Dispatch and Save
        cy.get(".controls")
          .find('input[name="documentId"]')
          .type(generatedRandomString);
        cy.get(".controls")
          .find("#autoFacilityList")
          .type("{downArrow}")
          .type("{downArrow}")
          .type("{enter}");
        cy.get(".controls").find('[name="deliveryDate"]').click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get("#referenceId").type("test");
        cy.get("#carrierType").type("test");
        cy.get("#carrierDescription").type("test");
        cy.get(".button-align-right")
          .find('input[name="_action_save"]')
          .click();
      }
    );

    cy.get(".pull-down").find("a").contains("Print").click();
    cy.get(".pull-down").find("a").contains("Cancel").click();
    cy.wait(2000);
    cy.get(".nav-buttons > .btn").click();
  });

  it("Test to verify if user can complete return", function () {
    navigateToModule("Inventory");
    navigateToSubModule("Dispatch Advice");
    const generatedRandomString = generateRandomString(7);
    cy.get(".pull-right").find("a").contains("New Dispatch Advice").click();
    //Validate Create Dispatch Advice
    cy.get("h3").contains("Create Dispatch Advice");
    cy.get(".sbs-input-alignment")
      .find(".sbs-label")
      .should("contain", "Document Id")
      .and("contain", "Destination")
      .and("contain", "Origin")
      .and("contain", "Dispatch Advice Date")
      .and("contain", "Reference Id")
      .and("contain", "Carrier Type")
      .and("contain", "Carrier Description");
    cy.get(".button-align-right")
      .find('input[name="_action_save"]')
      .should("be.visible");
    cy.get(".button-align-right")
      .find('input[name="_action_list"]')
      .should("be.visible");

    cy.fixture("inventory/dispatch_advice_data/dispatch_advice_data").then(
      (dispatch_advice_data) => {
        //Create Dispatch and Save
        cy.get(".controls")
          .find('input[name="documentId"]')
          .type(generatedRandomString);
        cy.get(".controls").find("#autoFacilityList").click();
        cy.wait(4000);

        cy.get(".controls")
          .find("#autoFacilityList")
          .type("{downArrow}")
          .type("{enter}");
        cy.get(".controls").find('[name="deliveryDate"]').click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get("#referenceId").type("test");
        cy.get("#carrierType").type("test");
        cy.get("#carrierDescription").type("test");
        cy.get(".button-align-right")
          .find('input[name="_action_save"]')
          .click();
      }
    );
    cy.wait(2000);
    cy.get(".pull-down").find("a").contains("Edit").click();
    cy.get("#autoProductListDispatchAdvice").type("{downArrow}").wait(2000);
    cy.get("#autoProductListDispatchAdvice")
      .type("{downArrow}")
      .type("{enter}");
    cy.get("#sscc").type("1");
    cy.get("#dispatchedQuantity").type(10);
    cy.get(":nth-child(15) > .btn").click();
    cy.get('[name="_action_update"]').click();
    cy.get(".pull-down").find("a").contains("Approve").click();

    cy.get(".nav-buttons > .btn").click();
  });
});
context("M17 - Service Sales", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function validateModule() {
    cy.get("h3").contains("Service Sales List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Status");
    cy.get("label").contains("Business Date From");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Prepared By");
    cy.get(".sortable").contains("Status");
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();
      });
    });
  });

  it("Validation of Service List List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Service Sales");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("Search service sales", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Shift Worksheet from menu list
    navigateToSubModule("Service Sales");

    //Validate that there will be no Error message displayed
    validateModule();

    cy.fixture("sales/service_sales/search_service_sales_list_data").then(
      (data) => {
        //Search Using Status
        cy.get("[id^=f_status]").select("Created");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );

    cy.fixture("sales/service_sales/search_service_sales_list_data").then(
      (data) => {
        //Search Using Status
        cy.get("[id^=f_status]").select("Approved");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );

    cy.fixture("sales/service_sales/search_service_sales_list_data").then(
      (data) => {
        //Search Using Status
        cy.get("[id^=f_status]").select("Cancelled");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );

    cy.fixture("sales/service_sales/search_service_sales_list_data").then(
      (data) => {
        //Search Using Status
        cy.get('input[id="fromDateSearch"]').click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );

    cy.fixture("sales/service_sales/search_service_sales_list_data").then(
      (data) => {
        //Search Using Status
        cy.get('input[id="thruDateSearch"]').click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );
  });

  it("Create purchase order", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Shift Worksheet from menu list
    navigateToSubModule("Service Sales");

    //Validate that there will be no Error message displayed
    validateModule();

    cy.get(".pull-right > .btn").click();
    cy.get('input[id="businessDate"]').click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    cy.get(".btn").contains("Save").click();
  });
});
context("M18 - Sales Events", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    let check;
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("table tbody")
          .then(($tbody) => {
            check = $tbody.find("tr").length;
            cy.log(`Rows inside tbody ${check}`);
          })
          .then(() => {
            cy.wrap(check).then((value) => {
              if (value > 0) {
                cy.get("table").should("have.descendants", "td");
              } else {
                cy.get(".message").should("contain", "Result not found.");
              }
            });
          });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear() {
    let check;
    cy.get(".btn").contains("Search").click();
    cy.get("table tbody")
      .then(($tbody) => {
        check = $tbody.find("tr").length;
        cy.log(`Rows inside tbody ${check}`);
      })
      .then(() => {
        cy.wrap(check).then((value) => {
          if (value > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });
      });

    cy.get(".btn").contains("Clear").click();
  }

  function validateEventModule() {
    cy.get("h3").contains("Event List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Event Type");
    cy.get("label").contains("Pos :");
    cy.get("label").contains("Business Date From");
    cy.get("label").contains("Business Date To");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Date Created");
    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Type");
    cy.get(".sortable").contains("POS");
    cy.get(".sortable").contains("Shift");
    cy.get(".sortable").contains("Receipt");
  }

  function performSearch() {
    cy.get(":nth-child(4) > .sbs-searchbtn-alignment > input.btn")
      .click()
      .wait(700);
  }

  beforeEach(() => {
    cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
      cy.visit(sbs_credentials.url);
      cy.contains("Username");
      cy.contains("Password");
      cy.contains("Login");
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.get("[id^=username]").type(sbs_credentials.username);
        cy.get("[id^=password]").type(sbs_credentials.password);
        cy.get("[id^=submit]").click();

        cy.contains("Masterfile");
        cy.contains("Matrix");
        cy.contains("Inventory");
        cy.contains("Sales");
        cy.contains("Report");
        cy.contains("Misc");
        cy.contains("Sign out");
      });
    });
  });
  it("Validation of Event List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Events");

    //Validate that there will be no Error message displayed
    validateEventModule();
  });

  it("TC01: S01 - S05", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Events");

    cy.fixture("sales/events/m18-sales-events").then((data) => {
      for (let i = 0; i < data[0].eventType.length; i++) {
        searchSuccess(data[0].eventType[i], true);
      }

      cy.get("#autoPosTerminal").type("1");
      searchClear();

      cy.get("#fromDateSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      cy.get("#thruDateSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();
    });
  });

  it("TC02: S01 - S03", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Events");

    //SO1
    cy.get("#f_type").within(() => {
      cy.get('[value="Sale"]').should("exist");
    });
    cy.wait(700);

    searchWithCategory("f_type", "Sale");
    cy.wait(700);

    searchWithOneField("autoPosTerminal", "1");
    cy.wait(700);
    cy.get("tbody")
      .find("tr")
      .then((row) => {
        for (let i = 0; i < row.length; i++) {
          cy.get("tbody>tr").eq(i).find("a").eq(3).contains("POS 1");
        }
      });

    cy.get("#fromDateSearch").click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    performSearch();

    cy.get("#thruDateSearch").click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    performSearch();

    //SO2
    cy.wait(700);
    cy.get('[name="_action_downloadAll"]').click();
    //SO3
    cy.wait(700);
    cy.get('[name="_action_printAll"]').click();
    cy.get(".sbs-button").contains("Clear").click();
  });

  it("TC03: S04 - S06", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Events");
    cy.fixture("sales/events/search_event_list_data").then((data) => {
      //Check PrinzReport Exist
      cy.get("#f_type").within(() => {
        cy.get('[value="PrintZReport"]').should("exist");
      });
      cy.wait(700);

      //Select PrintZReport Option
      cy.get("#f_type").select("PrintZReport");
      cy.wait(700);

      //Click Search
      cy.get(":nth-child(4) > .sbs-searchbtn-alignment > input.btn").click();
      cy.wait(700);

      //Input POS
      cy.get("#autoPosTerminal").type(data.pos_number);
      cy.wait(700);

      //Click Search
      cy.get(":nth-child(4) > .sbs-searchbtn-alignment > input.btn").click();
      cy.wait(700);

      //input date from
      cy.get("#fromDateSearch")
        .invoke("removeAttr", "readonly")
        .type(data.businessDateFrom);
      cy.wait(700);

      //Click Search
      cy.get(":nth-child(4) > .sbs-searchbtn-alignment > input.btn").click();
      cy.wait(700);

      //input date to
      cy.get("#thruDateSearch")
        .invoke("removeAttr", "readonly")
        .type(data.businessDateTo);
      cy.wait(700);

      //Click Search
      cy.get(":nth-child(4) > .sbs-searchbtn-alignment > input.btn").click();
      cy.wait(700);
    });

    //Click Download All
    cy.wait(700);
    cy.get('[name="_action_downloadAll"]').click();

    //Click Print All
    cy.wait(700);
    cy.get('[name="_action_printAll"]').click();
    cy.get(".sbs-button").contains("Clear").click();
    cy.get(".navbar-text > a").click();
  });
});
context("M19 - Sales Transaction", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function validateTransactionModule() {
    cy.get("h3").contains("Transaction List");
    cy.get("label").contains("Receipt Number");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Pos");
    cy.get("label").contains("ERC Number:");
    cy.get("label").contains("Sales Date From:");
    cy.get("label").contains("Sales Date To:");
    cy.get("label").contains("Status:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Receipt #");
    cy.get(".sortable").contains("Pos");
    cy.get(".sortable").contains("Shift");
    cy.get(".sortable").contains("Total Amount");
    cy.get(".sortable").contains("Date Ordered");
    cy.get(".sortable").contains("Date Created");
    cy.get(".sortable").contains("Status");
  }

  beforeEach(() => {
    cy.visit("/RetailPlusStoreBackend/login/auth");
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
    cy.fixture("sbs_credentials/sbs_credentials.json").then((login_data) => {
      cy.get("[id^=username]").type(login_data.username);
      cy.get("[id^=password]").type(login_data.password);
    });
    cy.get("[id^=submit]").click();
  });

  it("Validation of Transaction List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Transactions");

    //Validate that there will be no Error message displayed
    validateTransactionModule();
  });

  it("Search Transaction", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Transactions");

    //Validate that there will be no Error message displayed
    validateTransactionModule();

    cy.fixture("sales/transactions/search_transaction_list_data").then(
      (data) => {
        //Search Using Receipt Number
        cy.get("#receiptNumber").type(data.receipt_number);
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search Using POS Number
        const posNumber = "POS " + data.pos_number;
        cy.get(".numberInput").type(posNumber);
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search Using ERC Number
        cy.get("#loyaltyCardNumber").type("1");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search using date from
        cy.get("#salesDateFrom").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search using date to
        cy.get("#salesDateTo").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search Using Status
        cy.get("[id^=f_status]").select("Created");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        cy.get("[id^=f_status]").select("Completed");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        cy.get("[id^=f_status]").select("Cancelled");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );
  });
});
context("M20 - Sales Claim Order", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }
        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });
        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    if (check) {
      cy.get("table").should("have.descendants", "td");
    } else {
      cy.get(".message").should("contain", "Result not found.");
    }
    cy.get(".btn").contains("Clear").click();
  }

  function validateModule() {
    cy.get("h3").contains("Claim Order List");
    cy.get("label").contains("Document ID");
    cy.get("label").contains("Facility");
    cy.get("label").contains("ERC Number:");
    cy.get("label").contains("Claim Date From:");
    cy.get("label").contains("Claim Date To:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get("th").contains("Document ID");
    cy.get("th").contains("Buyer");
    cy.get("th").contains("Total Items");
    cy.get("th").contains("Total Amount");
    cy.get("th").contains("Claim Date");
    cy.get("th").contains("Date Created");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Claim Order List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Claim Order from menu list
    navigateToSubModule("Claim Order");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("TC01: S01 - S05", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Claim Order from menu list
    navigateToSubModule("Claim Order");

    //Validate that there will be no Error message displayed
    validateModule();

    cy.fixture("sales/claim_order/m20-sales-claim_order.json").then((data) => {
      searchSuccess(data[0]);

      cy.get("#salesDateFrom").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      cy.get("#salesDateTo").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();
    });
  });
});
context("M21 - Sales Shift", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function validateShiftWorksheetModule() {
    cy.get("h3").contains("Shift Work Sheet List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Pos:");
    cy.get("label").contains("Shift:");
    cy.get("label").contains("Business Date From:");
    cy.get("label").contains("Business Date To:");
    cy.get("label").contains("Status:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("POS");
    cy.get(".sortable").contains("Shift");
    cy.get(".sortable").contains("Cashier");
    cy.get(".sortable").contains("Status");
  }

  beforeEach(() => {
    cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
    cy.fixture("sbs_credentials/sbs_credentials.json").then((login_data) => {
      cy.get("[id^=username]").type(login_data.username);
      cy.get("[id^=password]").type(login_data.password);
    });
    cy.get("[id^=submit]").click();
  });

  it("Validation of Shift Worksheet List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Transactions from menu list
    navigateToSubModule("Shift Worksheet");

    //Validate that there will be no Error message displayed
    validateShiftWorksheetModule();
  });

  it("Search Shift Worksheet", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Shift Worksheet from menu list
    navigateToSubModule("Shift Worksheet");

    //Validate that there will be no Error message displayed
    validateShiftWorksheetModule();

    cy.fixture("sales/shift_worksheet/search_shift_worksheet_list_data").then(
      (data) => {
        //Search Using POS Number
        cy.get("#autoPosTerminal").type(data.pos_number);
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search Using shift number
        cy.then(() => {
          for (let i = 1; i < 11; i++) {
            cy.get("#shift").select(i);
            cy.get(".btn").contains("Search").click();
            cy.wait(2000);
            cy.get(".btn").contains("Clear").click();
          }
        });

        //Search using date from
        cy.get("#businessDateFromSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search using date to
        cy.get("#businessDateToSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        //Search Using Status
        cy.get("[id^=f_status]").select("IN PROCESS");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();

        cy.get("[id^=f_status]").select("APPROVED");
        cy.get(".btn").contains("Search").click();
        cy.wait(2000);
        cy.get(".btn").contains("Clear").click();
      }
    );
  });
});
context("M22 - Sales Store Disbursement", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });
    cy.get(".btn").contains("Clear").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  function validateModule() {
    cy.get("h3").contains("Disbursement List");
    cy.get("label").contains("Document No.");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Status");
    cy.get("label").contains("Business Date From");
    cy.get("label").contains("Business Date To");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Document ID");
    cy.get(".sortable").contains("Document No.");
    cy.get(".sortable").contains("Date Created");
    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Total Amount");
    cy.get(".sortable").contains("Status");
  }

  login();

  it("Validation of Service List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Store Disbursement from menu list
    navigateToSubModule("Store Disbursement");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("TC01: S01 - S10", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Store Disbursement from menu list
    navigateToSubModule("Store Disbursement");

    //Validate that there will be no Error message displayed
    validateModule();

    cy.fixture("sales/store_disbursement/m22-sales-store_disbursement").then(
      (data) => {
        searchSuccess(data[0]);

        searchSuccess(data[1].data[0], false, true);
        searchSuccess(data[1].data[1], false, true);
        searchSuccess(data[1].data[2], false, true);

        cy.get("#businessDateFromSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        searchClear(data[1].wsSlipDateFrom);

        cy.get("#businessDateToSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        searchClear(data[1].wsSlipDateFrom);

        // new disbursement
        cy.get(".pull-right > .btn").click();

        cy.get("#referenceId").type(data[2].referenceId);
        cy.get("#businessDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();

        cy.get(".btn").contains("Save").click();

        cy.get("body").then(($body) => {
          if ($body.find(".alert").length) {
            if (
              $body
                .find(".alert")
                .text()
                .includes("Disbursement must be unique.")
            ) {
              cy.log("Disbursement date or id already exist");
            }
          } else {
            cy.get(".btn").contains("Print").click();
            cy.get(".btn").contains("Cancel").click();
            cy.get(".btn").contains("<< Back to").click();

            // new disbursement
            cy.get(".pull-right > .btn").click();

            cy.get("#referenceId").type(data[2].referenceId);
            cy.get("#businessDate").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();

            cy.get(".btn").contains("Save").click();
            cy.get(".btn").contains("Edit").click();
            cy.get("#autoAccountList")
              .click()
              .click()
              .wait(5000)
              .type("{downArrow}")
              .type("{enter}");
            cy.get("#autoParticularsList")
              .click()
              .click()
              .wait(5000)
              .type("{downArrow}")
              .type("{enter}");
            cy.get("#amount").type(data[2].amount);
            cy.get("#vatStatus").select(data[2].vat);

            cy.get(".btn").contains("Add").click();
            cy.get(".btn").contains("Save").click();
            cy.get(".btn").contains("Approve").click();
            cy.get(".btn").contains("<< Back to").click();
          }
        });
      }
    );
  });
});
context("M23 - Sales Funds", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function generateRandomString(string_length) {
    let text = "";
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < string_length; i++)
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return text;
  }

  function validateModule() {
    cy.get("h3").contains("Fund List");
    cy.get("label").contains("Document No");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Status");
    cy.get("label").contains("Business Date From");
    cy.get("label").contains("Business Date To");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Document Id");
    cy.get(".sortable").contains("Date Created");
    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Total Amount");
    cy.get(".sortable").contains("Status");
  }

  beforeEach(() => {
    cy.visit("http://localhost:8080/RetailPlusStoreBackend/login/auth");
    cy.contains("Username");
    cy.contains("Password");
    cy.contains("Login");
    cy.fixture("sbs_credentials/sbs_credentials.json").then((login_data) => {
      cy.get("[id^=username]").type(login_data.username);
      cy.get("[id^=password]").type(login_data.password);
    });
    cy.get("[id^=submit]").click();
  });

  it("Validation of Fund List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Funds from menu list
    navigateToSubModule("Funds");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("Search Funds", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Funds from menu list
    navigateToSubModule("Funds");

    //Validate that there will be no Error message displayed
    validateModule();

    cy.fixture("sales/funds/search_fund_list_data").then((data) => {
      //Search Using Document No.
      cy.get("#id").type("1");
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();

      //Search Using Status
      cy.get("[id^=f_status]").select("Created");
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();

      cy.get("[id^=f_status]").select("Cancelled");
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();

      cy.get("[id^=f_status]").select("Approved");
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();

      //Search using date from
      cy.get("#businessDateFromSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();

      //Search using date to
      cy.get("#businessDateToSearch").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      cy.get(".btn").contains("Search").click();
      cy.wait(2000);
      cy.get(".btn").contains("Clear").click();
    });
  });

  it("Create, Print, Cancel fund", () => {
    //Click Sales from the menu
    navigateToModule("Sales");
    navigateToSubModule("Funds");
    validateModule();
    const generatedRandomString = generateRandomString(9);

    cy.get(".pull-right > .btn").click();
    cy.get("#referenceId").type(generatedRandomString);
    cy.get("#businessDate").click();
    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    cy.get(".btn").contains("Save").click();

    cy.get("body").then(($body) => {
      if ($body.find(".alert").length) {
        if ($body.find(".alert").text().includes("Fund must be unique")) {
          cy.log("Fund date or id already exist");
        }
      } else {
        cy.wait(2000);
        cy.get(".btn").contains("Print").click();
        cy.wait(2000);
        cy.get(".btn").contains("Cancel").click();
        cy.wait(2000);
        cy.get(".nav-buttons > .btn").click();
      }
    });
  });

  it("Create and Edit fund", () => {
    //Click Sales from the menu
    navigateToModule("Sales");
    navigateToSubModule("Funds");
    validateModule();
    const generatedRandomString = generateRandomString(7);

    cy.get(".pull-right > .btn").click();
    cy.get("#referenceId").type(generatedRandomString);
    cy.get("#businessDate").click();

    cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    cy.get(".btn").contains("Save").click();

    cy.get("body").then(($body) => {
      if ($body.find(".alert").text().includes("Fund must be unique")) {
        cy.log("Fund date or id already exist");
      } else {
        cy.wait(2000);
        cy.get(".btn").contains("Edit").click();
        cy.wait(2000);
        cy.get("#autoFundAccount")
          .type("Change")
          .type("{downArrow}")
          .type("{enter}");
        cy.wait(2000);
        cy.get("#fundAction").select("Add");
        cy.get("#amount").type("100");
        cy.get("#vatStatus").select("Non Vatable");
        cy.get(".btn").contains("Add").click();
        cy.wait(2000);
        cy.get(".btn").contains("Save").click();
        cy.wait(1000);
        cy.get(".btn").contains("Print").click();
        cy.wait(1000);
        cy.get(".btn").contains("Approve").click();
        cy.wait(1000);
        cy.get(".nav-buttons > .btn").click();
      }
    });
  });
});
context("M24 - Sales Refunds", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });
    cy.get(".btn").contains("Clear").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  function validateModule() {
    cy.get("h3").contains("Refund List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Receipt Number");
    cy.get("label").contains("Customer:");
    cy.get("label").contains("Returned Date From:");
    cy.get("label").contains("Returned Date To:");
    cy.get("label").contains("Status:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get("th").contains("Receipt Number/Reference ID");
    cy.get("th").contains("Refund Date");
    cy.get("th").contains("Customer");
    cy.get("th").contains("Status");
    cy.get("th").contains("Amount");
  }

  login();

  it("Validation of Refund List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Refunds from menu list
    navigateToSubModule("Refunds");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("TC01: S01 - S06", () => {
    navigateToModule("Sales");
    navigateToSubModule("Refunds");

    cy.fixture("sales/refund/m24-sales-refund").then((data) => {
      searchSuccess(data[0]);

      cy.get("#returnDateFrom").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      cy.get("#returnDateTo").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      searchSuccess(data[1].data[0], false, true);
      searchSuccess(data[1].data[1], false, true);
      searchSuccess(data[1].data[2], false, true);
    });
  });
});
context("M25 - Sales Cash Add", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();

    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });
    cy.get(".btn").contains("Clear").click();
  }

  function validateModule() {
    cy.get("h3").contains("Cash Add List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Pos:");
    cy.get("label").contains("Shift:");
    cy.get("label").contains("Business Date From:");
    cy.get("label").contains("Business Date To:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Pos");
    cy.get(".sortable").contains("Shift");
    cy.get(".sortable").contains("Amount");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Cash Add List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Cash Add from menu list
    navigateToSubModule("Cash Add");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("Search Cash Add", () => {
    navigateToModule("Sales");
    navigateToSubModule("Cash Add");

    cy.fixture("sales/cash_add/m25-sales-cash_add").then((data) => {
      //Search Using POS Number
      searchSuccess(data[0]);

      cy.wrap(data[1].data).each((item) => {
        searchSuccess(item, false, true);
      });

      cy.get("#fromDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      cy.get("#thruDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();
    });
  });
});
context("M26 - Sales Cash Drop", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("tr").length > 0) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    cy.get("tbody").then(($tbody) => {
      if ($tbody.find("tr").length > 0) {
        cy.get("table").should("have.descendants", "td");
      } else {
        cy.get(".message").should("contain", "Result not found.");
      }
    });
    cy.get(".btn").contains("Clear").click();
  }

  function validateModule() {
    cy.get("h3").contains("Cash Drop List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Pos:");
    cy.get("label").contains("Shift:");
    cy.get("label").contains("Business Date From:");
    cy.get("label").contains("Business Date To:");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Pos");
    cy.get(".sortable").contains("Shift");
    cy.get(".sortable").contains("Amount");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Cash Drop List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Funds from menu list
    navigateToSubModule("Cash Drop");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("TC01: S01 - S05", () => {
    navigateToModule("Sales");
    navigateToSubModule("Cash Drop");

    cy.fixture("sales/cash_drop/m26-sales-cash_drop").then((data) => {
      searchSuccess(data[0]);

      cy.wrap(data[1].data).each((item) => {
        searchSuccess(item, false, true);
      });

      cy.get("#fromDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();

      cy.get("#thruDate").click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
      searchClear();
    });
  });
});
context("M27 - Sales Modules Validation", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, check = false, category = false) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }
        cy.get("tbody").then(($tbody) => {
          if ($tbody.find("td").length) {
            cy.get("table").should("have.descendants", "td");
          } else {
            cy.get(".message").should("contain", "Result not found.");
          }
        });
        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    if (check) {
      cy.get("table").should("have.descendants", "td");
    } else {
      cy.get(".message").should("contain", "Result not found.");
    }
    cy.get(".btn").contains("Clear").click();
  }

  function validateModule() {
    cy.get("h3").contains("Modules Validation List");
    cy.get("label").contains("Facility");
    cy.get("label").contains("Status:");
    cy.get("label").contains("Business Date From");
    cy.get("label").contains("Business Date To");
    cy.get(".btn").contains("Search");
    cy.get(".btn").contains("Clear");

    cy.get(".sortable").contains("Date Created");
    cy.get(".sortable").contains("Business Date");
    cy.get(".sortable").contains("Status");
    cy.get(".sortable").contains("Total Cash");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  login();

  it("Validation of Modules Validation List page", () => {
    //Click Sales from the menu
    navigateToModule("Sales");

    //Click Modules Validation from menu list
    navigateToSubModule("Module Validation");

    //Validate that there will be no Error message displayed
    validateModule();
  });

  it("Search Modules Validation", () => {
    navigateToModule("Sales");
    navigateToSubModule("Module Validation");

    cy.fixture("sales/modules_validation/m27-sales-modules_validation").then(
      (data) => {
        searchSuccess(data[0].data[0], false, true);
        searchSuccess(data[0].data[1], false, true);
        searchSuccess(data[0].data[2], false, true);

        cy.get("#businessDateFromSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        searchClear();

        cy.get("#businessDateToSearch").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        searchClear();

        cy.get(".pull-right > .btn").click();
        cy.get("#businessDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Save").click();

        cy.get("body").then(($body) => {
          if ($body.find(".alert").length > 0) {
            cy.get(".btn").contains("Cancel").click();
          } else {
            cy.get(".btn").contains("<< Back to").click();
          }
        });

        cy.get(".pull-right > .btn").click();
        cy.get("#businessDate").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".btn").contains("Save").click();

        cy.get("body").then(($body) => {
          if ($body.find(".alert").length > 0) {
            cy.get(".btn").contains("Cancel").click();
          } else {
            cy.get(".btn").contains("<< Back to").click();
          }
        });

        // cy.get('.btn').contains('Edit').click();
        // cy.get('.btn').contains('Save').click();
      }
    );
  });
});
context("M28 - Report Generator", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchWithCategory(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).select(value);
    cy.get(".btn").contains("Search").click();
  }

  function searchSuccess(data, category = false) {
    const keys = Object.keys(data);
    let check;
    keys.forEach((key) => {
      if (data[key] != "") {
        if (category) {
          searchWithCategory(key, data[key]);
        } else {
          searchWithOneField(key, data[key]);
        }

        cy.get("table tbody")
          .then(($tbody) => {
            check = $tbody.find("tr").length;
            cy.log(`Rows inside tbody ${check}`);
          })
          .then(() => {
            cy.wrap(check).then((value) => {
              if (value > 0) {
                cy.get("table").should("have.descendants", "td");
              } else {
                cy.get(".message").should("contain", "Result not found.");
              }
            });
          });

        cy.get(".btn").contains("Clear").click();
      }
    });
  }

  function searchClear(check = false) {
    cy.get(".btn").contains("Search").click();
    if (check) {
      cy.get("table").should("have.descendants", "td");
    } else {
      cy.get(".message").should("contain", "Result not found.");
    }
    cy.get(".btn").contains("Clear").click();
  }

  function validateModule() {
    cy.get("h3").contains("Report List");
    cy.get("th").contains("Audit Report");
    cy.get("th").contains("Inventory Report");
    cy.get("th").contains("Pos Report");
    cy.get("th").contains("Sales Report");
    cy.get("th").contains("Take-on Report");
  }

  function validateShowReport(report) {
    cy.get("body").then(($body) => {
      if ($body.find("tr").length) {
        //cy.get('tr').find('td').contains(report).should('have.text', report).click();
        // cy.get('tr').find('td').contains(report).then(($el)=>{
        //     const normalizedText = $el.text().replace(/\s+/g, ' ').trim();
        //     if (normalizedText === report) {
        //       cy.wrap($el).click();
        //     }
        // })
        cy.get("tr")
          .find("td") // Use the parent or element type if needed
          .each(($el) => {
            const normalizedText = $el.text().replace(/\s+/g, " ").trim();
            if (normalizedText === report) {
              cy.wrap($el).click(); // Click the exact match
              cy.get("h3").contains("Show Report");
              cy.get(".btn").contains("Generate").click();
            }
          });
      } else {
        cy.log("report empty");
      }
    });
  }

  function checkReportByDateOnly(report, check = true, dateId = "#AUDIT_DATE") {
    validateShowReport(report);
    if (check) {
      cy.get(dateId).click();
      cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
    }
    printCancelBack();
  }

  function printCancelBack() {
    cy.get(".btn").contains("Print").click();
    cy.get(".btn").contains("Cancel").click();
    cy.get(".btn").contains("Back to Report List").click();
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  context("Reports -> Report Generator", () => {
    login();

    it("Validation of Report List page", () => {
      //Click Sales from the menu
      navigateToModule("Report");

      //Click Report Generator from menu list
      navigateToSubModule("Report Generator");

      //Validate that there will be no Error message displayed
      validateModule();
    });

    it("TC01: S01 - S05", () => {
      navigateToModule("Report");
      navigateToSubModule("Report Generator");

      cy.fixture("reports/m28-report_generator").then((data) => {
        searchSuccess(data[0].rn[0]);
        searchSuccess(data[0].rn[1]);

        searchSuccess(data[0].data[0], true, true);
        searchSuccess(data[0].data[1], true, true);
        searchSuccess(data[0].data[2], true, true);
        searchSuccess(data[0].data[3], true, true);
        searchSuccess(data[0].data[4], true, true);
        searchSuccess(data[0].data[5], true, true);

        cy.get(".btn").contains("Clear").click();
        cy.get(".btn").contains("Search").click();

        // go to page 2 but theres no page 2

        validateShowReport("Per Item Location Report");
        cy.get("#ID_LIST").type("1");
        printCancelBack();

        checkReportByDateOnly("Per Item Location Report - Manual");

        validateShowReport("Store Inventory Audit Report");
        cy.get('[id="50%_OF_SALES"]').type(data[1].percent_of_sales);
        cy.get("#AUDIT_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.get("#BEGINNING_SALES").type(data[1].beginning_sales);
        cy.get("#BM").type(data[1].bm);
        cy.get("#PT").type(data[1].pt);
        cy.get("#RL").type(data[1].rl);
        cy.get("#STS").type(data[1].sts);
        cy.get("#SU").type(data[1].su);
        printCancelBack();

        checkReportByDateOnly("In Stock Rate Report", true, "#COUNT_DATE");
        checkReportByDateOnly("Per Item Hit Rate Report");
        checkReportByDateOnly("On Hand Inventory Report", false);
        checkReportByDateOnly("Hit Rate Report", false);
        checkReportByDateOnly("Consolidated Audit Report");

        validateShowReport("Inventory Log (formerly Receiving Log)");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        printCancelBack();

        validateShowReport("Shelf Tags");
        cy.get("#CATEGORY_ID").type("10");
        cy.get("#DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        checkReportByDateOnly("Shelf Tags - Price Change", true, "#DATE");
        checkReportByDateOnly("Cycle Count Report", false);

        validateShowReport("Bad Merchandise Report");
        cy.get("#FROM_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#THRU_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        printCancelBack();

        validateShowReport("Total Purchases Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get('[value="324243423912755497"]').click();
        printCancelBack();

        validateShowReport("Retail Book Inventory");
        cy.get("#ADJUSTMENT").type(data[1].adjustment);
        cy.get("#AUDIT_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#COUNT_PER_AUDIT").type(data[1].count_per_audit);
        cy.get("#INVENTORY_AS_OF").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#MERCHANDISE").type(data[1].merchandise);
        printCancelBack();

        validateShowReport("Product Movement Analysis");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Gondola Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        checkReportByDateOnly("Ordering Tool", true, "#ORDER_DATE");

        validateShowReport("DLV Monitoring - Created");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("DLV Monitoring - Completed");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("DTSD Monitoring - Created");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        checkReportByDateOnly("DTSD Monitoring - Completed", false);

        validateShowReport("OR Sales Monitor by Quantity");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        validateShowReport("OR Sales Monitor by Amount");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        validateShowReport("AR Sales Monitor - Per POS (ServiceSale)");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("AR Sales Monitor - Per Shift");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Hourly Sales");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Rewards Redemption Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("ABC Report by Quantity");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        validateShowReport("ABC Report by Amount");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        validateShowReport("CBA Report by Quantity");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#listCategory").select(data[1].listCategory);
        printCancelBack();

        validateShowReport("CBA Report by Amount");

        cy.get("body").then(($body) => {
          if ($body.find("#DATE_TO").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#listCategory").select(data[1].listCategory);
          } else {
            cy.log("empty");
          }
        });

        printCancelBack();

        validateShowReport("Consignment Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Product Sales Analysis");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("City Blends Category Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        checkReportByDateOnly("CLiQQMas Report", false);

        // checkReportByDateOnly("Sales Report (formerly Cash Report)")

        validateShowReport("Shift Report");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#POS").type(data[1].pos);
        printCancelBack();

        validateShowReport("Shift Recap");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("Discount Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("MS Report");

        cy.get("body").then(($body) => {
          if ($body.find("#BUSINESS_DATE").length) {
            cy.get("#BUSINESS_DATE").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            printCancelBack();
          } else {
            cy.log("empty");
          }
        });

        // cy.get('#BUSINESS_DATE').click()
        // cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
        // printCancelBack()

        validateShowReport("Tender Report");

        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            printCancelBack();
          } else {
            cy.log("empty");
          }
        });

        // cy.get('#DATE_FROM').click()
        // cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
        // cy.get('.ui-datepicker-close').click();
        // cy.wait(1000)
        // cy.get('#DATE_TO').click()
        // cy.get('.ui-datepicker-days-cell-over > .ui-state-default').click();
        // cy.get('.ui-datepicker-close').click();
        // cy.wait(1000)
        // printCancelBack()

        checkReportByDateOnly("Beep Report", false);

        validateShowReport("Cash Variation - Employee");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#EMPLOYEE_ID").type(data[1].pos);
        printCancelBack();

        validateShowReport("Cash Variation - Store");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("Cash Drop Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Funds Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Cash Added Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Flash Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Refunds Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("Cancelled Transaction Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("Item Void Report");
        cy.get("#DATE_FROM").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        cy.get("#DATE_TO").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        cy.get(".ui-datepicker-close").click();
        cy.wait(1000);
        printCancelBack();

        validateShowReport("CLiQQ Wallet Report");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("GCash E-Payment Report");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CLiQQ Wallet History");

        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("E-Payment Report");
        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("Gross Sales with 711 Product");
        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("Ending Sales Update");
        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("Ending Sales Update (For No 711 Amount)");
        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("AR Sales with 711 Product");
        cy.get("body").then(($body) => {
          if ($body.find("#DATE_FROM").length) {
            cy.get("#DATE_FROM").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#DATE_TO").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
          } else {
            cy.log("empty");
          }
        });
        printCancelBack();

        validateShowReport("Ending Sales Update");
        cy.get("body").then(($body) => {
          if ($body.find("#BUSINESS_DATE").length) {
            cy.get("#BUSINESS_DATE").click();
            cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
            cy.get(".ui-datepicker-close").click();
            cy.wait(1000);
            cy.get("#POS_ID").type(data[1].pos);
            cy.get("#SHIFT").type(data[1].pos);
          } else {
            cy.log("empty");
          }
        });

        printCancelBack();

        validateShowReport("STD");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("PCM");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("GCI");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("SWS");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CRD 1");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CRD 2");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CRD 3");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CRD");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("CLK");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("TRR");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();

        validateShowReport("NCI");
        cy.get("#BUSINESS_DATE").click();
        cy.get(".ui-datepicker-days-cell-over > .ui-state-default").click();
        printCancelBack();
      });
    });
  });
});
context("Miscellaneous", () => {
  //Common Functions
  function navigateToModule(module) {
    cy.get("ul").contains(module).click();
  }

  function navigateToSubModule(subModule) {
    cy.get("li").contains(subModule).click();
  }

  function searchWithOneField(fieldId, value) {
    const field = `[id^=${fieldId}]`;
    cy.get(field).type(value);
    cy.get(".btn").contains("Search").click();
  }

  function validateModule() {
    cy.get("h3").contains("Miscellaneous");
    cy.get(".btn").contains("Generate POS Database");
  }

  function login() {
    beforeEach(() => {
      cy.fixture("sbs_credentials/sbs_credentials").then((sbs_credentials) => {
        cy.visit(sbs_credentials.url);
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
        cy.fixture("sbs_credentials/sbs_credentials").then(
          (sbs_credentials) => {
            cy.get("[id^=username]").type(sbs_credentials.username);
            cy.get("[id^=password]").type(sbs_credentials.password);
            cy.get("[id^=submit]").click();

            cy.contains("Masterfile");
            cy.contains("Matrix");
            cy.contains("Inventory");
            cy.contains("Sales");
            cy.contains("Report");
            cy.contains("Misc");
            cy.contains("Sign out");
          }
        );
      });
    });
  }

  context("Misc -> Miscellaneous", () => {
    login();

    it("Validation of Miscellaneous page", () => {
      //Click Sales from the menu
      navigateToModule("Misc");

      //Click Report Generator from menu list
      navigateToSubModule("Miscellaneous");

      //Validate that there will be no Error message displayed
      validateModule();
    });

    it("Generate POS DB", () => {
      navigateToModule("Misc");
      navigateToSubModule("Miscellaneous");

      // cy.get(':nth-child(3) > td > form').should("include.text","Still generating Pos Database, please refresh the browser to see if it's finished.")

      cy.get(":nth-child(3) > td > form")
        .invoke("text")
        .then((text) => {
          if (
            text.includes(
              "Still generating Pos Database, please refresh the browser to see if it's finished."
            )
          ) {
            cy.log("Text found.");
          } else {
            cy.get("form > .btn").click();
            text.includes(
              "Still generating Pos Database, please refresh the browser to see if it's finished."
            );
          }
        });

      // const posDataFolder = "C:\pos_db"
      // const fs = require('fs');
      // fs.readdirSync(posDataFolder).forEach(file =>{
      //     cy.log(file);
      // });
    });
  });
});
