/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from 'react';
import dataService, { CanceledError } from '../services/data-service'; // Adjust import paths as necessary
import { Donation } from './donation'; // Adjust import paths as necessary
import { DonorData } from './donorData'; // Adjust import paths as necessary
import { Avatar } from '@mui/material';
import DonationModal from './DonationModal';

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
     
    const userId = localStorage.getItem('userID') || '';
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        
        try {
            const { req: userReq } = dataService.getUser(userId);
            const userResponse = await userReq;
            setUser(userResponse.data);

            const { req: donationsReq } = dataService.getDonationsByUser(userId);
            const donationsResponse = await donationsReq;
            setDonations(donationsResponse.data);
            setFilteredDonations(donationsResponse.data); 
        } catch (error) {
            if (error instanceof CanceledError) return;

            console.error('Error fetching data:', error);
            // Consider implementing a user-friendly error message display here
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        applyFilters();
    }, [donations, searchQuery, selectedFilters, itemsToShow]);

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

    const handleDeleteClick = async (donationId: string) => {
        try {
            await dataService.deleteDonation(donationId);
            setDonations(donations.filter((donation) => donation._id !== donationId));
        } catch (error) {
            console.error('Error deleting donation:', error);
            // Consider implementing a user-friendly error message display here
        }
    };

    const handleEditClick = (donation: Donation) => {
        setSelectedDonation(donation);
        setShowModal(true);
    };

    const handleCancelClick = () => {
        setSelectedDonation(null);
        setShowModal(false);
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

    const handleCardClick = (donation: Donation) => {
        setSelectedDonation(donation);
        setShowModal(true);
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
                <div className="filter-section">
                    <h4>בחר מסננים:</h4>
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
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            /> 
        </div>
    );
};

export default Profile;