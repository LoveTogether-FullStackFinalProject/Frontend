import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import dataService, { CanceledError } from "../services/data-service";
import { DonorData } from './donorData';

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

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!adminData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="avatar">
        <img src="../assets/avatar.jpg" alt="Avatar" />
      </div>
      <div className="row">
        <div className="label">שם:</div>
        <div className="value">{adminData.firstName}</div>
      </div>
      <div className="row">
        <div className="label">אימייל:</div>
        <div className="value">{adminData.email}</div>
      </div>
      <div className="button-row">
        <button className="admin-button" onClick={() => handleButtonClick('/')}>עמוד הבית</button>
        <button className="admin-button" onClick={() => handleButtonClick('/manageDonations')}>נהל תרומות</button>
        <button className="admin-button" onClick={() => handleButtonClick('/statistics')}>דוחות נתונים</button>
        <button className="admin-button" onClick={() => handleButtonClick('/manage-users')}>נהל יוזרים</button>
      </div>
    </div>
  );
};

export default AdminPage;
