import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";
import { Link } from 'react-router-dom';
import Nav from "react-bootstrap/Nav";
import InstagramSection from './instagramSection';
import BitIcon from '../assets/bit.jpg'; 
import PayboxIcon from '../assets/paybox.jpg';
import certificate from '../assets/certificate.png';
//import {  Button} from 'react-bootstrap';

import {
  Box,
  Typography,
  Button,
  Avatar,
//   CardContent,
  Container,
  IconButton,
  Grid,
//   Card,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import VisibilitySensor from 'react-visibility-sensor';


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import person from './../assets/person.png';
// import whitelogo from '../assets/whiteLogo.png';
import logoTransparent from '../assets/logo_transparent.png';
import valueGif from '../assets/value.gif';
import teamworkGif from '../assets/teamwork.gif';
import agreementGif from '../assets/agreement.gif';
import logo from '../assets/cooporates/logo.jpg';
import logo1 from '../assets/cooporates/logo1.jpg';
import logo2 from '../assets/cooporates/logo2.jpg';
import logo3 from '../assets/cooporates/logo3.jpg';
import logo4 from '../assets/cooporates/logo4.jpg';
import logo5 from '../assets/cooporates/logo5.jpg';
import logo6 from '../assets/cooporates/logo6.jpg';
import logo7 from '../assets/cooporates/logo7.jpg';
import logo8 from '../assets/cooporates/logo8.jpg';
import logo9 from '../assets/cooporates/logo9.jpg';
import logo10 from '../assets/cooporates/logo10.jpg';
import logo11 from '../assets/cooporates/logo11.jpg';
import logo12 from '../assets/cooporates/logo12.jpg';
import logo13 from '../assets/cooporates/logo13.jpg';
import logo14 from '../assets/cooporates/logo14.jpg';
import logo15 from '../assets/cooporates/logo15.jpg';
import logo16 from '../assets/cooporates/logo16.jpg';
import logo17 from '../assets/cooporates/logo17.jpg';
import logo18 from '../assets/cooporates/logo18.jpg';
import logo19 from '../assets/cooporates/logo19.jpg';
import logo20 from '../assets/cooporates/logo20.jpg';
import logo21 from '../assets/cooporates/logo21.jpg';

import CountUp from 'react-countup';
import './main-page.css'; // Import the CSS file
import '../styles/globals.css';
// import { blue } from '@mui/material/colors';

const NextArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                zIndex:999,
                top: '50%',
                right: '0px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '2.5rem',
                }
            }}
        >
            <ChevronRight />
        </IconButton>
    );
};



const PrevArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                zIndex:999,
                top: '50%',
                left: '0px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                color: '#000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '2.5rem',
                }
            }}
        >
            <ChevronLeft />
        </IconButton>
    );
};

type LogoItemProps = {
  src: string;
  alt: string;
};

const LogoItem: React.FC<LogoItemProps> = ({ src, alt }) => (
  <Box sx={{ p: 1, textAlign: 'center' }}>
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: '200px',  // Adjust width
        height: '200px', // Adjust height
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto',
      }}
    />
  </Box>
);

function MainPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Donation[]>([]);
    const [users, setUsers] = useState<DonorData[]>([]);
    const [hasAnimatedDonations, setHasAnimatedDonations] = useState(false);
    const [hasAnimatedUsers, setHasAnimatedUsers] = useState(false);
    const [hasAnimatedPartners, setHasAnimatedPartners] = useState(false);
    const [requests, setRequests] = useState<requestedDonation[]>([]);
    const [counts, setCounts] = useState({
        food: 0,
        clothing: 0,
        furniture: 0,
        footwear: 0,
        babyGear: 0,
        houseware: 0,
        books: 0,
        toys: 0,
        other: 0
    });

    useEffect(() => {
        const { req, abort } = dataService.getDonations();
        req.then((res) => {
            setProducts(res.data);
            console.log(products);
            const categoryCounts = {
                food: res.data.filter(product => product.category === 'מזון ושתייה').length,
                clothing: res.data.filter(product => product.category === 'ביגוד').length,
                furniture: res.data.filter(product => product.category === 'ריהוט').length,
                footwear: res.data.filter(product => product.category === 'הנעלה').length,
                babyGear: res.data.filter(product => product.category === 'ציוד לתינוקות').length,
                houseware: res.data.filter(product => product.category === 'כלי בית').length,
                books: res.data.filter(product => product.category === 'ספרים').length,
                toys: res.data.filter(product => product.category === 'צעצועים').length,
                other: res.data.filter(product => product.category === 'אחר').length,
            };
            setCounts(categoryCounts);
        }).catch((err) => {
            console.log(err);
            if (err instanceof CanceledError) return;
        });

        return () => {
            abort();
        };
    }, []);

    useEffect(() => {
      const sections = document.querySelectorAll(
          '.animated-section, .animated-card, .animated-image'
      );

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

    useEffect(() => {
        const { req, abort } = dataService.getUsers();
        req.then((res) => {
            setUsers(res.data);
        }).catch((err) => {
            console.log(err);
            if (err instanceof CanceledError) return;
        });

        return () => {
            abort();
        };
    }, []);

    useEffect(() => {
        const { req, abort } = dataService.getRequestedProducts();
        req.then((res) => {
            setRequests(res.data);
        }).catch((err) => {
            console.log(err);
            if (err instanceof CanceledError) return;
        });

        return () => {
            abort();
        };
    }, []);

    const handleProductClick = (request:requestedDonation ) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            console.log("request is" ,request);
            navigate('/uploadproduct', { state: { request } });
 } else {
            navigate('/login');
        }
    }

    const handlePartnersVisibility = (isVisible: boolean) => {
      if (isVisible && !hasAnimatedPartners) {
          setHasAnimatedPartners(true);
      }
  };


    const handleButtonClick = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            navigate('/uploadproduct');
        } else {
            navigate('/login');
        }
    };

  
    const handleDonationsVisibility = (isVisible: boolean) => {
        if (isVisible && !hasAnimatedDonations) {
            setHasAnimatedDonations(true);
        }
    };

    const handleUsersVisibility = (isVisible: boolean) => {
        if (isVisible && !hasAnimatedUsers) {
            setHasAnimatedUsers(true);
        }
    };

    const numUsers = users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).length;
    const sliderSettings =({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        // centerMode: true,
        centerPadding: '0px',
    });

    const totalDonations = Object.values(counts).reduce((acc, count) => acc + count, 0);

    return (

        <Container style={{ 
            width: '100%', 
            padding: 0, 
            margin: 0, 
            maxWidth: '100%' ,
        }}>
            {/* Section 1: Logo and Main CTA */}
            {/* Background Gradient Container */}
            {/* Background */}
            
            <Box
              className="animated-section"
      sx={{
        marginTop: '150px',
        height:"500px",
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        background: 'linear-gradient(180deg, rgba(249, 230, 167, 0.8) 10%, rgba(245, 245, 244, 0.5) 100%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' // Adjust shadow here
    }}
>
    {/* Logo */}
    <Box
        component="img"
        src={logoTransparent}
        alt="logoTransparent"
        className="animated-image"
        style={{
            maxWidth: '400px',
        }}
        sx={{ 
            marginLeft:'20px',
            minWidth:'100px',
            height: 'auto'
        }}
    />

    {/* Text and Button */}
    <Box
         className="animated-section"
    style={{
      gap: "0px",
    }}
        
            sx={{ 
              fontFamily: "'Assistant', sans-serif",
              marginBottom:'50px',
              marginRight:'50px',
              maxWidth: { xs: '150px', sm: '200px', md: '400px' },
               marginLeft: '20px',
              height: 'auto',
            }}
          />
    
          {/* Text and Button */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              textAlign: 'right',
              marginRight: '50px',
              gap: 4, 
            }}
          >
            {/* Center Text */}
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.5rem' },
                fontFamily: "'Assistant', sans-serif", 
                fontWeight: 550, 
                marginBottom: "40px",
                color: 'black',
                mb: 2,
              }}
            >
              כמה קל לתרום היום
            </Typography>
    
            <Button
              onClick={() => {
                console.log('Button clicked');
                handleButtonClick();
              }}
              variant="contained"
              sx={{ 
                px: 4, 
                py: 2, 
                fontSize: '1rem', 
                borderRadius: "50px",
                backgroundColor: "#f9db78", 
                border: "55px  #f9db78",
                color: "black", 
                '&:hover': {
                  backgroundColor: '#f9db78',
                  color: 'black',
                },
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              }}
              startIcon={<i className="fa fa-chevron-left" style={{ fontSize: "20px" }}></i>}
            >
              לתרומה
            </Button>
          </Box>
        </Box>

   
