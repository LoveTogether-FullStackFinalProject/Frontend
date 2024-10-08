import React, { useState, useEffect } from "react";
import dataService, { CanceledError } from "../services/data-service";
import { requestedDonation } from "../services/upload-requested-product-service";

import {
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
  Button,
  TableSortLabel,
  TextField,
  InputAdornment,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Search, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./ManageRequestedDonations.css";

type Order = "asc" | "desc";

const ManageRequestedDonations: React.FC = () => {
  const [requests, setRequests] = useState<requestedDonation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof requestedDonation>("itemName");
  const [filter, setFilter] = useState<string>("");
  const [currentDonation, setCurrentDonation] =
    useState<requestedDonation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const { req, abort } = dataService.getRequestedProducts();
    req
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => {
      abort();
    };
  }, []);

  const handleRequestSort = (property: keyof requestedDonation) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const applySortAndFilter = (data: requestedDonation[]) => {
    return data
      .filter(
        (donation) =>
          donation.category.toLowerCase().includes(filter.toLowerCase()) ||
          donation.itemName.toLowerCase().includes(filter.toLowerCase()) ||
          donation.description.toLowerCase().includes(filter.toLowerCase()) ||
          donation.amount.toString().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const valueA = a[orderBy] || "";
        const valueB = b[orderBy] || "";
        return (order === "asc" ? 1 : -1) * (valueA > valueB ? 1 : -1);
      });
  };

  const sortedAndFilteredDonations = applySortAndFilter(requests);

  const handleDelete = (donationId: string) => {
    dataService
      .deleteRequestedDonation(donationId)
      .then(() => {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== donationId)
        );
        setSnackbarMessage("התרומה נמחקה בהצלחה!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage("מחיקת התרומה נכשלה.");
        setSnackbarOpen(true);
      });
  };

  const [isAdmin, setIsAdmin] = useState(true);
  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
      });
    }
  }, []);

  if (isAdmin) {
    return (
      <div className="manage-donations-page">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          style={{ textDecoration: "underline #f9db78", marginTop: "40px" }}
        >
          ניהול תרומות שהעמותה מבקשת
        </Typography>
        <Toolbar>
          <TextField
          style={{right: '0px'}}
            placeholder="חפש תרומה לפי פרטיה  "
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
            sx={{
              maxWidth: '300px', 
            }}
          />
        </Toolbar>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleRequestSort("category")}
                  >
                    קטגוריה
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "itemName"}
                    direction={orderBy === "itemName" ? order : "asc"}
                    onClick={() => handleRequestSort("itemName")}
                  >
                    שם המוצר
                  </TableSortLabel>
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    active={orderBy === "description"}
                    direction={orderBy === "description" ? order : "asc"}
                    onClick={() => handleRequestSort("description")}
                  >
                    תיאור
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "amount"}
                    direction={orderBy === "amount" ? order : "asc"}
                    onClick={() => handleRequestSort("amount")}
                  >
                    כמות
                  </TableSortLabel>
                </TableCell>
                <TableCell>פרטי התרומות</TableCell>
                <TableCell>עריכה</TableCell>
                <TableCell>מחיקה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredDonations.map((donation) => (
                <TableRow key={donation._id}>
                  <TableCell>
                    {donation.customCategory || donation.category}
                  </TableCell>
                  <TableCell>{donation.itemName}</TableCell>
                  <TableCell>{donation.description}</TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className="button-info"
                      onClick={() => {
                        setCurrentDonation(donation);
                        setShowModal(true);
                      }}
                    >
                      פרטי התרומה
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className="button-primary"
                      onClick={() =>
                        navigate("/editRequestedProduct", {
                          state: { donation },
                        })
                      }
                    >
                      עריכת פרטי התרומה
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="מחק תרומה">
                      <IconButton
                        sx={{ color: "red" }}
                        onClick={() => {
                          if (donation._id) {
                            handleDelete(donation._id);
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box
            sx={{
              width: "400px",
              margin: "auto",
              marginTop: "100px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "right",
              direction: "rtl",
            }}
          >
            <Typography id="simple-modal-title" variant="h6" component="h2">
              פרטי תרומה
            </Typography>
            {currentDonation && (
              <div>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>שם המוצר:</strong> {currentDonation.itemName}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>קטגוריה:</strong> {currentDonation.category}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>תיאור:</strong> {currentDonation.description}
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                  <strong>כמות:</strong> {currentDonation.amount}
                </Typography>
                {currentDonation.image && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <img
                      src={currentDonation.image}
                      className="img-fluid"
                      alt="Donation"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            <Button
              onClick={() => setShowModal(false)}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              סגור
            </Button>
          </Box>
        </Modal>
      </div>
    );
  } else {
    return (
      <div className="error-container">
        <p style={{ fontFamily: "Assistant" }}>שגיאה: אינך מחובר בתור מנהל</p>
        {/* <button style={{fontFamily: 'Assistant'}} onClick={() => navigate('/mainPage')} className="error-button">התחבר בתור מנהל</button> */}
      </div>
    );
  }
};

export default ManageRequestedDonations;
