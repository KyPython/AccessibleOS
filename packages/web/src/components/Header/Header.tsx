import React, { useState } from 'react';
import LogoIcon from '../icons/LogoIcon';
import DropdownArrowIcon from '../icons/DropdownArrowIcon';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <a href="#" className={styles.navLink}>Home Page</a>
            <a href="#" className={styles.navLink}>Features</a>
            <div className={styles.dropdown}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Get Started
                <DropdownArrowIcon width={13} height={7} color="#000000" />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <a href="#" className={styles.dropdownItem}>Support</a>
                  <a href="#" className={styles.dropdownItem}>Blog</a>
                  <a href="#" className={styles.dropdownItem}>Contact Us</a>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.logo}>
            <LogoIcon width={70} height={36} color="#000000" />
          </div>
          
          <button className={styles.menuButton}>
            Menu
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;