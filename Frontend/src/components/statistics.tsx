import { useEffect, useState } from 'react';
import { Donation } from './donation';
import { DonorData } from './donorData';
import { requestedDonation } from '../services/upload-requested-product-service';
import dataService, { CanceledError } from '../services/data-service';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  Toolbar,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { styled } from '@mui/system';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleXAxisFieldChange = (event: any) => {
    setXAxisField(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleYAxisFieldChange = (event: any) => {
    setYAxisField(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartChange = (event: any) => {
    setSelectedChart(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aggregateData = (data: any[], field: string, isObject = false) => {
    if (!data || data.length === 0) return {};
    return data.reduce((acc, item) => {
      const key = isObject ? `${item[field]?.firstName} ${item[field]?.lastName}` : item[field];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item.quantity || item.amount || 1; 
      return acc;
    }, {});
  };

  const getTopN = (data: Record<string, number>, n: number) => {
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([key, value]) => ({ name: key, count: value }));
  };

  // Aggregation for the table (static data)
  const topProducts = getTopN(aggregateData(products, 'itemName'), 5);
  const topRequests = getTopN(aggregateData(requests, 'itemName'), 5);
  const topUsers = getTopN(aggregateData(products, 'donor', true), 5);
  const topBranches = getTopN(aggregateData(products, 'branch'), 5);
  const topCategories = getTopN(aggregateData(products, 'category'), 5);

  // Aggregation for the charts (dynamic data based on selected fields)
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    טופ מוצרים
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table aria-label="top products table">
                      <TableHead>
                        <TableRow>
                          <TableCell>מוצר</TableCell>
                          <TableCell align="right">כמות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topProducts.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    טופ בקשות
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table aria-label="top requests table">
                      <TableHead>
                        <TableRow>
                          <TableCell>בקשה</TableCell>
                          <TableCell align="right">כמות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topRequests.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    טופ משתמשים
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table aria-label="top users table">
                      <TableHead>
                        <TableRow>
                          <TableCell>שם</TableCell>
                          <TableCell align="right">כמות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topUsers.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    טופ סניפים
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table aria-label="top branches table">
                      <TableHead>
                        <TableRow>
                          <TableCell>סניף</TableCell>
                          <TableCell align="right">כמות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topBranches.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    טופ קטגוריות
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table aria-label="top categories table">
                      <TableHead>
                        <TableRow>
                          <TableCell>קטגוריה</TableCell>
                          <TableCell align="right">כמות</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topCategories.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    גרף
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="chart-select-label">בחר גרף</InputLabel>
                    <Select
                      labelId="chart-select-label"
                      id="chart-select"
                      value={selectedChart}
                      onChange={handleChartChange}
                      fullWidth
                    >
                      <MenuItem value="donations">תרומות</MenuItem>
                      <MenuItem value="requests">בקשות</MenuItem>
                      <MenuItem value="users">משתמשים</MenuItem>
                    </Select>
                  </FormControl>
                  <ResponsiveContainer width="100%" height={400}>
                    {selectedChart === 'donations' && (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxisField} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={yAxisField} fill="#8884d8" />
                      </BarChart>
                    )}
                    {selectedChart === 'requests' && (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxisField} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={yAxisField} fill="#82ca9d" />
                      </BarChart>
                    )}
                    {selectedChart === 'users' && (
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          fill="#8884d8"
                          label
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Statistics;
