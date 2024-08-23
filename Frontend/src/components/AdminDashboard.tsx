import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import dataService, { CanceledError } from '../services/data-service';
import { DonorData } from './donorData';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminPage = () => {
  const [adminData, setAdminData] = useState<DonorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Initialize as null to represent an unknown state
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { req } = dataService.getUser(userId!);
        const userResponse = await req;
        if (userResponse.data.isAdmin) {
          setAdminData(userResponse.data);
          setIsAdmin(true); // Set admin status to true
        } else {
          setIsAdmin(false); // Set admin status to false if the user is not an admin
        }
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError(err instanceof Error ? err.message : String(err));
        setIsAdmin(false); // Set admin status to false if there is an error
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [userId]);

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  // Handle the scenario where the admin check is still in progress
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Handle the scenario where the user is confirmed not to be an admin
  if (isAdmin === false) {
    return (
      <div className="error-container">
        <p style={{ fontFamily: 'Assistant' }}>שגיאה: אינך מחובר בתור מנהל</p>
      </div>
    );
  }

  // Handle the scenario where there was an error fetching user data
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Handle the scenario where admin data is not yet available
  if (!adminData) {
    return <div className="loading">Loading...</div>;
  }

  // Render the admin page when the user is confirmed as an admin
  return (
    <div className="admin-page">
      <div className="background-section-text-center">
        <h1 className="admin-title">ניהול ובקרה</h1>
      </div>
      <div className="cards-container">
        <div className="card" onClick={() => handleButtonClick('/')}>
          <i className="fas fa-home card-icon"></i>
          <p>עמוד הבית</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/manageDonations')}>
          <i className="fas fa-hand-holding-heart card-icon"></i>
          <p>נהל תרומות</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/statistics')}>
          <i className="fas fa-chart-line card-icon"></i>
          <p>דוחות נתונים</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/manageUsers')}>
          <i className="fas fa-users card-icon"></i>
          <p>נהל יוזרים</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/uploadRequestedProduct')}>
          <i className="fas fa-upload card-icon"></i>
          <p>העלאת בקשת פריט</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/manageRequestedDonations')}>
          <i className="fas fa-clipboard-list card-icon"></i>
          <p>נהל תרומות שהעמותה מבקשת</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/manageMainPageUsers')}>
          <i className="fas fa-users-cog card-icon"></i>
          <p>נהל הצגת תורמים בעמוד הראשי</p>
        </div>
        <div className="card" onClick={() => handleButtonClick('/newLiveDonation')}>
          <i className="fas fa-donate card-icon"></i>
          <p>תרומה חדשה</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
