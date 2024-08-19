import React, { useEffect } from 'react';
import './aboutPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import socialFrezzer from '../assets/socialFrezzer.png';
import socialMarket from '../assets/socialMarket.png';
import socialCoats from '../assets/coats.png';
import myVideo from '../assets/videos/fbvideo.mp4';


const AboutPage = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.activity-item');
    const options = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });
  }, []);
  return (
    <div className="about-page">
       <div className="videoTitle">
        <video autoPlay muted loop className="vidBack">
          <source src={myVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="text-overlay">
          <h1 className="about-title">עמותת ואהבתם ביחד</h1>
          <p className="about-registration">ע.ר 580776359</p>
        </div>
      </div>

      <section className=" text-center my-5">
        <div className="section">
          <h2>המכולת החברתית</h2>
          <p>
            המכולת החברתית הראשונה באשדוד הוקמה במטרה לספק מצרכים בסיסיים ללא תשלום למעוטי יכולת. תושבים ובעלי עסקים מוזמנים לתרום מצרכים חיוניים, אותם יוכלו הנזקקים לקחת בכמות מוגדרת וקבועה. המכולת מופעלת על ידי מתנדבים ומתנדבות מסורים אשר דואגים למלא את המדפים באופן שוטף ולסייע למי שצריך.
          </p>
        </div>
        <hr />
        <div className="section">
          <h2>המקרר השיתופי</h2>
          <p>
            המקרר השיתופי הראשון באשדוד ממוקם ברחוב דוד המלך, ומהווה מקום בו תושבים יכולים להניח מוצרי מזון באריזתם המקורית, המיועדים למי שזקוק להם. המקרר פתוח 24/7 ונגיש לכל דורש, המאפשר סיוע דיסקרטי ובלתי מתווך לאלו הזקוקים לו ביותר.
          </p>
        </div>
        <hr />
        <div className="section">
          <h2>יוזמות נוספות</h2>
          <p>
            בין היוזמות הנוספות של העמותה ניתן למצוא את מיזם "תיק לכל ילד", במסגרתו נתרמים מאות ילקוטים וציוד לימוד למשפחות נזקקות, פרויקט "קיר המעילים" שמזמין את הציבור לתרום מעילים עבור אלו שזקוקים להם, וחלוקת סלי מזון למשפחות נזקקות בחגים ובמהלך השנה.
          </p>
        </div>
        <hr />
        <div className="section">
          <h2>סיוע מתמשך וקהילה תומכת</h2>
          <p>
            מאז הקמתה, עמותת "ואהבתם ביחד" זוכה לשיתוף פעולה נרחב עם עסקים מקומיים, בתי ספר, חברות ותורמים פרטיים. בזכות התמיכה הרחבה, העמותה מצליחה להעניק סיוע מתמשך לחיילי צה"ל, משפחות מפונים, קשישים ובני נוער בסיכון, ולהגשים את מטרתה - סיוע כלכלי ואנושי לאוכלוסיות הנזקקות.
          </p>
          <p>
            עמותת "ואהבתם ביחד" ממשיכה להתרחב ולגייס תרומות ושותפים במטרה לפתוח סניפים נוספים ולהרחיב את מעגל התמיכה לכל מי שזקוק לכך.
          </p>
        </div>
      </section>

      <section className="video  text-center my-5">
        <div>
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=316&href=https%3A%2F%2Fwww.facebook.com%2Fveahavtembeyahad%2Fvideos%2F907666304163438%2F&show_text=false&width=560&t=0"
            width="560"
            height="316"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Introduction Video"
          ></iframe>
        </div>
      </section>

      <section className="background-section text-center initiatives-section">
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
              <p>קיר המעילים החברתי שמזמין את התושבים לתרום מעילים שאינם משתמשים בהם עבור אלו שצריכים...
                <a href="https://ashdodnet.com/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%91%D7%A7%D7%94%D7%99%D7%9C%D7%94/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%94%D7%99%D7%A4%D7%94-%D7%A7%D7%99%D7%A8-%D7%94%D7%9E%D7%A2%D7%99%D7%9C%D7%99%D7%9D-%D7%94%D7%AA%D7%9E%D7%9C%D7%90-%D7%A2%D7%93-%D7%90%D7%A4%D7%A1-%D7%9E%D7%A7%D7%95%D7%9D-%D7%95%D7%9E%D7%99-%D7%A9%D7%A6%D7%A8%D7%99%D7%9A-%D7%9E%D7%95%D7%96%D7%9E%D7%9F-%D7%9C%D7%91%D7%95%D7%90-%D7%9C%D7%A7%D7%97%D7%AA-501040" target="_blank" rel="noopener noreferrer">קרא עוד</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
