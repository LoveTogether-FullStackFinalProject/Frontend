import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donation } from './donation';
import { DonorData } from './donorData';
import dataService, { CanceledError } from "../services/data-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Row, Col } from 'react-bootstrap';
import person from './../assets/person.png';

    function MainPage() {
        const navigate = useNavigate();
        const [products, setProducts] = useState<Donation[]>([])
        const [users, setUsers] = useState<DonorData[]>([])
        const [requests, setRequests] = useState<Donation[]>([])
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
    {chunkedRequests.map((chunk, chunkIndex) => (
      <Carousel.Item key={chunkIndex}>
        <Row>
          {chunk.map((request, index) => (
            <Col key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{`${request.itemName}: ${request.amount}`}</p>
              <img src={request.image} alt="Product" style={{ width: '200px', height: '200px' }} />
            </Col>
          ))}
        </Row>
      </Carousel.Item>
    ))}
  </Carousel>

  <style jsx>{`
  .carousel-control-next-icon:after,
  .carousel-control-prev-icon:after {
    content: '>';
    font-size: 30px;
    color: black;
  }

  .carousel-control-prev-icon:after {
    content: '<';
  }
`}</style>
        <button 
              onClick={() => navigate('/uploadproduct')}
                style={{ display: 'block', width: 'auto', padding: '10px', backgroundColor: '#CD853F', color: 'white', fontWeight: 'bold', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}
                >
                 תרמו כאן
        </button>
            </div>

            <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF', marginBottom: '80px' }}>
                <h2>הקטגוריות שלנו</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>הנעלה</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>ביגוד</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>אלקטרוניקה</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>אביזרים</span>
                    <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '50px', backgroundColor: '#FFE4E1' }}>מזון ושתיה</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF' }}>
            <h2 style={{ fontSize: '1.5em', textAlign: 'center' }}>
                 עד כה, התרומות שלכם עזרו למשפחות רבות בשנה האחרונה!
                 הצלחנו לגייס {countProducts('מזון ושתיה')} ארוחות חמות,
                {countProducts('ביגוד')} ביגוד, ו- {countProducts('אביזרים')} אביזרים
            </h2>
                  
                        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <img src={product1} alt="Image 1" style={{ width: '15%', margin: '10px', border: '2px solid black' }} />
                                <img src={product2} alt="Image 2" style={{ width: '25%', margin: '10px', border: '2px solid black' }} />
                                <img src={product3} alt="Image 3" style={{ width: '25%', margin: '10px', border: '2px solid black' }} />
                        </div> */}

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    {products.slice(0, 3).map((product, index) => (
        <img key={index} src={product.image} alt={`Product ${index + 1}`} style={{ width: '15%', margin: '20px', border: '2px solid black' }} />
    ))}
</div>
                </div>

                <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F0FFFF' }}>
                    <h1 style={{ fontSize: '2em', color: 'red', textAlign: 'center' }}>התורמים שלנו</h1>
                    <h2 style={{ fontSize: '1em', textAlign: 'center' }}>התורמים שתרמו הכי הרבה בשנה האחרונה וסייעו להכי הרבה משפחות נזקקות:</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* <p>ישראל ישראלי</p>
                        <p>ישראל ישראלי</p>
                        <p>ישראל ישראלי</p> */}

                        {/* {users.filter(user => user.rating === "1").map((user, index) => (
                         <p key={index}>{user.firstName} {user.lastName}</p>
                         ))} */}

<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px' }}>
  {users.filter(user => user.rating === "1").map((user, index) => (
    <div key={index} style={{ margin: '20px', flex: '0 0 auto' }}>
      <img 
        src={user.image || person} 
        alt={`${user.firstName} ${user.lastName}`} 
        style={{ width: '100px', height: '100px' }} 
      />
      <p style={{ fontSize: '20px', textAlign: 'center' }}>{user.firstName} {user.lastName}</p>
    </div>
  ))}
</div>
                    </div>
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       
                        <img src={person1} alt="Image 1" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                        <img src={person2} alt="Image 2" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                        <img src={person3} alt="Image 3" style={{ width: '30%', margin: '10px', border: '2px solid black' }} />
                    </div> */}
                </div>
            </div>
        </div>
            
            </>
    
        )
    }
    
    export default MainPage
