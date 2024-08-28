import React, { useState, useEffect } from 'react';
import dataService, { CanceledError } from '../services/data-service';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Modal,
  Button,
  TableSortLabel,
  TextField,
  InputAdornment,
  Toolbar,
  IconButton,
  MenuItem,
  Select,
  Box,
  Tooltip,
} from '@mui/material';
import { CSVLink } from 'react-csv';
import { Delete, Search, Visibility } from '@mui/icons-material';
import './ManageDonations.css';
import { Close } from '@mui/icons-material'; // Import Close icon
import { Donation } from './donation';

type Order = 'asc' | 'desc';

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Donation>('itemName');
  const [filterText, setFilterText] = useState<string>('');
  const [pendingChanges, setPendingChanges] = useState<Donation[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
      if (res.data) {
        setDonations(res.data);
      }
    }).catch((err) => {
      if (err instanceof CanceledError) return;
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
        const itemName = donation.itemName?.toLowerCase() || '';
        const category = donation.category?.toLowerCase() || '';
        const description = donation.description?.toLowerCase() || '';
        const status = donation.status?.toLowerCase() || '';
        const donorName = donation.donor 
          ? (donation.donor.firstName?.toLowerCase() + " " + donation.donor.lastName?.toLowerCase()) 
          : '';

        return (
          itemName.includes(lowerCaseFilterText) ||
          category.includes(lowerCaseFilterText) ||
          description.includes(lowerCaseFilterText) ||
          status.includes(lowerCaseFilterText) ||
          donorName.includes(lowerCaseFilterText) 
        );
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
  const handleApprovalUpdate = (donation: Donation, approvedByAdmin: boolean) => {
    const updatedDonation = { ...donation, approvedByAdmin: approvedByAdmin.toString() };
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
      setSnackbarMessage('השינויים נשמרו בהצלחה!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSnackbarMessage('שמירת השינויים נכשלה.');
      setSnackbarOpen(true);
    }
  };



  const handleDeleteClick = async (donation: Donation, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents modal from opening
    
    try {
        // Call the deleteDonation function to remove the donation from the database
        await dataService.deleteDonation(donation._id);
        
        // Update the UI after successful deletion
        setDonations(donations.filter((d) => d._id !== donation._id));
        setSnackbarMessage('התרומה נמחקה בהצלחה!');
    } catch (error) {
        console.error('Error deleting donation:', error);
        setSnackbarMessage('מחיקת התרומה נכשלה.');
    }
    
    setSnackbarOpen(true);
};

  const sortedAndFilteredDonations = applySortAndFilter(donations);

  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, []);

 

  if(isAdmin){
  return (
    <>
      <Box className="manage-donations-page" sx={{ direction: 'rtl', textAlign: 'right', padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: '30px' }}>
          ניהול תרומות
        </Typography>
        <Toolbar>
          <TextField
            placeholder="חפש תרומה לפי שם פריט, קטגוריה, תיאור, סטטוס, שם התורם או סניף"
            variant="outlined"
            fullWidth
            margin="normal"
            style={{width:"600px",marginLeft:"10px"}}
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
          <CSVLink
            data={donations}
            filename={"donations.csv"}
            className="btn btn-primary"
            style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#f9db78', color: '#000', borderRadius: '5px', textDecoration: 'none' }}
          >
            ייצוא ל-CSV
          </CSVLink>
        </Toolbar>
        <TableContainer component={Paper} className="table-responsive" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#f0e0ad' }}>
              <TableRow>
                <TableCell style={{ width: '15%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'donor'}
                    direction={orderBy === 'donor' ? order : 'asc'}
                    onClick={() => handleRequestSort('donor')}
                  >
                    שם מלא
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '15%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'itemName'}
                    direction={orderBy === 'itemName' ? order : 'asc'}
                    onClick={() => handleRequestSort('itemName')}
                  >
                    שם הפריט
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '15%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    קטגוריה
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '20%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'asc'}
                    onClick={() => handleRequestSort('description')}
                  >
                    תיאור
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '10%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    סטטוס
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '10%',textAlign:"center" }}>
                  <TableSortLabel
                    active={orderBy === 'approvedByAdmin'}
                    direction={orderBy === 'approvedByAdmin' ? order : 'asc'}
                    onClick={() => handleRequestSort('approvedByAdmin')}
                  >
                    אישור מנהל
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '5%', textAlign: 'center' }}>פרטי התרומה</TableCell>
                <TableCell style={{ width: '5%', textAlign: 'center' }}>מחיקה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredDonations.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell style={{textAlign:"center"}}>{donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : 'נתרם ע"י אורח'}</TableCell>
                  <TableCell style={{textAlign:"center"}}>{donation.itemName}</TableCell>
                  <TableCell style={{textAlign:"center"}}>{donation.category}</TableCell>
                  <TableCell style={{textAlign:"center"}}>{donation.description}</TableCell>
                  <TableCell>
                    <Select
                      value={donation.status}
                      onChange={(e) => handleStatusUpdate(donation, e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ backgroundColor: '#f9f9f9' }}
                    >
                      <MenuItem style={{direction:"rtl", textAlign:"right"}} value="נמסר בעמותה">נמסר בעמותה</MenuItem>
                      <MenuItem style={{direction:"rtl"}} value="ממתין לאיסוף">ממתין לאיסוף</MenuItem>
                      <MenuItem style={{direction:"rtl"}} value="נאסף">נאסף</MenuItem>
                      <MenuItem style={{direction:"rtl"}} value="הגיע לעמותה">הגיע לעמותה</MenuItem>
                      <MenuItem style={{direction:"rtl"}} value="טרם הגיע לעמותה">טרם הגיע לעמותה</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={donation.approvedByAdmin}
                      onChange={(e) => handleApprovalUpdate(donation, e.target.value === 'true')}
                      fullWidth
                      variant="outlined"
                      sx={{ backgroundColor: '#f9f9f9' }}
                    >
                      <MenuItem style={{direction:"rtl"}} value="true">מאושר</MenuItem>
                      <MenuItem style={{direction:"rtl"}} value="false">לא מאושר</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setCurrentDonation(donation);
                        setShowModal(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Tooltip title="מחק תרומה">
                      <IconButton
                        color="secondary"
                        onClick={(e) => handleDeleteClick(donation, e)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          onClick={saveChanges}
          sx={{
            marginTop: '20px',
            backgroundColor: '#f9db78',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '10px',
            padding: '10px 20px',
          }}
        >
          שמור שינויים
        </Button>
        <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={
      snackbarMessage === 'שמירת השינויים נכשלה.' ? 'error' : 'success'
    }
    icon={
      snackbarMessage === 'שמירת השינויים נכשלה.'
        ? <Close fontSize="inherit" />
        : undefined
    }
    sx={{
      color:
        snackbarMessage === 'שמירת השינויים נכשלה.' ? '#fff' : undefined,
      backgroundColor:
        snackbarMessage === 'שמירת השינויים נכשלה.' ? '#f44336' : undefined,
    }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box
    sx={{
      width: '300px',
      maxHeight: '80vh', // Set a max height for the modal
      overflowY: 'auto', // Enable vertical scrolling if content overflows
      margin: 'auto',
      marginTop: '100px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'right',
      direction: 'rtl',
    }}
  >
            <Typography id="simple-modal-title" variant="h6" component="h2" style={{marginBottom:"10px",borderBottom: '3px solid #f9db78',width:"50%" }}>
              פרטי תרומה
            </Typography>
            {currentDonation && (
              <div>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>שם המוצר:</strong> {currentDonation.itemName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>קטגוריה:</strong> {currentDonation.category}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>תיאור:</strong> {currentDonation.description}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>מצב:</strong> {currentDonation.condition}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>כמות:</strong> {currentDonation.quantity}
                </Typography>
                {currentDonation.status === 'ממתין לאיסוף' && (
                  <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                    <strong>כתובת לאיסוף:</strong> {currentDonation.pickupAddress}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                  <strong>סטטוס:</strong> {currentDonation.status}
                </Typography>
                {currentDonation.image && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img
                      src={currentDonation.image}
                      className="img-fluid"
                      alt="Donation"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }}
                    />
                  </div>
                )}
              </div>
            )}
            <Button onClick={() => setShowModal(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
              סגור
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
}else{
  return (
    <div className="error-container">
      <p style={{ fontFamily: 'Assistant' }}>שגיאה: אינך מחובר בתור מנהל</p>
    </div>
  );
}};


export default ManageDonationPage;
