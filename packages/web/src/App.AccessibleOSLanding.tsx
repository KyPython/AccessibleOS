import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import ContentSection from './components/ContentSection/ContentSection';
import StepsGuide from './components/StepsGuide/StepsGuide';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import InteractiveIcon from './components/icons/InteractiveIcon';
import AccessibilityIcon from './components/icons/AccessibilityIcon';
import RightArrowIcon from './components/icons/RightArrowIcon';

function AccessibleOSLanding() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Features />
      
      {/* Task Management Section */}
      <ContentSection
        title="Effortlessly Create, Edit, and Manage Your Tasks with Our App"
        description="Our task management feature empowers users to easily create, edit, and organize tasks according to their needs. With intuitive navigation and robust accessibility options, managing your daily activities has never been more seamless."
        image="/images/content-image.png"
        imageAlt="Task management interface"
      />
      
      {/* Accessibility Features Section */}
      <ContentSection
        title="Empowering Accessibility: Features that Transform Your Task Management Experience"
        description="Our app prioritizes accessibility, ensuring everyone can manage their tasks effortlessly. With features designed for inclusivity, we make organization simple and effective."
        image="/images/content-image.png"
        imageAlt="Accessibility features"
        reversed
        features={[
          {
            title: 'Voice-Over',
            description: 'Navigate your tasks with ease using our intuitive voice-over functionality.'
          },
          {
            title: 'Keyboard Navigation',
            description: 'Effortlessly manage tasks using our comprehensive keyboard navigation support.'
          }
        ]}
      />
      
      {/* Game Integration Section */}
      <ContentSection
        title="Experience Task Management Like Never Before with Our Unique Game Integration"
        description="Our innovative Unity game integration transforms task management into an engaging experience. Seamlessly navigate your tasks while enjoying interactive gameplay designed for accessibility."
        image="/images/content-image.png"
        imageAlt="Game integration"
        features={[
          {
            title: 'Interactive Gameplay',
            description: 'Combine productivity with fun through our interactive task management game experience.',
            icon: <InteractiveIcon width={45} height={39} color="#000000" />
          },
          {
            title: 'Accessible Features',
            description: 'Enjoy robust accessibility settings that cater to all users and enhance usability.',
            icon: <AccessibilityIcon width={35} height={48} color="#000000" />
          }
        ]}
      />
      
      {/* Transform Experience Section */}
      <ContentSection
        title="Transform Your Task Management Experience Today"
        description="Our app revolutionizes task management for users with disabilities by providing a fully accessible platform. Enjoy seamless organization and enhanced productivity with features tailored to your needs."
        image="/images/content-image.png"
        imageAlt="Transform experience"
        reversed
        features={[
          {
            title: 'Accessibility',
            description: 'Designed with accessibility at its core.'
          },
          {
            title: 'Integration',
            description: 'Interactive features for a unique user experience.'
          }
        ]}
      >
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button className="btn btn-secondary">Learn More</button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sign Up
            <RightArrowIcon width={7} height={12} color="#ffffff" />
          </button>
        </div>
      </ContentSection>
      
      <StepsGuide />
      <Testimonials />
      
      {/* Final CTA Section */}
      <ContentSection
        title="Transform Your Task Management Today"
        description="Join us in creating a more accessible world. Sign up to explore our innovative app!"
        image="/images/cta-image.png"
        imageAlt="Final call to action"
      >
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button className="btn btn-primary">Sign Up</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </ContentSection>
      
      <Footer />
    </div>
  );
}

export default AccessibleOSLanding;