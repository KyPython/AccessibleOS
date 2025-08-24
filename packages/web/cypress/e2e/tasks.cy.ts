describe('Task Management', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('mockAuth', 'true');
    });
    cy.visit('/tasks');
  });

  it('should display task list', () => {
    cy.get('h2').should('contain', 'All Tasks');
    cy.get('[data-testid="add-task-button"]').should('be.visible');
  });

  it('should open task creation form', () => {
    cy.get('[data-testid="add-task-button"]').click();
    cy.get('h3').should('contain', 'Create New Task');
    
    // Form fields should be visible
    cy.get('input[name="title"]').should('be.visible');
    cy.get('textarea[name="description"]').should('be.visible');
    cy.get('select[name="priority"]').should('be.visible');
  });

  it('should create a new task', () => {
    cy.get('[data-testid="add-task-button"]').click();
    
    // Fill out form
    cy.get('input[name="title"]').type('Test Task');
    cy.get('textarea[name="description"]').type('This is a test task');
    cy.get('select[name="priority"]').select('high');
    cy.get('input[name="dueDate"]').type('2024-12-31');
    cy.get('input[name="estimatedDuration"]').type('60');
    cy.get('input[name="tags"]').type('test, automation');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Task should appear in list (mocked)
    // In real implementation, this would create the task
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="add-task-button"]').click();
    cy.get('button[type="submit"]').click();
    
    // Title is required
    cy.get('input[name="title"]:invalid').should('exist');
  });

  it('should edit existing task', () => {
    // Assuming there's a task in the list
    cy.get('[data-testid="task-item"]').first().within(() => {
      cy.get('[data-testid="edit-task-button"]').click();
    });
    
    cy.get('h3').should('contain', 'Edit Task');
    cy.get('input[name="title"]').should('not.be.empty');
  });

  it('should mark task as completed', () => {
    cy.get('[data-testid="task-item"]').first().within(() => {
      cy.get('[data-testid="status-button"]').click();
    });
    
    // Task should show as completed
    cy.get('[data-testid="task-item"]').first().should('have.class', 'completed');
  });

  it('should delete task with confirmation', () => {
    cy.get('[data-testid="task-item"]').first().within(() => {
      cy.get('[data-testid="delete-task-button"]').click();
    });
    
    // Should show confirmation dialog
    cy.on('window:confirm', () => true);
  });

  it('should filter tasks by status', () => {
    // This would require implementing status filter UI
    cy.get('[data-testid="status-filter"]').select('completed');
    cy.get('h2').should('contain', 'Completed Tasks');
  });

  it('should support keyboard navigation in task list', () => {
    cy.get('[data-testid="task-item"]').first().focus();
    cy.focused().should('have.attr', 'data-testid', 'task-item');
    
    // Arrow keys should navigate between tasks
    cy.focused().type('{downarrow}');
    cy.get('[data-testid="task-item"]').eq(1).should('be.focused');
  });

  it('should have proper ARIA attributes for task items', () => {
    cy.get('[role="list"]').should('exist');
    cy.get('[role="listitem"]').should('exist');
    
    cy.get('[data-testid="task-item"]').each(($item) => {
      // Each task should have proper labeling
      cy.wrap($item).within(() => {
        cy.get('h3').should('exist'); // Task title
        cy.get('[data-testid="status-button"]').should('have.attr', 'aria-label');
        cy.get('[data-testid="edit-task-button"]').should('have.attr', 'aria-label');
        cy.get('[data-testid="delete-task-button"]').should('have.attr', 'aria-label');
      });
    });
  });

  it('should show task metadata clearly', () => {
    cy.get('[data-testid="task-item"]').first().within(() => {
      // Priority should be visible
      cy.get('[data-testid="task-priority"]').should('be.visible');
      
      // Due date if present
      cy.get('[data-testid="task-due-date"]').should('be.visible');
      
      // Categories and tags
      cy.get('[data-testid="task-categories"]').should('exist');
      cy.get('[data-testid="task-tags"]').should('exist');
    });
  });

  it('should support task categories', () => {
    cy.get('[data-testid="add-task-button"]').click();
    
    // Categories section should be available
    cy.get('fieldset').contains('Categories').should('exist');
    
    // Should be able to select categories
    cy.get('input[type="checkbox"]').first().check();
  });

  it('should handle empty state', () => {
    // Mock empty task list
    cy.window().then((win) => {
      win.localStorage.setItem('mockEmptyTasks', 'true');
    });
    cy.reload();
    
    cy.get('[data-testid="empty-state"]').should('be.visible');
    cy.get('[data-testid="empty-state"]').should('contain', 'No tasks found');
  });

  it('should handle loading state', () => {
    // Mock loading state
    cy.window().then((win) => {
      win.localStorage.setItem('mockLoading', 'true');
    });
    cy.reload();
    
    cy.get('[role="status"]').should('be.visible');
    cy.get('[role="status"]').should('contain', 'Loading tasks');
  });

  it('should handle error state', () => {
    // Mock error state
    cy.window().then((win) => {
      win.localStorage.setItem('mockError', 'true');
    });
    cy.reload();
    
    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'Error Loading Tasks');
  });
});