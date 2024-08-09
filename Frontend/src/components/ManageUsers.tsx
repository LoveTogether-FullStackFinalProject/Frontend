import React, { useState, useEffect } from 'react';
import dataService, { CanceledError } from '../services/data-service';
import { DonorData } from './donorData';
import {
  IconButton,
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
  Box,
  TextField,
  Button,
  TableSortLabel,
  Toolbar,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import './ManageUsers.css';

import { useNavigate } from 'react-router-dom';

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mainAddress: string;
//   phoneNumber: string;
//   rating: string;
// }

type Order = 'asc' | 'desc';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<DonorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<DonorData | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<DonorData>>({});
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DonorData>('firstName');
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const { req, abort } = dataService.getUsers();
    req.then((res) => {
      setUsers(res.data);
    }).catch((err) => {
      if (err instanceof CanceledError) return;
      setError(err.message);
    });
    return () => {
      abort();
    };
  }, []);

  const deleteUser = (id: string) => {
    dataService.deleteUser(id)
      .then(() => {
        setUsers(users.filter(user => user._id !== id));
        setSnackbarMessage('משתמש נמחק בהצלחה');
        setSnackbarOpen(true);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
  };

  const editUser = (user: DonorData) => {
    setCurrentUser(user);
    setUpdatedUser(user);
    setEditModalOpen(true);
  };

  const handleUpdateUser = () => {
    if (currentUser) {
      dataService.updateUserData(currentUser._id, updatedUser)
        .then(() => {
          setUsers(users.map(user => (user._id === currentUser._id ? { ...user, ...updatedUser } : user)));
          setSnackbarMessage('משתמש נערך בהצלחה');
          setSnackbarOpen(true);
          setEditModalOpen(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
    setUpdatedUser({});
  };

  const handleRequestSort = (property: keyof DonorData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const applySortAndFilter = (data: DonorData[]) => {
    return data
      .filter(user => 
        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase()) ||
        (user.address && user.address.toLowerCase().includes(filter.toLowerCase())) ||
        user.phoneNumber.includes(filter)
      )
      .sort((a, b) => {
        if (orderBy === 'rating') {
          return (order === 'asc' ? 1 : -1) * (parseInt(a[orderBy]) - parseInt(b[orderBy]));
        } else {
          const aValue = a[orderBy];
          const bValue = b[orderBy];
      
          if (aValue && bValue && aValue < bValue) return order === 'asc' ? -1 : 1;
          if (aValue && bValue && aValue > bValue) return order === 'asc' ? 1 : -1;
          return 0;
        }
      });
  };

  const handleExport = () => {
    const csvData = users.map((u) => ({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      address: u.address,
      phoneNumber: u.phoneNumber,
      rating: u.rating,
    }));
    return csvData;
  };

  const sortedAndFilteredUsers = applySortAndFilter(users);

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
    <div className="container">
      <Typography variant="h4" align="center" gutterBottom>
        ניהול יוזרים
      </Typography>
      <Toolbar>
        <TextField
          label="חפש משתמש"
           placeholder="חפש תורם לפי פרטיו"
          variant="outlined"
          fullWidth
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
           <CSVLink
          data={handleExport()}
          filename="users.csv"
          className="btn btn-success mb-3"
        >
          ייצוא לאקסל
        </CSVLink>
      </Toolbar>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table className="table-bordered">
          <TableHead className="table-bordered">
            <TableRow>
              {['email', 'firstName', 'lastName', 'address', 'phoneNumber', 'rating'].map((column) => (
                <TableCell key={column} className="rtl-table-col">
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column as keyof DonorData)}
                  >
                    {column === 'email' && 'אימייל'}
                    {column === 'firstName' && 'שם פרטי'}
                    {column === 'lastName' && 'שם משפחה'}
                    {column === 'address' && 'כתובת'}
                    {column === 'phoneNumber' && 'מספר טלפון'}
                    {column === 'rating' && 'דירוג'}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell className="rtl-table-col">עריכה</TableCell>
              <TableCell className="rtl-table-col">מחיקת משתמש</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="rtl-table">{user.email}</TableCell>
                <TableCell className="rtl-table">{user.firstName}</TableCell>
                <TableCell className="rtl-table">{user.lastName}</TableCell>
                <TableCell className="rtl-table">{user.address}</TableCell>
                <TableCell className="rtl-table">{user.phoneNumber}</TableCell>
                <TableCell className="rtl-table">{user.rating}</TableCell>
                <TableCell className="rtl-table">
                  <IconButton color="primary" onClick={() => editUser(user)}>
                    <Edit />
                  </IconButton>
                </TableCell>
                <TableCell className="rtl-table">
                  <IconButton color="secondary"  sx={{ color: 'red' }} onClick={() => deleteUser(user._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            עריכת משתמש
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="שם פרטי"
            value={updatedUser.firstName || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="שם משפחה"
            value={updatedUser.lastName || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="אימייל"
            value={updatedUser.email || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="כתובת"
            value={updatedUser.address || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="מספר טלפון"
            value={updatedUser.phoneNumber || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="דירוג"
            value={updatedUser.rating || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, rating: e.target.value })}
          />
          <Button onClick={handleUpdateUser} color="primary" variant="contained" sx={{ mt: 2 }}>
            שמור
          </Button>
          </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ManageUsers;
