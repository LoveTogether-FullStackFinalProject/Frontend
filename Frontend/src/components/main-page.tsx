import {  useEffect, useState } from 'react';
import Product,{ ProductData } from './product.tsx';
import  dataService,{ CanceledError } from "../services/data-service";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Row, Col } from 'react-bootstrap';



    function MainPage() {
        const [products, setProducts] = useState<ProductData[]>([])
        const [error, setError] = useState()
        useEffect(() => {
            const { req, abort } = dataService.getRequestedProducts()
            req.then((res) => {
                setProducts(res.data)
            }).catch((err) => {
                console.log(err)
                if (err instanceof CanceledError) return
                setError(err.message)
            })
            return () => {
                abort()
            }
        }, [])
    
        return (
            <>
                   <div style={{ textAlign: 'center', paddingTop: '10px' }}>
            <h2>ברוכים הבאים לאתר התרומות של</h2>
            <h1 style={{ color: 'brown' }}>"ואהבתם ביחד"</h1>
            <h2>נשמח לעזרתכם עם המוצרים הדרושים לתרומות בביקוש גבוה כרגע בעמותה:</h2>
        </div>
            
                {error && <p className='text-danger'>{error}</p>}
                <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px' }}>
            <Carousel 
                nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" style={{color: 'black'}} />} 
                prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{color: 'black'}} />}
            >
                <Carousel.Item>
                    <Row>
                        <Col><img className="d-block w-100" src="path_to_your_image1.jpg" alt="Image 1" style={{ border: '1px solid black', borderRadius: '5px' }} /></Col>
                        <Col><img className="d-block w-100" src="path_to_your_image2.jpg" alt="Image 2" style={{ border: '1px solid black', borderRadius: '5px' }} /></Col>
                        <Col><img className="d-block w-100" src="path_to_your_image3.jpg" alt="Image 3" style={{ border: '1px solid black', borderRadius: '5px' }} /></Col>
                    </Row>
                </Carousel.Item>
            </Carousel>
            <button style={{ display: 'block', width: 'auto', padding: '10px', backgroundColor: 'red', color: 'white', fontWeight: 'bold', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto' }}>תרמו כאן</button>
        </div>
                {/* {products.map((product, index) =>
                    <div className="p-4" key={index}>
                        <Product product={product} />
                    </div>
                )} */}
    <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h2>הקטגוריות שלנו</h2>
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px' }}>משחקים לילדים</span>
        <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px' }}>כלי בית</span>
        <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px' }}>שתייה</span>
        <span style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px' }}>מזון</span>
    </div>
</div>

<div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1em', textAlign: 'center' }}>עד כה, התרומות שלכם עזרו לכ-150 משפחות רק בשנה האחרונה!
        הצלחנו לגייס 1000 ארוחות חמות,
        70 מוצרי מזון לתינוקות, ו- 400 כלי בית</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img src="image1.jpg" alt="Image 1" style={{ width: '30%', margin: '10px' }} />
            <img src="image2.jpg" alt="Image 2" style={{ width: '30%', margin: '10px' }} />
            <img src="image3.jpg" alt="Image 3" style={{ width: '30%', margin: '10px' }} />
        </div>
    </div>

    <div style={{ border: '1px solid black', borderRadius: '5px', padding: '10px', margin: '10px', width: '45%', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2em', color: 'red', textAlign: 'center' }}>התורמים שלנו</h1>
        <h2 style={{ fontSize: '1em', textAlign: 'center' }}>התרומים שתרמו הכי הרבה בשנה האחרונה וסייעו להכי הרבה משפחות נזקקות:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>ישראל ישראלי</p>
            <p>ישראל ישראלי</p>
            <p>ישראל ישראלי</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img src="image1.jpg" alt="Image 1" style={{ width: '30%', margin: '10px' }} />
            <img src="image2.jpg" alt="Image 2" style={{ width: '30%', margin: '10px' }} />
            <img src="image3.jpg" alt="Image 3" style={{ width: '30%', margin: '10px' }} />
        </div>
    </div>
</div>
            
            </>
    
        )
    }
    
    export default MainPage