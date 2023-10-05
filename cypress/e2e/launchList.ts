describe('LaunchList Component', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('/launchlist');
  });

  it('displays a list of SpaceX launches', () => {
    // Ensure that launches are loaded
    cy.get('.launch-card').should('have.length.greaterThan', 0);
  });

  it('filters launches by name', () => {
    // Type a search query in the search input
    cy.get('.search-input').type('Falcon');

    // Wait for a moment and check if filtered launches are displayed
    cy.wait(500);
    cy.get('.launch-card').should('have.length.greaterThan', 0);


  });

  it('filters launches by status', () => {
    // Select "Successful Launches" from the filter dropdown
    cy.get('.filter-select').click();

    // Select the "Successful Launches" option
    cy.contains('Successful Launches')
    .should('be.visible') // Ensure the label is visible
    .click(); // Click the label
    
    // Wait for a moment and check if only successful launches are displayed
    cy.wait(500);
    cy.get('.launch-card').each((card) => {
      cy.wrap(card).contains('Status: Successful');
    });
  });

  it('loads more launches when scrolling to the bottom', () => {
    // Scroll to the bottom of the page
    cy.scrollTo('bottom');

    // Wait for a moment and check if more launches are loaded
    cy.wait(1000);
    cy.get('.launch-card').should('have.length.greaterThan', 12);
  });
});
