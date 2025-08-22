import React from 'react';
import LogoIcon from '../icons/LogoIcon';
import FacebookIcon from '../icons/FacebookIcon';
import InstagramIcon from '../icons/InstagramIcon';
import XIcon from '../icons/XIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import YouTubeIcon from '../icons/YouTubeIcon';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const quickLinks = [
    'Home Page',
    'About Us',
    'Contact Us',
    'Link Four',
    'Link Five'
  ];

  const columnTwoLinks = [
    'Link Six',
    'Link Seven',
    'Link Eight',
    'Link Nine',
    'Link Ten'
  ];

  const socialLinks = [
    { icon: <FacebookIcon width={20} height={20} color="#000000" />, label: 'Facebook' },
    { icon: <InstagramIcon width={18} height={18} color="#000000" />, label: 'Instagram' },
    { icon: <XIcon width={18} height={16} color="#000000" />, label: 'X' },
    { icon: <LinkedInIcon width={18} height={18} color="#000000" />, label: 'LinkedIn' },
    { icon: <YouTubeIcon width={20} height={14} color="#000000" />, label: 'Youtube' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.newsletter}>
            <LogoIcon width={70} height={36} color="#000000" />
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for the latest features and updates.
            </p>
            <div className={styles.newsletterForm}>
              <div className={styles.formRow}>
                <input 
                  type="email" 
                  placeholder="Your email here" 
                  className={styles.emailInput}
                />
                <button className={styles.subscribeButton}>Subscribe</button>
              </div>
              <p className={styles.privacyText}>
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>Quick Links</h3>
              <div className={styles.linkList}>
                {quickLinks.map((link, index) => (
                  <a key={index} href="#" className={styles.footerLink}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>Column Two</h3>
              <div className={styles.linkList}>
                {columnTwoLinks.map((link, index) => (
                  <a key={index} href="#" className={styles.footerLink}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div className={styles.linkColumn}>
              <h3 className={styles.columnTitle}>Follow Us</h3>
              <div className={styles.socialLinks}>
                {socialLinks.map((social, index) => (
                  <a key={index} href="#" className={styles.socialLink}>
                    {social.icon}
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© 2024 Relume. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Service</a>
            <a href="#" className={styles.legalLink}>Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;