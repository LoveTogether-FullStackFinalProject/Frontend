import {  useEffect, useState } from 'react';
import { ProductData } from './product.tsx';
import  dataService,{ CanceledError } from "../services/data-service.ts";
import 'bootstrap/dist/css/bootstrap.min.css';


    function Statistics() {
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

<h1 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '50px', textDecoration: 'underline' }}>
    דוחות נתונים וסטטיסטיקות של התרומות בעמותה
</h1>
{error && <p className='text-danger'>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', height: '500px' }}>
                <div style={{ marginBottom: '10px', color: 'red' }}> נתוני התרומות בשנה האחרונה
                 </div>
                <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ color: 'red', border: '1px solid black' }}>כמות</th>
                            <th style={{ color: 'red', border: '1px solid black' }}>שם המוצר</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {products.map((product, index) => (
                            <tr key={index} style={{ border: '1px solid black' }}>
                                <td style={{ border: '1px solid black', padding: '10px' }}>{product.quantity}</td>
                                <td style={{ border: '1px solid black', padding: '10px' }}>{product.name}</td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', height: '500px' }}>
                <div style={{ marginBottom: '10px', color: 'red' }}>נתוני פריטים חסרים בעמותה
                שנדרשים לתרומות </div>
                <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ color: 'red', border: '1px solid black' }}>כמות</th>
                            <th style={{ color: 'red', border: '1px solid black' }}>שם המוצר</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {products.map((product, index) => (
                            <tr key={index} style={{ border: '1px solid black' }}>
                                <td style={{ border: '1px solid black', padding: '10px' }}>{product.quantity}</td>
                                <td style={{ border: '1px solid black', padding: '10px' }}>{product.name}</td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    
        </>
        )
    }
    
    export default Statistics