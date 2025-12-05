# AccessibleOS Architecture

## Overview

AccessibleOS is a comprehensive task management system designed with accessibility as a first-class concern across multiple platforms: Web (React), Mobile (React Native), and Unity Game. The architecture emphasizes modularity, accessibility compliance, and cross-platform consistency.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Web App    │ Mobile App   │ Unity Game   │  Future Clients │
│  (React)     │(React Native)│   (C#)       │                 │
└──────┬───────┴──────┬───────┴──────┬───────┴─────────────────┘
       │              │               │
       └──────────────┼───────────────┘
                      │
       ┌──────────────▼──────────────┐
       │     REST API (Express)      │
       │   Node.js + TypeScript      │
       └──────────────┬──────────────┘
                      │
       ┌──────────────▼──────────────┐
       │      PostgreSQL Database    │
       │   (via Prisma ORM)          │
       └─────────────────────────────┘
```

## Component Architecture

### Backend (Node.js + Express + PostgreSQL)

**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Testing**: Jest

**Key Features:**
- RESTful API with `/api` prefix
- Accessibility-aware data models
- Validation enforcing accessibility constraints
- Structured error handling
- Health check endpoint

**API Structure:**
```
/api
  /tasks
    GET    /tasks          - List all tasks
    GET    /tasks/:id      - Get task by ID
    POST   /tasks          - Create new task
    PUT    /tasks/:id      - Update task
    DELETE /tasks/:id      - Delete task
```

**Accessibility Features:**
- Task model includes `altText` field for media descriptions
- Validation ensures `altText` is provided when `hasMedia` is true
- Labels/tags support for categorization
- Structured error messages for accessibility violations

**Future Integrations:**
- Firebase/Supabase support (TODOs marked in code)
- Authentication and authorization
- Real-time updates via WebSockets
- File upload for task media

### Web Application (React + TypeScript)

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Testing**: Jest + React Testing Library + axe-core
- **Styling**: CSS with CSS Variables for theming

**Key Features:**
- Semantic HTML throughout
- Full keyboard navigation
- Screen reader optimization
- High contrast and large font modes
- Automated accessibility testing

**Component Structure:**
```
web/src/
  components/
    Layout/
      SkipLink.tsx          - Skip to main content link
    TaskList.tsx            - Task list with ARIA roles
    TaskForm.tsx            - Accessible form with validation
    AccessibilitySettings.tsx - User preferences
    Help.tsx                - Onboarding and keyboard shortcuts
  types/
    Task.ts                 - TypeScript interfaces
  tests/
    setup.ts                - Test configuration
  __tests__/
    a11y/                   - Accessibility-specific tests
      TaskList.a11y.test.tsx
    TaskList.test.tsx
    SkipLink.test.tsx
```

**Accessibility Patterns:**
- **Semantic HTML**: Use of `<main>`, `<nav>`, `<header>`, `<section>`, etc.
- **ARIA**: Proper roles, labels, and live regions
- **Keyboard Navigation**: Tab order, skip links, keyboard shortcuts
- **Focus Management**: Visible focus indicators, logical focus flow
- **Screen Reader Support**: Descriptive labels, error announcements
- **Visual Accessibility**: High contrast mode, large font, reduced motion support

### Mobile Application (React Native + Expo)

**Technology Stack:**
- **Framework**: React Native with TypeScript
- **Platform**: Expo for cross-platform development
- **Navigation**: React Navigation
- **Storage**: AsyncStorage for settings persistence

**Key Features:**
- Native accessibility props
- Platform-specific screen reader support (VoiceOver, TalkBack)
- Keyboard navigation hints for external keyboards
- Settings persistence
- Adaptive layouts

**Screen Structure:**
```
mobile/src/screens/
  TaskListScreen.tsx        - List of tasks with accessibility props
  TaskDetailScreen.tsx      - Task details view
  AccessibilitySettingsScreen.tsx - Mobile accessibility settings
```

**Accessibility Patterns:**
- **Accessibility Props**: `accessible`, `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`
- **Platform Support**: VoiceOver (iOS), TalkBack (Android)
- **Keyboard Navigation**: External keyboard support with hints
- **Settings**: High contrast, large font, reduce motion
- **Dynamic Type**: Support for system font size preferences

**Platform Considerations:**
- iOS: VoiceOver integration, Dynamic Type support
- Android: TalkBack integration, accessibility services
- External keyboards: Navigation hints and shortcuts

### Unity Game (C#)

**Technology Stack:**
- **Engine**: Unity 2021.3+
- **Language**: C#
- **Input**: Unity Input System (planned)
- **Audio**: Unity AudioSource for cues

**Key Features:**
- Remappable controls (keyboard, gamepad, mouse)
- Screen reader integration hooks
- Audio cues with captions
- Keyboard and gamepad navigation
- Visual accessibility options

**Script Structure:**
```
unity-game/Assets/Scripts/
  Accessibility/
    AccessibleMenuController.cs     - Menu navigation with a11y
    ScreenReaderIntegration.cs      - Screen reader hooks
  Tasks/
    TaskInteractionController.cs    - Task interaction patterns
```

**Accessibility Patterns:**
- **Control Remapping**: All controls can be remapped
- **Screen Reader Integration**: Platform-specific hooks (Windows UI Automation, macOS NSAccessibility, Linux AT-SPI)
- **Audio Cues**: Optional audio feedback with text captions
- **Focus Management**: Clear focus indicators, logical navigation
- **Visual Options**: High contrast, large font, colorblind-friendly

**Platform Integration:**
- Windows: UI Automation, Tolk library option
- macOS: NSAccessibility, VoiceOver
- Linux: AT-SPI, Orca integration

## Data Models

### Task Model

```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // Required
  description: string | null;    // Optional
  status: TaskStatus;            // PENDING | IN_PROGRESS | COMPLETED | CANCELLED
  dueDate: DateTime | null;      // Optional
  createdAt: DateTime;
  updatedAt: DateTime;
  
  // Accessibility fields
  altText: string | null;        // Required when hasMedia is true
  hasMedia: boolean;             // Indicates if task has associated media
  labels: string[];              // Array of tags/labels
}
```

**Accessibility Constraints:**
- `title` is required (cannot be empty)
- When `hasMedia` is `true`, `altText` must be provided
- Validation enforced at both client and server levels

## Accessibility as a First-Class Concern

### Design Principles

1. **Semantic Structure**: Use appropriate HTML elements and ARIA roles
2. **Keyboard Navigation**: All features accessible via keyboard
3. **Screen Reader Support**: Proper labels, hints, and announcements
4. **Visual Accessibility**: High contrast, large fonts, clear focus indicators
5. **User Control**: Users can customize accessibility settings
6. **Progressive Enhancement**: Core functionality works without JavaScript/advanced features

### Testing Strategy

1. **Automated Testing**: axe-core for web, platform-specific tools for mobile/Unity
2. **Manual Testing**: Keyboard-only navigation, screen reader testing
3. **User Testing**: Testing with actual users with disabilities
4. **WCAG Compliance**: Targeting WCAG 2.1 AA level

### Accessibility Features by Platform

| Feature | Web | Mobile | Unity |
|---------|-----|--------|-------|
| Keyboard Navigation | ✅ Full | ✅ External keyboards | ✅ Full |
| Screen Reader Support | ✅ ARIA | ✅ Native props | ⚠️ Platform hooks |
| High Contrast | ✅ User toggle | ✅ User toggle | ✅ User toggle |
| Large Font | ✅ User toggle | ✅ System + toggle | ✅ User toggle |
| Focus Indicators | ✅ CSS | ✅ Native | ✅ Custom |
| Skip Links | ✅ Implemented | N/A | ✅ Planned |
| Audio Cues | ❌ | ❌ | ✅ Planned |

## Development Phases

### Phase 1: Foundation (Current - Scaffolded)
- ✅ Monorepo structure
- ✅ Backend API skeleton
- ✅ Web app foundation
- ✅ Mobile app structure
- ✅ Unity game structure
- ✅ Basic accessibility patterns

### Phase 2: Core Features
- [ ] Full CRUD operations
- [ ] User authentication
- [ ] Task synchronization across platforms
- [ ] Basic accessibility testing

### Phase 3: Development & Integration
- [ ] Complete UI/UX implementation
- [ ] Cross-platform synchronization
- [ ] Advanced accessibility features
- [ ] API integration for all clients

### Phase 4: Testing & Optimization
- [ ] Comprehensive accessibility testing
- [ ] Performance optimization
- [ ] WCAG 2.1 AA compliance audit
- [ ] User testing with accessibility tools

### Phase 5: Polish & Deployment
- [ ] Lighthouse audits
- [ ] Axe compliance reports
- [ ] Documentation completion
- [ ] Production deployment

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React's built-in escaping)
- CORS configuration
- Environment variable management
- Secure authentication (future)

## Scalability Considerations

- Stateless API design
- Database indexing on frequently queried fields
- Caching strategies (future)
- CDN for static assets (web)
- API rate limiting (future)

## Future Enhancements

1. **Real-time Updates**: WebSocket support for live task updates
2. **Offline Support**: Service workers for web, local storage for mobile
3. **Collaboration**: Multi-user task sharing and permissions
4. **Notifications**: Push notifications for task reminders
5. **Analytics**: Usage analytics with privacy considerations
6. **Internationalization**: Multi-language support
7. **Advanced Accessibility**: Voice control, eye-tracking support

## Technology Decisions

### Why Prisma?
- Type-safe database access
- Migrations management
- Good TypeScript integration
- Accessibility to validation layer

### Why Vite for Web?
- Fast development server
- Modern build tooling
- Good TypeScript support
- Excellent developer experience

### Why Expo for Mobile?
- Cross-platform development
- Good accessibility support
- Easy deployment
- Active community

### Why Unity for Game?
- Cross-platform game engine
- Good C# ecosystem
- Customizable for accessibility
- Can integrate with native accessibility APIs

## Conclusion

This architecture prioritizes accessibility while maintaining flexibility for future enhancements. The modular design allows each platform to optimize for its strengths while sharing core data models and API contracts. Accessibility is built into every layer, from data models to UI components, ensuring a consistent and inclusive experience across all platforms.

