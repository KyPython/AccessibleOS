// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log for cleaner output
Cypress.on('window:before:load', (win) => {
  // Mock Firebase for testing
  win.firebase = {
    auth: () => ({
      currentUser: null,
      signInWithEmailAndPassword: cy.stub(),
      createUserWithEmailAndPassword: cy.stub(),
      signOut: cy.stub(),
      onAuthStateChanged: cy.stub(),
    }),
  };
  
  // Mock API responses
  const originalFetch = win.fetch;
  win.fetch = function(...args) {
    const url = args[0];
    
    // Mock authentication endpoints
    if (typeof url === 'string' && url.includes('/api/auth')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'user-123',
            email: 'test@example.com',
            displayName: 'Test User',
          },
        }),
      });
    }
    
    // Mock task endpoints
    if (typeof url === 'string' && url.includes('/api/tasks')) {
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Sample Task 1',
          description: 'This is a sample task',
          status: 'pending',
          priority: 'medium',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tags: ['sample'],
          categories: [],
        },
        {
          id: 'task-2',
          title: 'Sample Task 2',
          description: 'Another sample task',
          status: 'completed',
          priority: 'high',
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          tags: ['sample', 'completed'],
          categories: [],
        },
      ];
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: mockTasks,
          total: mockTasks.length,
          page: 1,
          limit: 20,
          totalPages: 1,
        }),
      });
    }
    
    // Mock accessibility settings
    if (typeof url === 'string' && url.includes('/api/accessibility')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            id: 'settings-123',
            userId: 'user-123',
            voiceOverEnabled: false,
            voiceOverSpeed: 1.0,
            keyboardNavigationEnabled: false,
            highContrastMode: false,
            fontSizeMultiplier: 1.0,
            screenReaderEnabled: false,
            motionReduced: false,
            colorBlindMode: null,
            customCss: null,
          },
        }),
      });
    }
    
    // Fall back to original fetch for other requests
    return originalFetch.apply(this, args);
  };
});

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // that might occur during testing (like Firebase auth errors)
  if (err.message.includes('Firebase') || err.message.includes('auth')) {
    return false;
  }
  
  // Let other errors fail the test
  return true;
});

// Add accessibility testing utilities
beforeEach(() => {
  // Inject axe-core for accessibility testing
  // This would require cypress-axe plugin
  // cy.injectAxe();
  
  // Set up common test data
  cy.window().then((win) => {
    // Clear any existing mock data
    win.localStorage.removeItem('mockAuth');
    win.localStorage.removeItem('mockEmptyTasks');
    win.localStorage.removeItem('mockLoading');
    win.localStorage.removeItem('mockError');
  });
});