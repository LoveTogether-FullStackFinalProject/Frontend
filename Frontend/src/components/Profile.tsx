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
                return 'status-approved';
            case 'ממתין לאישור':
                return 'status-pending';
            case 'טרם נמסר':
                return 'status-not-approved';
            default:
                return '';
        }
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
                          {tab === 'all' && 'התרומות שלי'}
                      </button>
                  ))}
              </div>
              <div className="donations-list">
                  {filteredDonations.map((donation) => (
                      <div key={donation._id} className="donation-card">
                          {editDonationId === donation._id ? (
                              <div className="edit-form">
                                  <input type="text" name="itemName" value={editableDonation.itemName || ''} onChange={handleInputChange} />
                                  <input type="text" name="category" value={editableDonation.category || ''} onChange={handleInputChange} />
                                  <input type="number" name="quantity" value={editableDonation.quantity || 0} onChange={handleInputChange} />
                                  <input type="text" name="condition" value={editableDonation.condition || ''} onChange={handleInputChange} />
                                  <textarea name="description" value={editableDonation.description || ''} onChange={handleInputChange}></textarea>
                                  <input type="date" name="expirationDate" value={new Date(editableDonation.expirationDate!).toISOString().split('T')[0]} onChange={handleInputChange} />
                                  <input type="text" name="pickupAddress" value={editableDonation.pickupAddress || ''} onChange={handleInputChange} />
                                  <input type="text" name="status" value={editableDonation.status || ''} onChange={handleInputChange} />
                                  {editableDonation.image && <input type="text" name="image" value={editableDonation.image} onChange={handleInputChange} />}
                                  <button className="save-button" onClick={handleSaveClick}>Save</button>
                                  <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
                              </div>
                          ) : (
                              <div className="donation-details">
                                  <p>שם הפריט: {donation.itemName}</p>
                                  <p>קטגוריה: {donation.category}</p>
                                  <p>כמות: {donation.quantity}</p>
                                  <p>מצב הפריט: {donation.condition}</p>
                                  <p>תיאור: {donation.description}</p>
                                  <p>תאריך תפוגה: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                                  <p>כתובת לאיסוף: {donation.pickupAddress}</p>
                                  <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
                                  {donation.image && <p>תמונה: <img src={donation.image} alt={donation.itemName} /></p>}
                                  <button className="edit-button" onClick={() => handleEditClick(donation)}>Edit</button>
                                  <button className="delete-button" onClick={() => handleDeleteClick(donation._id)}>Delete</button>
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
                  <button className="load-more-button" onClick={handleShowMoreClick}>
                      הצג עוד
                  </button>
              )}
          </main>
          <footer className="footer">
              <p>© 2024 עמותת ואהבתם ביחד. כל הזכויות שמורות.</p>
              <div className="social-media">
                  <a href="https://www.facebook.com/veahavtembeyahad/" target="_blank" rel="noopener noreferrer">
                      <img src={facebookLogo} alt="Facebook" />
                  </a>
                  <a href="https://www.instagram.com/veahavtem_beyahad/?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                      <img src={instagramLogo} alt="Instagram" />
                  </a>
              </div>
          </footer>
      </div>
  );
};

export default Profile;