import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import dataService, { CanceledError } from "../services/data-service";
import {requestedDonation} from "../services/upload-requested-product-service";
import { Donation } from './donation';
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

const ManageRequestedDonations = () => {
  const [requests, setRequests] = useState<requestedDonation[]>([])
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Donation>('category');
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const { req, abort } = dataService.getRequestedProducts();
    req.then((res) => {
        setRequests(res.data);
    }).catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
    });

    return () => {
        abort();
    };
    }, [requests]);

    const handleRequestSort = (property: keyof Donation) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };
    
      const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
      };
    
      const applySortAndFilter = (data: requestedDonation[]) => {
        return data
          .filter(donation => 
            donation.category.toLowerCase().includes(filter.toLowerCase()) ||
            donation.description.toLowerCase().includes(filter.toLowerCase()) ||
            donation.amount.toString().includes(filter.toLowerCase())
          )
      };
    
      const sortedAndFilteredDonations = applySortAndFilter(requests);

      const handleUpdatePlus = (donationId: string, amount: number) => {
        dataService.updateRequestedDonation(donationId, { amount: amount+1 });
        console.log(`updating donation with ID: ${donationId}`);
      };

      const handleUpdateMinus = (donationId: string, amount: number) => {
        dataService.updateRequestedDonation(donationId, { amount: amount-1 });
        console.log(`updating donation with ID: ${donationId}`);
      };

      const handleDelete = (donationId: string) => {
        dataService.deleteRequestedDonation(donationId);
        console.log(`Deleting donation with ID: ${donationId}`);
      };

      return (
        <div className="container mt-4">
          <h2>ניהול תרומות שהעמותה מבקשת</h2>
          <TextField
            label="חפש תרומה"
            placeholder="חפש תרומה לפי קטגוריה, תיאור, כמות"
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
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleRequestSort('category')}
                  >
                    כמות
                  </TableSortLabel>
                </th>
                <th>מחיקת פריט מהעמוד הראשי</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.category}</td>
                  <td>{donation.description}</td>
                  <td>
                  <Button onClick={() => handleUpdatePlus(donation._id!, donation.amount)}>
               +
              </Button>
              {donation.amount}
              {donation.amount > 0 && (
                <Button onClick={() => handleUpdateMinus(donation._id!, donation.amount)}>
                    -
                </Button>
                )}
                  </td>
                  <td>
              <Button variant="danger" onClick={() => handleDelete(donation._id!)}>
                מחיקה
              </Button>
            </td>
                </tr>
              ))}
            </tbody>
          </Table> 
        </div>

      );
};


export default ManageRequestedDonations;
