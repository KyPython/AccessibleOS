import React from 'react';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImage}>
        <img src="/images/hero-bg.png" alt="Hero background" className={styles.backgroundImage} />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.headline}>
              Empower Your Life with Accessible Task Management
            </h1>
          </div>
          <div className={styles.rightContent}>
            <p className={styles.description}>
              At AccessibleOS, we believe everyone deserves the tools to organize their 
              lives effortlessly. Discover our innovative task management app designed 
              for accessibility and ease of use across all platforms.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryButton}>Learn More</button>
              <button className={styles.secondaryButton}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;