import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import {requestedDonation} from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Row, Col } from 'react-bootstrap';
import person from './../assets/person.png';
import './main-page.css';

    function MainPage() {
        const navigate = useNavigate();
        const [products, setProducts] = useState<Donation[]>([])
        const [users, setUsers] = useState<DonorData[]>([])
        const [requests, setRequests] = useState<requestedDonation[]>([])
        useEffect(() => {
            const { req, abort } = dataService.getDonations()
            req.then((res) => {
                setProducts(res.data)
                console.log("products" ,products);
            }).catch((err) => {
                console.log(err)
                if (err instanceof CanceledError) return
                setError(err.message)
            })
            
            return () => {
                abort()
            }
        }, [])

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

        const chunkArray = (myArray, chunk_size) => {
            let index = 0;
            const arrayLength = myArray.length;
            const tempArray = [];
            
            for (index = 0; index < arrayLength; index += chunk_size) {
              const myChunk = myArray.slice(index, index+chunk_size);
              tempArray.push(myChunk);
            }
          
            return tempArray;
          };
          const chunkedRequests = chunkArray(requests, 3);
    
        return (
            <>
<div className='body'>
  <div className="centerText brownText">
    <h2>ברוכים הבאים לאתר התרומות של</h2>
    <h1>"ואהבתם ביחד"</h1>
    <h2 style={{direction:"rtl"}}>נשמח לעזרתכם עם המוצרים הדרושים לתרומות בביקוש גבוה כרגע בעמותה:</h2>
  </div>
  
  <div className="borderBox">
    <Carousel 
    nextIcon={<span aria-hidden="true" className="carouselControlNextIcon">&gt;</span>} prevIcon={<span aria-hidden="true" className="carouselControlPrevIcon">&lt;</span>} >
      {chunkedRequests.map((chunk, chunkIndex) => (
        <Carousel.Item key={chunkIndex}>
          <Row>
            {chunk.map((request, index) => (
              <Col key={index} className="categorySection">
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
    <button onClick={() => navigate('/uploadproduct')} className="donateButton">תרמו כאן</button>
  </div>
  <div className="categorySection">
    <h2>הקטגוריות שלנו</h2>
    <div className="categoryItemsContainer">
      <span className="categoryItem">הנעלה</span>
      <span className="categoryItem">ביגוד</span>
      <span className="categoryItem">אלקטרוניקה</span>
      <span className="categoryItem">אביזרים</span>
      <span className="categoryItem">מזון ושתיה</span>
    </div>
  </div>
  <div className="flexSpaceBetween">
    <div className="squareContainer flexCenterColumn">
      {/* <h2 style={{ fontSize: '1.5em', textAlign: 'center' }}>עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה! הצלחנו לגייס {countProducts('מזון ושתיה')} ארוחות חמות, {countProducts('ביגוד')} ביגוד, ו- {countProducts('אביזרים')} אביזרים</h2> */}
      <h2 style={{ fontSize: '1.5em', textAlign: 'center' }}>
  עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה!<br />
  הצלחנו לגייס {countProducts('מזון ושתיה')} ארוחות חמות,<br />
  {countProducts('ביגוד')} ביגוד, ו- {countProducts('אביזרים')} אביזרים
</h2>
      <div className="flexCenter">
        {products.slice(0, 3).map((product, index) => (
          <img key={index} src={product.image} alt={`Product ${index + 1}`} className="productImage" />
        ))}
      </div>
    </div>
    <div className="squareContainer flexCenterColumn">
      <h1 className="donorSection">התורמים שלנו</h1>
      <h2 className="donorInfo">התורמים שתרמו הכי הרבה בשנה האחרונה וסייעו להכי הרבה משפחות נזקקות:</h2>
      <div className="donorDisplay">
        {users.filter(user => user.rating === "1").map((user, index) => (
          <div key={index} className="donorItem">
            <img src={user.image || person} alt={`${user.firstName} ${user.lastName}`} className="donorImage" />
            <p className="donorName">{user.firstName} {user.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
            
            </>
    
        )
    }
    
    export default MainPage
