/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Container, Grid, TextField, Typography, Chip, Card, CardContent } from '@mui/material';
import { Donation } from './donation';
import { DonorData } from './donorData';
import DonationModal from './DonationModal';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import whitelogo from '../assets/whiteLogo.png';
import dataService, { CanceledError } from '../services/data-service';
import './Profile.css'; // Keeping the custom styles

const Profile: React.FC = () => {
    const [user, setUser] = useState<DonorData | null>(null);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [showModal, setShowModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<{ status: string[]; approved: string[] }>({ status: [], approved: [] });
    const [sortProperty, setSortProperty] = useState<keyof Donation | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const userId = localStorage.getItem('userID');

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
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        applyFilters();
    }, [donations, searchQuery, selectedFilters, itemsToShow, sortProperty, sortOrder]);

    const applyFilters = () => {
        let filtered = donations;

        if (searchQuery) {
            filtered = filtered.filter(donation =>
                donation.itemName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedFilters.status.length > 0) {
            filtered = filtered.filter(donation =>
                selectedFilters.status.includes(donation.status)
            );
        }

        if (selectedFilters.approved.length > 0) {
            filtered = filtered.filter(donation =>
                selectedFilters.approved.includes(String(donation.approvedByAdmin))
            );
        }

        if (sortProperty) {
            filtered.sort((a, b) => {
                const aValue = a[sortProperty];
                const bValue = b[sortProperty];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
                } else if (aValue instanceof Date && bValue instanceof Date) {
                    return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
                }
                return 0;
            });
        }

        setFilteredDonations(filtered.slice(0, itemsToShow));
    };

    const handleShowMoreClick = () => {
        setItemsToShow(itemsToShow + 4);
    };

    const toggleFilter = (type: 'status' | 'approved', value: string) => {
        setSelectedFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (newFilters[type].includes(value)) {
                newFilters[type] = newFilters[type].filter(f => f !== value);
            } else {
                newFilters[type].push(value);
            }
            return newFilters;
        });
    };

    const removeFilter = (type: 'status' | 'approved', value: string) => {
        setSelectedFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            newFilters[type] = newFilters[type].filter(f => f !== value);
            return newFilters;
        });
    };

    const handleDeleteClick = async (donationId: string): Promise<void> => {
        try {
            await dataService.deleteDonation(donationId);
            setDonations(donations.filter((donation) => donation._id !== donationId));
            setFilteredDonations(filteredDonations.filter((donation) => donation._id !== donationId));
        } catch (error) {
            console.error('Error deleting donation:', error);
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
                        donation._id === updatedDonation._id ? { ...donation, ...updatedDonation } : donation
                    )
                );
                setShowModal(false);
            } else {
                console.error('Error: No donation ID found');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const handleCancelClick = () => {
        setShowModal(false);
    };

    const handleSortChange = (property: keyof Donation | '') => {
        setSortProperty(property);
    };

    const handleSortOrderChange = (order: 'asc' | 'desc') => {
        setSortOrder(order);
    };

    const resetFilters = () => {
        setSelectedFilters({ status: [], approved: [] });
        setSearchQuery('');
    };

    useEffect(() => {
        if (user) {
          const newRating = updateRating(donations.length);
          dataService.updateUserData(user._id, { rating: newRating });
        }
      }, [donations]);

   function updateRating(donations: number) {
        if (donations >= 20) {
          return "1";
        } else if (donations >= 15) {
          return "2";
        } else if (donations >= 10) {
          return "3";
        } else if (donations >= 5) {
          return "4";
        } else {
          return "0";
        }
      }

    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <Container style={{ 
            width: '100%', 
            padding: 0, 
            margin: 0, 
            maxWidth: '100%' ,
        }}>         
            <Box
      sx={{
        marginTop: '150px',
        height:"300px",
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        background: 'linear-gradient(135deg, rgba(249, 230, 167, 0.8) 10%, rgba(245, 245, 244, 0.5) 100%)',
        padding: '0 20px', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}
>
    {/* Logo */}
    <Box
        component="img"
        src={whitelogo}
        alt="whitelogo"
        style={{
            maxWidth: '500px',
            maxHeight:"300px"
        }}
        sx={{ 
            marginLeft:'7px',
            minWidth:'100px',
            minHeight:"50px"
           
        }}
    />

    {/* Text and Button */}
    <Box
        sx={{
            marginBottom:'20px',
            marginRight:'50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            gap: 2, // Space between text and button
        }}
    >
        {/* Center Text */}
        <Typography variant="h3" sx={{ 
            fontFamily: "'Assistant', sans-serif", 
            fontWeight: 500, 
            color: 'black',
            mb: 2,
        }}>
           {user.firstName} {user.lastName} ,שלום

        </Typography>
       {/* User Rating */}
       <Box sx={{ textAlign: 'right', direction: 'rtl' }}>
            <Typography variant="body1" sx={{ fontFamily: "'Assistant', sans-serif", color: 'black',  fontSize: '1.6em' }}>
                דירוג משתמש: {user.rating ?? 0}
            </Typography>
        </Box>
</Box>
</Box>

<Typography 
            variant="h3" 
            sx={{ 
                mb: 2, 
                fontFamily: 'Assistant', 
                borderBottom: '3px solid #f9db78', 
                textAlign: 'center',
                padding: '20px',
                width: 'fit-content', 
                margin: '0 auto', 
            }}
        >
            התרומות שלי
        </Typography>

            {/* Search Section */}
            <Box my={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
  <TextField
    variant="outlined"
    placeholder="חפש תרומה..."
    style={{ width: "25%", textAlign: 'right' }}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    InputProps={{
      startAdornment: <SearchIcon />,
    }}
    sx={{ direction: 'rtl' }}
  />
            </Box>

            {/* Sort and Filter Section */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" flexWrap="wrap" gap={2}>
                <Box display="flex" gap={2} flexWrap="wrap" justifyContent={"flex-end"}>
                    <TextField
                        select
                        label="מיין לפי"
                        value={sortProperty}
                        onChange={(e) => handleSortChange(e.target.value as keyof Donation)}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        sx={{ direction: 'rtl' }}
                    >
                        <option value=""></option>
                        <option value="category">קטגוריה</option>
                        <option value="quantity">כמות</option>
                        <option value="condition">מצב הפריט</option>
                        <option value="status">סטטוס</option>
                        <option value="createdAt">תאריך יצירה</option>
                        <option value="updatedAt">תאריך עדכון</option>
                    </TextField>
                    <TextField
                        select
                        label="סדר"
                        value={sortOrder}
                        onChange={(e) => handleSortOrderChange(e.target.value as 'asc' | 'desc')}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                        sx={{ direction: 'rtl' }}
                    >
                        <option value="asc">סדר עולה</option>
                        <option value="desc">סדר יורד</option>
                    </TextField>
                </Box>

            </Box>

            {/* Quick Filters */}
            <Box display="flex" justifyContent="center" gap={2} my={4} flexWrap="wrap">
            <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={resetFilters}
                    sx={{ order: -1 }} // This moves the button to the first position
                >
                    הסר מסננים
                </Button>
                {['ממתין לאיסוף', 'נאסף', 'הגיע לעמותה', 'טרם הגיע לעמותה', 'נמסר בעמותה'].map(status => (
                    <Button
                        key={status}
                        variant={selectedFilters.status.includes(status) ? 'contained' : 'outlined'}
                        onClick={() => toggleFilter('status', status)}
                    >
                        {status}
                    </Button>
                ))}
                <Button
                    variant={selectedFilters.approved.includes('true') ? 'contained' : 'outlined'}
                    onClick={() => toggleFilter('approved', 'true')}
                >
                    מאושר
                </Button>
                <Button
                    variant={selectedFilters.approved.includes('false') ? 'contained' : 'outlined'}
                    onClick={() => toggleFilter('approved', 'false')}
                >
                    לא מאושר
                </Button>
            </Box>

            {/* Selected Filters */}
            <Box display="flex" flexWrap="wrap" gap={1} my={2}>
                {selectedFilters.status.map(filter => (
                    <Chip
                        key={filter}
                        label={filter}
                        onDelete={() => removeFilter('status', filter)}
                        deleteIcon={<ClearIcon />}
                        sx={{ backgroundColor: '#f0ad4e', color: 'white' }}
                    />
                ))}
                {selectedFilters.approved.map(filter => (
                    <Chip
                        key={filter}
                        label={filter === 'true' ? 'מאושר' : 'לא מאושר'}
                        onDelete={() => removeFilter('approved', filter)}
                        deleteIcon={<ClearIcon />}
                        sx={{ backgroundColor: '#f0ad4e', color: 'white' }}
                    />
                ))}
            </Box>

            {/* Donations List */}
            <Grid container spacing={3} my={4}>
                {filteredDonations.length > 0 ? (
                    filteredDonations.map((donation) => (
                        <Grid item xs={12} sm={6} md={4} key={donation._id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                                onClick={() => handleCardClick(donation)}
                            >
                                <CardContent  sx={{ direction: 'rtl', textAlign: 'right' }}>
                                    <img
                                        src={donation.image}
                                        alt={donation.itemName}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Typography variant="h6" my={2}>
                                        {donation.itemName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        סטטוס: {donation.status}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        אושר על ידי מנהל: {donation.approvedByAdmin === 'true' ? "כן" : "לא"}
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

            {donations.length > itemsToShow && (
                <Box display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={handleShowMoreClick}>
                        הצג עוד
                    </Button>
                </Box>
            )}

            <DonationModal
                
                show={showModal}
                onHide={handleCancelClick}
                donation={selectedDonation}
                onEditClick={handleSaveChanges}
                onDeleteClick={handleDeleteClick}
            />
        </Container>
    );
};

export default Profile;
