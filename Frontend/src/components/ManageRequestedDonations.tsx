import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import dataService, { CanceledError } from "../services/data-service";
import {requestedDonation} from "../services/upload-requested-product-service";
import { Donation } from './donation';
import {
  Table,
  Button,
  Modal,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageDonations.css';
import {
  TextField,
  InputAdornment,
  TableSortLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';
type Order = 'asc' | 'desc';
import { useNavigate } from 'react-router-dom';

const ManageRequestedDonations = () => {
  const [requests, setRequests] = useState<requestedDonation[]>([])
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Donation>('category');
  const [filter, setFilter] = useState<string>('');
  const [currentDonation, setCurrentDonation] = useState<requestedDonation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

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
    }, [requests]);

    const handleRequestSort = (property: keyof Donation) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };
    
      const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
      };
    
      const applySortAndFilter = (data: requestedDonation[]) => {
        return data
          .filter(donation => 
            donation.category.toLowerCase().includes(filter.toLowerCase()) ||
            donation.description.toLowerCase().includes(filter.toLowerCase()) ||
            donation.amount.toString().includes(filter.toLowerCase()) ||
            donation.itemName.toLowerCase().includes(filter.toLowerCase()) ||
             donation.itemCondition.toLowerCase().includes(filter.toLowerCase()) 
          )
          .sort((a, b) => {
            return (order === 'asc' ? 1 : -1) * (a[orderBy] > b[orderBy] ? 1 : -1);
          });
      };
    
      const sortedAndFilteredDonations = applySortAndFilter(requests);

      const handleUpdatePlus = (donationId: string, amount: number) => {
        dataService.updateRequestedDonation(donationId, { amount: amount+1 });
        console.log(`updating donation with ID: ${donationId}`);
      };

      const handleUpdateMinus = (donationId: string, amount: number) => {
        dataService.updateRequestedDonation(donationId, { amount: amount-1 });
        console.log(`updating donation with ID: ${donationId}`);
      };

      const handleDelete = (donationId: string) => {
        dataService.deleteRequestedDonation(donationId);
        console.log(`Deleting donation with ID: ${donationId}`);
      };

      const [isAdmin, setIsAdmin] = useState(false);
     useEffect(() => {
       const userId = localStorage.getItem('userID');
       if (userId) {
         dataService.getUser(userId).req.then((res) => {
           setIsAdmin(res.data.isAdmin);
           console.log("isAdmin:", res.data.isAdmin);
         });
       }
     }, []);


     if (!isAdmin) {
      return (
          <div style={{ backgroundColor: 'white', width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px',padding: '20px', border: '1px solid black' }}>
          <p style={{ color: 'black' }}>שגיאה: אינך מחובר בתור מנהל</p>
          <button onClick={() => navigate('/mainPage')} style={{ backgroundColor: '#F9DA78', marginTop: '20px' }}>התחבר בתור מנהל</button>
        </div>
      );
    }
     
      return (
        <div className="container mt-4">
          <h2 style={{ marginTop: '80px' }}>ניהול תרומות שהעמותה מבקשת</h2>
          <TextField
            label="חפש תרומה"
            placeholder="חפש תרומה לפי קטגוריה, שם מוצר, מצב, תיאור, כמות"
            variant="outlined"
            style={{ width: '60%' }} 
            margin="normal"
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          {error && <p className="text-danger">{error}</p>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    קטגוריה
                  </TableSortLabel>
                </th>
                <th>
                  <TableSortLabel
                    active={orderBy === 'itemName'}
                    direction={orderBy === 'itemName' ? order : 'asc'}
                    onClick={() => handleRequestSort('itemName')}
                  >
                    שם המוצר
                  </TableSortLabel>
                </th>
                <th>
                  <TableSortLabel
                    active={orderBy === 'itemCondition'}
                    direction={orderBy === 'itemCondition' ? order : 'asc'}
                    onClick={() => handleRequestSort('itemCondition')}
                  >
                    מצב המוצר
                  </TableSortLabel>
                </th>
                
                <th>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'asc'}
                    onClick={() => handleRequestSort('description')}
                  >
                    תיאור
                  </TableSortLabel>
                </th>
                <th>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    כמות
                  </TableSortLabel>
                </th>
                <th>מחיקת פריט מהעמוד הראשי</th>
                <th>פרטי התרומות</th>
                <th>פעולות </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.category}</td>
                  <td>{donation.itemName}</td>
                  <td>{donation.itemCondition}</td>
                  <td>{donation.description}</td>
                  <td>
                  {/* <Button onClick={() => handleUpdatePlus(donation._id!, donation.amount)}>
               +
              </Button> */}
              {donation.amount}
              {/* {donation.amount > 1 && (
                <Button onClick={() => handleUpdateMinus(donation._id!, donation.amount)}>
                    -
                </Button>
                )} */}
                  </td>
                  <td>
              <Button variant="danger" onClick={() => handleDelete(donation._id!)}>
                מחיקה
              </Button>
            </td>
            <td>
                <Button
                  variant="info"
                  className="ms-2"
                  onClick={() => {
                    setCurrentDonation(donation);
                    setShowModal(true);
                  }}
                >
                    פרטי התרומה
                </Button>
              </td>
              <td>
                <Button
                  variant="info"
                  className="ms-2"
                  onClick={() => {
                    navigate('/editRequestedProduct', { state: { donation } });
                  }}
                >
                    עריכת פרטי התרומה
                </Button>
              </td>
          
                </tr>
              ))}
            </tbody>
          </Table> 

          <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>פרטי תרומה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDonation && (
            <div>
              <p><strong>קטגוריה:</strong> {currentDonation.category}</p>
              <p><strong>שם המוצר:</strong> {currentDonation.itemName}</p>
              <p><strong>תיאור:</strong> {currentDonation.description}</p>
              <p><strong>מצב:</strong> {currentDonation.itemCondition}</p>
              <p><strong>כמות:</strong> {currentDonation.amount}</p>
              {currentDonation.image && (
                <div>
                  <p><strong>תמונה:</strong></p>
                  <img src={currentDonation.image} alt="Donation" className="img-fluid" />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal>

      </div>


      
      );
};


export default ManageRequestedDonations;
