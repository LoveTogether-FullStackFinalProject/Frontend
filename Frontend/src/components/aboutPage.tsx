import { useEffect } from "react";
import "./aboutPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  Typography,
  //Button,
  //Avatar,
  //   CardContent,
  Container,
  //IconButton,
  //   Card,
} from "@mui/material";
import socialFrezzer from "../assets/socialFrezzer.png";
import socialMarket from "../assets/socialMarket.png";
import socialCoats from "../assets/coats.png";
import myVideo from "../assets/videos/fbvideo.mp4";
import logo10 from "../assets/cooporates/logo10.jpg";
import logo11 from "../assets/cooporates/logo11.jpg";
import logo12 from "../assets/cooporates/logo12.jpg";
// import logo13 from '../assets/cooporates/logo13.jpg';
import img1 from "../assets/organizationImages/img1.jpg";
import img2 from "../assets/organizationImages/img2.jpg";
import img3 from "../assets/organizationImages/img3.jpg";
import img4 from "../assets/organizationImages/img4.jpg";
import img5 from "../assets/organizationImages/img5.jpg";
import img6 from "../assets/organizationImages/img6.jpg";
import img7 from "../assets/organizationImages/img7.jpg";
import img8 from "../assets/organizationImages/img8.jpg";
import img9 from "../assets/organizationImages/img9.jpg";
import img10 from "../assets/organizationImages/img10.jpg";
import img11 from "../assets/organizationImages/img11.jpg";
import img12 from "../assets/organizationImages/img12.jpg";
import img13 from "../assets/organizationImages/img13.jpg";
import img14 from "../assets/organizationImages/img14.jpg";
import img15 from "../assets/organizationImages/img15.jpg";
import img16 from "../assets/organizationImages/img16.jpg";
import img17 from "../assets/organizationImages/img17.jpg";

