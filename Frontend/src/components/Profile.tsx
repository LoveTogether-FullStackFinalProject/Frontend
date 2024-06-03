import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductData } from './product';
import dataService, { CanceledError } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import logo from '../assets/logoVeahavtem.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  rating: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('donated');
  const [editDonationId, setEditDonationId] = useState<string | null>(null);
  const [editableDonation, setEditableDonation] = useState<Partial<ProductData>>({});

  const fetchData = useCallback(async () => {
    try {
      const { req: userReq } = dataService.getUser(userId!);
      const userResponse = await userReq;
      setUser(userResponse.data);

      const { req: productsReq } = dataService.getProducts();
      const productsResponse = await productsReq;
      setProducts(productsResponse.data);
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

  const handleEditClick = (donation: ProductData) => {
    setEditDonationId(donation._id);
    setEditableDonation(donation);
  };

  const handleDeleteClick = async (donationId: string) => {
    try {
      await dataService.deleteDonation(donationId);
      setProducts(products.filter((donation) => donation._id !== donationId));
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
      setProducts((prev) =>
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
      case 'donated':
        return products.filter(donation => donation.status === 'Approved');
      case 'pending':
        return products.filter(donation => donation.status === 'Pending');
      case 'notArrived':
        return products.filter(donation => donation.status === 'Not Arrived');
      case 'all':
      default:
        return products;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
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
          <img src="./../assets/person1.png" alt="User Avatar" className="avatar" />
          <span>שלום, {`${user.firstName} ${user.lastName}`}</span>
        </div>
      </header>
      <main className="profile-content">
        <div className="tabs">
          {['donated', 'pending', 'notArrived', 'all'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'donated' && 'תרומות שאושרו'}
              {tab === 'pending' && 'תרומות שלא אושרו'}
              {tab === 'notArrived' && 'תרומות שטרם הגיעו'}
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
                    placeholder="שם הפריט"
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
                    placeholder="סטטוס"
                  />
                  <textarea
                    name="description"
                    value={editableDonation.description || ''}
                    onChange={handleInputChange}
                    placeholder="תיאור פריט"
                  />
                  <button className="save-button" onClick={handleSaveClick}>שמור</button>
                  <button className="cancel-button" onClick={handleCancelClick}>בטל</button>
                </div>
              ) : (
                <div className="donation-details">
                  <p>שם הפריט: {donation.category}</p>
                  <p>כמות: {donation.amount}</p>
                  <p>סטטוס: <span className={getStatusClass(donation.status)}>{donation.status}</span></p>
                  <p>תיאור פריט: {donation.description}</p>
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