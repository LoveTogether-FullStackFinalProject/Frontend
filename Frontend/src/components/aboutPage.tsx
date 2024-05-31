import React from 'react';
import { Link } from 'react-router-dom';
import './aboutPage.css';
import logo from '../assets/logoVeahahavtem.jpg';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <Link to="/">עמוד הבית</Link>
          <Link to="/donate">תרומה</Link>
          <Link to="/login">התנתק</Link>
        </nav>
      </header>

      <main className="main-content">
        <section className="about-us">
          <h1>מי אנחנו</h1>
          <p>
            עמותת ואהבתם ביחד מסייעת לאוכלוסיות נזקקות ופועלת בין היתר את 
            המחלה החברתית, המחקר הרפואי, ריק לכל ילד, קיר המפעלים ועוד...
          </p>
        </section>

        <section className="gallery">
          <h2>התצטרפו אלינו!</h2>
          <div className="gallery-images">
            <img src={image1} alt="Gallery Image 1" />
            <img src={image2} alt="Gallery Image 2" />
            <img src={image3} alt="Gallery Image 3" />
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 עמותת ואהבתם ביחד. כל הזכויות שמורות.</p>
        <div className="social-media">
          <a href="#"><img src="../assets/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="../assets/instagram.png" alt="Instagram" /></a>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
