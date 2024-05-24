import React from 'react';

// AdminProfile component
const AdminProfile: React.FC = () => {
  return (
    <div>
      <div className="profile-icon"></div>
      <div>
        <p>שם מלא: </p>
        <p>תפקיד: </p>
      </div>
    </div>
  );
};

// ManageDonations component
const ManageDonations: React.FC = () => {
  return (
    <div>
      <h3>מעבר לעמוד הבית תרומות</h3>
      <div className="manage-donations">
        <div>מעבר לעמוד חוות דעת</div>
        <div>
          <h4>מעבר לאישור פריטים</h4>
          <div>
            <p>מעבר לאישור פריטים</p>
            <p>שיתופל לקהילות</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ManageVolunteers component
const ManageVolunteers: React.FC = () => {
  return (
    <div>
      <h3>מעבר לעמוד מלאי פריטים</h3>
      <div>
        <p>מעבר לעמוד ניהול יוזרים</p>
      </div>
    </div>
  );
};

// AdminDashboard component
const AdminDashboard: React.FC = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <main>
        <AdminProfile />
        <ManageDonations />
        <ManageVolunteers />
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default AdminDashboard;