import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link , useNavigate} from 'react-router-dom';
import { Donation } from './donation';
import dataService, { CanceledError , logout} from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import logo from '../assets/logoVeahavtem.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/facebookLogo.png';
import Donor, { DonorData } from './donorData';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<DonorData | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');
  const [itemsToShow, setItemsToShow] = useState(8);
  const navigate = useNavigate();


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
              <div className="donation-details">
                <p>קטגוריה: {donation.category}</p>
                <p>סוג הפריט: {donation.productType}</p>
                <p>כמות: {donation.amount}</p>
                <p>מצב הפריט: {donation.itemCondition}</p>
                <p>תיאור: {donation.description}</p>
                <p>תוקף: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                <p>כתובת לאיסוף: {donation.pickUpAddress}</p>
                <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
              </div>
            </div>
          ))}
        </div>
        <div className="donations-list">
          {filteredDonations.map((donation) => (
            <div key={donation._id} className="donation-card">
              <div className="donation-details">
                <p>קטגוריה: {donation.category}</p>
                <p>סוג הפריט: {donation.productType}</p>
                <p>כמות: {donation.amount}</p>
                <p>מצב הפריט: {donation.itemCondition}</p>
                <p>תיאור: {donation.description}</p>
                <p>תוקף: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                <p>כתובת לאיסוף: {donation.pickUpAddress}</p>
                <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
              </div>
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

