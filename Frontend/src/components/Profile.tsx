import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Donation {
  _id: string;
  category: string;
  productType: string;
  amount: number;
  itemCondition: string;
  expirationDate: Date;
  description: string;
  pickUpAddress: string;
}

interface User {
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
    const [donations, setDonations] = useState<Donation[]>([]);
    const [activeTab, setActiveTab] = useState<'profile' | 'donations'>('profile');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/profile/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchDonations = async () => {
        try {
          const response = await axios.get(`/api/profile/donations/${userId}`);
          setDonations(response.data);
        } catch (error) {
          console.error('Error fetching donations:', error);
        }
    };    
    fetchUser();
    fetchDonations();
  }, [userId]);

  if (!user) return <div>טוען...</div>;

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab('profile')}>פרופיל</button>
        <button onClick={() => setActiveTab('donations')}>תרומות</button>
      </div>

      {activeTab === 'profile' && (
        <div>
          <h1>פרופיל של {user.firstName} {user.lastName}</h1>
          <p>אימייל: {user.email}</p>
          <p>כתובת: {user.address}</p>
          <p>מספר טלפון: {user.phoneNumber}</p>
          <p>דירוג: {user.rating}</p>
        </div>
      )}

      {activeTab === 'donations' && (
        <div>
          <h2>תרומות</h2>
          <ul>
            {donations.map(donation => (
              <li key={donation._id}>
                {donation.category} - {donation.productType} - {donation.amount} - {donation.itemCondition} - {new Date(donation.expirationDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;