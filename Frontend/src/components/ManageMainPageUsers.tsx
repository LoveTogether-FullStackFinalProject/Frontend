import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import dataService, { CanceledError } from "../services/data-service";
import { DonorData } from './donorData';
import {
  Table,
  Button,
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

const ManageMainPageUsers = () => {
  const [donors, setDonors] = useState<DonorData[]>([])
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DonorData>('firstName');
  const [filter, setFilter] = useState<string>('');
  const [buttonLabels, setButtonLabels] = useState<{ [key: string]: string }>({});

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
      };
    
      const sortedAndFilteredDonors = applySortAndFilter(donors);

      const handleButtonClick = (id: string) => {
        setButtonLabels((prevLabels) => ({
          ...prevLabels,
          [id]: prevLabels[id] === 'אישור' ? 'ביטול' : 'אישור',
        }));
      };

      return (
        <div className="container mt-4">
          <h2>ניהול הצגת תורמים בעמוד הראשי</h2>
          <TextField
            label="חפש תורם"
            placeholder="חפש תורם לפי שם פרטי, שם משפחה, דירוג"
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
                    שם פרטי
                  </TableSortLabel>
                </th>
                <th>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'asc'}
                    onClick={() => handleRequestSort('description')}
                  >
                    שם משפחה
                  </TableSortLabel>
                </th>
                <th>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    דירוג
                  </TableSortLabel>
                </th>
                <th>אישור הצגת התורם בעמוד הראשי</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredDonors.map((donor) => (
                <tr key={donor._id}>
                  <td>{donor.firstName}</td>
                  <td>{donor.lastName}</td>
                  <td>{donor.rating}</td>
                  <td>
                  <Button variant="danger" onClick={() => handleButtonClick(donor._id!)}>
                  {buttonLabels[donor._id!] || 'אישור'}
                </Button>
            </td>
                </tr>
              ))}
            </tbody>
          </Table> 
        </div>
      );
};

export default ManageMainPageUsers;
