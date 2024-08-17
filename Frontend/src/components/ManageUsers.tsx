
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
  InputAdornment,
  Tooltip,

} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import './ManageUsers.css';

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
      });
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="error-container">
        <p>שגיאה: אינך מחובר בתור מנהל</p>
      </div>
    );
  }

  return (
    <div className="manage-users-page">
        <Typography 
        variant="h3"
        style={{
          alignItems:"center"
        }}
        sx={{ 
        align:"center",
        mb: 2, 
        fontFamily: 'Assistant', 
        marginTop: "100px", 
        borderBottom: '3px solid #f9db78', 
        display: 'inline-block',
        marginRight:"45%"
        
    }}
>
    ניהול יוזרים
</Typography>

      <Toolbar>
        <TextField
        style={{
          width:"400px",
          direction:"rtl"
        }}
          
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
          className="csv-link"
          style={{ 
            textDecoration: "none", 
            color: "white", 
            backgroundColor: "#217346", // Green background color
            padding: "10px 20px",       // Padding for the button
            borderRadius: "5px",        // Rounded corners
            display: "inline-flex",     // Align icon and text
            alignItems: "center"        // Center icon and text vertically
          }}
        >
          ייצוא לאקסל
        </CSVLink>
      </Toolbar>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <TableContainer component={Paper}  className="table-container-color">    
      <Table className="table-users">
          <TableHead className="table-head">
            <TableRow>
              {['email', 'firstName', 'lastName', 'address', 'phoneNumber', 'rating'].map((column) => (
                <TableCell key={column} className="rtl-table-col" style={{textAlign:"center"}}>
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
              <TableCell className="rtl-table-col">מחיקה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.email}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.firstName}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.lastName}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.address}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.phoneNumber}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.rating}</TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>
                  <Tooltip title="ערוך משתמש">
                    <IconButton color="primary" onClick={() => editUser(user)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell className="rtl-table" style={{textAlign:"center"}}>
                  <Tooltip title="מחק משתמש">
                    <IconButton color="secondary" sx={{ color: 'red' }} onClick={() => deleteUser(user._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  

      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal for editing users */}
      <Modal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-user-modal-title"
        aria-describedby="edit-user-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%', // responsive width
            maxWidth: 500, // max width for larger screens
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography id="edit-user-modal-title" variant="h6" component="h2">
            עריכת משתמש
          </Typography>
          <TextField
            fullWidth
            label="שם פרטי"
            margin="normal"
            value={updatedUser.firstName || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
          />
          <TextField
            fullWidth
            label="שם משפחה"
            margin="normal"
            value={updatedUser.lastName || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
          />
          <TextField
            fullWidth
            label="אימייל"
            margin="normal"
            value={updatedUser.email || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="כתובת"
            margin="normal"
            value={updatedUser.address || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
          />
          <TextField
            fullWidth
            label="מספר טלפון"
            margin="normal"
            value={updatedUser.phoneNumber || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleUpdateUser}>
            עדכן משתמש
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageUsers;
