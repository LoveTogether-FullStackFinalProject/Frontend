/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Chip,
  Card,
  CardContent,
  Modal,
} from "@mui/material";
import { Donation } from "./donation";
import { DonorData } from "./donorData";
import DonationModal from "./DonationModal";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import whitelogo from "../assets/whiteLogo.png";
import dataService, { CanceledError } from "../services/data-service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Profile.css"; // Keeping the custom styles

// Define the validation schema
const userSchema = z.object({
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("'@' כתובת דואר אלקטרוני חייבת להכיל את התו"),
  phoneNumber: z
    .string()
    .length(10, "מספר הטלפון חייב להכיל 10 ספרות")
    .refine((phone) => phone.startsWith("0"), "'מספר הטלפון חייב להתחיל ב-'0"),
  mainAddress: z.string().min(5, "כתובת ראשית חייבת להכיל לפחות 5 תווים"),
});

const Profile: React.FC = () => {
  const [user, setUser] = useState<DonorData | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    approved: string[];
  }>({ status: [], approved: [] });
  const [sortProperty, setSortProperty] = useState<keyof Donation | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  const userId = localStorage.getItem("userID");

  const fetchData = useCallback(async () => {
    try {
      const { req: userReq } = dataService.getUser(userId!);
      const userResponse = await userReq;
      setUser(userResponse.data);

      const { req: donationsReq } = dataService.getDonationsByUser(userId!);
      const donationsResponse = await donationsReq;
      setDonations(donationsResponse.data);
      setFilteredDonations(donationsResponse.data);
    } catch (error) {
      if (error instanceof CanceledError) return;
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    applyFilters();
  }, [
    donations,
    searchQuery,
    selectedFilters,
    itemsToShow,
    sortProperty,
    sortOrder,
  ]);

  const applyFilters = () => {
    let filtered = donations;

    if (searchQuery) {
      filtered = filtered.filter((donation) =>
        donation.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter((donation) =>
        selectedFilters.status.every((status) => donation.status === status)
      );
    }

    if (selectedFilters.approved.length > 0) {
      filtered = filtered.filter((donation) =>
        selectedFilters.approved.every(
          (approved) => String(donation.approvedByAdmin) === approved
        )
      );
    }

    if (sortProperty) {
      filtered.sort((a, b) => {
        const aValue = a[sortProperty];
        const bValue = b[sortProperty];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        return 0;
      });
    }

    setFilteredDonations(filtered.slice(0, itemsToShow));
  };

  const handleShowMoreClick = () => {
    setItemsToShow(itemsToShow + 6);
  };

  const toggleFilter = (type: "status" | "approved", value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter((f) => f !== value);
      } else {
        newFilters[type].push(value);
      }
      return newFilters;
    });
  };

  const removeFilter = (type: "status" | "approved", value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[type] = newFilters[type].filter((f) => f !== value);
      return newFilters;
    });
  };

  const handleDeleteClick = async (donationId: string): Promise<void> => {
    try {
      await dataService.deleteDonation(donationId);
      setDonations(donations.filter((donation) => donation._id !== donationId));
      setFilteredDonations(
        filteredDonations.filter((donation) => donation._id !== donationId)
      );
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  };

  const handleCardClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleSaveChanges = async (updatedDonation: Donation) => {
    try {
      if (updatedDonation && updatedDonation._id) {
        await dataService.updateDonation(updatedDonation._id, updatedDonation);
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === updatedDonation._id
              ? { ...donation, ...updatedDonation }
              : donation
          )
        );
        setShowModal(false);
      } else {
        console.error("Error: No donation ID found");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelClick = () => {
    setShowModal(false);
  };

  const handleSortChange = (property: keyof Donation | "") => {
    setSortProperty(property);
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const resetFilters = () => {
    setSelectedFilters({ status: [], approved: [] });
    setSearchQuery("");
  };

  useEffect(() => {
    if (user) {
      console.log("הדירוג שלי: ", user.rating);
      console.log("מספר התרומות שלי: ", donations.length);
      const newRating = updateRating(donations.length);
      dataService.updateUserData(user._id, { rating: newRating });
    }
  }, [donations]);

  function updateRating(donations: number) {
    if (donations >= 15) {
      return "⭐⭐⭐⭐⭐";
    } else if (donations >= 10) {
      return "⭐⭐⭐⭐";
    } else if (donations >= 5) {
      return "⭐⭐⭐";
    } else {
      return "⭐";
    }
  }

  const handleOpenUserEditModal = () => {
    setEditUserModalOpen(true);
  };

  const handleCloseUserEditModal = () => {
    setEditUserModalOpen(false);
  };

  const handleSaveUserDetails = async (updatedUserData: Partial<DonorData>) => {
    if (user) {
      try {
        await dataService.updateUserData(user._id, updatedUserData);
        setUser((prevUser) => ({ ...prevUser!, ...updatedUserData }));
        setEditUserModalOpen(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="loading">User not found</div>;

  return (
    <Container
      style={{
        width: "100%",
        padding: 0,
        margin: 0,
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          marginTop: "150px",
          height: "300px",
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(249, 230, 167, 0.8) 10%, rgba(245, 245, 244, 0.5) 100%)",
          padding: "0 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={whitelogo}
          alt="whitelogo"
          style={{
            maxWidth: "500px",
            maxHeight: "300px",
          }}
          sx={{
            marginLeft: "7px",
            minWidth: "100px",
            minHeight: "50px",
          }}
        />

        {/* Text and Button */}
        <Box
          sx={{
            marginBottom: "20px",
            marginRight: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
            gap: 2, // Space between text and button
          }}
        >
          {/* Center Text */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Assistant', sans-serif",
              fontWeight: 500,
              color: "black",
              mb: 2,
            }}
          >
            שלום, {user.firstName} {user.lastName}
          </Typography>
          {/* User Rating */}
          <Box sx={{ textAlign: "right", direction: "rtl" }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Assistant', sans-serif",
                color: "black",
                fontSize: "1.6em",
              }}
            >
              דירוג משתמש: {user.rating ?? 0}
            </Typography>
          </Box>
          {/* Edit Profile Button */}
          <Button variant="outlined" onClick={handleOpenUserEditModal}>
            ערוך פרטים אישיים
          </Button>
        </Box>
      </Box>

      <Typography
        variant="h3"
        sx={{
          mb: 2,
          fontFamily: "Assistant",
          borderBottom: "3px solid #f9db78",
          textAlign: "center",
          padding: "20px",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        התרומות שלי
      </Typography>

      {/* Search Section */}
      <Box
        my={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="חפש תרומה..."
          style={{ width: "20%" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ direction: "rtl", minWidth: "300px" }}
        />
        {/* Sort and Filter Section */}
        <Box display="flex" justifyContent="center" gap={2} width="100%" mt={2}>
          <TextField
            select
            value={sortProperty}
            onChange={(e) => handleSortChange(e.target.value as keyof Donation)}
            SelectProps={{
              native: true,
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiSelect-icon": {
                  left: 0, // Move the arrow to the left
                  right: "unset", // Remove the right alignment to avoid conflict
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                },
              },
            }}
            variant="outlined"
            sx={{
              width: {
                xs: "80%", // 80% width on extra-small screens (phones)
                sm: "50%", // 50% width on small screens (tablets)
                md: "20%", // 20% width on medium screens (desktops)
                lg: "10%", // 10% width on large screens (large desktops)
              },
              alignContent: "center",
              direction: "rtl",
              "& .MuiOutlinedInput-notchedOutline": {
                textAlign: "right",
              },
            }}
          >
            <option value="">מיין לפי</option>
            <option value="category">קטגוריה</option>
            <option value="quantity">כמות</option>
            <option value="condition">מצב הפריט</option>
            <option value="status">סטטוס</option>
            <option value="createdAt">תאריך יצירה</option>
            <option value="updatedAt">תאריך עדכון</option>
          </TextField>

          <TextField
            select
            value={sortOrder}
            onChange={(e) =>
              handleSortOrderChange(e.target.value as "asc" | "desc")
            }
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            sx={{
              width: {
                xs: "80%", // 80% width on extra-small screens
                sm: "50%", // 50% width on small screens
                md: "20%", // 20% width on medium screens
                lg: "10%", // 10% width on large screens
              },
              alignContent: "center",
              direction: "rtl",
              "& .MuiOutlinedInput-notchedOutline": {
                textAlign: "center",
              },
              "& .MuiInputBase-input": {
                textAlign: "center",
              },
            }}
          >
            <option value="asc">סדר עולה</option>
            <option value="desc">סדר יורד</option>
          </TextField>
        </Box>
      </Box>

      {/* Quick Filters */}
      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        my={4}
        flexWrap="wrap"
      >
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={resetFilters}
          sx={{ order: -1 }} // This moves the button to the first position
        >
          הסר מסננים
        </Button>

        {[
          "ממתין לאיסוף",
          "נאסף",
          "הגיע לעמותה",
          "טרם הגיע לעמותה",
          "נמסר בעמותה",
        ].map((status) => (
          <Button
            key={status}
            variant={
              selectedFilters.status.includes(status) ? "contained" : "outlined"
            }
            onClick={() => toggleFilter("status", status)}
          >
            {status}
          </Button>
        ))}
        <Button
          variant={
            selectedFilters.approved.includes("true") ? "contained" : "outlined"
          }
          onClick={() => toggleFilter("approved", "true")}
        >
          מאושר
        </Button>
        <Button
          variant={
            selectedFilters.approved.includes("false")
              ? "contained"
              : "outlined"
          }
          onClick={() => toggleFilter("approved", "false")}
        >
          לא מאושר
        </Button>
      </Box>

      {/* Selected Filters */}
      <Box display="flex" flexWrap="wrap" gap={1} my={2}>
        {selectedFilters.status.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onDelete={() => removeFilter("status", filter)}
            deleteIcon={<ClearIcon />}
            sx={{ backgroundColor: "#f0ad4e", color: "white" }}
          />
        ))}
        {selectedFilters.approved.map((filter) => (
          <Chip
            key={filter}
            label={filter === "true" ? "מאושר" : "לא מאושר"}
            onDelete={() => removeFilter("approved", filter)}
            deleteIcon={<ClearIcon />}
            sx={{ backgroundColor: "#f0ad4e", color: "white" }}
          />
        ))}
      </Box>

      {/* Donations Grid */}
      <Grid container spacing={3} my={4}>
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <Grid item xs={12} sm={6} md={4} key={donation._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleCardClick(donation)}
              >
                <div className="card-image-container">
                  <img
                    src={donation.image}
                    alt={donation.itemName}
                    className="card-image"
                  />
                </div>
                <CardContent
                  sx={{
                    flex: "0 0 auto", // Ensures this section doesn't grow, stays at the bottom
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    textAlign: "center",
                    direction: "rtl",
                    padding: "16px",
                  }}
                >
                  <Typography variant="h6" my={2}>
                    {donation.itemName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סטטוס: {donation.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    אושר על ידי מנהל:{" "}
                    {donation.approvedByAdmin === "true" ? "כן" : "לא"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              לא נמצאו תרומות
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Show More Button */}
      {donations.length > itemsToShow && (
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowMoreClick}
          >
            הצג עוד
          </Button>
        </Box>
      )}

      {/* Donation Modal */}
      <DonationModal
        show={showModal}
        onHide={handleCancelClick}
        donation={selectedDonation}
        onEditClick={handleSaveChanges}
        onDeleteClick={handleDeleteClick}
      />

      {/* User Edit Modal */}
      <UserEditModal
        open={editUserModalOpen}
        onClose={handleCloseUserEditModal}
        user={user}
        onSave={handleSaveUserDetails}
      />
    </Container>
  );
};

// User Edit Modal Component
const UserEditModal: React.FC<{
  open: boolean;
  onClose: () => void;
  user: DonorData | null;
  onSave: (data: Partial<DonorData>) => void;
}> = ({ open, onClose, user, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user || {},
  });

  useEffect(() => {
    reset(user || {});
  }, [user, reset]);

  const onSubmit = (data: Partial<DonorData>) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <Typography id="edit-user-modal-title" variant="h6" component="h2">
          עריכת פרטי משתמש
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="שם פרטי"
            margin="normal"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            InputLabelProps={{
              sx: {
                right: 15,
                left: "auto",
                transformOrigin: "top right",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -10px) scale(0.75)",
                  transformOrigin: "top right",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiOutlinedInput-notchedOutline": {
                  textAlign: "right",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="שם משפחה"
            margin="normal"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            InputLabelProps={{
              sx: {
                right: 15,
                left: "auto",
                transformOrigin: "top right",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -10px) scale(0.75)",
                  transformOrigin: "top right",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiOutlinedInput-notchedOutline": {
                  textAlign: "right",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="אימייל"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{
              sx: {
                right: 15,
                left: "auto",
                transformOrigin: "top right",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -10px) scale(0.75)",
                  transformOrigin: "top right",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiOutlinedInput-notchedOutline": {
                  textAlign: "right",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="כתובת"
            margin="normal"
            {...register("mainAddress")}
            error={!!errors.mainAddress}
            helperText={errors.mainAddress?.message}
            InputLabelProps={{
              sx: {
                right: 15,
                left: "auto",
                transformOrigin: "top right",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -10px) scale(0.75)",
                  transformOrigin: "top right",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiOutlinedInput-notchedOutline": {
                  textAlign: "right",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="מספר טלפון"
            margin="normal"
            {...register("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            InputLabelProps={{
              sx: {
                right: 15,
                left: "auto",
                transformOrigin: "top right",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0, -10px) scale(0.75)",
                  transformOrigin: "top right",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            }}
            InputProps={{
              sx: {
                textAlign: "right",
                direction: "rtl",
                "& .MuiOutlinedInput-notchedOutline": {
                  textAlign: "right",
                },
              },
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            שמור שינויים
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default Profile;
