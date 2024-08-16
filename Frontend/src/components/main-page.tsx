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
  Card,
  CardContent,
  Container,
  IconButton,
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

    const handleProductClick = (productName: string, category: string, amount: number) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
          navigate(`/uploadproduct?productName=${encodeURIComponent(productName)}&category=${encodeURIComponent(category)}&amount=${amount}`);
      } else {
          navigate('/login');
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow onClick={() => {}} />,
        centerMode: true,
        centerPadding: '0px',
    };

    const totalDonations = Object.values(counts).reduce((acc, count) => acc + count, 0);

    return (
        <Container maxWidth="lg">
            {/* Section 1: Logo and Main CTA */}
            <Box className="first-section">
    <img src={whitelogo} alt="Logo" className="first-section-logo" />
    <Typography variant="h5" className="first-section-title">
        כמה קל לתרום היום
    </Typography>
    <Button
        onClick={handleButtonClick}
        variant="contained"
        className="first-section-button"
    >
        לתרומה <ChevronLeft />
    </Button>
</Box>

            {/* Section 2: Products We Need */}
            <Box className="section section-light">
                <Typography variant="h5">
                    מוצרים שאנחנו צריכים
                </Typography>
                <Slider {...sliderSettings}>
                    {requests.map((request, index) => (
                        <Box key={index} sx={{ p: 1, textAlign: 'center' }}>
                            <Box
                                component="img"
                                src={request.image || person}
                                sx={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    display: 'block',
                                    margin: '0 auto',
                                }}
                                onClick={() => handleProductClick(request.itemName, request.category, request.amount)}
                                />
                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>{request.itemName}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>{request.amount} :כמות מבוקשת</Typography>
                        </Box>
                    ))}
                </Slider>
            </Box>


            {/* Section 3: Leading Donors */}
            <Box className="section section-light">
                <Typography variant="h5">
                    תורמים מובילים
                </Typography>
                <Slider {...sliderSettings}>
                    {users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).map((user, index) => (
                        <Box key={index} sx={{ p: 2 }}>
                            <Card sx={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                <Avatar
                                    src={user.image || person}
                                    alt={`${user.firstName} ${user.lastName}`}
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
