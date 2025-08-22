import React from 'react';
import FiveStarsIcon from '../icons/FiveStarsIcon';
import WebflowIcon from '../icons/WebflowIcon';
import styles from './Testimonials.module.css';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The accessibility features are a game changer for me!",
      name: "Jane Doe",
      title: "Project Manager, TechCorp",
      avatar: "/images/user-avatar.jpg"
    },
    {
      quote: "I can finally keep track of my tasks effortlessly!",
      name: "John Smith",
      title: "Designer, CreativeCo",
      avatar: "/images/user-avatar.jpg"
    },
    {
      quote: "The user interface is incredibly intuitive and friendly!",
      name: "Emily Johnson",
      title: "Developer, InnovateX",
      avatar: "/images/user-avatar.jpg"
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.heading}>User Feedback</h2>
          <p className={styles.subtitle}>This app has transformed how I manage my tasks!</p>
        </div>
        
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.rating}>
                <FiveStarsIcon width={116} height={19} color="#000000" />
              </div>
              
              <blockquote className={styles.quote}>
                "{testimonial.quote}"
              </blockquote>
              
              <div className={styles.author}>
                <div className={styles.authorAvatar}>
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{testimonial.name}</div>
                  <div className={styles.authorTitle}>{testimonial.title}</div>
                </div>
                <div className={styles.companyLogo}>
                  <WebflowIcon width={116} height={19} color="#000000" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;