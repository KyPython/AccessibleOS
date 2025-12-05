import { useState, useEffect } from 'react';
import './AccessibilitySettings.css';

interface AccessibilitySettings {
  highContrast: boolean;
  largeFont: boolean;
}

const STORAGE_KEY = 'accessibleos-settings';

export function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeFont: false,
  });

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
        applySettings(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (newSettings.largeFont) {
      root.classList.add('large-font');
      root.style.fontSize = '125%';
    } else {
      root.classList.remove('large-font');
      root.style.fontSize = '100%';
    }
  };

  const handleChange = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  return (
    <section aria-label="Accessibility settings">
      <h1>Accessibility Settings</h1>
      <p>Customize your experience to meet your accessibility needs.</p>

      <form aria-label="Accessibility preferences">
        <fieldset className="settings-group">
          <legend>Display Preferences</legend>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={(e) => handleChange('highContrast', e.target.checked)}
              aria-describedby="highContrast-help"
            />
            <label htmlFor="highContrast">High Contrast Mode</label>
            <span id="highContrast-help" className="help-text">
              Increases color contrast for better visibility
            </span>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="largeFont"
              checked={settings.largeFont}
              onChange={(e) => handleChange('largeFont', e.target.checked)}
              aria-describedby="largeFont-help"
            />
            <label htmlFor="largeFont">Large Font Size</label>
            <span id="largeFont-help" className="help-text">
              Increases text size by 25% for easier reading
            </span>
          </div>
        </fieldset>
      </form>

      <section className="keyboard-shortcuts" aria-labelledby="shortcuts-heading">
        <h2 id="shortcuts-heading">Keyboard Shortcuts</h2>
        <dl>
          <dt>
            <kbd>Tab</kbd>
          </dt>
          <dd>Navigate between interactive elements</dd>

          <dt>
            <kbd>Enter</kbd> or <kbd>Space</kbd>
          </dt>
          <dd>Activate buttons and links</dd>

          <dt>
            <kbd>Esc</kbd>
          </dt>
          <dd>Close dialogs or cancel actions</dd>

          <dt>
            <kbd>/</kbd>
          </dt>
          <dd>Focus search box (when available)</dd>
        </dl>
      </section>
    </section>
  );
}

