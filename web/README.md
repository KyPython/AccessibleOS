# AccessibleOS Web App

React + TypeScript web application with strong accessibility foundations.

## Features

- Semantic HTML elements
- Full keyboard navigation
- Screen reader support
- ARIA roles and labels
- Skip-to-content links
- High contrast and large font modes
- Automated accessibility testing with axe-core

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (optional):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run accessibility tests:
```bash
npm run test:a11y
```

## Accessibility Features

### Keyboard Navigation
- Tab order is logical and predictable
- Skip-to-content link appears on focus
- All interactive elements are keyboard accessible
- Focus indicators are clearly visible

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and roles
- Form field descriptions
- Live regions for status updates

### Visual Accessibility
- High contrast mode (toggle in Settings)
- Large font mode (toggle in Settings)
- Clear focus indicators
- Responsive design

### Automated Testing
- axe-core integration for automated accessibility testing
- Jest + React Testing Library for component tests
- Accessibility-focused test examples

## Project Structure

```
web/
├── src/
│   ├── components/       # React components
│   │   ├── Layout/       # Layout components (SkipLink, etc.)
│   │   ├── TaskList.tsx  # Task list component
│   │   ├── TaskForm.tsx  # Task form component
│   │   ├── AccessibilitySettings.tsx
│   │   └── Help.tsx
│   ├── types/            # TypeScript type definitions
│   ├── tests/            # Test setup and utilities
│   ├── __tests__/        # Test files
│   │   └── a11y/         # Accessibility tests
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── index.html
└── vite.config.ts
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development Notes

- Uses Vite for fast development and building
- React Router for navigation
- Axe-core runs in development mode for real-time accessibility feedback
- All forms include proper labels and error messages
- All images require alt text when media is present

