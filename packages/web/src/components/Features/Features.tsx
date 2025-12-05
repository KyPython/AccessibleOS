import React from 'react';
import RightArrowIcon from '../icons/RightArrowIcon';
import styles from './Features.module.css';

const Features: React.FC = () => {
  const features = [
    {
      image: '/images/feature-placeholder.png',
      title: 'Effortless Task Creation and Management',
      description: 'Easily create, edit, and manage your tasks with just a few taps.'
    },
    {
      image: '/images/feature-placeholder.png',
      title: 'Customizable Accessibility Settings for Everyone',
      description: 'Adjust voice-over, keyboard navigation, and contrast to suit your needs.'
    },
    {
      image: '/images/feature-placeholder.png',
      title: 'Real-Time Sync Across All Devices',
      description: 'Stay updated with real-time task synchronization on all platforms.'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <p className={styles.label}>Empower</p>
          <div className={styles.content}>
            <h2 className={styles.heading}>
              Discover the Essential Features of Our App
            </h2>
            <p className={styles.description}>
              Our task management app is designed for everyone, ensuring seamless task creation and 
              management. With robust accessibility features, it empowers users to organize their lives 
              effortlessly.
            </p>
          </div>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureImage}>
                <img src={feature.image} alt={feature.title} />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.actions}>
          <button className={styles.secondaryButton}>Learn More</button>
          <button className={styles.primaryButton}>
            Sign Up
            <RightArrowIcon width={7} height={12} color="#ffffff" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;