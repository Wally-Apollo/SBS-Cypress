context("Dashboard Test Case", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
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

  it("Dashboard Navigation", () => {
    loginCreddentials();
    NabVarVerify();

    cy.get('[data-cy="table-pos"] ').should("be.visible");
    cy.get('[data-cy="table-pos"] ').should("contains.text", "POS");
    cy.get('[data-cy="table-pos"] ').should(
      "contains.text",
      "POS Download Sync"
    );
    cy.get('[data-cy="table-pos"] ').should("contains.text", "POS CAS File");
    cy.get('[data-cy="table-pos"] ').should("contains.text", "POS EVT File");
    cy.get('[data-cy="table-pos"] ').should("contains.text", "POS TXN File");
  });
});
