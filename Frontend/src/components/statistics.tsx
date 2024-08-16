import * as React from 'react';
import { useEffect, useState } from 'react';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from '../services/upload-requested-product-service';
import dataService, { CanceledError } from '../services/data-service';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  //LineChart,
  //Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { styled } from '@mui/system';
import './statistics.css';

// Styled Table Container
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  '& .MuiTableCell-body': {
    fontSize: '1.1rem',
  },
}));

// Statistics Component
const Statistics = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<requestedDonation[]>([]);
  const [users, setUsers] = useState<DonorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [xAxisField, setXAxisField] = useState<string>('itemName');
  const [yAxisField, setYAxisField] = useState<string>('quantity');
  const [selectedChart, setSelectedChart] = useState<string>('donations');

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
        setProducts(res.data);
    }).catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
    });

    return () => {
        abort();
    };
  }, []);

  useEffect(() => {
    const { req, abort } = dataService.getUsers();
    req.then((res) => {
        setUsers(res.data);
    }).catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
    });

    return () => {
        abort();
    };
  }, []);

  useEffect(() => {
    const { req, abort } = dataService.getRequestedProducts();
    req.then((res) => {
        setRequests(res.data);
    }).catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
    });

    return () => {
        abort();
    };
  }, []);

 
  
  const handleXAxisFieldChange = (event: SelectChangeEvent<string>) => {
    setXAxisField(event.target.value);
  };

  const handleYAxisFieldChange = (event: SelectChangeEvent<string>) => {
    setYAxisField(event.target.value);
  };

  const handleChartChange = (event: SelectChangeEvent<string>) => {
    setSelectedChart(event.target.value);
  };

  const aggregateData = (data: unknown[], field: string, isObject = false) => {
    if (!data || data.length === 0) return {};
    return data.reduce((acc, item) => {
      const key = isObject ? `${(item as any)[field]?.firstName} ${(item as any)[field]?.lastName}` : (item as any)[field];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += (item as any).quantity || (item as any).amount || 1; 
      return acc;
    }, {} as Record<string, number>);
  };

  const getTopN = (data: Record<string, number>, n: number) => {
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([key, value]) => ({ name: key, count: value }));
  };

  const topProducts = getTopN(aggregateData(products, 'itemName'), 5);
  //const topRequests = getTopN(aggregateData(requests, 'itemName'), 5);
  const topUsers = getTopN(aggregateData(products, 'donor', true), 5);
  const topBranches = getTopN(aggregateData(products, 'branch'), 5);
  const topCategories = getTopN(aggregateData(products, 'category'), 5);

  const chartData = selectedChart === 'users' 
    ? getTopN(aggregateData(users, 'id', true), 10) 
    : getTopN(aggregateData(selectedChart === 'requests' ? requests : products, xAxisField), 10);

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          border: '1px solid black'
        }}
      >
        <Typography variant="h6" color="error">
          שגיאה: אינך מחובר בתור מנהל
        </Typography>
        <Button
          onClick={() => navigate('/adminDashboard')}
          variant="contained"
          color="primary"
          sx={{ marginTop: '20px' }}
        >
          התחבר בתור מנהל
        </Button>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" fontSize={50} gutterBottom align="center" sx={{ marginTop: 15 }}>
        נתונים וסטטיסטיקות
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              </Typography>
              <StyledTableContainer >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>פריטים הכי נתרמים</TableCell>
                      <TableCell>משתמשים הכי תורמים</TableCell>
                      <TableCell>סניפים עם הכי הרבה תרומות</TableCell>
                      <TableCell>קטגוריות הכי נתרמות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>{topProducts[index]?.name && `${topProducts[index].name} (${topProducts[index].count} תרומות)`}</TableCell>
                        <TableCell>{topUsers[index]?.name && `${topUsers[index].name} (${topUsers[index].count} תרומות)`}</TableCell>
                        <TableCell>{topBranches[index]?.name && `${topBranches[index].name} (${topBranches[index].count} תרומות)`}</TableCell>
                        <TableCell>{topCategories[index]?.name && `${topCategories[index].name} (${topCategories[index].count} תרומות)`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mb={4}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>שדה X</InputLabel>
          <Select value={xAxisField} onChange={handleXAxisFieldChange} disabled={selectedChart === 'users'}>
            <MenuItem value="itemName">שם המוצר</MenuItem>
            <MenuItem value="category">קטגוריה</MenuItem>
            <MenuItem value="condition">מצב</MenuItem>
            <MenuItem value="pickupAddress">כתובת איסוף</MenuItem>
            <MenuItem value="branch">סניף עמותה</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>שדה Y</InputLabel>
          <Select value={yAxisField} onChange={handleYAxisFieldChange}>
            <MenuItem value="quantity">כמות</MenuItem>
            <MenuItem value="amount">סכום</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>סוג תרומה</InputLabel>
          <Select value={selectedChart} onChange={handleChartChange}>
            <MenuItem value="donations">תרומות</MenuItem>
            <MenuItem value="requests">בקשות</MenuItem>
            <MenuItem value="users">משתמשים</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {selectedChart !== 'users' && (
        <Box mb={4} sx={{ height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      {selectedChart === 'users' && (
        <Box mb={4} sx={{ height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Container>
  );
};

export default Statistics;
