context("Matrix Test Case", () => {
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

  it("Plaanogram Navigation", () => {
    navigateNavBar("Matrix", "planogram");
    cy.get('[data-cy="planogram-list-title"]').should(
      "contain",
      "Planogram List"
    );

    cy.get('[data-cy="planogram-table"]').should("contain.text", "Document Id");
    cy.get('[data-cy="planogram-table"]').should(
      "contain.text",
      "Reference Id"
    );
    cy.get('[data-cy="planogram-table"]').should("contain.text", "Description");
    cy.get('[data-cy="planogram-table"]').should("contain.text", "Status");
    cy.get('[data-cy="planogram-table"]').should(
      "contain.text",
      "Last Updated"
    );

    cy.get('[data-cy="planogram-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(':nth-child(1) > a > [data-cy="table-cell-link"]').click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Planogram");
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
