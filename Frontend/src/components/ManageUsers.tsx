import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    rating: string;
  }

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);



  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await axios.get('admin/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>ניהול יוזרים</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>תמונה</th>
            <th>אימייל</th>
            <th>דירוג</th>
            <th>עריכה</th>
            <th>מחיקת משתמש</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <button>
                  <i className="trash-icon"></i>
                </button>
              </td>
              <td>
                <button>
                  <i className="edit-icon"></i>
                </button>
              </td>
              <td>{user.email}</td>
              <td>{user.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;