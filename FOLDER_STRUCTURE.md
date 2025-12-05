# AccessibleOS Folder Structure

Complete folder structure of the AccessibleOS monorepo.

```
accessibleos/
├── .gitignore                          # Git ignore rules
├── package.json                        # Root package.json with workspace scripts
├── README.md                           # Main project README
├── FOLDER_STRUCTURE.md                 # This file
│
├── backend/                            # Node.js + Express + TypeScript API
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── README.md
│   ├── prisma/
│   │   └── schema.prisma               # Prisma database schema
│   └── src/
│       ├── index.ts                    # Express server entry point
│       ├── routes/
│       │   └── tasks.ts                # Task API routes
│       ├── controllers/
│       │   └── TaskController.ts       # Task business logic
│       └── __tests__/
│           └── TaskController.test.ts  # Task controller tests
│
├── web/                                # React + TypeScript web app
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts                  # Vite configuration
│   ├── jest.config.js
│   ├── index.html
│   ├── README.md
│   └── src/
│       ├── main.tsx                    # React entry point
│       ├── App.tsx                     # Main app component
│       ├── App.css
│       ├── index.css                   # Global styles
│       ├── types/
│       │   └── Task.ts                 # TypeScript type definitions
│       ├── components/
│       │   ├── TaskList.tsx            # Task list component
│       │   ├── TaskList.css
│       │   ├── TaskForm.tsx            # Task form component
│       │   ├── TaskForm.css
│       │   ├── AccessibilitySettings.tsx
│       │   ├── AccessibilitySettings.css
│       │   ├── Help.tsx
│       │   ├── Help.css
│       │   └── Layout/
│       │       ├── SkipLink.tsx        # Skip to content link
│       │       └── SkipLink.css
│       ├── tests/
│       │   └── setup.ts                # Test configuration
│       └── __tests__/
│           ├── TaskList.test.tsx       # Task list tests
│           ├── SkipLink.test.tsx       # Skip link tests
│           └── a11y/
│               └── TaskList.a11y.test.tsx  # Accessibility tests
│
├── mobile/                             # React Native + Expo app
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   ├── app.json                        # Expo configuration
│   ├── index.js                        # React Native entry point
│   ├── App.tsx                         # Root component with navigation
│   ├── README.md
│   └── src/
│       ├── screens/
│       │   ├── TaskListScreen.tsx      # Task list screen
│       │   ├── TaskDetailScreen.tsx    # Task detail screen
│       │   └── AccessibilitySettingsScreen.tsx
│       └── types/
│           └── Task.ts                 # TypeScript type definitions
│
├── unity-game/                         # Unity game structure
│   ├── README.md                       # Unity project documentation
│   └── Assets/
│       └── Scripts/
│           ├── Accessibility/
│           │   ├── AccessibleMenuController.cs
│           │   └── ScreenReaderIntegration.cs
│           └── Tasks/
│               └── TaskInteractionController.cs
│
└── docs/                               # Documentation
    ├── architecture.md                 # System architecture documentation
    └── timeline.md                     # Project timeline (200-290 hours)
```

## Key Files by Purpose

### Configuration Files
- `package.json` (root) - Workspace configuration and scripts
- `backend/package.json` - Backend dependencies
- `web/package.json` - Web app dependencies
- `mobile/package.json` - Mobile app dependencies
- `backend/tsconfig.json` - Backend TypeScript config
- `web/tsconfig.json` - Web TypeScript config
- `mobile/tsconfig.json` - Mobile TypeScript config
- `web/vite.config.ts` - Vite build configuration
- `mobile/babel.config.js` - Babel configuration
- `mobile/app.json` - Expo configuration

### Entry Points
- `backend/src/index.ts` - Backend server entry
- `web/src/main.tsx` - Web app entry
- `mobile/index.js` - Mobile app entry
- `mobile/App.tsx` - Mobile app root component

### Database
- `backend/prisma/schema.prisma` - Database schema with Task model

### Core Components

#### Backend
- `backend/src/routes/tasks.ts` - REST API routes
- `backend/src/controllers/TaskController.ts` - Business logic
- `backend/src/__tests__/TaskController.test.ts` - Tests with accessibility validation

#### Web
- `web/src/App.tsx` - Main app with routing
- `web/src/components/TaskList.tsx` - Task list with ARIA
- `web/src/components/TaskForm.tsx` - Accessible form
- `web/src/components/Layout/SkipLink.tsx` - Skip to content

#### Mobile
- `mobile/src/screens/TaskListScreen.tsx` - Task list with accessibility props
- `mobile/src/screens/TaskDetailScreen.tsx` - Task details
- `mobile/src/screens/AccessibilitySettingsScreen.tsx` - Settings

#### Unity
- `unity-game/Assets/Scripts/Accessibility/AccessibleMenuController.cs` - Menu navigation
- `unity-game/Assets/Scripts/Tasks/TaskInteractionController.cs` - Task interactions
- `unity-game/Assets/Scripts/Accessibility/ScreenReaderIntegration.cs` - Screen reader hooks

### Documentation
- `README.md` (root) - Main project documentation
- `docs/architecture.md` - Detailed architecture
- `docs/timeline.md` - Project timeline and phases
- `backend/README.md` - Backend setup instructions
- `web/README.md` - Web app setup instructions
- `mobile/README.md` - Mobile app setup instructions
- `unity-game/README.md` - Unity project documentation

## Environment Files Needed

### Backend
Create `backend/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/accessibleos?schema=public"
PORT=3000
NODE_ENV=development
```

### Web (Optional)
Create `web/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Quick Start Commands

```bash
# Install all dependencies
npm run install:all

# Run backend
npm run dev:backend

# Run web app
npm run dev:web

# Run mobile app
cd mobile && npm start

# Run tests
npm run test:all
```

## File Count Summary

- **Backend**: 8 files
- **Web**: 22 files
- **Mobile**: 9 files
- **Unity**: 4 files
- **Documentation**: 7 files
- **Root**: 3 files

**Total**: ~53 files (excluding node_modules, build artifacts)

