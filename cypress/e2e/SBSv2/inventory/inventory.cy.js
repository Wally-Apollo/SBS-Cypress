context("Inventory Test Case", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
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

  it("Inventory Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "inventory");

    cy.get('[data-cy="inventory-list-title"]').should(
      "contain",
      "Inventory List"
    );
    cy.get('[data-cy="inventory-table"]').should("contains.text", "Product Id");
    cy.get('[data-cy="inventory-table"]').should("contains.text", "Product");
    cy.get('[data-cy="inventory-table"]').should("contains.text", "QOH");
    cy.get('[data-cy="inventory-table"]').should("contains.text", "ATP");

    cy.get('[data-cy="inventory-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="inventory-link"] > [data-cy="table-cell-link"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Inventory Detail List"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Order Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "order");

    cy.get('[data-cy="toolbar-title"]').should("contains.text", "Order List");

    cy.get('[data-cy="order-table"]').should("contains.text", "Document ID");
    cy.get('[data-cy="order-table"]').should("contains.text", "Date Created");
    cy.get('[data-cy="order-table"]').should("contains.text", "Order Date");
    cy.get('[data-cy="order-table"]').should(
      "contains.text",
      "Number of Item Ordered"
    );
    cy.get('[data-cy="order-table"]').should("contains.text", "Total Cost");
    cy.get('[data-cy="order-table"]').should("contains.text", "Total Retail");
    cy.get('[data-cy="order-table"]').should("contains.text", "Status");

    cy.get('[data-cy="new-order-btn"]').click();

    cy.get(".q-toolbar__title").should("contains.text", "Create Order");
    cy.get(".q-card__actions > :nth-child(2)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="order-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="order-link"] > [data-cy="order-link-text"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Order");
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Receiving Advice Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "receiving advice");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Receiving Advice List"
    );
    cy.get('[data-cy="receiving-advice-table"]').should("be.visible");

    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Document No"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Date Received"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "From"
    );
    cy.get('[data-cy="receiving-advice-table"]').should("contains.text", "To");
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Total Items"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Total Cost"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="receiving-advice-table"]').should(
      "contains.text",
      "Status"
    );

    cy.get('[data-cy="create-receiving-advice-button"]').click();

    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Receiving Advice"
    );
    cy.get(".q-card__actions > :nth-child(2)").click();
    cy.get('[data-autofocus="true"]').click();

    cy.get('[data-cy="receiving-advice-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-receiving-advice-link"] > [data-cy="show-receiving-advice-text"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Receiving Advice"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Cycle Count Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "cycle count");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Cycle Count List"
    );
    cy.get('[data-cy="cycle-count-table"]').should("be.visible");

    cy.get('[data-cy="cycle-count-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="cycle-count-table"]').should(
      "contains.text",
      "Count Date"
    );
    cy.get('[data-cy="cycle-count-table"]').should("contains.text", "Type");
    cy.get('[data-cy="cycle-count-table"]').should(
      "contains.text",
      "Total Cost"
    );
    cy.get('[data-cy="cycle-count-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="cycle-count-table"]').should("contains.text", "Status");

    cy.get('[data-cy="new-cycle-count-button"]').click();

    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Cycle Count / Variance"
    );
    cy.get(".q-card__actions > :nth-child(2)").click();
    cy.get('[data-autofocus="true"]').click();

    cy.get('[data-cy="cycle-count-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-cycle-count-link"] > [data-cy="cycle-count-row-text"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Cycle Count"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });
  it("Audit Count Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "audit count");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Audit Count List"
    );
    cy.get('[data-cy="audit-count-table"]').should("be.visible");

    cy.get('[data-cy="audit-count-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="audit-count-table"]').should(
      "contains.text",
      "Count Date"
    );
    cy.get('[data-cy="audit-count-table"]').should("contains.text", "Status");

    cy.get('[data-cy="audit-count-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-audit-count-link"] > [data-cy="audit-count-row-text"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Audit Count"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Returns Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "returns");

    cy.get('[data-cy="toolbar-title"]').should("contains.text", "Returns List");
    cy.get('[data-cy="returns-table"]').should("be.visible");
    cy.get('[data-cy="returns-table"]').should("contains.text", "Document Id");
    cy.get('[data-cy="returns-table"]').should("contains.text", "Return Date");
    cy.get('[data-cy="returns-table"]').should("contains.text", "Supplier");
    cy.get('[data-cy="returns-table"]').should("contains.text", "Total Item");
    cy.get('[data-cy="returns-table"]').should("contains.text", "Total Cost");
    cy.get('[data-cy="returns-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="returns-table"]').should("contains.text", "Status");

    cy.get('[data-cy="new-returns-btn"]').click();
    cy.get(".q-toolbar__title").should("contains.text", "Create Return");

    cy.get(".q-card__actions > :nth-child(2)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="returns-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-returns-link"] > [data-cy="returns-table-cell-content"]'
          ).click();

          cy.get(".q-toolbar__title").should("contains.text", "Show Return");
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Bad Merchandise Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "bad merchandise");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Bad Merchandise List"
    );
    cy.get('[data-cy="bad-merchandise-table"]').should("be.visible");
    cy.get('[data-cy="bad-merchandise-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="bad-merchandise-table"]').should(
      "contains.text",
      "BM Date"
    );
    cy.get('[data-cy="bad-merchandise-table"]').should(
      "contains.text",
      "Status"
    );

    cy.get('[data-cy="new-bad-merchandise-btn"]').click();
    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Bad Merchandise"
    );

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="bad-merchandise-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-bad-merchandise-link"] > [data-cy="bad-merchandise-table-cell-content"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Bad Merchandise"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Weekly Supplies Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "weekly supplies");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Weekly Supplies List"
    );
    cy.get('[data-cy="supplies-table"]').should("be.visible");

    cy.get('[data-cy="supplies-table"]').should("contains.text", "Document Id");
    cy.get('[data-cy="supplies-table"]').should(
      "contains.text",
      "WS Slip Date"
    );
    cy.get('[data-cy="supplies-table"]').should("contains.text", "Total Items");
    cy.get('[data-cy="supplies-table"]').should("contains.text", "Total Cost");
    cy.get('[data-cy="supplies-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="supplies-table"]').should("contains.text", "Status");

    cy.get('[data-cy="new-supplies-button"]').click();
    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Weekly Supplies"
    );

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="supplies-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="table-row-link"] > [data-cy="table-row-item"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Weekly Supplies"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Product Transfer Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "product transfer");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Product Transfer List"
    );
    cy.get('[data-cy="product-transfer-table"]').should("be.visible");

    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "PT Slip Date"
    );
    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "Total Items"
    );
    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "Total Cost"
    );
    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="product-transfer-table"]').should(
      "contains.text",
      "Status"
    );

    cy.get('[data-cy="new-product-transfer-button"]').click();
    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Product Transfer"
    );

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="product-transfer-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="table-row-link"] > [data-cy="table-row-item"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Product Transfer"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Retail Price Change Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "retail price change");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Price Change List"
    );
    cy.get('[data-cy="price-change-table"]').should("be.visible");
    cy.get('[data-cy="price-change-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="price-change-table"]').should(
      "contains.text",
      "Price Change Date"
    );
    cy.get('[data-cy="price-change-table"]').should(
      "contains.text",
      "Total Items"
    );
    cy.get('[data-cy="price-change-table"]').should(
      "contains.text",
      "Total Price Change"
    );
    cy.get('[data-cy="price-change-table"]').should("contains.text", "Status");

    cy.get('[data-cy="new-price-change-button"]').click();
    cy.get(".q-toolbar__title").should("contains.text", "Create Price Change");

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="price-change-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="table-row-link"] > [data-cy="table-row-item"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Price Change"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Purchase Order Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "purchase order");

    cy.get(".q-toolbar__title").should("contains.text", "Purchase Order List");
    cy.get('[data-cy="purchase-order-table"]').should("be.visible");
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Order Date"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Supplier"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Delivery Date"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Total Items"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Total Cost"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="purchase-order-table"]').should(
      "contains.text",
      "Status"
    );

    cy.get('[data-cy="new-product-order-button"]').click();
    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Purchase Order"
    );

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="purchase-order-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-purchase-order-link"] > [data-cy="table-cell-content"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Purchase Order"
          );
          cy.get("a > .q-btn").click();
        } else {
          cy.get(".q-table__bottom").should(
            "contains.text",
            "No data available"
          );
        }
      });
  });

  it("Disptach Advice Navigation", () => {
    loginCreddentials();
    NabVarVerify();
    navigateNavBar("Inventory", "dispatch advice");

    cy.get('[data-cy="toolbar-title"]').should(
      "contains.text",
      "Dispatch Advice List"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should("be.visible");
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Document Id"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Dispatch Advice Date"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Origin"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Destination"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Total Items"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Total Cost"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Total Retail Price"
    );
    cy.get('[data-cy="dispatch-advice-table"]').should(
      "contains.text",
      "Status"
    );

    cy.get('[data-cy="new-dispatch-advice-button"]').click();
    cy.get(".q-toolbar__title").should(
      "contains.text",
      "Create Dispatch Advice"
    );

    cy.get(".q-card__actions > :nth-child(1)").click();
    cy.get('[data-autofocus="true"] > .q-btn__content').click();

    cy.get('[data-cy="dispatch-advice-table"]')
      .find("table > tbody")
      .then(($tbody) => {
        if ($tbody.find("td").length > 0) {
          cy.get(
            ':nth-child(1) > :nth-child(1) > [data-cy="show-dispatch-advice-link"] > [data-cy="table-cell-content"]'
          ).click();

          cy.get(".q-toolbar__title").should(
            "contains.text",
            "Show Dispatch Advice"
          );
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