<Box component="section" className="section-centered animated-section" sx={{ marginTop: { xs: '20px', sm: '50px' } }}>
  <Container>
    <Typography
      variant="h3"
      sx={{
        mb: 2,
        fontFamily: "'Assistant', sans-serif" ,
        borderBottom: '3px solid #f9db78',
        display: 'inline-block',
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
      }}
    >
      מי אנחנו
    </Typography>
    <Typography variant="body1" className="initiative-text" sx={{ textAlign: 'center', marginTop: '20px' }}>
    עמותת ואהבתם ביחד (ע.ר 580776359) מסייעת לאוכלוסיות נזקקות ומפעילה בין היתר את המכולת החברתית, המקרר השיתופי, תיק לכל ילד וקיר המעילים
    </Typography>
    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
      <a 
        href="/about" 
        style={{ 
          textDecoration: 'none', 
          color: '#f9db78', 
          fontWeight: 'bold',
          display: 'inline-block',
          padding: '10px 15px',
          borderRadius: '25px',
          transition: 'background-color 0.3s, color 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9db78';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#f9db78';
        }}
      >
        קראו עוד על העמותה והפרוייקטים שלנו!
      </a>
    </Typography>
    <Box className="animated-section"  sx={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <a
    href="https://drive.google.com/uc?export=download&id=1pO9bFF9XEohfEIcIeTfJopYfFSUN4w43"
    download="תעודת רישום העמותה.pdf"
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      textDecoration: 'none', 
      color: 'inherit' 
    }}
    className="hover-effect"
  >
    <img
      src={certificate}
      alt="תעודת רישום העמותה"
      style={{ 
        width: '50px', 
        height: '50px', 
        marginRight: '10px', 
        cursor: 'pointer' 
      }} 
    />
    <Typography
      variant="body1"
      sx={{ 
        color: '#333', 
        fontWeight: 'bold', 
        fontSize: '1.2rem', 
        textDecoration: 'none', 
        cursor: 'pointer', 
        textAlign: 'center' 
      }}
    >
      תעודת רישום העמותה
    </Typography>
  </a>
</Box>

  </Container>
</Box>


    {/* Section 2: Products We Need */}
    <Box className="section-section-light animated-section">
    <Typography 
    variant="h3" 
    sx={{ 
        mb: 2, 
        fontFamily: "'Assistant', sans-serif" ,
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },

        marginTop: "100px", 
        borderBottom: '3px solid #f9db78', 
        display: 'inline-block'
    }}
>
    מוצרים שאנו צריכים
</Typography>
  {requests.length === 1 ? (
    <Box sx={{ p: 1, textAlign: 'center',  }}>
      <Box
        component="img"
        src={requests[0].image || person}
        sx={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'block',
          margin: '0 auto',
        }}
        onClick={() => handleProductClick(requests[0])}
      />
      <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold',fontFamily: 'Assistant' }}>
        {requests[0].itemName}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {requests[0].amount} :כמות מבוקשת
      </Typography>
    </Box>
  ) : (
    <Slider {...sliderSettings}>
      {requests.map((request, index) => (
        <Box key={index} sx={{ p: 1, textAlign: 'center',fontFamily: 'Assistant' ,marginTop:"50px",}}>
          <Box
            component="img"
            src={request.image || person}
            sx={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'block',
              margin: '0 auto',
            }}
            onClick={() => handleProductClick(request)}
          />
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold',fontFamily: 'Assistant' }}>
            {request.itemName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {request.amount} :כמות מבוקשת
          </Typography>
        </Box>
      ))}
    </Slider>
  )}
</Box>

