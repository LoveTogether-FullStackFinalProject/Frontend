// import React from 'react';
import './AdminDashboard.css';

const AdminPage = () => {
  return (
    <div className="container">
      <div className="avatar">
      <img src='../assets/avatar.jpg'/>
      </div>
      <div className="row">
        <div className="label">שם:</div>
      </div>
      <div className="row">
        <div className="label">תפקיד:</div>
        
      </div>
      <div className="button-row">
        <button className="admin-button">עמוד הבית</button>
        <button className="admin-button">נהל תרומות</button>
        <button className="admin-button">דוחות נתונים</button>
        <button className="admin-button">נהל יוזרים</button>
      </div>
    </div>
  );
};

export default AdminPage;