const AboutPage = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(
      ".activity-item, .initiative-item, .section, .card"
    );
    const options = {
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    sections.forEach((section) => {
      observer.observe(section);
    });
  }, []);

  return (
    <div className="about-page">
      <div className="videoTitle">
        <video autoPlay muted loop playsInline className="vidBack">
          <source src={myVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="text-overlay">
          <h1 className="about-title">עמותת ואהבתם ביחד</h1>
          <p className="about-registration">ע.ר 580776359</p>
        </div>
      </div>

      <Box
        component="section"
        className="section-centered"
        sx={{ marginTop: { xs: "20px", sm: "50px" } }}
      >
        <Container>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontFamily: "'Assistant', sans-serif",
              borderBottom: "3px solid #f9db78",
              display: "inline-block",
            }}
          >
            הסיפור שלנו
          </Typography>
          <Typography
            variant="body1"
            className="initiative-text"
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            עמותת "ואהבתם ביחד" נוסדה מתוך חזון להעניק סיוע ותמיכה לאוכלוסיות
            נזקקות באשדוד והסביבה. העמותה מפעילה מגוון יוזמות חברתיות ייחודיות,
            ביניהן המכולת החברתית, המקרר השיתופי, תיק לכל ילד וקיר המעילים,
            במטרה לספק פתרונות מידיים ויעילים לצרכים הבסיסיים של משפחות נזקקות.
          </Typography>
        </Container>
      </Box>

      <section className="initiatives-section">
        <div className="initiative-item">
          <img src={logo10} alt="המכולת החברתית" className="initiative-image" />
          <div className="initiative-content">
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontFamily: "'Assistant', sans-serif",
                borderBottom: "3px solid #f9db78",
                display: "inline-block",
              }}
            >
              המכולת החברתית
            </Typography>
            <p className="initiative-text">
              המכולת החברתית הראשונה באשדוד הוקמה במטרה לספק מצרכים בסיסיים ללא
              תשלום למעוטי יכולת. תושבים ובעלי עסקים מוזמנים לתרום מצרכים
              חיוניים, אותם יוכלו הנזקקים לקחת בכמות מוגדרת וקבועה. המכולת
              מופעלת על ידי מתנדבים ומתנדבות מסורים אשר דואגים למלא את המדפים
              באופן שוטף ולסייע למי שצריך.
            </p>
          </div>
        </div>

        <div className="initiative-item">
          <img src={logo12} alt="המקרר השיתופי" className="initiative-image" />
          <div className="initiative-content">
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontFamily: "'Assistant', sans-serif",
                borderBottom: "3px solid #f9db78",
                display: "inline-block",
              }}
            >
              המקרר השיתופי
            </Typography>
            <p className="initiative-text">
              המקרר השיתופי הראשון באשדוד ממוקם ברחוב דוד המלך, ומהווה מקום בו
              תושבים יכולים להניח מוצרי מזון באריזתם המקורית, המיועדים למי שזקוק
              להם. המקרר פתוח 24/7 ונגיש לכל דורש, המאפשר סיוע דיסקרטי ובלתי
              מתווך לאלו הזקוקים לו ביותר.
            </p>
          </div>
        </div>

        <div className="initiative-item">
          <img src={logo11} alt="יוזמות נוספות" className="initiative-image" />
          <div className="initiative-content">
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontFamily: "'Assistant', sans-serif",
                borderBottom: "3px solid #f9db78",
                display: "inline-block",
              }}
            >
              יוזמות נוספות
            </Typography>
            <p className="initiative-text">
              בין היוזמות הנוספות של העמותה ניתן למצוא את מיזם "תיק לכל ילד",
              במסגרתו נתרמים מאות ילקוטים וציוד לימוד למשפחות נזקקות, פרויקט
              "קיר המעילים" שמזמין את הציבור לתרום מעילים עבור אלו שזקוקים להם,
              וחלוקת סלי מזון למשפחות נזקקות בחגים ובמהלך השנה.
            </p>
          </div>
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

      <section className="activity-section">
        <div className="activity-gallery">
          <div className="activity-item">
            <img src={img1} alt="Description 1" />
          </div>
          <div className="activity-item">
            <img src={img2} alt="Description 2" />
          </div>
          <div className="activity-item">
            <img src={img3} alt="Description 3" />
          </div>
          <div className="activity-item">
            <img src={img4} alt="Description 4" />
          </div>
          <div className="activity-item">
            <img src={img5} alt="Description 5" />
          </div>
          <div className="activity-item">
            <img src={img6} alt="Description 6" />
          </div>
          <div className="activity-item">
            <img src={img7} alt="Description 7" />
          </div>
          <div className="activity-item">
            <img src={img8} alt="Description 8" />
          </div>
          <div className="activity-item">
            <img src={img9} alt="Description 9" />
          </div>
          <div className="activity-item">
            <img src={img10} alt="Description 10" />
          </div>
          <div className="activity-item">
            <img src={img11} alt="Description 11" />
          </div>
          <div className="activity-item">
            <img src={img12} alt="Description 12" />
          </div>
          <div className="activity-item">
            <img src={img13} alt="Description 13" />
          </div>
          <div className="activity-item">
            <img src={img14} alt="Description 14" />
          </div>
          <div className="activity-item">
            <img src={img15} alt="Description 15" />
          </div>
          <div className="activity-item">
            <img src={img16} alt="Description 16" />
          </div>
          <div className="activity-item">
            <img src={img17} alt="Description 17" />
          </div>
        </div>
      </section>

      <section className="background-section text-center initiatives-section">
        <h2>היוזמות שלנו</h2>
        <div className="cards-container">
          <div className="card">
            <img src={socialMarket} alt="המכולת החברתית" />
            <div className="card-content">
              <h3>המכולת החברתית</h3>
              <p>
                מדהים: מכולת חברתית חדשה באשדוד תחלק למעוטי יכולת מצרכים ללא
                תשלום...
                <a
                  href="https://ashdodnet.com/%D7%97%D7%93%D7%A9%D7%95%D7%AA-%D7%90%D7%A9%D7%93%D7%95%D7%93/%D7%9E%D7%93%D7%94%D7%99%D7%9D-%D7%9E%D7%9B%D7%9C%D7%95%D7%AA-%D7%97%D7%91%D7%A8%D7%AA%D7%99%D7%AA-%D7%97%D7%93%D7%A9%D7%94-%D7%91%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%AA%D7%90%D7%A4%D7%A9%D7%A8-%D7%9C%D7%9E%D7%A2%D7%95%D7%98%D7%99-%D7%99%D7%9B%D7%95%D7%9C%D7%AA-%D7%9C%D7%A7%D7%91%D7%9C-%D7%9E%D7%A6%D7%A8%D7%9B%D7%99%D7%9D-%D7%9C%D7%9C%D7%90-%D7%AA%D7%A9%D7%9C%D7%95%D7%9D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  קרא עוד
                </a>
              </p>
            </div>
          </div>
          <div className="card">
            <img src={socialFrezzer} alt="המקרר השיתופי" />
            <div className="card-content">
              <h3>המקרר השיתופי</h3>
              <p>
                המקרר החברתי הראשון באשדוד: תורמים מוצרי מזון ומי שזקוק להם פשוט
                מגיע ולוקח...
                <a
                  href="https://ashdodnet.com/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%91%D7%A7%D7%94%D7%99%D7%9C%D7%94/%D7%94%D7%9E%D7%A7%D7%A8%D7%A8-%D7%94%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F-%D7%91%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%AA%D7%95%D7%A8%D7%9E%D7%99%D7%9D-%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%9E%D7%96%D7%95%D7%9F-%D7%95%D7%9E%D7%99-%D7%A9%D7%96%D7%A7%D7%95%D7%A7-%D7%9C%D7%94%D7%9D-%D7%A4%D7%A9%D7%95%D7%98-%D7%9E%D7%92%D7%99%D7%A2-%D7%95%D7%9C%D7%95%D7%A7%D7%97-469588"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  קרא עוד
                </a>
              </p>
            </div>
          </div>
          <div className="card">
            <img src={socialCoats} alt="קיר המעילים" />
            <div className="card-content">
              <h3>קיר המעילים</h3>
              <p>
                קיר המעילים החברתי שמזמין את התושבים לתרום מעילים שאינם משתמשים
                בהם עבור אלו שצריכים...
                <a
                  href="https://ashdodnet.com/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%91%D7%A7%D7%94%D7%99%D7%9C%D7%94/%D7%90%D7%A9%D7%93%D7%95%D7%93-%D7%94%D7%99%D7%A4%D7%94-%D7%A7%D7%99%D7%A8-%D7%94%D7%9E%D7%A2%D7%99%D7%9C%D7%99%D7%9D-%D7%94%D7%AA%D7%9E%D7%9C%D7%90-%D7%A2%D7%93-%D7%90%D7%A4%D7%A1-%D7%9E%D7%A7%D7%95%D7%9D-%D7%95%D7%9E%D7%99-%D7%A9%D7%A6%D7%A8%D7%99%D7%9A-%D7%9E%D7%95%D7%96%D7%9E%D7%9F-%D7%9C%D7%91%D7%95%D7%90-%D7%9C%D7%A7%D7%97%D7%AA-501040"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  קרא עוד
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
