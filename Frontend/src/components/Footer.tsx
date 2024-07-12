import React from 'react';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>פרטי יצירת קשר</p>
      {/* <div className="social-media">
        <a href="https://www.facebook.com/veahavtem/" target="_blank" rel="noopener noreferrer">
          <img src={facebookLogo} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/veahavtem/" target="_blank" rel="noopener noreferrer">
          <img src={instagramLogo} alt="Instagram" />
        </a>
      </div> */}
      <p>עמותת וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
