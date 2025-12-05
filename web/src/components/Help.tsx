import { Link } from 'react-router-dom';
import './Help.css';

export function Help() {
  return (
    <article aria-labelledby="help-heading">
      <h1 id="help-heading">Help & Onboarding</h1>

      <section aria-labelledby="getting-started-heading">
        <h2 id="getting-started-heading">Getting Started</h2>
        <p>
          Welcome to AccessibleOS! This task management app is designed with
          accessibility as a first-class concern.
        </p>

        <h3>Creating Your First Task</h3>
        <ol>
          <li>Click the "Create New Task" button on the home page</li>
          <li>Fill in the task title (required)</li>
          <li>Optionally add a description, due date, and other details</li>
          <li>If your task includes media, make sure to provide alt text</li>
          <li>Click "Create Task" to save</li>
        </ol>
      </section>

      <section aria-labelledby="keyboard-nav-heading">
        <h2 id="keyboard-nav-heading">Keyboard Navigation</h2>
        <p>
          AccessibleOS is fully keyboard navigable. You can use the following
          shortcuts:
        </p>
        <ul>
          <li>
            <kbd>Tab</kbd> - Move forward through interactive elements
          </li>
          <li>
            <kbd>Shift + Tab</kbd> - Move backward through interactive elements
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and links
          </li>
          <li>
            <kbd>Esc</kbd> - Close dialogs or cancel actions
          </li>
        </ul>

        <h3>Skip Links</h3>
        <p>
          When you press <kbd>Tab</kbd> at the top of any page, you'll see a
          "Skip to main content" link. This allows you to bypass the navigation
          and jump directly to the main content.
        </p>
      </section>

      <section aria-labelledby="screen-reader-heading">
        <h2 id="screen-reader-heading">Screen Reader Support</h2>
        <p>
          AccessibleOS is designed to work well with screen readers like
          NVDA, JAWS, VoiceOver, and TalkBack.
        </p>
        <ul>
          <li>All images have descriptive alt text</li>
          <li>Forms include proper labels and error messages</li>
          <li>Interactive elements have clear ARIA labels</li>
          <li>Status updates are announced to screen readers</li>
        </ul>

        <h3>Tips for Screen Reader Users</h3>
        <ul>
          <li>
            Use heading navigation (e.g., H in NVDA) to quickly move between
            sections
          </li>
          <li>
            Use landmark navigation (e.g., D in NVDA) to jump to main content,
            navigation, etc.
          </li>
          <li>
            Form fields include descriptions - listen for the help text after
            the label
          </li>
        </ul>
      </section>

      <section aria-labelledby="accessibility-features-heading">
        <h2 id="accessibility-features-heading">Accessibility Features</h2>
        <ul>
          <li>
            <strong>High Contrast Mode:</strong> Increase color contrast for
            better visibility. Enable this in{' '}
            <Link to="/settings">Settings</Link>.
          </li>
          <li>
            <strong>Large Font Mode:</strong> Increase text size by 25% for
            easier reading. Enable this in{' '}
            <Link to="/settings">Settings</Link>.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Full keyboard support for all
            features.
          </li>
          <li>
            <strong>Focus Indicators:</strong> Clear, visible focus indicators
            on all interactive elements.
          </li>
          <li>
            <strong>Semantic HTML:</strong> Proper use of headings, landmarks,
            and ARIA roles.
          </li>
        </ul>
      </section>

      <section aria-labelledby="media-heading">
        <h2 id="media-heading">Adding Media to Tasks</h2>
        <p>
          When creating a task that includes images, videos, or other media,
          you must provide alt text. This ensures that users with screen
          readers can understand the content of the media.
        </p>
        <ul>
          <li>
            Alt text should be concise but descriptive
          </li>
          <li>
            Focus on the purpose and content of the media, not just describing
            what it is
          </li>
          <li>
            If the media is decorative, mark the task as not having media
          </li>
        </ul>
      </section>

      <section aria-labelledby="support-heading">
        <h2 id="support-heading">Need More Help?</h2>
        <p>
          If you have questions or encounter accessibility issues, please reach
          out. We're committed to making AccessibleOS as accessible as possible.
        </p>
      </section>
    </article>
  );
}

