import React from 'react';
import WheelchairIcon from '../icons/WheelchairIcon';
import TaskIcon from '../icons/TaskIcon';
import AccessibilityIcon from '../icons/AccessibilityIcon';
import RightArrowIcon from '../icons/RightArrowIcon';
import styles from './StepsGuide.module.css';

const StepsGuide: React.FC = () => {
  const steps = [
    {
      icon: <WheelchairIcon width={32} height={40} color="#000000" />,
      title: 'Follow these simple steps to get started with AccessibleOS.',
      description: 'Begin by signing up for an account to unlock your task management journey.',
      buttonText: 'Sign Up'
    },
    {
      icon: <TaskIcon width={33} height={41} color="#000000" />,
      title: 'Easily create and manage your tasks with our intuitive interface.',
      description: 'Use the app to add, edit, and organize your tasks effortlessly.',
      buttonText: 'Manage'
    },
    {
      icon: <AccessibilityIcon width={35} height={48} color="#000000" />,
      title: 'Explore accessibility options to tailor the app to your needs.',
      description: 'Adjust settings for voice-over, keyboard navigation, and more for a personalized experience.',
      buttonText: 'Settings'
    }
  ];

  return (
    <section className={styles.stepsGuide}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Discover how to effortlessly manage your tasks with our accessible app.
        </h2>
        
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>
                  {step.icon}
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              <button className={styles.stepButton}>
                {step.buttonText}
                <RightArrowIcon width={7} height={12} color="#ffffff" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsGuide;