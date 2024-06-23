import {  useEffect, useState } from 'react';
import { Donation } from './donation.tsx';
import  dataService,{ CanceledError } from "../services/data-service.ts";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'


    function Statistics() {
        const navigate = useNavigate();
        const [products, setProducts] = useState<Donation[]>([])
        const [requests, setRequests] = useState<Donation[]>([])
        const [error, setError] = useState()

        useEffect(() => {
            const { req, abort } = dataService.getDonations()
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


        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return (
                <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', border: '1px solid black' }}>
                <p style={{ color: 'red' }}>שגיאה: אינך מחובר בתור מנהל</p>
                <button onClick={() => navigate('/adminDashboard')} className="btn btn-primary" style={{ backgroundColor: 'red', marginTop: '20px' }}>התחבר בתור מנהל</button>
              </div>
            );
          }

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