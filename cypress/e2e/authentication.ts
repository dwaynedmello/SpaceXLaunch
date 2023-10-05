// cypress/integration/authentication.spec.ts

describe('Authentication', () => {
    it('should log in with a valid token', () => {
      // Visit the authentication page
      cy.visit('http://localhost:5173/'); // Replace with the actual URL of your authentication page
  
      // Check if the "Welcome" message is displayed
      cy.contains('You are not authenticated.').should('exist');
  
  
   
    });
  });
  