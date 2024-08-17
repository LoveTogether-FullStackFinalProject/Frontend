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
import { Delete, Search } from '@mui/icons-material';
import './ManageDonations.css';
import { Donation } from './donation';

type Order = 'asc' | 'desc';

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        const branch = donation.branch?.toLowerCase() || '';

        return (
          itemName.includes(lowerCaseFilterText) ||
          category.includes(lowerCaseFilterText) ||
          description.includes(lowerCaseFilterText) ||
          status.includes(lowerCaseFilterText) ||
          donorName.includes(lowerCaseFilterText) ||
          branch.includes(lowerCaseFilterText)
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

  const handleApprovalUpdate = (donation: Donation, approvedByAdmin: string) => {
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
      setSnackbarMessage('השינויים נשמרו בהצלחה!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setSnackbarMessage('שמירת השינויים נכשלה.');
      setSnackbarOpen(true);
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
      <div className="error-container">
        <p style={{fontFamily: 'Assistant'}}>שגיאה: אינך מחובר בתור מנהל</p>
      </div>
    );
  }

  return (
    <Box className="manage-donations-page" sx={{ direction: 'rtl', textAlign: 'right', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: '30px' }}>
        ניהול תרומות
      </Typography>
      <Toolbar>
        <TextField
          label="חפש תרומה"
          placeholder="חפש תרומה לפי שם פריט, קטגוריה, תיאור, סטטוס, שם התורם או סניף"
          variant="outlined"
          fullWidth
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
        <CSVLink
          data={donations}
          filename={"donations.csv"}
          className="btn btn-primary"
          style={{ marginLeft: '20px', padding: '10px 20px', backgroundColor: '#f9db78', color: '#000', borderRadius: '5px', textDecoration: 'none' }}
        >
          ייצוא ל-CSV
        </CSVLink>
      </Toolbar>
      <TableContainer
  component={Paper}
  className="table-responsive"
  sx={{
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflowX: 'auto',
  }}
>
  <Box sx={{ direction: 'rtl' }}>
    <Table stickyHeader>
      <TableHead sx={{ backgroundColor: '#f0e0ad' }}>
        <TableRow>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'itemName'}
              direction={orderBy === 'itemName' ? order : 'asc'}
              onClick={() => handleRequestSort('itemName')}
            >
              שם הפריט
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'category'}
              direction={orderBy === 'category' ? order : 'asc'}
              onClick={() => handleRequestSort('category')}
            >
              קטגוריה
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'description'}
              direction={orderBy === 'description' ? order : 'asc'}
              onClick={() => handleRequestSort('description')}
            >
              תיאור
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'status'}
              direction={orderBy === 'status' ? order : 'asc'}
              onClick={() => handleRequestSort('status')}
            >
              סטטוס
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'approvedByAdmin'}
              direction={orderBy === 'approvedByAdmin' ? order : 'asc'}
              onClick={() => handleRequestSort('approvedByAdmin')}
            >
              אישור מנהל
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>שם התורם</TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'branch'}
              direction={orderBy === 'branch' ? order : 'asc'}
              onClick={() => handleRequestSort('branch')}
            >
              סניף
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <TableSortLabel
              active={orderBy === 'createdAt'}
              direction={orderBy === 'createdAt' ? order : 'asc'}
              onClick={() => handleRequestSort('createdAt')}
            >
              נוצר ב-
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>פעולות</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedAndFilteredDonations.map((donation) => (
          <TableRow key={donation._id}>
            <TableCell sx={{ textAlign: 'right' }}>{donation.itemName}</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>{donation.category}</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>{donation.description}</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Select
                value={donation.status || ''}
                onChange={(e) => handleStatusUpdate(donation, e.target.value)}
                sx={{ textAlign: 'right' }}
              >
                <MenuItem value="ממתין לאיסוף">ממתין לאיסוף</MenuItem>
                <MenuItem value="נאסף">נאסף</MenuItem>
                <MenuItem value="הגיע לעמותה">הגיע לעמותה</MenuItem>
                <MenuItem value="טרם הגיע לעמותה">טרם הגיע לעמותה</MenuItem>
                <MenuItem value="נמסר בעמותה">נמסר בעמותה</MenuItem>
              </Select>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Select
                value={donation.approvedByAdmin || ''}
                onChange={(e) => handleApprovalUpdate(donation, e.target.value)}
                sx={{ textAlign: 'right' }}
              >
                <MenuItem value="Pending">ממתין לאישור</MenuItem>
                <MenuItem value="Approved">כן</MenuItem>
                <MenuItem value="Declined">לא</MenuItem>
              </Select>
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              {donation.donor
                ? `${donation.donor.firstName} ${donation.donor.lastName}`
                : ''}
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>{donation.branch}</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>{formatDate(donation.createdAt)}</TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Tooltip title="מחק תרומה">
                <IconButton onClick={() => setCurrentDonation(donation)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
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
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{ width: '400px', margin: 'auto', marginTop: '100px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Typography id="simple-modal-title" variant="h6" component="h2">
            מחיקת תרומה
          </Typography>
          <Typography id="simple-modal-description" sx={{ mt: 2 }}>
            האם אתה בטוח שברצונך למחוק את התרומה הזאת?
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => setShowModal(false)} sx={{ marginTop: '20px' }}>
            ביטול
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageDonationPage;
