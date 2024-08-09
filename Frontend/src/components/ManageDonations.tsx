import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataService, { CanceledError } from '../services/data-service';
import {
  Table,
  Button,
  Dropdown,
  Modal
} from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageDonations.css';
import {
  TextField,
  InputAdornment,
  TableSortLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Donation } from './donation';

//  export interface Donation {
//   _id: string;
//   category: string;
//   description: string;
//   status: string;
//   approvedByAdmin?: boolean | string;
//   donor?: {
//     firstName: string;
//     lastName: string;
//     phone?: string;
//   };
//   pickUpAddress: string;
//   userAddress?: string;
//   branch?: string;
//   image?: string;
//   amount?: number;
//   itemCondition?: string;
//   expirationDate?: Date | string;
//   createdAt: string;
  
// }

type Order = 'asc' | 'desc';

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  //const [selectedDonations, setSelectedDonations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  //const [ setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Donation>('category');
  const [filterText, setFilterText] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<Donation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  //const [ uniqueBranches,setUniqueBranches] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
      const updatedDonations = res.data.map((donation: Donation) => {
        if (donation.category === 'newLiveDonation') { 
          return { ...donation, status: 'נמסר בעמותה' };
        }
        return donation;
      });
      setDonations(updatedDonations);

      //const branches = Array.from(new Set(updatedDonations.map(donation => donation.branch).filter(branch => branch)));
      //setUniqueBranches(branches);

    }).catch((err) => {
      console.log(err);
      if (err instanceof CanceledError) return;
      //setError(err.message);
    });

    return () => {
      abort();
    };
  }, []);

  const handleRequestSort = (property: keyof Donation) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const applySortAndFilter = (data: Donation[]) => {
    const lowerCaseFilterText = filterText.toLowerCase();
    return data
      .filter(donation => {
        const category = donation.category?.toLowerCase() || '';
        const description = donation.description?.toLowerCase() || '';
        const status = donation.status?.toLowerCase() || '';
        const donorName = donation.donor 
          ? (donation.donor.firstName?.toLowerCase() + " " + donation.donor.lastName?.toLowerCase()) 
          : '';
        const branch = donation.branch?.toLowerCase() || '';
        return (category.includes(lowerCaseFilterText) ||
                description.includes(lowerCaseFilterText) ||
                status.includes(lowerCaseFilterText) ||
                donorName.includes(lowerCaseFilterText) ||
                branch.includes(lowerCaseFilterText));
      })
      .sort((a, b) => {
        const valueA = a[orderBy] || '';
        const valueB = b[orderBy] || '';
        return (order === 'asc' ? 1 : -1) * (valueA > valueB ? 1 : -1);
      });
  };

  const handleStatusUpdate = (donation: Donation, status: string) => {
    const updatedDonation = { ...donation, status };
    setDonations((prevDonations) =>
      prevDonations.map((d) => (d._id === donation._id ? updatedDonation : d))
    );
    setPendingChanges((prev) => [...prev, updatedDonation]);
  };

  const handleApprovalUpdate = (donation: Donation, approvedByAdmin:string) => {
    const updatedDonation = { ...donation, approvedByAdmin };
    setDonations((prevDonations) =>
      prevDonations.map((d) => (d._id === donation._id ? updatedDonation : d))
    );
    setPendingChanges((prev) => [...prev, updatedDonation]);
  };

  const saveChanges = async () => {
    try {
      const updatePromises = pendingChanges.map((donation) =>
        dataService.updateDonation(donation._id, donation)
      );
      await Promise.all(updatePromises);
      setPendingChanges([]);
      alert("השינויים נשמרו בהצלחה!");
    } catch (error) {
      console.error('Error saving changes:', error);
      alert("שמירת השינויים נכשלה.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedAndFilteredDonations = applySortAndFilter(donations);

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
    <div className="manage-donations-page">
      <h2>ניהול תרומות</h2>
      <TextField
        label="חפש תרומה"
        placeholder="חפש תרומה לפי קטגוריה, תיאור, סטטוס, שם התורם או סניף"
        variant="outlined"
        style={{ width: '60%' }} 
        margin="normal"
        value={filterText}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <CSVLink data={donations} filename={"donations.csv"} className="btn btn-primary">
        ייצא ל-CSV
      </CSVLink>
      <Table striped bordered hover responsive>
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
            <th>תיאור</th>
            <th>סטטוס</th>
            <th>אישור מנהל</th>
            <th>שם התורם</th>
            {/* <th>כתובת לאיסוף</th> */}
            <th>תאריך</th>
            <th>סניף</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredDonations.map((donation) => (
            <tr key={donation._id}>
              <td>{donation.category}</td>
              <td>{donation.description}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {donation.status || 'Select Status'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'נמסר בעמותה')}>
                      נמסר בעמותה
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'ממתין לאיסוף')}>
                      ממתין לאיסוף
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'נאסף')}>
                      נאסף
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {donation.approvedByAdmin ? 'מאושר' : 'לא מאושר'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, 'true')}>
                      מאושר
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, 'false')}>
                      לא מאושר
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                {donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : 'Unknown'}
              </td>
              {/* <td>
                {donation.pickUpAddress || donation.userAddress}
              </td> */}
              <td>{formatDate(donation.createdAt)}</td>
              <td>{donation.branch}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => {
                    setCurrentDonation(donation);
                    setShowModal(true);
                  }}
                >
                  מחק
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="primary"
        onClick={saveChanges}
        disabled={pendingChanges.length === 0}
      >
        שמור שינויים
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>אשר מחיקת תרומה</Modal.Title>
        </Modal.Header>
        <Modal.Body>האם אתה בטוח שברצונך למחוק תרומה זו?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ביטול
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (currentDonation) {
                dataService
                  .deleteDonation(currentDonation._id)
                  .then(() => {
                    setDonations((prevDonations) =>
                      prevDonations.filter((d) => d._id !== currentDonation._id)
                    );
                    setShowModal(false);
                  })
                  .catch((err) => {
                    console.error(err);
                    alert("מחיקת התרומה נכשלה.");
                  });
              }
            }}
          >
            מחק
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageDonationPage;
