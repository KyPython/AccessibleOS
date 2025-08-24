/**
 * Accessibility Audit Tool for AccessibleOS
 * Provides automated accessibility testing and reporting
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  description: string;
  element: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  suggestion: string;
}

export interface AccessibilityReport {
  score: number;
  totalIssues: number;
  criticalIssues: number;
  seriousIssues: number;
  moderateIssues: number;
  minorIssues: number;
  issues: AccessibilityIssue[];
  timestamp: string;
}

class AccessibilityAuditor {
  private issues: AccessibilityIssue[] = [];

  /**
   * Run comprehensive accessibility audit
   */
  async audit(element: Element = document.body): Promise<AccessibilityReport> {
    this.issues = [];

    // Run all audit checks
    this.checkColorContrast(element);
    this.checkKeyboardNavigation(element);
    this.checkAriaLabels(element);
    this.checkHeadingStructure(element);
    this.checkFormLabels(element);
    this.checkImageAltText(element);
    this.checkFocusManagement(element);
    this.checkSemanticHTML(element);
    this.checkLandmarks(element);
    this.checkTextScaling(element);

    return this.generateReport();
  }

  /**
   * Check color contrast ratios
   */
  private checkColorContrast(element: Element): void {
    const textElements = element.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, label, input, textarea');
    
    textElements.forEach((el) => {
      const styles = window.getComputedStyle(el as Element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrastRatio(color, backgroundColor);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        const requiredRatio = isLargeText ? 3 : 4.5;
        
        if (contrast < requiredRatio) {
          this.addIssue({
            type: 'error',
            rule: 'color-contrast',
            description: `Insufficient color contrast ratio: ${contrast.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
            element: this.getElementSelector(el as Element),
            impact: contrast < 2 ? 'critical' : 'serious',
            wcagLevel: 'AA',
            wcagCriteria: '1.4.3',
            suggestion: 'Increase contrast between text and background colors'
          });
        }
      }
    });
  }

  /**
   * Check keyboard navigation support
   */
  private checkKeyboardNavigation(element: Element): void {
    const interactiveElements = element.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    
    interactiveElements.forEach((el) => {
      const tabIndex = (el as HTMLElement).tabIndex;
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex > 0) {
        this.addIssue({
          type: 'warning',
          rule: 'tabindex-positive',
          description: 'Positive tabindex values should be avoided',
          element: this.getElementSelector(el as Element),
          impact: 'moderate',
          wcagLevel: 'A',
          wcagCriteria: '2.4.3',
          suggestion: 'Use tabindex="0" or remove tabindex to rely on natural tab order'
        });
      }

      // Check for missing focus indicators
      const styles = window.getComputedStyle(el as Element, ':focus');
      if (!styles.outline || styles.outline === 'none') {
        this.addIssue({
          type: 'warning',
          rule: 'focus-visible',
          description: 'Interactive element lacks visible focus indicator',
          element: this.getElementSelector(el as Element),
          impact: 'serious',
          wcagLevel: 'AA',
          wcagCriteria: '2.4.7',
          suggestion: 'Add visible focus styles using :focus or :focus-visible'
        });
      }
    });
  }

  /**
   * Check ARIA labels and attributes
   */
  private checkAriaLabels(element: Element): void {
    const elementsNeedingLabels = element.querySelectorAll('button, input, select, textarea');
    
    elementsNeedingLabels.forEach((el) => {
      const hasAriaLabel = el.hasAttribute('aria-label');
      const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
      const hasLabel = el.tagName === 'INPUT' && element.querySelector(`label[for="${el.id}"]`);
      const hasInnerText = (el as HTMLElement).innerText?.trim();
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasLabel && !hasInnerText) {
        this.addIssue({
          type: 'error',
          rule: 'aria-label',
          description: 'Interactive element lacks accessible name',
          element: this.getElementSelector(el as Element),
          impact: 'critical',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          suggestion: 'Add aria-label, aria-labelledby, or associate with a label element'
        });
      }
    });

    // Check for invalid ARIA attributes
    const elementsWithAria = element.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');
    elementsWithAria.forEach((el) => {
      const ariaExpanded = el.getAttribute('aria-expanded');
      const ariaSelected = el.getAttribute('aria-selected');
      const ariaChecked = el.getAttribute('aria-checked');
      
      if (ariaExpanded && !['true', 'false'].includes(ariaExpanded)) {
        this.addIssue({
          type: 'error',
          rule: 'aria-valid-attr-value',
          description: 'Invalid aria-expanded value',
          element: this.getElementSelector(el as Element),
          impact: 'serious',
          wcagLevel: 'A',
          wcagCriteria: '4.1.2',
          suggestion: 'Use "true" or "false" for aria-expanded'
        });
      }
    });
  }

  /**
   * Check heading structure
   */
  private checkHeadingStructure(element: Element): void {
    const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > previousLevel + 1) {
        this.addIssue({
          type: 'warning',
          rule: 'heading-order',
          description: `Heading level ${level} skips levels (previous was ${previousLevel})`,
          element: this.getElementSelector(heading),
          impact: 'moderate',
          wcagLevel: 'AA',
          wcagCriteria: '1.3.1',
          suggestion: 'Use heading levels in sequential order'
        });
      }
      
      previousLevel = level;
    });

    // Check for missing h1
    if (!element.querySelector('h1')) {
      this.addIssue({
        type: 'warning',
        rule: 'page-has-heading-one',
        description: 'Page should have one main heading (h1)',
        element: 'document',
        impact: 'moderate',
        wcagLevel: 'AA',
        wcagCriteria: '1.3.1',
        suggestion: 'Add an h1 element to identify the main content'
      });
    }
  }

  /**
   * Check form labels
   */
  private checkFormLabels(element: Element): void {
    const formInputs = element.querySelectorAll('input:not([type="hidden"]), select, textarea');
    
    formInputs.forEach((input) => {
      const id = input.id;
      const hasLabel = id && element.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label');
      const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        this.addIssue({
          type: 'error',
          rule: 'label',
          description: 'Form input lacks proper label',
          element: this.getElementSelector(input),
          impact: 'critical',
          wcagLevel: 'A',
          wcagCriteria: '3.3.2',
          suggestion: 'Associate input with a label element or add aria-label'
        });
      }
    });
  }

  /**
   * Check image alt text
   */
  private checkImageAltText(element: Element): void {
    const images = element.querySelectorAll('img');
    
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        this.addIssue({
          type: 'error',
          rule: 'image-alt',
          description: 'Image lacks alt attribute',
          element: this.getElementSelector(img),
          impact: 'serious',
          wcagLevel: 'A',
          wcagCriteria: '1.1.1',
          suggestion: 'Add alt attribute with descriptive text or empty alt="" for decorative images'
        });
      }
    });
  }

  /**
   * Check focus management
   */
  private checkFocusManagement(element: Element): void {
    // Check for focus traps in modals
    const modals = element.querySelectorAll('[role="dialog"], .modal');
    
    modals.forEach((modal) => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        this.addIssue({
          type: 'warning',
          rule: 'focus-trap',
          description: 'Modal dialog lacks focusable elements',
          element: this.getElementSelector(modal),
          impact: 'serious',
          wcagLevel: 'AA',
          wcagCriteria: '2.4.3',
          suggestion: 'Ensure modal contains focusable elements and implements focus trap'
        });
      }
    });
  }

  /**
   * Check semantic HTML usage
   */
  private checkSemanticHTML(element: Element): void {
    // Check for generic div/span usage where semantic elements would be better
    const clickableDivs = element.querySelectorAll('div[onclick], span[onclick]');
    
    clickableDivs.forEach((div) => {
      this.addIssue({
        type: 'warning',
        rule: 'semantic-html',
        description: 'Clickable div/span should be a button or link',
        element: this.getElementSelector(div),
        impact: 'moderate',
        wcagLevel: 'A',
        wcagCriteria: '4.1.2',
        suggestion: 'Use <button> for actions or <a> for navigation'
      });
    });
  }

  /**
   * Check landmark regions
   */
  private checkLandmarks(element: Element): void {
    const hasMain = element.querySelector('main, [role="main"]');
    const hasNav = element.querySelector('nav, [role="navigation"]');
    
    if (!hasMain) {
      this.addIssue({
        type: 'warning',
        rule: 'landmark-main',
        description: 'Page lacks main landmark',
        element: 'document',
        impact: 'moderate',
        wcagLevel: 'AA',
        wcagCriteria: '1.3.1',
        suggestion: 'Add <main> element or role="main" to identify main content'
      });
    }
  }

  /**
   * Check text scaling
   */
  private checkTextScaling(element: Element): void {
    const textElements = element.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    
    textElements.forEach((el) => {
      const styles = window.getComputedStyle(el as Element);
      const fontSize = parseFloat(styles.fontSize);
      
      if (fontSize < 12) {
        this.addIssue({
          type: 'warning',
          rule: 'text-scaling',
          description: 'Text size may be too small for some users',
          element: this.getElementSelector(el as Element),
          impact: 'minor',
          wcagLevel: 'AA',
          wcagCriteria: '1.4.4',
          suggestion: 'Ensure text can be scaled up to 200% without loss of functionality'
        });
      }
    });
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): [number, number, number] {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0];
  }

  /**
   * Calculate relative luminance
   */
  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Get CSS selector for element
   */
  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `${element.tagName.toLowerCase()}.${element.className.split(' ')[0]}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Add issue to the list
   */
  private addIssue(issue: AccessibilityIssue): void {
    this.issues.push(issue);
  }

  /**
   * Generate accessibility report
   */
  private generateReport(): AccessibilityReport {
    const criticalIssues = this.issues.filter(i => i.impact === 'critical').length;
    const seriousIssues = this.issues.filter(i => i.impact === 'serious').length;
    const moderateIssues = this.issues.filter(i => i.impact === 'moderate').length;
    const minorIssues = this.issues.filter(i => i.impact === 'minor').length;
    
    // Calculate score (100 - weighted penalty)
    const score = Math.max(0, 100 - (
      criticalIssues * 20 +
      seriousIssues * 10 +
      moderateIssues * 5 +
      minorIssues * 1
    ));

    return {
      score,
      totalIssues: this.issues.length,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      issues: this.issues,
      timestamp: new Date().toISOString()
    };
  }
}

export const accessibilityAuditor = new AccessibilityAuditor();

/**
 * Quick accessibility audit function
 */
export async function auditAccessibility(element?: Element): Promise<AccessibilityReport> {
  return accessibilityAuditor.audit(element);
}

/**
 * Continuous accessibility monitoring
 */
export class AccessibilityMonitor {
  private observer: MutationObserver | null = null;
  private isMonitoring = false;

  start(callback: (report: AccessibilityReport) => void): void {
    if (this.isMonitoring) return;

    this.observer = new MutationObserver(async () => {
      const report = await auditAccessibility();
      callback(report);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-label', 'aria-labelledby', 'role']
    });

    this.isMonitoring = true;
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
  }
}

export const accessibilityMonitor = new AccessibilityMonitor();