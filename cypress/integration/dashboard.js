// Log in to Tagboard and create a new Tagboard

const username = "webmaster@tagboard.com";
const password = "VEU6yuh6cez3wum-upn";
const tagboardName = "Test Board"
const tagboardDescription = "This is a test"


const getIframeDocument = () => {
  return cy.get('iframe')
  .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  // get the document
  return getIframeDocument()
  // automatically retries until body is loaded
  .its('body').should('not.be.undefined')
  // wraps "body" DOM element to allow
  // chaining more Cypress commands, like ".find(...)"
  .then(cy.wrap)
}


describe("A user should log in and create a new Tagboard", () => {
  it("Visits the Tagboard page", () => {
    cy.viewport(1280, 720)
    cy.intercept('GET', 'https://account.tagboard.com/dashboard').as('loadDashboard')

    cy.visit("https://account.tagboard.com/signin");

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should("include", "tagboard.com/signin");

    cy.get(".signin-auth0").click();

    cy.get("#username").type(`${username}`).should("have.value", `${username}`);

    cy.get("#password").type(`${password}`).should("have.value", `${password}`);

    cy.get("button").contains("default").click();
    cy.wait('@loadDashboard').its('response.statusCode').should('equal', 200)

    // Confirms user is logged in
    cy.url().should("include", "tagboard.com/dashboard");


    //Create a new Tagboard
    getIframeBody().find('.toolbar button').should('have.text', 'New Tagboard').click()
    getIframeBody().find('input[name="name"]').clear().type(`${tagboardName}`)
    getIframeBody().find('input[name="description"]').clear().type(`${tagboardDescription}`)
    getIframeBody().find('button').contains('Create tagboard').click()

    // Confirm Tagboard was created
    getIframeBody().find('.tagboards-list').contains('New Tagboard')

  });
});
