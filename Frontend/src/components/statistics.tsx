import {  useEffect, useState } from 'react';
import { Donation } from './donation.tsx';
import {requestedDonation} from "../services/upload-requested-product-service";
import  dataService,{ CanceledError } from "../services/data-service.ts";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'
import './statistics.css';


    function Statistics() {
        const navigate = useNavigate();
        const [products, setProducts] = useState<Donation[]>([])
        const [requests, setRequests] = useState<requestedDonation[]>([])
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

{/* <h1 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '50px', textDecoration: 'underline' }}>
    דוחות נתונים וסטטיסטיקות של התרומות בעמותה
</h1>
{error && <p className='text-danger'>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', direction: 'rtl' }}>
            <div style={{ marginBottom: '10px', color: 'red', textAlign: 'center', fontSize: '20px' }}>נתוני התרומות בשנה האחרונה</div>
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
                        <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{product.itemName}</td>
                        <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{product.quantity}</td>
                    </tr>
                     ))}
                </tbody>
                </table>
            )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', padding: '10px', backgroundColor: '#DCDCDC', width: '40%', direction: 'rtl' }}>
  <div style={{ marginBottom: '10px', color: 'red', textAlign: 'center', fontSize: '20px'}}>נתוני פריטים חסרים בעמותה שנדרשים לתרומות </div>
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
          <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{request.itemName}</td>
          <td style={{ border: '1px solid black', padding: '20px', fontSize: '18px', width: '50%', textAlign: 'center' }}>{request.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div> */}





<h1>
    דוחות נתונים וסטטיסטיקות של התרומות בעמותה
</h1>
{error && <p className='text-danger'>{error}</p>}
<div className="data-container">
    <div className="data-section">
        <div className="data-title">נתוני התרומות בשנה האחרונה</div>
        {Array.isArray(products) && (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>שם המוצר</th>
                        <th>כמות</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.itemName}</td>
                            <td>{product.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    <div className="data-section">
        <div className="data-title">נתוני פריטים חסרים בעמותה שנדרשים לתרומות</div>
        <table className="data-table">
            <thead>
                <tr>
                    <th>שם המוצר</th>
                    <th>כמות</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request, index) => (
                    <tr key={index}>
                        <td>{request.itemName}</td>
                        <td>{request.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>
    
        </>
        )
    }
    
    export default Statistics