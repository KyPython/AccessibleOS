describe('Accessibility Features', () => {
  beforeEach(() => {
    // Mock authentication for settings access
    cy.window().then((win) => {
      win.localStorage.setItem('mockAuth', 'true');
    });
    cy.visit('/settings');
  });

  it('should have proper heading hierarchy', () => {
    cy.get('h1, h2, h3, h4, h5, h6').then(($headings) => {
      const headings = Array.from($headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Check that headings are in proper order (no skipping levels)
      for (let i = 1; i < headings.length; i++) {
        expect(headings[i] - headings[i-1]).to.be.at.most(1);
      }
    });
  });

  it('should have proper form labels', () => {
    cy.get('input, select, textarea').each(($input) => {
      const id = $input.attr('id');
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      }
    });
  });

  it('should support keyboard navigation', () => {
    // Test tab order through interactive elements
    cy.get('body').tab();
    cy.focused().should('be.visible');
    
    // Continue tabbing through all focusable elements
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop
    
    function tabNext() {
      if (tabCount < maxTabs) {
        cy.focused().tab();
        cy.focused().should('be.visible');
        tabCount++;
        tabNext();
      }
    }
    
    tabNext();
  });

  it('should have proper ARIA attributes', () => {
    // Check for ARIA labels on buttons without text
    cy.get('button').each(($button) => {
      const hasText = $button.text().trim().length > 0;
      const hasAriaLabel = $button.attr('aria-label');
      const hasAriaLabelledby = $button.attr('aria-labelledby');
      
      if (!hasText) {
        expect(hasAriaLabel || hasAriaLabelledby).to.be.ok;
      }
    });
  });

  it('should have sufficient color contrast', () => {
    // This would require a color contrast checking library
    // For now, we'll check that high contrast mode can be enabled
    cy.get('input[id="highContrast"]').check();
    cy.get('html').should('have.class', 'high-contrast');
  });

  it('should support font size adjustment', () => {
    const originalFontSize = 16;
    
    // Increase font size
    cy.get('input[id="fontSize"]').invoke('val', '1.5').trigger('change');
    
    cy.get(':root').should('have.css', '--font-size-multiplier', '1.5');
  });

  it('should support motion reduction', () => {
    cy.get('input[id="motionReduced"]').check();
    cy.get('html').should('have.class', 'reduce-motion');
  });

  it('should have proper focus indicators', () => {
    cy.get('button').first().focus();
    cy.focused().should('have.css', 'outline-width').and('not.equal', '0px');
  });

  it('should support screen reader announcements', () => {
    // Check for live regions
    cy.get('[aria-live]').should('exist');
    
    // Check for proper status messages
    cy.get('[role="status"], [role="alert"]').should('exist');
  });

  it('should have descriptive link text', () => {
    cy.get('a').each(($link) => {
      const text = $link.text().trim();
      const ariaLabel = $link.attr('aria-label');
      const title = $link.attr('title');
      
      // Links should have descriptive text, not just "click here" or "read more"
      const hasDescriptiveText = text && 
        !['click here', 'read more', 'more', 'here'].includes(text.toLowerCase());
      
      expect(hasDescriptiveText || ariaLabel || title).to.be.ok;
    });
  });

  it('should support voice-over settings', () => {
    cy.get('input[id="voiceOver"]').check();
    
    // Voice speed slider should become visible
    cy.get('input[id="voiceSpeed"]').should('be.visible');
    
    // Test speed adjustment
    cy.get('input[id="voiceSpeed"]').invoke('val', '1.5').trigger('change');
  });

  it('should support color blind modes', () => {
    const colorBlindModes = ['protanopia', 'deuteranopia', 'tritanopia'];
    
    colorBlindModes.forEach(mode => {
      cy.get('select[id="colorBlindMode"]').select(mode);
      cy.get('html').should('have.class', `color-blind-${mode}`);
    });
  });

  it('should save settings automatically', () => {
    cy.get('input[id="highContrast"]').check();
    
    // Should show success message
    cy.get('.message.success').should('be.visible');
    cy.get('.message.success').should('contain', 'Settings saved successfully');
  });

  it('should apply custom CSS', () => {
    const customCSS = 'body { background-color: red !important; }';
    
    cy.get('textarea[id="customCss"]').clear().type(customCSS);
    cy.get('textarea[id="customCss"]').blur(); // Trigger save
    
    // Custom styles should be applied
    cy.get('#accessibility-custom-styles').should('exist');
  });
});