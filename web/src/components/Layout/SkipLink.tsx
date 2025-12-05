import { ReactNode } from 'react';
import './SkipLink.css';

interface SkipLinkProps {
  href: string;
  children: ReactNode;
}

/**
 * SkipLink component for keyboard navigation
 * Allows users to skip to main content, improving accessibility
 */
export function SkipLink({ href, children }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      (target as HTMLElement).focus();
    }
  };

  return (
    <a href={href} className="skip-link" onClick={handleClick}>
      {children}
    </a>
  );
}