<Box className="section-section-light animated-section" sx={{ textAlign: 'center', marginTop: '150px' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontFamily: "'Assistant', sans-serif" ,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            borderBottom: '3px solid #f9db78',
            display: 'inline-block',
          }}
        >
          דרכים נוספות לתרום
        </Typography>

        {/* Donation Methods Grids */}
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '30px' }}>
          {/* Bit Donation */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '30px',
                boxShadow: 3,
                borderRadius: '10px',
                height: '100%',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                '@media (max-width: 600px)': {
                  padding: '20px',
                },
              }}
            >
              <img src={BitIcon} alt="Bit Icon" style={{ width: '80px', height: '80px', marginBottom: '20px' }} />
              <Typography variant="h6" sx={{fontFamily: "'Assistant', sans-serif" ,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '1.5rem' } }}>
               bit תרומה באמצעות אפליקציית ביט
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "'Assistant', sans-serif", marginTop: '10px' }}>
                0506863121 למספר
              </Typography>
            </Box>
          </Grid>

          {/* Paybox Donation */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                 fontFamily: "'Assistant', sans-serif" ,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                textAlign: 'center',
                padding: '30px',
                boxShadow: 3,
                borderRadius: '10px',
                height: '100%',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                '@media (max-width: 600px)': {
                  padding: '20px',
                },
              }}
            >
              <img src={PayboxIcon} alt="Paybox Icon" style={{ width: '80px', height: '80px', marginBottom: '20px' }} />
              <Typography variant="h6" sx={{ fontFamily: "'Assistant', sans-serif" ,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '1.5rem' } }}>
              Paybox תרומה באמצעות אפליקציית פייבוקס
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="https://payboxapp.page.link/RfBHMQfuZ4dt5fsQ8"
                sx={{ marginTop: '10px', backgroundColor: '#f9db78', }}
              >
                 לתרומה
              </Button>
            </Box>
          </Grid>

          {/* Bank Transfer Donation */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '30px',
                boxShadow: 3,
                borderRadius: '10px',
                height: '100%',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
                '@media (max-width: 600px)': {
                  padding: '20px',
                },
              }}
            >
              <Typography variant="h6" sx={{  fontFamily: "'Assistant', sans-serif" ,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, marginBottom: '20px' }}>
                העברה בנקאית
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Assistant', sans-serif" }}>
                בנק מרכנתיל (17)
                <br />
                סניף יהודה הנשיא (740)
                <br />
                חשבון 99004560
                <br />
                ע״ש ואהבתם ביחד
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

         {/* Section 3: Leading Donors */}
         <Box className="section-section3-light animated-section"  sx={{ mb: 5 ,fontFamily: 'Assistant'}}>
         <Typography 
        variant="h3" 
        sx={{ 
        mb: 2, 
        fontFamily: "'Assistant', sans-serif", 
        marginTop: "150px", 
        borderBottom: '3px solid #f9db78', 
        display: 'inline-block'
        
    }}
>
    תורמים מובילים
</Typography>
    {numUsers === 1 ? (
            users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).map((user, index) => (
                <Box key={index} sx={{ p: 1, textAlign: 'center' }}>
                    <Avatar
                        src={user.image || person}
                        alt={user.firstName + ' ' + user.lastName}
                        sx={{ width: 100, height: 100, mx: 'auto', my: 2 }}
                    />
                    <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="body2">תורם מוביל</Typography>
                </Box>
            ))
        ) : (
            <Slider {...sliderSettings}>
                {users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).map((user, index) => (
                    <Box key={index} sx={{ p: 1, textAlign: 'center',fontFamily: 'Assistant' }}>
                        <Avatar
                            src={user.image || person}
                            alt={user.firstName + ' ' + user.lastName}
                            sx={{ width: 100, height: 100, mx: 'auto', my: 2,fontFamily: 'Assistant' }}
                        />
                        <Typography variant="h6" style={{fontFamily: 'Assistant'}}>{user.firstName} {user.lastName}</Typography>
                        <Typography variant="body2">תורם מוביל</Typography>
                    </Box>
                ))}
            </Slider>
        )}
</Box>

<Box className="section-partners animated-section" sx={{ marginTop: { xs: '40px', sm: '60px', md: '80px' }, textAlign: 'center' }}>
  <Typography 
    variant="h3" 
    sx={{ 
      mb: 2, 
      fontFamily: "'Assistant', sans-serif",
      borderBottom: '3px solid #f9db78', 
      display: 'inline-block',
      marginBottom: '50px',
      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    }}
  >
    הפרוייקטים שלנו
  </Typography>
  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '40px' }}>
  <Box component="img" src={logo10} alt="logo10" sx={{ maxWidth: { xs: '150px', sm: '200px', md: '250px' } }} />
  <Box component="img" src={logo11} alt="logo11" sx={{ maxWidth: { xs: '150px', sm: '200px', md: '250px' } }} />
  <Box component="img" src={logo12} alt="logo12" sx={{ maxWidth: { xs: '150px', sm: '200px', md: '250px' } }} />
  <Box component="img" src={logo13} alt="logo13" sx={{ maxWidth: { xs: '150px', sm: '200px', md: '250px' } }} />
