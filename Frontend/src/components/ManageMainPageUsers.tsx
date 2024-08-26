import React, { useState, useEffect } from 'react';
import './ManageMainPageUsers.css';  // Import the CSS file
import dataService, { CanceledError } from "../services/data-service";
import { DonorData } from './donorData';
import {
  Table,
  Dropdown,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Typography,
  TextField,
  InputAdornment,
  TableSortLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';
type Order = 'asc' | 'desc';
import person from './../assets/person.png';

const ManageMainPageUsers = () => {
  const [donors, setDonors] = useState<DonorData[]>([])
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DonorData>('firstName');
  const [filter, setFilter] = useState<string>('');
  

  useEffect(() => {
    const { req, abort } = dataService.getUsers();
    req.then((res) => {
        setDonors(res.data);
    }).catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
    });

    return () => {
        abort();
    };
  }, []);

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
      .filter(donor => 
        donor.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        donor.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        (donor.rating ?? '').toString().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (a[orderBy] === undefined || b[orderBy] === undefined) return 0;
      
        return (order === 'asc' ? 1 : -1) * (
          (a[orderBy] ?? '') > (b[orderBy] ?? '') ? 1 : 
          (a[orderBy] ?? '') < (b[orderBy] ?? '') ? -1 : 
          0
        );
      });
  };

  const sortedAndFilteredDonors = applySortAndFilter(donors);

  const handleApprovalUpdate = (donor: DonorData, isPublished: boolean) => {
    const updatedDonor = { ...donor, isPublished };
    setDonors((updateddonor) =>
        updateddonor.map((d) => (d._id === donor._id ? updatedDonor : d))
    );
    dataService.updateUser(donor._id, { isPublished: isPublished });
  };

  const [isAdmin, setIsAdmin] = useState(true);
   useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
       dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
        console.log("isAdmin:", res.data.isAdmin);
      });
    }
  }, []);


if(isAdmin){
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
        marginRight:"35%"
        
    }}
>
    ניהול הצגת יוזרים בעמוד הראשי</Typography>
      <TextField
        
        placeholder="חפש תורם לפי שם פרטי, שם משפחה, דירוג"
        variant="outlined"
        className="filter-input"
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
      <Table striped bordered hover responsive className="donors-table">
        <thead>
          <tr>
            <th>
              <TableSortLabel
                active={orderBy === 'firstName'}
                direction={orderBy === 'firstName' ? order : 'asc'}
                onClick={() => handleRequestSort('firstName')}
              >
                שם פרטי
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={orderBy === 'lastName'}
                direction={orderBy === 'lastName' ? order : 'asc'}
                onClick={() => handleRequestSort('lastName')}
              >
                שם משפחה
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={orderBy === 'rating'}
                direction={orderBy === 'rating' ? order : 'asc'}
                onClick={() => handleRequestSort('rating')}
              >
                דירוג
              </TableSortLabel>
            </th>
            <th>תמונת פרופיל</th>
            <th>אישור הצגת התורם בעמוד הראשי</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredDonors.filter(donor => donor.rating === "⭐⭐⭐⭐⭐").map((donor) => (
            <tr key={donor._id}>
              <td>{donor.firstName}</td>
              <td>{donor.lastName}</td>
              <td>{donor.rating}</td>
              <td>
                <img src={donor.image || person} alt={donor.firstName} className="profile-image" />
              </td>
              <td>
                <Dropdown >
                  <Dropdown.Toggle variant="secondary" 
                  id="dropdown-basic" 
                  className="custom-dropdown"
                  style ={{
                    backgroundColor: donor.isPublished ? 'green' : 'red',
                    color: 'white',
                    
                  }}>
                    {donor.isPublished === true || donor.isPublished ? "מאושר" : "לא מאושר"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donor, true)}>
                      כן
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donor, false)}>
                      לא
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> 
    </div>
  );
}else{
  return (
    <div className="error-container">
      <p style={{fontFamily: 'Assistant'}}>שגיאה: אינך מחובר בתור מנהל</p>
      {/* <button style={{fontFamily: 'Assistant'}} onClick={() => navigate('/mainPage')} className="error-button">התחבר בתור מנהל</button> */}
    </div>
  );
}};

export default ManageMainPageUsers;
