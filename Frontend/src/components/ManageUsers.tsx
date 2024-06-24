import React, { useState, useEffect } from 'react';
import dataService, { CanceledError } from "../services/data-service";
import './ManageUsers.css';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";



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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dataService.getAllUsers()
      .then(({ data }) => {
        console.log(data);
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
  }, []);

  const deleteUser = (id: string) => {
    dataService.deleteUser(id)
      .then(() => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
  };

  const editUser = (id: string) => {
    // Add navigation to edit page or open a modal
    console.log(`Edit user with ID: ${id}`);
  };

  return (
    <div className="container">
      <h1>ניהול יוזרים</h1>
      {error && <p className="error">{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>אימייל</th>
            <th>דירוג</th>
            <th>עריכה</th>
            <th>מחיקת משתמש</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.rating}</td>
              <td>
                <button className="edit-button" onClick={() => editUser(user._id)}>
                <CiEdit />
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteUser(user._id)}>
                <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;
