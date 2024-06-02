import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductData } from './product';
import dataService, { CanceledError } from '../services/data-service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

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

  useEffect(() => {
    console.log(`getDonorById:${userId}`); // Log userId for debugging
    const fetchData = async () => {
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
    };

    fetchData();
  }, [userId]);

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
    setEditableDonation({ ...editableDonation, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      await dataService.updateDonation(editDonationId!, editableDonation);
      setProducts(products.map((donation) => (donation._id === editDonationId ? { ...donation, ...editableDonation } : donation)));
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">{error}</div>;
  if (!user) return <div className="loading">User not found</div>;

  return (
    <div className="profile-page">
      <header className="header">
        <img src="logo.png" alt="Logo" className="logo" />
        <nav>
          <a href="/mainPage">עמוד הבית</a>
          <a href="/donate">שליחת תרומה</a>
          <a href="/login">התנתק</a>
        </nav>
        <div className="user-info">
          <img src="user-avatar.png" alt="User Avatar" className="avatar" />
          <span>שלום, {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</span>
        </div>
      </header>
      <main className="profile-content">
        <div className="tabs">
          <button className={activeTab === 'donated' ? 'active' : ''} onClick={() => setActiveTab('donated')}>תרומות שאושרו</button>
          <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>תרומות שלא אושרו</button>
          <button className={activeTab === 'notArrived' ? 'active' : ''} onClick={() => setActiveTab('notArrived')}>תרומות שטרם הגיעו</button>
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>התרומות שלי</button>
        </div>
        <div className="donations-list">
          {products.map((donation) => (
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
                  <p>סטטוס: {donation.itemCondition}</p>
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
        &copy; 2024 Your Company. כל הזכויות שמורות.
      </footer>
    </div>
  );
};

export default Profile;
