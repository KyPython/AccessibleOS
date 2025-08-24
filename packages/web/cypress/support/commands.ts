/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to simulate tab key press for keyboard navigation testing
       */
      tab(): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to check accessibility violations using axe-core
       */
      checkA11y(context?: string | Node, options?: any): Chainable<void>;
      
      /**
       * Custom command to login with mock authentication
       */
      mockLogin(user?: { email: string; displayName: string }): Chainable<void>;
      
      /**
       * Custom command to set accessibility settings
       */
      setA11ySettings(settings: Record<string, any>): Chainable<void>;
    }
  }
}

// Tab navigation command
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  const focusedElement = subject || cy.focused();
  return focusedElement.trigger('keydown', { key: 'Tab', code: 'Tab', keyCode: 9 });
});

// Accessibility checking command (would require cypress-axe plugin)
Cypress.Commands.add('checkA11y', (context, options) => {
  // This would use cypress-axe plugin
  // cy.injectAxe();
  // cy.checkA11y(context, options);
  
  // For now, we'll do basic checks
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt');
  });
  
  cy.get('input, select, textarea').each(($input) => {
    const id = $input.attr('id');
    if (id) {
      cy.get(`label[for="${id}"]`).should('exist');
    }
  });
});

// Mock login command
Cypress.Commands.add('mockLogin', (user = { email: 'test@example.com', displayName: 'Test User' }) => {
  cy.window().then((win) => {
    win.localStorage.setItem('mockAuth', JSON.stringify({
      authenticated: true,
      user: user,
      token: 'mock-token'
    }));
  });
});

// Set accessibility settings command
Cypress.Commands.add('setA11ySettings', (settings) => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  });
  
  // Apply settings to DOM
  Object.entries(settings).forEach(([key, value]) => {
    switch (key) {
      case 'highContrastMode':
        if (value) {
          cy.get('html').invoke('addClass', 'high-contrast');
        }
        break;
      case 'fontSizeMultiplier':
        cy.get(':root').invoke('css', '--font-size-multiplier', value.toString());
        break;
      case 'motionReduced':
        if (value) {
          cy.get('html').invoke('addClass', 'reduce-motion');
        }
        break;
      case 'keyboardNavigationEnabled':
        if (value) {
          cy.get('html').invoke('addClass', 'keyboard-navigation');
        }
        break;
    }
  });
});

export {};