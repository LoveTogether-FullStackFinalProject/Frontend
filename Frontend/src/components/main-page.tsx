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
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Container,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import person from './../assets/person.png';
import whitelogo from '../assets/whiteLogo.png';
import VisibilitySensor from 'react-visibility-sensor';
import CountUp from 'react-countup';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WeekendIcon from '@mui/icons-material/Weekend';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ToysIcon from '@mui/icons-material/Toys';
import CategoryIcon from '@mui/icons-material/Category';

function MainPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Donation[]>([]);
    const [users, setUsers] = useState<DonorData[]>([]);
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

    const handleProductClick = (productName: string, category: string) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            navigate(`/uploadproduct?productName=${encodeURIComponent(productName)}&category=${encodeURIComponent(category)}`);
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <ChevronLeft />,
        prevArrow: <ChevronLeft />,
        centerMode: true,
        centerPadding: '0px',
    };

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <img src={whitelogo} alt="Logo" style={{ maxWidth: '200px', margin: '0 auto' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 4 }}>
                        כמה קל לתרום היום
                    </Typography>
                    <Button
                        onClick={handleButtonClick}
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#f9db78',
                            color: '#000',
                            fontWeight: 'bold',
                            px: 4,
                            py: 2,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                            '&:hover': {
                                backgroundColor: '#f9db78',
                                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.5)',
                            },
                        }}
                    >
                        לתרומה <ChevronLeft />
                    </Button>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
                        מוצרים שאנחנו צריכים
                    </Typography>
                    <Slider {...settings}>
                        {requests.map((request, index) => (
                            <Box key={index} sx={{ p: 2 }}>
                                <Card sx={{ height: '300px', width: '300px', borderRadius: '50%', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} onClick={() => handleProductClick(request.itemName, request.category)}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={request.image || person} // Default image if none provided
                                        alt={request.itemName}
                                        sx={{ objectFit: 'contain', borderRadius: '50%', width: '140px', height: '140px' }} // Ensures uniformity
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{request.itemName}</Typography>
                                        <Typography variant="body2">{request.amount} :כמות מבוקשת</Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
                        תורמים מובילים
                    </Typography>
                    <Slider {...settings}>
                        {users.filter(user => user.rating === "⭐⭐⭐⭐⭐" && user.isPublished).map((user, index) => (
                            <Box key={index} sx={{ p: 2 }}>
                                <Card sx={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h5">
                        עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה!
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={4} md={4}>
                            <FastfoodIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">מזון ושתייה</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.food} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <CheckroomIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">ביגוד</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.clothing} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <WeekendIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">ריהוט</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.furniture} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <EmojiPeopleIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">הנעלה</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.footwear} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <ChildFriendlyIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">ציוד לתינוקות</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.babyGear} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <KitchenIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">כלי בית</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.houseware} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <MenuBookIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">ספרים</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.books} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <ToysIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">צעצועים</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.toys} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <CategoryIcon style={{ fontSize: 50 }} />
                            <Typography variant="h6">אחר</Typography>
                            <VisibilitySensor partialVisibility offset={{ bottom: 200 }}>
                                {({ isVisible }: { isVisible: boolean }) => (
                                    <div>{isVisible ? <CountUp end={counts.other} duration={2} /> : null}</div>
                                )}
                            </VisibilitySensor>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}

export default MainPage;
