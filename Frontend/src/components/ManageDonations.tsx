// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import dataService, { CanceledError } from '../services/data-service';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Snackbar,
//   Alert,
//   Modal,
//   Button,
//   TableSortLabel,

//   TextField,
//   InputAdornment,
//   Toolbar,
//   IconButton,
//   MenuItem,
//   Select,
//   Box,
//   Tooltip,
// } from '@mui/material';
// import { CSVLink } from 'react-csv';
//  // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Edit, Delete, Search } from '@mui/icons-material';
// import './ManageDonations.css';
// import {Donation} from './donation';

// // interface Donation {
// //   _id: string;
// //   itemName: string;
// //   category: string;
// //   description: string;
// //   status: string;
// //   approvedByAdmin?: boolean | string;
// //   donor?: {
// //     firstName: string;
// //     lastName: string;
// //     phone: string;
// //   };
// //   pickUpAddress: string;
// //   userAddress?: string;
// //   branch?: string;
// //   image?: string;
// //   quantity?: number;
// //   itemCondition?: string;
// //   expirationDate?: string;
// //   createdAt: string;
// // }


// type Order = 'asc' | 'desc';

// const ManageDonationPage: React.FC = () => {
//   const [donations, setDonations] = useState<Donation[]>([]);

//   const [showModal, setShowModal] = useState(false);
//   const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
//   //const [ setError] = useState<string | null>(null);
//   const [order, setOrder] = useState<Order>('asc');
//   const [orderBy, setOrderBy] = useState<keyof Donation>('itemName');
//   const [filterText, setFilterText] = useState<string>('');
//   const [pendingChanges, setPendingChanges] = useState<Donation[]>([]);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//  // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const navigate = useNavigate();

//   useEffect(() => {
//     const { req, abort } = dataService.getDonations();
//     req.then((res) => {
//       if(res.data){
//         setDonations(res.data);
//       }
      

//     }).catch((err) => {
//       if (err instanceof CanceledError) return;
//       //setError(err.message);
//     });

//     return () => {
//       abort();
//     };
//   }, []);

//   const handleRequestSort = (property: keyof Donation) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setFilterText(event.target.value);
//   };

//   const applySortAndFilter = (data: Donation[]) => {
//     const lowerCaseFilterText = filterText.toLowerCase();
//     return data
//       .filter(donation => {
//         const itemName = donation.itemName?.toLowerCase() || '';
//         const category = donation.category?.toLowerCase() || '';
//         const description = donation.description?.toLowerCase() || '';
//         const status = donation.status?.toLowerCase() || '';
//         const donorName = donation.donor 
//           ? (donation.donor.firstName?.toLowerCase() + " " + donation.donor.lastName?.toLowerCase()) 
//           : '';
//         const branch = donation.branch?.toLowerCase() || '';

//         return (
//           itemName.includes(lowerCaseFilterText) ||
//           category.includes(lowerCaseFilterText) ||
//           description.includes(lowerCaseFilterText) ||
//           status.includes(lowerCaseFilterText) ||
//           donorName.includes(lowerCaseFilterText) ||
//           branch.includes(lowerCaseFilterText)
//         );

//       })
//       .sort((a, b) => {
//         const valueA = a[orderBy] || '';
//         const valueB = b[orderBy] || '';
//         return (order === 'asc' ? 1 : -1) * (valueA > valueB ? 1 : -1);
//       });
//   };

//   const handleStatusUpdate = (donation: Donation, status: string) => {
//     const updatedDonation = { ...donation, status };
//     setDonations((prevDonations) =>
//       prevDonations.map((d) => (d._id === donation._id ? updatedDonation : d))
//     );
//     setPendingChanges((prev) => [...prev, updatedDonation]);
//   };

//   const handleApprovalUpdate = (donation: Donation, approvedByAdmin:string) => {
//     const updatedDonation = { ...donation, approvedByAdmin };
//     setDonations((prevDonations) =>
//       prevDonations.map((d) => (d._id === donation._id ? updatedDonation : d))
//     );
//     setPendingChanges((prev) => [...prev, updatedDonation]);
//   };

//   const saveChanges = async () => {
//     try {
//       const updatePromises = pendingChanges.map((donation) =>
//         dataService.updateDonation(donation._id, donation)
//       );
//       await Promise.all(updatePromises);
//       setPendingChanges([]);
//       setSnackbarMessage('השינויים נשמרו בהצלחה!');
//       setSnackbarOpen(true);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       setSnackbarMessage('שמירת השינויים נכשלה.');
//       setSnackbarOpen(true);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('he-IL', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const sortedAndFilteredDonations = applySortAndFilter(donations);

