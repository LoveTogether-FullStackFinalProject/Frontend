import React, { useState, useEffect } from 'react';
import './ManageMainPageUsers.css';  // Import the CSS file
import dataService, { CanceledError } from "../services/data-service";
import { DonorData } from './donorData';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Dropdown,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
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
  const navigate = useNavigate();

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
        donor.rating.toString().includes(filter.toLowerCase())
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
        <p>שגיאה: אינך מחובר בתור מנהל</p>
      </div>
    );
  }

  return (
    <div className="manage-users-page">
      <h2>ניהול הצגת תורמים בעמוד הראשי</h2>
      <TextField
        label="חפש תורם"
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
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
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
};

export default ManageMainPageUsers;
