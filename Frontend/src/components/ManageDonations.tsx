import React, { useState, useEffect } from 'react';
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

interface Donation {
  _id: string;
  category: string;
  description: string;
  status: string;
  approvedByAdmin?: boolean | string;
  donor?: {
    firstName: string;
    lastName: string;
  };
  pickUpAddress: string;
  branch: string;
  image?: string;
}

type Order = 'asc' | 'desc';

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonations, setSelectedDonations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Donation>('category');
  const [filter, setFilter] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<Donation[]>([]);

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
      setDonations(res.data);
    }).catch((err) => {
      console.log(err);
      if (err instanceof CanceledError) return;
      setError(err.message);
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const applySortAndFilter = (data: Donation[]) => {
    return data
      .filter(donation => 
        donation.category.toLowerCase().includes(filter.toLowerCase()) ||
        donation.description.toLowerCase().includes(filter.toLowerCase()) ||
        donation.status.toLowerCase().includes(filter.toLowerCase()) ||
        (donation.donor && (donation.donor.firstName.toLowerCase() + " " + donation.donor.lastName.toLowerCase()).includes(filter.toLowerCase()))
      )
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

  const handleApprovalUpdate = (donation: Donation, approvedByAdmin: boolean | string) => {
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

  const sortedAndFilteredDonations = applySortAndFilter(donations);

  return (
    <div className="container mt-4">
      <h2>ניהול תרומות</h2>
      <TextField
        label="חפש תרומה"
        placeholder="חפש תרומה לפי קטגוריה, תיאור, סטטוס ושם התורם"
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
      <CSVLink data={sortedAndFilteredDonations} filename="donations.csv" className="btn btn-success mb-3">
        ייצוא לאקסל
      </CSVLink>
      <Button className="mb-3" onClick={saveChanges} disabled={pendingChanges.length === 0}>
        שמור שינויים
      </Button>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>בחירה</th>
            <th>
              <TableSortLabel
                active={orderBy === 'donor'}
                direction={orderBy === 'donor' ? order : 'asc'}
                onClick={() => handleRequestSort('donor')}
              >
                שם מלא
              </TableSortLabel>
            </th>
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
                active={orderBy === 'description'}
                direction={orderBy === 'description' ? order : 'asc'}
                onClick={() => handleRequestSort('description')}
              >
                תיאור
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleRequestSort('status')}
              >
                סטטוס
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={orderBy === 'approvedByAdmin'}
                direction={orderBy === 'approvedByAdmin' ? order : 'asc'}
                onClick={() => handleRequestSort('approvedByAdmin')}
              >
                אושר ע"י מנהל
              </TableSortLabel>
            </th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredDonations.map((donation) => (
            <tr key={donation._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedDonations.includes(donation._id)}
                  onChange={() => setSelectedDonations(prev => prev.includes(donation._id) ? prev.filter(id => id !== donation._id) : [...prev, donation._id])}
                />
              </td>
              <td>{donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : 'לא צויין'}</td>
              <td>{donation.category}</td>
              <td>{donation.description}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {donation.status}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'הגיע לעמותה')}>
                      הגיע לעמותה
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'נמסר')}>
                      נמסר
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {donation.approvedByAdmin === true || donation.approvedByAdmin === 'true' ? "כן" : "לא"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, true)}>
                      כן
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, false)}>
                      לא
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
                  הצגת פרטים
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
              <p><strong>תיאור:</strong> {currentDonation.description}</p>
              <p><strong>כמות:</strong> {currentDonation.amount}</p>
              <p><strong>מצב הפריט:</strong> {currentDonation.itemCondition}</p>
              <p><strong>תאריך תפוגה:</strong> {new Date(currentDonation.expirationDate).toLocaleDateString()}</p>
              <p><strong>כתובת לאיסוף:</strong> {currentDonation.pickUpAddress}</p>
              <p><strong> סניף עמותה:</strong> {currentDonation.branch}</p>
              <p><strong>סטטוס:</strong> {currentDonation.status}</p>
              <p><strong>אושר על ידי מנהל:</strong> {currentDonation.approvedByAdmin === true || currentDonation.approvedByAdmin === 'true' ? "כן" : "לא"}</p>
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

export default ManageDonationPage;