//   return (
//     <div className="manage-donations-page" style={{ direction: 'rtl', textAlign: 'right', padding: '20px' }}>
//       <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '30px' }}>
//         ניהול תרומות
//       </Typography>
//       <Toolbar>
//         <TextField
//           label="חפש תרומה"
//           placeholder="חפש תרומה לפי שם פריט, קטגוריה, תיאור, סטטוס, שם התורם או סניף"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={filterText}
//           onChange={handleInputChange}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Search />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <CSVLink
//           data={donations}
//           filename={"donations.csv"}
//           className="btn btn-primary"
//           style={{ marginLeft: '20px', padding: '10px 20px', backgroundColor: '#f9db78', color: '#000', borderRadius: '5px', textDecoration: 'none' }}
//         >
//           ייצוא ל-CSV
//         </CSVLink>
//       </Toolbar>
//       {/* {error && <Typography color="error" align="center">{error}</Typography>} */}
//       <TableContainer component={Paper} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
//         <Table style={{ minWidth: 650 }}>
//           <TableHead style={{ backgroundColor: '#f0e0ad' }}>
//             <TableRow>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'itemName'}
//                   direction={orderBy === 'itemName' ? order : 'asc'}
//                   onClick={() => handleRequestSort('itemName')}
//                 >
//                   שם הפריט
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'category'}
//                   direction={orderBy === 'category' ? order : 'asc'}
//                   onClick={() => handleRequestSort('category')}
//                 >
//                   קטגוריה
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'description'}
//                   direction={orderBy === 'description' ? order : 'asc'}
//                   onClick={() => handleRequestSort('description')}
//                 >
//                   תיאור
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'status'}
//                   direction={orderBy === 'status' ? order : 'asc'}
//                   onClick={() => handleRequestSort('status')}
//                 >
//                   סטטוס
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'approvedByAdmin'}
//                   direction={orderBy === 'approvedByAdmin' ? order : 'asc'}
//                   onClick={() => handleRequestSort('approvedByAdmin')}
//                 >
//                   אישור מנהל
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 {/* <TableSortLabel
//                   active={orderBy === 'donor.firstName'}
//                   direction={orderBy === 'donor.firstName' ? order : 'asc'}
//                   onClick={() => handleRequestSort('donor.firstName')}
//                 >
//                   שם התורם
//                 </TableSortLabel> */}
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === 'createdAt'}
//                   direction={orderBy === 'createdAt' ? order : 'asc'}
//                   onClick={() => handleRequestSort('createdAt')}
//                 >
//                   תאריך
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>סניף</TableCell>
//               <TableCell>פרטי התרומות</TableCell>
//               <TableCell>מחיקה</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sortedAndFilteredDonations.map((donation) => (
//               <TableRow key={donation._id}>
//                 <TableCell>{donation.itemName}</TableCell>
//                 <TableCell>{donation.category}</TableCell>
//                 <TableCell>{donation.description}</TableCell>
//                 <TableCell>
//                   <Select
//                     value={donation.status}
//                     onChange={(e) => handleStatusUpdate(donation, e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                     sx={{ backgroundColor: '#f9f9f9' }}
//                   >
//                     <MenuItem value="נמסר בעמותה">נמסר בעמותה</MenuItem>
//                     <MenuItem value="ממתין לאיסוף">ממתין לאיסוף</MenuItem>
//                     <MenuItem value="נאסף">נאסף</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   <Select
//                     value={String(donation.approvedByAdmin)}
//                     onChange={(e) => handleApprovalUpdate(donation, e.target.value === 'true' ? 'false' : 'true')}
//                     fullWidth
//                     variant="outlined"
//                     sx={{ backgroundColor: '#f9f9f9' }}
//                   >
//                     <MenuItem value="true">מאושר</MenuItem>
//                     <MenuItem value="false">לא מאושר</MenuItem>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   {donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : 'לא ידוע'}
//                 </TableCell>
//                 <TableCell>{formatDate(donation.createdAt)}</TableCell>
//                 <TableCell>{donation.branch || 'לא זמין'}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => {
//                       setCurrentDonation(donation);
//                       setShowModal(true);
//                     }}
//                   >
//                     פרטי התרומה
//                   </Button>
//                 </TableCell>
//                 <TableCell>
//                   <Tooltip title="מחק תרומה">
//                     <IconButton
//                       color="secondary"
//                       onClick={() => {
//                         setCurrentDonation(donation);
//                         setShowModal(true);
//                       }}
//                     >
//                       <Delete />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={saveChanges}
//         disabled={pendingChanges.length === 0}
//         sx={{ mt: 2 }}
//       >
//         שמור שינויים
//       </Button>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//       >
//         <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       <Modal
//         open={showModal}
//         onClose={() => setShowModal(false)}
//       >
//         <Box sx={modalStyle}>
//           <Typography variant="h6" gutterBottom>
//             פרטי התרומה
//           </Typography>
//           {currentDonation && (
//             <div>
//               <Typography variant="body1"><strong>שם המוצר:</strong> {currentDonation.itemName}</Typography>
//               <Typography variant="body1"><strong>תיאור:</strong> {currentDonation.description}</Typography>
//               <Typography variant="body1"><strong>מצב:</strong> {currentDonation.itemCondition}</Typography>
//               <Typography variant="body1"><strong>כמות:</strong> {currentDonation.quantity}</Typography>
//               {currentDonation.image && (
//                 <div style={{ textAlign: 'center' }}>
//                   <img src={currentDonation.image} alt="Donation" className="img-fluid" />
//                 </div>
//               )}
//             </div>
//           )}
//           <Button onClick={() => setShowModal(false)} variant="contained" color="primary" sx={{ mt: 2 }}>
//             סגור
//           </Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// const modalStyle = {
//   position: 'absolute' ,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
// };

// export default ManageDonationPage;
