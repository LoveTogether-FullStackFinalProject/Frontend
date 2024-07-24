import React from 'react';
// import { Link } from 'react-router-dom';
import './aboutPage.css';
// import logo from '../assets/logoVeahavtem.png';
// import bgImage from '../assets/logoVeahavtem.png'; 
import socialFrezzer from '../assets/socialFrezzer.png';
import socialMarket from '../assets/socialMarket.png';
import socialCoats from '../assets/coats.png';
import bagForAll from '../assets/bagForAlll.png';


const AboutPage = () => {
  return (
    <div className="about-page">
 

      
        <h2 className='about-header'>קצת עלינו</h2>
        <p className='aboutUsP'>עמותת ואהבתם ביחד מסייעת לאוכלוסיות נזקקות ומפעילה בין היתר את המכולת החברתית , המקרר השיתופי, תיק לכל ילד, קיר המעילים ועוד...</p>
        <section className="description-section">
        <div className="video-container">
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=316&href=https%3A%2F%2Fwww.facebook.com%2Fveahavtembeyahad%2Fvideos%2F907666304163438%2F&show_text=false&width=560&t=0"
            width="560"
            height="316"
            scrolling="no"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </section>

      <section className="initiatives-section">
        <h2>היוזמות שלנו</h2>
        <div className="cards-container">
          <div className="card">
            <img src={socialMarket} alt="המכולת החברתית" />
            <div className="card-content">
              <h3>המכולת החברתית</h3>
              <p>מדהים: מכולת חברתית חדשה באשדוד תחלק למעוטי יכולת מצרכים ללא תשלום...
              <a href="https://ashdodnet.com/%D7%97%D7%93%D7%A9%D7%95%D7%AA-%D7%90%D7%A9%D7%93%D7%95%D7%93/%D7%9E%D7%93%D7%94%D7%99%D7%9D-%D7%9E%D7%9B%D7%9C%D7%95%D7%AA-%D7%97%D7%91%D7%A8%D7%AA%D7%99%D7%AA-%D7%97%D7%93%D7%A9%D7%94-%D7%91%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%AA%D7%90%D7%A4%D7%A9%D7%A8-%D7%9C%D7%9E%D7%A2%D7%95%D7%98%D7%99-%D7%99%D7%9B%D7%95%D7%9C%D7%AA-%D7%9C%D7%A7%D7%91%D7%9C-%D7%9E%D7%A6%D7%A8%D7%9B%D7%99%D7%9D-%D7%9C%D7%9C%D7%90-%D7%AA%D7%A9%D7%9C%D7%95%D7%9D" target="_blank" rel="noopener noreferrer">קרא עוד</a>
              </p>
            </div>
          </div>
          <div className="card">
            <img src={socialFrezzer} alt="המקרר השיתופי" />
            <div className="card-content">
              <h3>המקרר השיתופי</h3>
              <p>המקרר החברתי הראשון באשדוד: תורמים מוצרי מזון ומי שזקוק להם פשוט מגיע ולוקח...
                 <a href="https://ashdodnet.com/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%91%D7%A7%D7%94%D7%99%D7%9C%D7%94/%D7%94%D7%9E%D7%A7%D7%A8%D7%A8-%D7%94%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F-%D7%91%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%AA%D7%95%D7%A8%D7%9E%D7%99%D7%9D-%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%9E%D7%96%D7%95%D7%9F-%D7%95%D7%9E%D7%99-%D7%A9%D7%96%D7%A7%D7%95%D7%A7-%D7%9C%D7%94%D7%9D-%D7%A4%D7%A9%D7%95%D7%98-%D7%9E%D7%92%D7%99%D7%A2-%D7%95%D7%9C%D7%95%D7%A7%D7%97-469588" target="_blank" rel="noopener noreferrer">קרא עוד</a>
              </p>     
            </div>
          </div>
          <div className="card">
            <img src={socialCoats} alt="קיר המעילים" />
            <div className="card-content">
              <h3>קיר המעילים</h3>
              <p>
                קיר המעילים החברתי שמזמין את התושבים לתרום מעילים שאינם משתמשים בהם עבור אלו שצריכים...
                <a href="https://ashdodnet.com/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%91%D7%A7%D7%94%D7%99%D7%9C%D7%94/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%94%D7%99%D7%A4%D7%94-%D7%A7%D7%99%D7%A8-%D7%94%D7%9E%D7%A2%D7%99%D7%9C%D7%99%D7%9D-%D7%94%D7%AA%D7%9E%D7%9C%D7%90-%D7%A2%D7%93-%D7%90%D7%A4%D7%A1-%D7%9E%D7%A7%D7%95%D7%9D-%D7%95%D7%9E%D7%99-%D7%A9%D7%A6%D7%A8%D7%99%D7%9A-%D7%9E%D7%95%D7%96%D7%9E%D7%9F-%D7%9C%D7%91%D7%95%D7%90-%D7%9C%D7%A7%D7%97%D7%AA-501040" target="_blank" rel="noopener noreferrer">קרא עוד</a>
              </p>
            </div>
          </div>
          <div className="card">
            <img src={bagForAll} alt="תיק לכל תלמיד" />
            <div className="card-content">
              <h3>תיק לכל תלמיד</h3>
              <p>תיאור של תיק לכל תלמיד...</p>
            </div>
          </div>
        </div>
      </section>

  
  </div>
  );
};

export default AboutPage;