</Box>
  <Typography 
    variant="h5" 
    sx={{ 
      mt: 4, 
      fontFamily: "'Assistant', sans-serif",
      color: 'inherit', // Link color
      '&:hover': {
        textDecoration: 'underline', // Underline on hover
        cursor: 'pointer' // Ensure cursor changes to pointer

      },
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
    }}
  >
    
    <Nav.Link
  as={Link}
  to="/about"
  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
  onClick={(e) => {
    e.preventDefault(); // Prevent default scroll behavior
    window.location.href = "/about"; // Redirect to the top of the About page
  }}
>
  קראו עוד על הפרוייקטים שלנו
</Nav.Link>
  </Typography>
</Box>
<Box className="section-section-light">
<Typography 
    variant="h3" 
    sx={{ 
      mb: 2, 
      fontFamily: "'Assistant', sans-serif", 
      borderBottom: '3px solid #f9db78', 
      display: 'inline-block',
      marginBottom: '50px',
      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    }}
  >
    השותפים שלנו לדרך
</Typography>
<Slider {...sliderSettings}>
  {[
    { src: logo, alt: 'logo1' },
    { src: logo1, alt: 'logo2' },
    { src: logo2, alt: 'logo3' },
    { src: logo3, alt: 'logo4' },
    { src: logo4, alt: 'logo5' },
    { src: logo5, alt: 'logo6' },
    { src: logo6, alt: 'logo7' },
    { src: logo7, alt: 'logo8' },
    { src: logo8, alt: 'logo9' },
    { src: logo9, alt: 'logo10' },
    { src: logo14, alt: 'logo14' },
    { src: logo15, alt: 'logo15' },
    { src: logo16, alt: 'logo16' },
    { src: logo17, alt: 'logo17' },
    { src: logo18, alt: 'logo18' },
    { src: logo19, alt: 'logo19' },
    { src: logo20, alt: 'logo20' },
    { src: logo21, alt: 'logo21' },
  ].map((logoData, index) => (
    <LogoItem key={index} src={logoData.src} alt={logoData.alt} />
  ))}
</Slider>
</Box>



            {/* Section 4: Donations and Community Counters */}
          {/* Section 4: Donations and Community Counters */}
          <Box className="section-counters animated-section" sx={{ marginTop: '50px', padding: '50px 0' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 2, 
          fontFamily: "'Assistant', sans-serif",
          borderBottom: '3px solid #f9db78', 
          display: 'inline-block',
          marginBottom: '50px',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          textAlign: 'center' // Ensures the title is centered on smaller screens
        }}
      >
        אנחנו במספרים
      </Typography>

      <Typography 
        variant="h4" 
        sx={{ 
          fontFamily: "'Assistant', sans-serif", 
          padding: "15px", 
          textAlign: "center",
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' }, // Responsive font size
        }}
      >
        !עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה
      </Typography>

      <Grid 
        container 
        spacing={4} 
        sx={{ 
          marginTop: '30px', 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
          <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handleDonationsVisibility}>
            <div>
              <Typography variant="h3" sx={{  mb: 1 }}>
                <CountUp end={hasAnimatedDonations ? totalDonations : 0} duration={2} />
              </Typography>
              <img src={valueGif} alt="Value" style={{ width: 70, height: 70, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                תרומות שנתרמו
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
          <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handleUsersVisibility}>
            <div>
              <Typography variant="h3" sx={{  mb: 1 }}>
                <CountUp end={hasAnimatedUsers ? users.length : 0} duration={2} />
              </Typography>
              <img src={teamworkGif}  className="img-gif" alt="Teamwork" style={{ width: 70, height: 70, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                תורמים בקהילה
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
          <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handlePartnersVisibility}>
            <div>
              <Typography variant="h3" sx={{ mb: 1 }}>
                <CountUp end={hasAnimatedPartners ? 18 : 0} duration={2} />
              </Typography>
              <img src={agreementGif} alt="Partnership" style={{ width: 70, height: 70, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                מוסדות ועסקים שותפים
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>
      </Grid>
    </Box>
    <InstagramSection />
        </Container>
    );

    }
export default MainPage;