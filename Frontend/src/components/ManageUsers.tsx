
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
import { Edit, Delete, Search} from '@mui/icons-material';
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
  const [isAdmin, setIsAdmin] = useState(true); 

  const fetchData = async () => {
    const userId = localStorage.getItem('userID');
    if (!userId) {
      setIsAdmin(false);
      return;
    }
  
    try {
      const [userRes, usersRes] = await Promise.all([
        dataService.getUser(userId).req,
        dataService.getUsers().req
      ]);
      setIsAdmin(userRes.data.isAdmin);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsAdmin(false);
      setError("Error fetching data. Please try again.");
    } 
  };

  useEffect(() => {
    fetchData();
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
        (user.mainAddress && user.mainAddress.toLowerCase().includes(filter.toLowerCase())) ||
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
      address: u.mainAddress,
      phoneNumber: u.phoneNumber,
      rating: u.rating,
    }));
    return csvData;
  };

  const sortedAndFilteredUsers = applySortAndFilter(users);

 

  
  if (users.length === 0) {
    return <div>No users found.</div>;
  }
  
if(isAdmin){
  return (
    <div className="manage-users-page">
        <Typography 
        variant="h3"
        style={{
          alignItems:"center",
          marginRight:"40%"
        }}
        sx={{ 
        align:"center",
        justifyContent:"center",
        textAlign:"center",
        mb: 2, 
        fontFamily: 'Assistant', 
        marginTop: "100px", 
        textDecoration: 'underline #f9db78',
        display: 'table',
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
            backgroundColor: "#217346", 
            padding: "10px 20px",       
            borderRadius: "5px",        
            display: "inline-flex",     
            alignItems: "center"        
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
              {['email', 'firstName', 'lastName', 'mainAddress', 'phoneNumber', 'rating'].map((column) => (
                <TableCell key={column} className="rtl-table-col" style={{textAlign:"center"}}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column as keyof DonorData)}
                  >
                    {column === 'email' && 'אימייל'}
                    {column === 'firstName' && 'שם פרטי'}
                    {column === 'lastName' && 'שם משפחה'}
                    {column === 'mainAddress' && 'כתובת'}
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
                <TableCell className="rtl-table" style={{textAlign:"center"}}>{user.mainAddress}</TableCell>
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
      width: '90%', // Responsive width
      maxWidth: 500, // Max width for larger screens
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 1,
      textAlign: 'right', // Align text and form elements to the right
      direction: 'rtl', // Set RTL direction for the content
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
      InputLabelProps={{
        sx: {
          right: 19,
          left: 'auto',
          transformOrigin: 'top right',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -10px) scale(0.75)',
            transformOrigin: 'top right',
          },
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
      InputProps={{
        sx: {
          textAlign: 'right',
          direction: 'rtl',
          '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
          },
        },
      }}
    />
    <TextField
      fullWidth
      label="שם משפחה"
      margin="normal"
      value={updatedUser.lastName || ''}
      onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
      InputLabelProps={{
        sx: {
          right: 19,
          left: 'auto',
          transformOrigin: 'top right',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -10px) scale(0.75)',
            transformOrigin: 'top right',
          },
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
      InputProps={{
        sx: {
          textAlign: 'right',
          direction: 'rtl',
          '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
          },
        },
      }}
    />
    <TextField
      fullWidth
      label="אימייל"
      margin="normal"
      value={updatedUser.email || ''}
      onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
      InputLabelProps={{
        sx: {
          right: 19,
          left: 'auto',
          transformOrigin: 'top right',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -10px) scale(0.75)',
            transformOrigin: 'top right',
          },
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
      InputProps={{
        sx: {
          textAlign: 'right',
          direction: 'rtl',
          '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
          },
        },
      }}
    />
    <TextField
      fullWidth
      label="כתובת"
      margin="normal"
      value={updatedUser.mainAddress || ''}
      onChange={(e) => setUpdatedUser({ ...updatedUser, mainAddress: e.target.value })}
      InputLabelProps={{
        sx: {
          right: 19,
          left: 'auto',
          transformOrigin: 'top right',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -10px) scale(0.75)',
            transformOrigin: 'top right',
          },
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
      InputProps={{
        sx: {
          textAlign: 'right',
          direction: 'rtl',
          '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
          },
        },
      }}
    />
    <TextField
      fullWidth
      label="מספר טלפון"
      margin="normal"
      value={updatedUser.phoneNumber || ''}
      onChange={(e) => setUpdatedUser({ ...updatedUser, phoneNumber: e.target.value })}
      InputLabelProps={{
        sx: {
          right: 19,
          left: 'auto',
          transformOrigin: 'top right',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(0, -10px) scale(0.75)',
            transformOrigin: 'top right',
          },
          '& .MuiFormLabel-asterisk': {
            display: 'none',
          },
        },
      }}
      InputProps={{
        sx: {
          textAlign: 'right',
          direction: 'rtl',
          '& .MuiOutlinedInput-notchedOutline': {
            textAlign: 'right',
          },
        },
      }}
    />
    <Button variant="contained" color="primary" fullWidth onClick={handleUpdateUser}>
      עדכן משתמש
    </Button>
  </Box>
</Modal>
    </div>
  );
}
else{
  return (
    <div className="error-container">
      <p>שגיאה: אינך מחובר בתור מנהל</p>
    </div>
  );
}};
export default ManageUsers;

