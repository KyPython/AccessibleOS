import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'accessibleos-settings';

interface AccessibilitySettings {
  highContrast: boolean;
  largeFont: boolean;
  reduceMotion: boolean;
}

export function AccessibilitySettingsScreen() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeFont: false,
    reduceMotion: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      // TODO: Apply settings to app (dynamic styles, etc.)
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleToggle = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityLabel="Accessibility settings"
    >
      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessible={true}
          accessibilityRole="header"
        >
          Display Preferences
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Text
              style={styles.settingLabel}
              accessible={true}
              accessibilityRole="text"
            >
              High Contrast Mode
            </Text>
            <Text style={styles.settingDescription}>
              Increases color contrast for better visibility
            </Text>
          </View>
          <Switch
            value={settings.highContrast}
            onValueChange={(value) => handleToggle('highContrast', value)}
            accessible={true}
            accessibilityLabel="Toggle high contrast mode"
            accessibilityHint="Double tap to enable or disable high contrast mode"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Text
              style={styles.settingLabel}
              accessible={true}
              accessibilityRole="text"
            >
              Large Font Size
            </Text>
            <Text style={styles.settingDescription}>
              Increases text size for easier reading
            </Text>
          </View>
          <Switch
            value={settings.largeFont}
            onValueChange={(value) => handleToggle('largeFont', value)}
            accessible={true}
            accessibilityLabel="Toggle large font size"
            accessibilityHint="Double tap to enable or disable large font size"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Text
              style={styles.settingLabel}
              accessible={true}
              accessibilityRole="text"
            >
              Reduce Motion
            </Text>
            <Text style={styles.settingDescription}>
              Reduces animations and transitions
            </Text>
          </View>
          <Switch
            value={settings.reduceMotion}
            onValueChange={(value) => handleToggle('reduceMotion', value)}
            accessible={true}
            accessibilityLabel="Toggle reduce motion"
            accessibilityHint="Double tap to enable or disable reduced motion"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={styles.sectionTitle}
          accessible={true}
          accessibilityRole="header"
        >
          Platform Accessibility
        </Text>
        <Text style={styles.infoText}>
          AccessibleOS respects your device's system accessibility settings.
          Make sure to enable VoiceOver (iOS) or TalkBack (Android) in your
          device settings for full screen reader support.
        </Text>
        {/* TODO: Add links to system settings if possible */}
        {/* TODO: Add keyboard navigation hints for external keyboards */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

