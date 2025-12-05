# AccessibleOS - Accessible Task Management App

A comprehensive, accessible task management system built for Web, Mobile, and Unity platforms with strong accessibility foundations.

## 🎯 Project Overview

AccessibleOS is designed from the ground up with accessibility as a first-class concern. The application supports:

- **Web**: React + TypeScript with semantic HTML and WCAG 2.1 AA compliance
- **Mobile**: React Native with full accessibility props and keyboard navigation
- **Game**: Unity/C# with remappable controls and screen reader support
- **Backend**: Node.js + Express + PostgreSQL with accessibility metadata support

## 📁 Monorepo Structure

```
accessibleos/
├── backend/          # Node.js + Express + TypeScript API
├── web/              # React + TypeScript web app
├── mobile/           # React Native app
├── unity-game/       # Unity project structure + C# scripts
└── docs/             # Architecture and documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL 14+ (for backend)
- React Native development environment (for mobile)
- Unity 2021.3+ (for game)

### Installation

Install all dependencies:

```bash
npm run install:all
```

Or install individually:

```bash
npm run install:backend
npm run install:web
npm run install:mobile
```

### Running the Applications

#### Backend

1. Set up your PostgreSQL database
2. Create a `.env` file in `backend/` with your database connection string (see `backend/README.md` for details)
3. Run database migrations:
   ```bash
   cd backend
   npm run prisma:migrate
   ```
4. Start the development server:
   ```bash
   npm run dev:backend
   ```

The API will be available at `http://localhost:3000`

#### Web App

```bash
npm run dev:web
```

The web app will be available at `http://localhost:5173` (or your configured port)

#### Mobile App

```bash
cd mobile
npm start
```

Then follow React Native CLI instructions to run on iOS or Android.

## 🧪 Testing

Run all tests:

```bash
npm run test:all
```

Run tests for specific platforms:

```bash
npm run test:backend
npm run test:web
```

## 📚 Documentation

- [Architecture Documentation](./docs/architecture.md) - Overall system architecture and design decisions
- [Timeline](./docs/timeline.md) - Project timeline and phase breakdown (200-290 hours / 13-19 weeks)

## ♿ Accessibility Features

### Web
- Semantic HTML elements
- ARIA roles and labels
- Keyboard navigation (Tab order, skip links)
- Screen reader support
- High contrast and large font modes
- Axe-core automated accessibility testing

### Mobile
- Native accessibility props
- Keyboard navigation hints
- VoiceOver/TalkBack support
- Dynamic Type support
- High contrast modes

### Unity Game
- Remappable controls
- Screen reader integration hooks
- Audio cues and captions
- Keyboard and gamepad navigation

## 🏗️ Development Status

This is a scaffolded project structure. Current status:

- ✅ Monorepo structure established
- ✅ Backend API skeleton with accessibility-aware models
- ✅ Web app foundation with accessibility components
- ✅ Mobile app structure with accessibility patterns
- ✅ Unity game folder structure and example scripts
- 📝 Full feature implementation (in progress)

## 📋 Key Features (Planned)

- Task creation, editing, and deletion
- Accessibility metadata (alt text, descriptions)
- Multi-platform synchronization
- Accessibility settings persistence
- Keyboard shortcuts
- Screen reader optimized navigation

## 🤝 Contributing

This project prioritizes accessibility. All contributions should:

1. Follow WCAG 2.1 AA guidelines
2. Include accessibility testing
3. Support keyboard navigation
4. Provide proper ARIA labels and semantic HTML

## 📄 License

MIT

