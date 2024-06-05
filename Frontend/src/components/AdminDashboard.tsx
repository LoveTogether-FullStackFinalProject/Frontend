import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const adminId = '665883191451b6b5dd7f4059';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`/admin/${adminId}`);
        console.log('Admin data:', response.data);
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    

    fetchAdminData();
  }, [adminId]);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <div className="avatar">
        <img src="../assets/avatar.jpg" alt="Avatar" />
      </div>
      <div className="row">
        <div className="label">שם:</div>
        <div>{adminData.name}</div>
      </div>
      <div className="row">
        <div className="label">אימייל:</div>
        <div>{adminData.email}</div>
      </div>
      <div className="button-row">
        <button className="admin-button" onClick={() => handleButtonClick('/')}>עמוד הבית</button>
        <button className="admin-button" onClick={() => handleButtonClick('/manage-donations')}>נהל תרומות</button>
        <button className="admin-button" onClick={() => handleButtonClick('/reports')}>דוחות נתונים</button>
        <button className="admin-button" onClick={() => handleButtonClick('/manage-users')}>נהל יוזרים</button>
      </div>
    </div>
  );
};

export default AdminPage;