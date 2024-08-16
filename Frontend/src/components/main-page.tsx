import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";


import {
  Box,
  Typography,
  Button,
  Avatar,
  CardContent,
  Container,
  IconButton,
  Card,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import VisibilitySensor from 'react-visibility-sensor';
import GroupIcon from '@mui/icons-material/Group';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import person from './../assets/person.png';
import whitelogo from '../assets/whiteLogo.png';
import CountUp from 'react-countup';
import './main-page.css'; // Import the CSS file
import '../styles/globals.css';

const NextArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                color: '#000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                }
            }}
        >
            <ChevronRight />
        </IconButton>
    );
};

type PrevArrowProps = {
    onClick: () => void;
};

const PrevArrow = (props: PrevArrowProps) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                top: '50%',
                left: '-20px',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                color: '#000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '1.5rem',
                }
            }}
        >
            <ChevronLeft />
        </IconButton>
    );
};

function MainPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Donation[]>([]);
    const [users, setUsers] = useState<DonorData[]>([]);
    const [hasAnimatedDonations, setHasAnimatedDonations] = useState(false);
    const [hasAnimatedUsers, setHasAnimatedUsers] = useState(false);
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

    const sliderSettings =({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, 
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow onClick={function (): void {
            throw new Error('Function not implemented.');
        } } />,
        centerMode: true,
        centerPadding: '0px',
    });


    const totalDonations = Object.values(counts).reduce((acc, count) => acc + count, 0);

    return (
        <Container style={{width:"100%"}}>
            {/* Section 1: Logo and Main CTA */}
            {/* Background Gradient Container */}
            {/* Background */}
            <Box
        sx={{
        marginTop: '80px',
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Space between logo and text/button
        background: 'linear-gradient(135deg, rgba(249, 218, 120, 0.8) 0%, rgba(245, 245, 245, 0.8) 100%)',
        zIndex: -1, // Ensure it is behind other content
        padding: '0 20px', // Optional: padding for better spacing
    }}
>
    {/* Logo */}
    <Box
        component="img"
        src={whitelogo}
        alt="whitelogo"
        sx={{ 
            maxWidth: '300px',
            minWidth:'100px',
            height: 'auto'
        }}
    />

    {/* Text and Button */}
    <Box
        sx={{
            marginBottom:'20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            gap: 2, // Space between text and button
        }}
    >
        {/* Center Text */}
        <Typography variant="h4" sx={{ 
            fontFamily: "'Assistant', sans-serif", 
            fontWeight: 500, 
            color: 'black',
            mb: 2,
        }}>
            כמה קל לתרום היום
        </Typography>

        {/* Button */}
        <Button
            onClick={handleButtonClick}
            variant="contained"
            endIcon={<i className="bi bi-chevron-left" style={{ fontSize: "20px" }}></i>}
            sx={{ 
                px: 4, 
                py: 2, 
                fontSize: '1rem', 
                textTransform: 'none', 
                backgroundColor: "white", 
                color: "black", 
                borderRadius: "8px" 
            }}
        >
            לתרומה
        </Button>
    </Box>
</Box>
            {/* </Box> */}
        {/* </Box> */}
    
     
       

             {/* Section 2: Products We Need */}
             <Box className="section-section-light" >
                <Typography variant="h5" sx={{ mb: 2}}>
                    מוצרים שאנחנו צריכים
                </Typography>
                <Slider {...sliderSettings}>
                    {requests.map((request, index) => (
                        <Box key={index} sx={{ p: 1, textAlign: 'center' }}>
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
                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>{request.itemName}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>{request.amount} :כמות מבוקשת</Typography>
                        </Box>
                    ))}
                </Slider>
            </Box>


          {/* Section 3: Products We Need */}
          <Box className="section-section3-light" >
                <Typography variant="h5" sx={{ mb: 2}}>
                    תורמים מובילים
                </Typography>
                <Slider {...sliderSettings}>
                {users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).map((user, index) => (
                        <Box key={index} sx={{ p: 2 }}>
                            <Card sx={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                <Avatar
                                    src={user.image || person}
                                    alt={user.firstName + ' ' + user.lastName}
                                    sx={{ width: 100, height: 100, mx: 'auto', my: 2 }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                                    <Typography variant="body2">תורם מוביל</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Slider>
            </Box>





            {/* Section 4: Donations and Community Counters */}
            <Box className="section section-yellow">
                <Typography variant="h5">
                    !עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה
                </Typography>
                <Box className="counter-box">
                    <Box>
                        <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handleDonationsVisibility}>
                            <div>
                                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                    <CountUp end={hasAnimatedDonations ? totalDonations : 0} duration={2} />
                                </Typography>
                                <VolunteerActivismIcon sx={{ fontSize: 50, mt: 1 }} />
                                <Typography variant="h6">תרומות שנתרמו</Typography>
                            </div>
                        </VisibilitySensor>
                    </Box>
                    <Box>
                        <VisibilitySensor partialVisibility offset={{ bottom: 200 }} onChange={handleUsersVisibility}>
                            <div>
                                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                    <CountUp end={hasAnimatedUsers ? users.length : 0} duration={2} />
                                </Typography>
                                <GroupIcon sx={{ fontSize: 50, mt: 1 }} />
                                <Typography variant="h6">תורמים בקהילה</Typography>
                            </div>
                        </VisibilitySensor>
                    </Box>
                </Box>
            </Box>
        </Container>
    );

    }

export default MainPage;
