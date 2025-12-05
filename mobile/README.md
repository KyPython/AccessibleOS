# AccessibleOS Mobile App

React Native mobile application built with Expo, focusing on accessibility patterns.

## Features

- React Native with TypeScript
- React Navigation for routing
- Full accessibility props support (accessible, accessibilityLabel, accessibilityHint, etc.)
- Keyboard navigation hints for external keyboards
- Platform-specific accessibility features (VoiceOver, TalkBack)
- Settings persistence with AsyncStorage

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Expo CLI globally (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   Or run on a specific platform:
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   npm run web     # Web browser
   ```

## Development

### iOS
- Requires Xcode and iOS Simulator
- Make sure your API URL points to the correct backend (use `localhost` for simulator)

### Android
- Requires Android Studio and Android Emulator
- For Android emulator, use `10.0.2.2` instead of `localhost` to access your development machine

### API Configuration
Update the `API_URL` in screen files or create an environment configuration:
- iOS Simulator: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`
- Physical Device: Use your machine's local IP address

## Accessibility Features

### React Native Accessibility Props
- `accessible`: Marks elements as accessible
- `accessibilityLabel`: Descriptive label for screen readers
- `accessibilityHint`: Additional context for screen reader users
- `accessibilityRole`: Semantic role (button, text, header, etc.)

### Platform Support
- **iOS**: VoiceOver support with proper accessibility labels
- **Android**: TalkBack support with proper accessibility hints
- **Keyboard Navigation**: External keyboard support with focus indicators

### Settings
- High contrast mode
- Large font size
- Reduce motion
- Settings persist across app restarts

## Project Structure

```
mobile/
├── src/
│   ├── screens/              # Screen components
│   │   ├── TaskListScreen.tsx
│   │   ├── TaskDetailScreen.tsx
│   │   └── AccessibilitySettingsScreen.tsx
│   └── types/                # TypeScript types
│       └── Task.ts
├── App.tsx                   # Root component with navigation
├── index.js                  # Entry point
└── app.json                  # Expo configuration
```

## Testing

Run tests:
```bash
npm test
```

## TODO / Future Enhancements

- [ ] Add keyboard navigation hints for external keyboards
- [ ] Implement platform-specific focus styles
- [ ] Add floating action button for creating tasks
- [ ] Implement edit and delete functionality
- [ ] Add loading states and error boundaries
- [ ] Environment configuration for API URLs
- [ ] Deep linking support
- [ ] Offline support
- [ ] Push notifications

## Notes

- This is a scaffolded structure focusing on accessibility patterns
- Full feature implementation is planned for later phases
- Platform-specific accessibility work is marked with TODOs
- External keyboard navigation requires additional implementation

