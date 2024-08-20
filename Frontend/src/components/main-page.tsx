import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";
import { Link } from 'react-router-dom';
import Nav from "react-bootstrap/Nav";
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
import GroupIcon from '@mui/icons-material/Group';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import person from './../assets/person.png';
import whitelogo from '../assets/whiteLogo.png';
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
      sx={{
        marginTop: '150px',
        height:"500px",
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        background: 'linear-gradient(135deg, rgba(249, 230, 167, 0.8) 10%, rgba(245, 245, 244, 0.5) 100%)',
        //249, 218, 120, 0.8)
        // zIndex: -1, 
        padding: '0 20px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' // Adjust shadow here
    }}
>
    {/* Logo */}
    <Box
        component="img"
        src={whitelogo}
        alt="whitelogo"
        style={{
            maxWidth: '500px',
        }}
        sx={{ 
            marginLeft:'7px',
            minWidth:'100px',
            height: 'auto'
        }}
    />

    {/* Text and Button */}
    <Box
        sx={{
            marginBottom:'20px',
            marginRight:'50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            gap: 2, // Space between text and button
        }}
    >
        {/* Center Text */}
        <Typography variant="h3" sx={{ 
            fontFamily: "'Assistant', sans-serif", 
            fontWeight: 500, 
            color: 'black',
            mb: 2,
        }}>
            כמה קל לתרום היום
        </Typography>
      
        <Button

        style={{
            borderRadius:"100px",
            
        }}
  onClick={() => {
    console.log('Button clicked');
    handleButtonClick();
  }}
  variant="contained"
  className="first-section-button"
  startIcon={<i className="fa fa-chevron-left" style={{ fontSize: "20px" }}></i>}
  sx={{ 
    px: 4, 
    py: 2, 
    fontSize: '1rem', 
    // textTransform: 'none', 
    backgroundColor: "white", 
    color: "black", 
    // borderRadius: "8px",
    // boxShadow:"5px",
  }}
>
  לתרומה
</Button>
</Box>
</Box>

            
    
     
       

       
    {/* Section 2: Products We Need */}
    <Box className="section-section-light">
    <Typography 
    variant="h3" 
    sx={{ 
        mb: 2, 
        fontFamily: 'Assistant', 
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

         {/* Section 3: Leading Donors */}
         <Box className="section-section3-light" sx={{ mb: 5 ,fontFamily: 'Assistant'}}>
         <Typography 
        variant="h3" 
        sx={{ 
        mb: 2, 
        fontFamily: 'Assistant', 
        marginTop: "140px", 
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

<Box className="section-partners" sx={{ marginTop: { xs: '40px', sm: '60px', md: '80px' }, textAlign: 'center' }}>
  <Typography 
    variant="h3" 
    sx={{ 
      mb: 2, 
      fontFamily: 'Assistant', 
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
      fontFamily: 'Assistant', 
      color: 'inherit', // Link color
      '&:hover': {
        textDecoration: 'underline', // Underline on hover
      },
      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
    }}
  >
    <Nav.Link as={Link} to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
      קראו עוד על הפרוייקטים שלנו
    </Nav.Link>
  </Typography>
</Box>
<Box className="section-section-light">
<Typography 
    variant="h3" 
    sx={{ 
      mb: 2, 
      fontFamily: 'Assistant', 
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
          <Box className="section-section-yellow" sx={{ marginTop: '50px', padding: '50px 0' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 2, 
          fontFamily: 'Assistant', 
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
          fontFamily: 'Assistant', 
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
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                <CountUp end={hasAnimatedDonations ? totalDonations : 0} duration={2} />
              </Typography>
              <VolunteerActivismIcon sx={{ fontSize: { xs: 40, sm: 50 }, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                תרומות שנתרמו
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
          <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handleUsersVisibility}>
            <div>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                <CountUp end={hasAnimatedUsers ? users.length : 0} duration={2} />
              </Typography>
              <GroupIcon sx={{ fontSize: { xs: 40, sm: 50 }, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                תורמים בקהילה
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
          <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handlePartnersVisibility}>
            <div>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                <CountUp end={hasAnimatedPartners ? 18 : 0} duration={2} />
              </Typography>
              <BusinessCenterIcon sx={{ fontSize: { xs: 40, sm: 50 }, marginBottom: '8px' }} />
              <Typography variant="h6" sx={{ mt: 1, whiteSpace: 'nowrap', textAlign: 'center' }}>
                מוסדות ועסקים שותפים
              </Typography>
            </div>
          </VisibilitySensor>
        </Grid>
      </Grid>
    </Box>



        </Container>
    );

    }

export default MainPage;
