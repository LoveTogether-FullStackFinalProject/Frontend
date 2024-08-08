import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import dataService, { CanceledError } from "../services/data-service";
import { DonorData } from './donorData';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AdminPage = () => {
  const [adminData, setAdminData] = useState<DonorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { req, abort } = dataService.getUser(userId!);
        const userResponse = await req;
        if (userResponse.data.isAdmin) {
          setAdminData(userResponse.data);
        } else {
          setError('User is not an admin');
        }
      } catch (err) {
        if (err instanceof CanceledError) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchData();
  }, [userId]);

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      dataService.getUser(userId).req.then((res) => {
        setIsAdmin(res.data.isAdmin);
        console.log("isAdmin:", res.data.isAdmin);
      });
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="error-container">
        <p>שגיאה: אינך מחובר בתור מנהל</p>
        <button onClick={() => navigate('/mainPage')} className="error-button">התחבר בתור מנהל</button>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!adminData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="background-section text-center">
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
