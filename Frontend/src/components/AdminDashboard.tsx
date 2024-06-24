import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import  dataService,{ CanceledError } from "../services/data-service";


const AdminPage = () => {
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    dataService.getAdmin()
      .then(( {data} ) => {
        console.log(data)
        setAdminData(data);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
  }, []);

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