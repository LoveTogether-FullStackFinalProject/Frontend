import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import dataService, { CanceledError } from "../services/data-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Row, Col } from 'react-bootstrap';
import person1 from './../assets/person1.png';
import person2 from './../assets/person2.png';
import person3 from './../assets/person3.png';
import product1 from './../assets/product1.png';
import product2 from './../assets/product2.png';
import product3 from './../assets/product3.png';
import donation1 from './../assets/donation1.png';
import donation2 from './../assets/donation2.png';
import donation3 from './../assets/donation3.png';

function MainPage() {
    const [products, setProducts] = useState<Donation[]>([]);
    const [users, setUsers] = useState<DonorData[]>([]);
    const [requests, setRequests] = useState<Donation[]>([]);
    const navigate = useNavigate();

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

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const countProducts = (category: string) => {
        return products.filter(product => product.category === category).length;
    }

    return (
        <div>
            <div style={{ textAlign: 'center', paddingTop: '10px', marginBottom: '60px' }}>
                <h2>ברוכים הבאים לאתר התרומות של</h2>
                <h1 style={{ color: 'brown' }}>"ואהבתם ביחד"</h1>
                <h2>נשמח לעזרתכם עם המוצרים הדרושים לתרומות בביקוש גבוה כרגע בעמותה:</h2>
            </div>
            <div >
                <button className="btn btn-primary" onClick={handleProfileClick}>החשבון שלי</button>
                <button className="btn btn-primary">תרמו כאן</button>
            </div>
            <div >
                <button className="btn btn-primary" onClick={handleProfileClick}>החשבון שלי</button>
            </div>
            
            <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', marginBottom: '80px', backgroundColor: '#F0FFFF' }}>
                <Carousel
                    nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" style={{ color: 'black', backgroundColor: 'transparent' }} />}
                    prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{ color: 'black', backgroundColor: 'transparent' }} />}
                >
                    <Carousel.Item>
                        <Row>
                            {requests.map((request, index) => (
                                <Col key={index}>
                                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{`${request.productType}: ${request.amount}`}</p>
                                </Col>
                            ))}
                        </Row>
                    </Carousel.Item>
                </Carousel>
                <button style={{ display: 'block', width: 'auto', padding: '10px', backgroundColor: '#CD853F', color: 'white', fontWeight: 'bold', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>תרמו כאן</button>
            </div>

            <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF', marginBottom: '80px' }}>
                <h2>הקטגוריות שלנו</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>משחקים לילדים</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>כלי בית</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>שתייה</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>מזון</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF' }}>
                    <h2 style={{ fontSize: '1.5em', textAlign: 'center' }}>
                        עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה!
                        הצלחנו לגייס {countProducts('מזון')} ארוחות חמות,
                        {countProducts('שתייה')} משקאות, ו- {countProducts('כלי בית')} כלי בית
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <img src={product1} alt="Image 1" style={{ width: '15%', margin: '10px', border: '2px solid black' }} />
                        <img src={product2} alt="Image 2" style={{ width: '25%', margin: '10px', border: '2px solid black' }} />
                        <img src={product3} alt="Image 3" style={{ width: '25%', margin: '10px', border: '2px solid black' }} />
                    </div>
                </div>

                <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF' }}>
                    <h1 style={{ fontSize: '2em', color: 'red', textAlign: 'center' }}>התורמים שלנו</h1>
                    <h2 style={{ fontSize: '1em', textAlign: 'center' }}>התורמים שתרמו הכי הרבה בשנה האחרונה וסייעו להכי הרבה משפחות נזקקות:</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {users.filter(user => user.rating === "1").map((user, index) => (
                            <p key={index}>{user.firstName} {user.lastName}</p>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <img src={person1} alt="Image 1" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                        <img src={person2} alt="Image 2" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                        <img src={person3} alt="Image 3" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
