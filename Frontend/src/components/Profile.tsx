import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataService, { CanceledError, logout } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import { userDonation } from './userDonation';
import { DonorData } from './donorData';
import DonationModal from './DonationModal'; // Import the new modal component

const Profile: React.FC = () => {
    const [user, setUser] = useState<DonorData | null>(null);
    const [donations, setDonations] = useState<userDonation[]>([]);
    const [filteredDonations, setFilteredDonations] = useState<userDonation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState('all');
    const [itemsToShow, setItemsToShow] = useState(8);
    const [editDonationId, setEditDonationId] = useState<string | null>(null);
    const [editableDonation, setEditableDonation] = useState<Partial<userDonation>>({});
    const [showModal, setShowModal] = useState(false); // Modal state
    const [selectedDonation, setSelectedDonation] = useState<userDonation | null>(null); // Selected donation state
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const fetchData = useCallback(async () => {
        try {
            const { req: userReq } = dataService.getUser(userId!);
            const userResponse = await userReq;
            setUser(userResponse.data);

            const { req: donationsReq } = dataService.getDonationsByUser(userId!);
            const donationsResponse = await donationsReq;
            setDonations(donationsResponse.data);

            // Log all statuses to understand what values they have
            donationsResponse.data.forEach(donation => {
                console.log('Donation status:', donation.status);
            });
        } catch (error) {
            if (error instanceof CanceledError) return;
            console.error('Error fetching data:', error);

            if (error.response) {
                if (error.response.status === 404) {
                    setDonations([]);
                } else {
                    console.error('Server responded with:', error.response.status, error.response.data);
                    setError(`Error fetching data: ${error.response.status} - ${error.response.data}`);
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('Error fetching data: No response received from server');
            } else {
                console.error('Error setting up request:', error.message);
                setError(`Error fetching data: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        filterDonations();
    }, [donations, activeTab, itemsToShow]);

    useEffect(() => {
        if (user) {
          const newRating = updateRating(donations.length);
          dataService.updateUserData(user._id, { rating: newRating });
        }
      }, [donations]);

    const filterDonations = () => {
        console.log('Filtering donations with activeTab:', activeTab);
        const filtered = donations.filter((donation) => {
            switch (activeTab) {
                case 'אושר':
                    return donation.approvedByAdmin === 'true';
                case 'ממתין לאישור':
                    return donation.approvedByAdmin === 'false';
                case 'טרם נמסר':
                    return donation.status !== 'הגיע לעמותה' && donation.status !== 'נמסר';
                case 'all':
                default:
                    return true;
            }
        });
        console.log('Filtered donations:', filtered);
        setFilteredDonations(filtered.slice(0, itemsToShow));
    };

    const handleShowMoreClick = () => {
        setItemsToShow(itemsToShow + 8);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setItemsToShow(8);
    };

    const handleDeleteClick = async (donationId: string) => {
        try {
            await dataService.deleteDonation(donationId);
            setDonations(donations.filter((donation) => donation._id !== donationId));
        } catch (error) {
            console.error('Error deleting donation:', error);
            setError('Error deleting donation');
        }
    };

    const handleEditClick = (donation: userDonation) => {
        setEditDonationId(donation._id);
        setEditableDonation(donation);
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableDonation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        try {
            await dataService.updateDonation(editDonationId!, editableDonation);
            setDonations((prev) =>
                prev.map((donation) =>
                    donation._id === editDonationId ? { ...donation, ...editableDonation } : donation
                )
            );
            setEditDonationId(null);
            setEditableDonation({});
            setShowModal(false);
        } catch (error) {
            console.error('Error updating donation:', error);
        }
    };

    const handleCancelClick = () => {
        setEditDonationId(null);
        setEditableDonation({});
        setShowModal(false);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'הגיע לעמותה':
                return 'status-approved';
            case 'נמסר':
                return 'status-pending';
            case 'טרם נמסר':
                return 'status-not-approved';
            default:
                return '';
        }
    };

    const handleCardClick = (donation: userDonation) => {
        setSelectedDonation(donation);
        setShowModal(true);
    };

    function updateRating(donations: number) {
        if (donations >= 20) {
          return "⭐⭐⭐⭐⭐";
        } else if (donations >= 15) {
          return "⭐⭐⭐⭐";
        } else if (donations >= 10) {
          return "⭐⭐⭐";
        } else if (donations >= 5) {
          return "⭐⭐";
        } else {
          return "⭐";
        }
      }

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="loading">{error}</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="profile-page">        
            <div className="user-info">
                    <img src="../assets/person1.png" alt="User Avatar" className="avatar" />
                    <span>שלום, {user.firstName} {user.lastName}</span>
                </div> 

            <main className="profile-content">
                <div className="rating-status" style={{direction:"rtl"}}>
                     דירוג: {user.rating ?? 0}
                </div>
                

                <div className="tabs">
                    {['אושר', 'ממתין לאישור', 'טרם נמסר', 'all'].map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab === 'אושר' && 'תרומות שאושרו'}
                            {tab === 'ממתין לאישור' && 'תרומות שלא אושרו'}
                            {tab === 'טרם נמסר' && 'תרומות שטרם הגיעו'}
                            {tab === 'all' && 'כל התרומות'}
                        </button>
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
                {filteredDonations.length > itemsToShow && (
                    <button className="show-more" onClick={handleShowMoreClick}>
                        הצג עוד
                    </button>
                )}
            </main>
           
            <DonationModal
                show={showModal}
                onHide={handleCancelClick} // Use handleCancelClick to close modal
                donation={selectedDonation}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />
        </div>
    );
};

export default Profile;
