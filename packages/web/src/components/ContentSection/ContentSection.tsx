import React from 'react';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
  features?: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  children?: React.ReactNode;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  image,
  imageAlt,
  reversed = false,
  features,
  children
}) => {
  return (
    <section className={styles.contentSection}>
      <div className={styles.container}>
        <div className={`${styles.content} ${reversed ? styles.reversed : ''}`}>
          <div className={styles.textContent}>
            <div className={styles.textWrapper}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.description}>{description}</p>
              
              {features && (
                <div className={styles.features}>
                  {features.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      {feature.icon && (
                        <div className={styles.featureIcon}>
                          {feature.icon}
                        </div>
                      )}
                      <div className={styles.featureContent}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {children}
            </div>
          </div>
          
          <div className={styles.imageContent}>
            <img src={image} alt={imageAlt} className={styles.image} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;