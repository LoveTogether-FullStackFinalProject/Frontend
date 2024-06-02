import {  useEffect, useState } from 'react';
import { ProductData } from './product.tsx';
import  dataService,{ CanceledError } from "../services/data-service.ts";
import 'bootstrap/dist/css/bootstrap.min.css';


    function Statistics() {
        const [products, setProducts] = useState<ProductData[]>([])
        const [requests, setRequests] = useState<ProductData[]>([])
        const [error, setError] = useState()
        useEffect(() => {
            const { req, abort } = dataService.getProducts()
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

        useEffect(() => {
            const { req, abort } = dataService.getRequestedProducts()
            req.then((res) => {
                setRequests(res.data)
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

<h1 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '50px', textDecoration: 'underline' }}>
    דוחות נתונים וסטטיסטיקות של התרומות בעמותה
</h1>
{error && <p className='text-danger'>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', height: '500px', direction: 'rtl' }}>
                <div style={{ marginBottom: '10px', color: 'red', textAlign: 'center', fontSize: '20px' }}> נתוני התרומות בשנה האחרונה
                 </div>
                 {Array.isArray(products) && (
                <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={{ color: 'red', border: '1px solid black', textAlign: 'center', width: '50%' }}>שם המוצר</th>
                         <th style={{ color: 'red', border: '1px solid black', textAlign: 'center', width: '50%' }}>כמות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                    <tr key={index} style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{product.productType}</td>
                    <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{product.amount}</td>
                    </tr>
                         ))}
                    </tbody>
                </table>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', height: '500px', direction: 'rtl'  }}>
                <div style={{ marginBottom: '10px', color: 'red', textAlign: 'center', fontSize: '20px'}}>נתוני פריטים חסרים בעמותה
                שנדרשים לתרומות </div>


                <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
             <thead>
                <tr>
                 <th style={{ color: 'red', border: '1px solid black', textAlign: 'center', width: '50%' }}>שם המוצר</th>
                <th style={{ color: 'red', border: '1px solid black', textAlign: 'center', width: '50%' }}>כמות</th>
                 </tr>
            </thead>
         <tbody>
            {requests.map((request, index) => (
            <tr key={index} style={{ border: '1px solid black' }}>
             <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{request.productType}</td>
             <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{request.amount}</td>
            </tr>
             ))}
        </tbody>
        </table>

{/* <tr style={{ border: '1px solid black' }}>
                         <td style={{ border: '1px solid black', padding: '10px' }}>3</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>מטרנה</td>
                    </tr>
                     <tr style={{ border: '1px solid black' }}>
                          <td style={{ border: '1px solid black', padding: '10px' }}>כמות למשפחה</td>
                         <td style={{ border: '1px solid black', padding: '10px' }}>ירקות</td>
                    </tr>
                    <tr style={{ border: '1px solid black' }}>
                     <td style={{ border: '1px solid black', padding: '10px' }}>30</td>
                    <td style={{ border: '1px solid black', padding: '10px' }}>ארוחות חמות לחג</td>
                    </tr> */}

            </div>
        </div>
    
        </>
        )
    }
    
    export default Statistics