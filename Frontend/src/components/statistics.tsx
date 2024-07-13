import { useEffect, useState } from 'react';
import { Donation } from './donation';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/system';
import './statistics.css';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Statistics = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<requestedDonation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [xAxisField, setXAxisField] = useState<string>('itemName');
  const [yAxisField, setYAxisField] = useState<string>('quantity');

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
      console.log('Fetched Donations:', res.data);
      setProducts(res.data);
      logAggregatedData(); // Add this line

    }).catch((err) => {
      if (err instanceof CanceledError) return;
      setError(err.message);
    });
    return () => abort();
  }, []);
  
  useEffect(() => {
    const { req, abort } = dataService.getRequestedProducts();
    req.then((res) => {
      console.log('Fetched Requested Products:', res.data);
      setRequests(res.data);
    }).catch((err) => {
      if (err instanceof CanceledError) return;
      setError(err.message);
    });
    return () => abort();
  }, []);
  

  const handleXAxisFieldChange = (event: any) => {
    setXAxisField(event.target.value);
  };

  const handleYAxisFieldChange = (event: any) => {
    setYAxisField(event.target.value);
  };

  const calculateAggregatedData = (data, field) => {
    return data.reduce((acc, item) => {
      const key = item[field];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item.quantity; // Assuming quantity is the field to sum up
      return acc;
    }, {});
  };
  
  const logAggregatedData = () => {
    const aggregatedByCategory = calculateAggregatedData(products, 'category');
    const aggregatedByItemName = calculateAggregatedData(products, 'itemName');
    const aggregatedByCondition = calculateAggregatedData(products, 'condition');
  
    console.log('Aggregated by Category:', aggregatedByCategory);
    console.log('Aggregated by Item Name:', aggregatedByItemName);
    console.log('Aggregated by Condition:', aggregatedByCondition);
  };
  

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
      <Typography variant="h4" component="h1" gutterBottom align="center">
        דוחות נתונים וסטטיסטיקות של התרומות בעמותה
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box mb={4}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="x-axis-select-label"
            value={xAxisField}
            onChange={handleXAxisFieldChange}
          >
            <MenuItem value="itemName">שם המוצר</MenuItem>
            <MenuItem value="category">קטגוריה</MenuItem>
            <MenuItem value="condition">מצב</MenuItem>
            <MenuItem value="pickupAddress">כתובת איסוף</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                נתוני התרומות בשנה האחרונה
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisField} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={yAxisField} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary" gutterBottom>
                נתוני פריטים חסרים בעמותה שנדרשים לתרומות
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={requests} dataKey="amount" nameKey="itemName" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                תרומות לאורך זמן
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={xAxisField} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={yAxisField} stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;
