import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Donation } from './donation';
import dataService, { CanceledError } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import logo from '../assets/logoVeahavtem.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';
import Donor, { DonorData } from './donorData';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<DonorData | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('donated');
  const [editDonationId, setEditDonationId] = useState<string | null>(null);
  const [editableDonation, setEditableDonation] = useState<Partial<Donation>>({});

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

  const handleEditClick = (donation: Donation) => {
    setEditDonationId(donation._id);
    setEditableDonation(donation);
  };

  const handleDeleteClick = async (donationId: string) => {
    try {
      await dataService.deleteDonation(donationId);
      setDonations(donations.filter((donation) => donation._id !== donationId));
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
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

  const filterDonations = () => {
    switch (activeTab) {
      case 'אושר':
        return donations.filter(donation => donation.status === 'אושר');
      case 'ממתין לאישור':
        return donations.filter(donation => donation.status === 'ממתין לאישור');
      case 'טרם נמסר':
        return donations.filter(donation => donation.status === 'טרם נמסר');
      case 'all':
      default:
        return donations;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'אושר':
        return 'status-approved';
      case 'ממתין לאישור':
        return 'status-pending';
      default:
        return 'status-not-approved';
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
          <Link to="/login">התנתק</Link>
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
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'אושר' && 'תרומות שאושרו'}
              {tab === 'ממתין לאישור' && 'תרומות שלא אושרו'}
              {tab === 'טרם נמסר' && 'תרומות שטרם הגיעו'}
              {tab === 'all' && 'התרומות שלי'}
            </button>
          ))}
        </div>
        <div className="donations-list">
          {filterDonations().map((donation) => (
            <div key={donation._id} className="donation-card">
              {editDonationId === donation._id ? (
                <div className="donation-details">
                  <input
                    type="text"
                    name="category"
                    value={editableDonation.category || ''}
                    onChange={handleInputChange}
                    placeholder="קטגוריה"
                  />
                  <input
                    type="text"
                    name="productType"
                    value={editableDonation.productType || ''}
                    onChange={handleInputChange}
                    placeholder="סוג הפריט"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={editableDonation.amount || ''}
                    onChange={handleInputChange}
                    placeholder="כמות"
                  />
                  <input
                    type="text"
                    name="itemCondition"
                    value={editableDonation.itemCondition || ''}
                    onChange={handleInputChange}
                    placeholder="מצב הפריט"
                  />
                  <textarea
                    name="description"
                    value={editableDonation.description || ''}
                    onChange={handleInputChange}
                    placeholder="תיאור"
                  />
                  <input
                    type="date"
                    name="expirationDate"
                    value={editableDonation.expirationDate ? new Date(editableDonation.expirationDate).toISOString().substring(0, 10) : ''}
                    onChange={handleInputChange}
                    placeholder="תוקף"
                  />
                  <input
                    type="text"
                    name="pickUpAddress"
                    value={editableDonation.pickUpAddress || ''}
                    onChange={handleInputChange}
                    placeholder="כתובת לאיסוף"
                  />
                  <button className="save-button" onClick={handleSaveClick}>שמור</button>
                  <button className="cancel-button" onClick={handleCancelClick}>בטל</button>
                </div>
              ) : (
                <div className="donation-details">
                  <p>קטגוריה: {donation.category}</p>
                  <p>סוג הפריט: {donation.productType}</p>
                  <p>כמות: {donation.amount}</p>
                  <p>מצב הפריט: {donation.itemCondition}</p>
                  <p>תיאור: {donation.description}</p>
                  <p>תוקף: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                  <p>כתובת לאיסוף: {donation.pickUpAddress}</p>
                  <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
                  <button className="edit-button" onClick={() => handleEditClick(donation)}>ערוך פריט</button>
                  <button className="delete-button" onClick={() => handleDeleteClick(donation._id)}>מחק פריט</button>
                </div>
              )}
            </div>
          ))}
        </div>
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
