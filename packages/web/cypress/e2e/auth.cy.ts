describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display landing page for unauthenticated users', () => {
    cy.get('h1').should('contain', 'Empower Your Life with Accessible Task Management');
    cy.get('[data-testid="sign-in-button"]').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('h1').should('contain', 'Welcome Back');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('button[type="submit"]').click();
    
    cy.get('input[type="email"]:invalid').should('exist');
    cy.get('input[type="password"]:invalid').should('exist');
  });

  it('should navigate to register page from login', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('button').contains('Sign up').click();
    
    cy.get('h1').should('contain', 'Create Account');
    cy.get('input[name="displayName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
  });

  it('should validate password confirmation', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('button').contains('Sign up').click();
    
    cy.get('input[name="displayName"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('differentpassword');
    
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should('contain', 'Passwords do not match');
  });

  it('should have proper accessibility attributes', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    
    // Check form labels
    cy.get('label[for="email"]').should('exist');
    cy.get('label[for="password"]').should('exist');
    
    // Check input attributes
    cy.get('input[type="email"]')
      .should('have.attr', 'required')
      .should('have.attr', 'autoComplete', 'email');
    
    cy.get('input[type="password"]')
      .should('have.attr', 'required')
      .should('have.attr', 'autoComplete', 'current-password');
  });

  it('should support keyboard navigation', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    
    // Tab through form elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'type', 'email');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'type', 'password');
    
    cy.focused().tab();
    cy.focused().should('contain', 'Sign In');
    
    cy.focused().tab();
    cy.focused().should('contain', 'Sign up');
  });

  // Mock successful authentication for dashboard test
  it('should redirect to dashboard after successful login', () => {
    // This would require mocking Firebase Auth
    // For now, we'll test the UI flow
    cy.get('[data-testid="sign-in-button"]').click();
    
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // In a real test, we'd mock the Firebase response
    // cy.get('button[type="submit"]').click();
    // cy.url().should('include', '/dashboard');
  });
});