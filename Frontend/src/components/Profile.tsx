import React, { useState, useEffect, useCallback } from 'react';
import dataService, { CanceledError } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import { Donation } from './donation';
import { DonorData } from './donorData';
import DonationModal from './DonationModal';
import { Avatar } from '@mui/material';

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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'ממתין לאיסוף מבית התורם':
                return 'status-awaiting-pickup';
            case 'נמסר בעמותה':
                return 'status-delivered-to-charity';
            case 'ממתין לאיסוף':
                return 'status-awaiting-collection';
            case 'נמסר':
                return 'status-delivered';
            default:
                return '';
        }
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

    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="profile-page">
            <div className="user-info">
                <Avatar className='Avatar-profile' alt="Remy Sharp" src={user.image} />
                <span className='profile-header'>שלום, {user.firstName} {user.lastName}</span>
            </div>
            <main className="profile-content">
                <div className="rating-status" style={{ direction: "rtl" }}>
                    דירוג משתמש: {user.rating ?? 0}
                </div>
                <div className="my-donations-title">
                    התרומות שלי
                </div>

                <div className="search-bar">
                    <input
                        className='search-input'
                        type="text"
                        placeholder="חפש תרומה..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="sort-section">
                    <select
                        value={sortProperty}
                        onChange={(e) => handleSortChange(e.target.value as keyof Donation)}
                    >   
                        <option value="">מיין לפי</option>
                        <option value="category">קטגוריה</option>
                        <option value="quantity">כמות</option>
                        <option value="condition">מצב הפריט</option>
                        <option value="status">סטטוס</option>
                        <option value="pickUpAddress">כתובת לאיסוף</option>
                        <option value="createdAt">תאריך יצירה</option>
                        <option value="updatedAt">תאריך עדכון</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => handleSortOrderChange(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="asc">סדר עולה</option>
                        <option value="desc">סדר יורד</option>
                    </select>
                </div>

                <div className="filter-section">
                    <h4>סינון לפי:</h4>
                    <div className="filter-buttons">
                        {['ממתין לאיסוף מבית התורם', 'נמסר בעמותה', 'ממתין לאיסוף', 'נמסר'].map(status => (
                            <button
                                key={status}
                                onClick={() => toggleFilter('status', status)}
                                className={selectedFilters.status.includes(status) ? 'active' : ''}
                            >
                                {status}
                            </button>
                        ))}
                        <button
                            onClick={() => toggleFilter('approved', 'true')}
                            className={selectedFilters.approved.includes('true') ? 'active' : ''}
                        >
                            מאושר
                        </button>
                        <button
                            onClick={() => toggleFilter('approved', 'false')}
                            className={selectedFilters.approved.includes('false') ? 'active' : ''}
                        >
                            לא מאושר
                        </button>
                    </div>
                    <button className="reset-filters" onClick={resetFilters}>
                        הסר מסננים
                    </button>
                </div>

                <div className="selected-filters">
                    {selectedFilters.status.map(filter => (
                        <span key={filter} onClick={() => removeFilter('status', filter)}>
                            {filter} ✖
                        </span>
                    ))}
                    {selectedFilters.approved.map(filter => (
                        <span key={filter} onClick={() => removeFilter('approved', filter)}>
                            {filter === 'true' ? 'מאושר' : 'לא מאושר'} ✖
                        </span>
                    ))}
                </div>

                <div className="donations-list">
                    {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation) => (
                            <div
                                key={donation._id}
                                className={`donation-card ${getStatusClass(donation.status)}`}
                                onClick={() => handleCardClick(donation)}
                            >
                                <img src={donation.image} alt={donation.itemName} />
                                <h5>{donation.itemName}</h5>
                                <p>סטטוס: {donation.status}</p>
                                <p>אושר על ידי מנהל: {donation.approvedByAdmin === 'true' ? "כן" : "לא"}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-donations-container">
                            <p>לא נמצאו תרומות</p>
                        </div>
                    )}
                </div>
                {donations.length > itemsToShow && (
                    <button className="show-more" onClick={handleShowMoreClick}>
                        הצג עוד
                    </button>
                )}
            </main>

            <DonationModal
                show={showModal}
                onHide={handleCancelClick}
                donation={selectedDonation}
                onEditClick={handleSaveChanges}
                onDeleteClick={handleDeleteClick}
            />
        </div>
    );
};

export default Profile;
