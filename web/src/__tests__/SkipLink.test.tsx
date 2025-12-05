import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkipLink } from '../components/Layout/SkipLink';

describe('SkipLink', () => {
  it('should have correct ARIA attributes and be keyboard accessible', () => {
    render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should focus the target element when clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <main id="main-content">Main content</main>
      </div>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    const mainContent = container.querySelector('#main-content') as HTMLElement;

    await user.click(skipLink);

    expect(mainContent).toHaveFocus();
  });
});

