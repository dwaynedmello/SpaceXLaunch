import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Set your base URL here
    // Other e2e-related configuration options can go here
    
    specPattern: 'cypress/e2e/*.ts', // Adjust the pattern to match your test file naming and extension
    
    
  },
  // Other Cypress configuration options can go here
});
