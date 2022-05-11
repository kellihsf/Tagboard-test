// Log in to Producer and create a new Production

const username = "webmaster@tagboard.com";
const password = "VEU6yuh6cez3wum-upn";

const getIframeDocument = () => {
  return cy
    .get('iframe[id="Your App: "Tagboard-tests""]')
    .its("0.contentDocument")
    .should("exist");
};

const getIframeBody = () => {
  // get the document
  return (
    getIframeDocument()
      // automatically retries until body is loaded
      .its("body")
      .should("not.be.undefined")
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      .then(cy.wrap)
  );
};

describe("A user should log in and create a new Production", () => {
  it("Visits the Tagboard page", () => {
    cy.visit("https://producer.tagboard.com/#/");

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should("include", "producer.tagboard.com");

    cy.get(".signin-auth0").click();

    cy.get("#username").type(`${username}`).should("have.value", `${username}`);

    cy.get("#password").type(`${password}`).should("have.value", `${password}`);

    cy.get("button").contains("default").click();

    // Confirms user is logged in
    cy.contains("Tell your story with Tagboard Producer");

    // Create new Production
    cy.get("button").contains("New production").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Production created successfully`);
    });
    cy.contains("Asset Library");
  });
});
