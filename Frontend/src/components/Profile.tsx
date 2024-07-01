import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataService, { CanceledError, logout } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import logo from '../assets/logoVeahavtem.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';
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
        } catch (error) {
            if (error instanceof CanceledError) return;
            console.error('Error fetching data:', error);
            setError('Error fetching data');
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

    const filterDonations = () => {
        const filtered = donations.filter((donation) => {
            switch (activeTab) {
                case 'אושר':
                    return donation.status === 'אושר';
                case 'ממתין לאישור':
                    return donation.status === 'ממתין לאישור';
                case 'טרם נמסר':
                    return donation.status === 'טרם נמסר';
                case 'all':
                default:
                    return true;
            }
        });
        setFilteredDonations(filtered.slice(0, itemsToShow));
    };

    const handleShowMoreClick = () => {
        setItemsToShow(itemsToShow + 8);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setItemsToShow(8);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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
        console.log('Editing donation:', donation); // Debug statement
        setEditDonationId(donation._id);
        setEditableDonation(donation);
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log('Input change:', name, value); // Debug statement
        setEditableDonation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        console.log('Saving donation:', editableDonation); // Debug statement
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
        console.log('Cancel edit'); // Debug statement
        setEditDonationId(null);
        setEditableDonation({});
        setShowModal(false);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'אושר':
                return 'status-approved';
            case 'ממתין לאישור':
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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="loading">{error}</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="profile-page">
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
                <nav>
                    <Link to="/mainPage">עמוד הבית</Link>
                    <Link to="/donate">שליחת תרומה</Link>
                    <button onClick={handleLogout}>התנתק</button>
                </nav>
                <div className="user-info">
                    <img src="../assets/person1.png" alt="User Avatar" className="avatar" />
                    <span>שלום, {user.firstName} {user.lastName}</span>
                </div>
            </header>
            <main className="profile-content">
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
                    {filteredDonations.map((donation) => (
                        <div
                            key={donation._id}
                            className={`donation-card ${getStatusClass(donation.status)}`}
                            onClick={() => handleCardClick(donation)}
                        >
                            <h3>{donation.itemName}</h3>
                            <p>סטטוס: {donation.status}</p>
                            <p>תיאור: {donation.description}</p>
                        </div>
                    ))}
                </div>
                {filteredDonations.length > itemsToShow && (
                    <button className="show-more" onClick={handleShowMoreClick}>
                        Show More
                    </button>
                )}
            </main>
            <footer className="footer">
                <p>פרטי יצירת קשר</p>
                <div className="social-media">
                    <a href="https://www.facebook.com/veahavtem/" target="_blank" rel="noopener noreferrer">
                        <img src={facebookLogo} alt="Facebook" />
                    </a>
                    <a href="https://www.instagram.com/veahavtem/" target="_blank" rel="noopener noreferrer">
                        <img src={instagramLogo} alt="Instagram" />
                    </a>
                </div>
                <p>עמותת וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ &copy; 2023</p>
            </footer>
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
