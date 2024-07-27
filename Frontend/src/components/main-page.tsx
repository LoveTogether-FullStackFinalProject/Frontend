import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Row, Col } from 'react-bootstrap';
import person from './../assets/person.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './main-page.css';

function MainPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Donation[]>([]);
    const [users, setUsers] = useState<DonorData[]>([]);
    const [requests, setRequests] = useState<requestedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const { req, abort } = dataService.getDonations();
        req.then((res) => {
            setProducts(res.data);
        }).catch((err) => {
            console.log(err);
            if (err instanceof CanceledError) return;
            setError(err.message);
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
            setError(err.message);
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
            setError(err.message);
        });

        return () => {
            abort();
        };
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
    };

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

    const countProducts = (category: string) => {
        return products.filter(product => product.category === category).length;
    };

    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const categories = ['מזון ושתייה', 'ביגוד', 'אלקטרוניקה'];

    const chunkedProducts = categories.map(category =>
        chunkArray(products.filter(product => product.category === category), 3)
    ).flat();

    const chunkedRequests = chunkArray(requests, 3);
    const donorChunks = chunkArray(users.filter(user => user.rating === "1" && user.isPublished), 2);

    return (
        <>
            <div className='body'>
                <div className='body_backgroud'>
                    <div className='image-background-container'></div>
                    <div className="centerText-brownText">
                        <h2>כמה קל לתרום היום</h2>
                        <button onClick={handleButtonClick} className="donateButton">
                            לתרומה
                            <i className="bi bi-chevron-left" style={{ fontSize: "20px" }}></i>
                        </button>
                    </div>
                    <div>
                        <img src="src/assets/whiteLogo.png" alt="whitelogo" className='whiteLogo' />
                    </div>
                </div>

                <div className="borderBox">
                    <Carousel
                        nextIcon={<span aria-hidden="true" className="carouselControlNextIcon">&lt;</span>}
                        prevIcon={<span aria-hidden="true" className="carouselControlPrevIcon">&gt;</span>}
                    >
                        {chunkedRequests.map((chunk, chunkIndex) => (
                            <Carousel.Item key={chunkIndex}>
                                <Row>
                                    {chunk.map((request, index) => (
                                        <Col key={index} className="categorySection" onClick={() => handleProductClick(request.itemName,request.category)}>
                                            <p className="centerText">
                                                {`${request.itemName}: ${request.amount}`}
                                                {request.expirationDate && `תאריך תפוגה: ${new Date(request.expirationDate).toLocaleDateString('he-IL')}`}
                                            </p>
                                            <img src={request.image} alt="Product" className="productImage" />
                                        </Col>
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>

                <div className="flexSpaceBetween">
                    <div className="squareContainer flexCenterColumn">
                        <h2 style={{ fontSize: '1.5em', textAlign: 'center', marginTop: '10px' }}>
                            עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה!<br />
                            הצלחנו לגייס {countProducts('מזון ושתייה')} פרטי מזון ושתייה,<br />
                            {countProducts('ביגוד')} ביגוד, ו- {countProducts('אלקטרוניקה')} מוצרי אלקטרוניקה
                        </h2>
                        <Carousel
                            style={{ marginTop: '30px' }}
                            nextIcon={<span aria-hidden="true" className="carouselControlNextIcon">&lt;</span>}
                            prevIcon={<span aria-hidden="true" className="carouselControlPrevIcon">&gt;</span>}
                        >
                            {chunkedProducts.map((chunk, chunkIndex) => (
                                <Carousel.Item key={chunkIndex}>
                                    <Row>
                                        {chunk.map((product, index) => (
                                            <Col key={index} className="categorySection">
                                                <p className="centerText">
                                                    {`${product.itemName}`}
                                                </p>
                                                <img
                                                    src={product.image}
                                                    alt={`Product ${index + 1}`}
                                                    className="productImage"
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>

                    <div className="squareContainer flexCenterColumn">
                        <div className="donorHeader">
                            <h1 className="donorSection">התורמים שלנו</h1>
                            <h2 className="donorInfo">התורמים שתרמו הכי הרבה בשנה האחרונה וסייעו להכי הרבה משפחות נזקקות:</h2>
                        </div>
                        <Carousel
                            nextIcon={<span aria-hidden="true" className="carouselControlNextIcon">&lt;</span>}
                            prevIcon={<span aria-hidden="true" className="carouselControlPrevIcon">&gt;</span>}
                        >
                            {donorChunks.map((chunk, index) => (
                                <Carousel.Item key={index}>
                                    <Row className="donorDisplay">
                                        {chunk.map((user, userIndex) => (
                                            <Col key={userIndex} className="donorItem" xs={12} sm={4} md={4}>
                                                <img src={user.image || person} alt={`${user.firstName} ${user.lastName}`} className="donorImage" />
                                                <p className="donorName">{user.firstName} {user.lastName}</p>
                                            </Col>
                                        ))}
                                    </Row>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPage;
