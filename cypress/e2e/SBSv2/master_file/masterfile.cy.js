context("Master File Test Case", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
    loginCreddentials();
    NabVarVerify();
  });
  afterEach(() => {
    cy.get('[data-cy="left-drawer"]').trigger("mouseover");
    cy.get('[data-cy="nav-links"]')
      .find("div")
      .contains("Logout")
      .parent()
      .click();
    cy.get('[data-autofocus="true"]').click();
  });

  function NabVarVerify() {
    cy.get('[data-cy="left-drawer"]').trigger("mouseover");
    cy.get(":nth-child(1) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Dashboard"
    );
    cy.get(":nth-child(2) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "MasterFile"
    );
    cy.get(":nth-child(3) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Matrix"
    );
    cy.get(":nth-child(4) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Inventory"
    );
    cy.get(":nth-child(5) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Sales"
    );
    cy.get(":nth-child(6) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Reports"
    );
    cy.get(":nth-child(7) > .q-expansion-item__container > .q-item").should(
      "contains.text",
      "Misc"
    );
    cy.get(
      ":nth-child(2) > .q-expansion-item > .q-expansion-item__container > .q-item"
    ).should("contains.text", "Logout");
  }

  function loginCreddentials() {
    cy.contains("Username");
    cy.contains("Password");

    cy.get('[data-cy="input-username"]').clear().type("711001");
    cy.wait(1000);
    cy.get('[data-cy="input-password"]').clear().type("711001");
    cy.wait(1000);
    cy.get('[data-cy="button-login"]').click();
    cy.wait(1500);
    cy.get('[data-cy="dashboard-title"]').should("contain", "Dashboard");
  }

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

  it("User Navigation", () => {
    navigateNavBar("MasterFile", "User");
    cy.get('[data-cy="user-list-title"]').should("contain", "User List");

    cy.get('[data-cy="user-list-table"]').should("be.visible");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "User Id");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "First Name");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "Last Name");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "Username");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "Status");
    cy.get('[data-cy="user-list-table"]').should("contains.text", "Updated By");
    cy.get('[data-cy="user-list-table"]').should(
      "contains.text",
      "Last Updated"
    );

    cy.get('[data-cy="user-list-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > a > [data-cy="user-row"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show User");

          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });
  it("Product Navigation", () => {
    navigateNavBar("MasterFile", "Product");
    cy.get('[data-cy="toolbar-title"]').should("contain", "Product List");

    cy.get('[data-cy="product-table"]').should("be.visible");
    cy.get('[data-cy="product-table"]').should("contains.text", "Product Id");
    cy.get('[data-cy="product-table"]').should("contains.text", "GTIN");
    cy.get('[data-cy="product-table"]').should("contains.text", "Short Name");
    cy.get('[data-cy="product-table"]').should("contains.text", "Long Name");
    cy.get('[data-cy="product-table"]').should("contains.text", "Description");
    cy.get('[data-cy="product-table"]').should(
      "contains.text",
      "Introduction Date"
    );

    cy.get('[data-cy="product-table"]').should(
      "contains.text",
      "Discontinuation Date"
    );

    cy.get('[data-cy="product-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="table-row-link"] > [data-cy="table-cell-text"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Product");
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });
  it("Promo Navigation", () => {
    navigateNavBar("MasterFile", "promo");
    cy.get('[data-cy="promo-toolbar-title"]').should("contain", "Promo List");

    cy.get('[data-cy="promo-table"]').should("be.visible");
    cy.get('[data-cy="promo-table"]').should("contains.text", "Promo Id");
    cy.get('[data-cy="promo-table"]').should("contains.text", "Promo Name");
    cy.get('[data-cy="promo-table"]').should("contains.text", "Description");
    cy.get('[data-cy="promo-table"]').should(
      "contains.text",
      "Limit per Customer"
    );
    cy.get('[data-cy="promo-table"]').should("contains.text", "Updated By");
    cy.get('[data-cy="promo-table"]').should("contains.text", "Last Updated");

    cy.get('[data-cy="promo-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="promo-table-row-link"] > [data-cy="promo-table-cell-text"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Promo");
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Facility Navigation", () => {
    navigateNavBar("MasterFile", "facility");
    cy.get('[data-cy="facility-toolbar-title"]').should(
      "contain",
      "Facility List"
    );

    cy.get('[data-cy="facility-table"]').should("be.visible");
    cy.get('[data-cy="facility-table"]').should("contains.text", "Facility Id");
    cy.get('[data-cy="facility-table"]').should("contains.text", "GLN");
    cy.get('[data-cy="facility-table"]').should(
      "contains.text",
      "Facility Name"
    );
    cy.get('[data-cy="facility-table"]').should(
      "contains.text",
      "Facility Type"
    );
    cy.get('[data-cy="facility-table"]').should("contains.text", "Updated By");
    cy.get('[data-cy="facility-table"]').should(
      "contains.text",
      "Last Updated"
    );

    cy.get('[data-cy="facility-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="facility-table-row-link"] > [data-cy="facility-table-cell-text"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Facility");
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });
});
