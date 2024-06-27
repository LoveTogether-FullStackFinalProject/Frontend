import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataService, { CanceledError, logout } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
// import logo from '../assets/logoVeahavtem.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';
import { userDonation } from './userDonation';
import { DonorData } from './donorData';

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

    useEffect(() => {
        if (user) {
          const newRating = updateRating(donations.length);
          dataService.updateUserData(user._id, { rating: newRating });
        }
      }, [donations]);

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
        setEditDonationId(donation._id);
        setEditableDonation(donation);
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
        } catch (error) {
            console.error('Error updating donation:', error);
        }
    };

    const handleCancelClick = () => {
        setEditDonationId(null);
        setEditableDonation({});
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'אושר':
                return 'text-success';
            case 'ממתין לאישור':
                return 'text-warning';
            case 'טרם נמסר':
                return 'text-danger';
            default:
                return '';
        }
    };

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
    if (error) return <div className="loading">{error}</div>;
    if (!user) return <div className="loading">User not found</div>;

    return (
        <div className="container-fluid profile-page vh-100 d-flex flex-column">
            {/* <header className="header d-flex justify-content-between align-items-center py-2 px-4 bg-brown text-white">
                <img src={logo} alt="Logo" className="logo" />
                <nav className="d-flex">
                    <Link className="btn btn-light me-2" to="/mainPage">עמוד הבית</Link>
                    <Link className="btn btn-light me-2" to="/uploadProduct">שליחת תרומה</Link>
                    <button className="btn btn-light" onClick={handleLogout}>התנתק</button>
                </nav>
                <div className="user-info d-flex align-items-center">
                    <img src="../assets/person1.png" alt="User Avatar" className="avatar rounded-circle me-2" />
                    <span>שלום, {user.firstName} {user.lastName}</span>
                </div>
            </header> */}
            <main className="profile-content flex-grow-1 d-flex flex-column align-items-center py-4">
                <div className="tabs d-flex justify-content-around mb-4 w-100">
                    {['אושר', 'ממתין לאישור', 'טרם נמסר', 'all'].map((tab) => (
                        <button
                            key={tab}
                            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab === 'אושר' && 'תרומות שאושרו'}
                            {tab === 'ממתין לאישור' && 'תרומות שלא אושרו'}
                            {tab === 'טרם נמסר' && 'תרומות שטרם הגיעו'}
                            {tab === 'all' && 'התרומות שלי'}
                        </button>
                    ))}
                </div>

                <div className="rating-status">
                     הדירוג שלך הוא: {user.rating ?? 0}
                </div>

                <div className="donations-list row w-100 justify-content-center">
                    {filteredDonations.map((donation) => (
                        <div key={donation._id} className="donation-card col-lg-3 col-md-4 col-sm-6 mb-4 p-2">
                            {editDonationId === donation._id ? (
                                <div className="edit-form p-2 border rounded bg-light">
                                    <input type="text" name="itemName" value={editableDonation.itemName || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Item Name" />
                                    <input type="text" name="category" value={editableDonation.category || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Category" />
                                    <input type="number" name="quantity" value={editableDonation.quantity || 0} onChange={handleInputChange} className="form-control mb-2" placeholder="Quantity" />
                                    <input type="text" name="condition" value={editableDonation.condition || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Condition" />
                                    <textarea name="description" value={editableDonation.description || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Description"></textarea>
                                    <input type="date" name="expirationDate" value={new Date(editableDonation.expirationDate!).toISOString().split('T')[0]} onChange={handleInputChange} className="form-control mb-2" />
                                    <input type="text" name="pickupAddress" value={editableDonation.pickupAddress || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Pick Up Address" />
                                    <input type="text" name="status" value={editableDonation.status || ''} onChange={handleInputChange} className="form-control mb-2" placeholder="Status" />
                                    {editableDonation.image && <input type="text" name="image" value={editableDonation.image} onChange={handleInputChange} className="form-control mb-2" placeholder="Image" />}
                                    <button className="btn btn-success me-2" onClick={handleSaveClick}>שמירה</button>
                                    <button className="btn btn-danger" onClick={handleCancelClick}>ביטול</button>
                                </div>
                            ) : (
                                <div className="donation-details p-2 border rounded bg-light">
                                    <p>שם הפריט: {donation.itemName}</p>
                                    <p>קטגוריה: {donation.category}</p>
                                    <p>כמות: {donation.quantity}</p>
                                    <p>מצב הפריט: {donation.condition}</p>
                                    <p>תיאור: {donation.description}</p>
                                    <p>תאריך תפוגה: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                                    <p>כתובת לאיסוף: {donation.pickupAddress}</p>
                                    <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
                                    {donation.image && <p>תמונה: <img src={donation.image} alt={donation.itemName} className="img-fluid" /></p>}
                                    <button className="btn btn-primary me-2" onClick={() => handleEditClick(donation)}>ערוך פריט</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteClick(donation._id)}>מחק פריט</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {filteredDonations.length < donations.filter((donation) => {
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
                }).length && (
                    <button className="btn btn-primary mt-4" onClick={handleShowMoreClick}>
                        הצג עוד
                    </button>
                )}
            </main>
            <footer className="footer bg-brown text-white text-center py-3">
                <p>© 2024 עמותת ואהבתם ביחד. כל הזכויות שמורות.</p>
                <div className="social-media d-flex justify-content-center">
                    <a href="https://www.facebook.com/veahavtembeyahad/" target="_blank" rel="noopener noreferrer" className="me-2">
                        <img src={facebookLogo} alt="Facebook" className="img-fluid" style={{ width: '30px' }} />
                    </a>
                    <a href="https://www.instagram.com/veahavtem_beyahad/?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                        <img src={instagramLogo} alt="Instagram" className="img-fluid" style={{ width: '30px' }} />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Profile;

