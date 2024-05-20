import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    'aboutImg1.jpg',
    'aboutImg2.jpg',
    'aboutImg3.jpg',
    'aboutImg4.jpg',
    'aboutImg5.jpg',
    'aboutImg6.jpg',
    'aboutImg7.jpg',
    'aboutImg8.jpg',
    'aboutImg9.jpg',
    'aboutImg10.jpg',
    'aboutImg11.jpg',
    'aboutImg12.jpg',
    'aboutImg13.jpg',
    'aboutImg14.jpg'
  ];

  return (
    <div>
      <h1>אודותינו</h1>
      <p>
        ברוכים הבאים למיזם קהילתי ייחודי שנועד לתמוך באנשים הזקוקים לכך.
        הקמנו חנות חברתית המספקת מוצרי יסוד למשפחות מעוטות יכולת ללא עלות.
        המשימה שלנו החלה במעשי חסד קטנים - חלוקת סלי מזון, תיקוני בתים ומתן ציוד לבתי ספר - וגדלה לארגון ללא מטרות רווח, "ואהבתם ביחד".
        הצטרפו אלינו במאמצים להבטיח שאף אחד בקהילה שלנו לא יחסר את הצרכים הבסיסיים.
      </p>
      <p>
        למידע נוסף, בקרו בעמוד הפייסבוק שלנו <a href="https://www.facebook.com/veahavtembeyahad/">כאן</a>.
      </p>
      <h2>תמונות</h2>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`slide-${index}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default About;
