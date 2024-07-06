import React, { useState, useEffect } from 'react';
import dataService, { CanceledError } from '../services/data-service';
import { Table, Button, Dropdown, Modal } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageDonations.css';

interface Donation {
  _id: string;
  category: string;
  productType: string;
  amount: number;
  itemCondition: string;
  expirationDate: Date;
  description: string;
  pickUpAddress: string;
  status: string;
  approvedByAdmin?: string;
  donor: {
    firstName: string;
    lastName: string;
  };
  image?: string;
}

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonations, setSelectedDonations] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Donation[]>([]);

  useEffect(() => {
    const { req, abort } = dataService.getDonations();
    req.then((res) => {
      setDonations(res.data);
    }).catch((err) => {
      console.log(err);
      if (err instanceof CanceledError) return;
      setError(err.message);
    });

    return () => {
      abort();
    };
  }, []);

  const handleStatusUpdate = (donation: Donation, status: string) => {
    const updatedDonation = { ...donation, status };
    setPendingChanges((prev) => {
      const existingChange = prev.find((d) => d._id === donation._id);
      if (existingChange) {
        return prev.map((d) => (d._id === donation._id ? updatedDonation : d));
      }
      return [...prev, updatedDonation];
    });
    setDonations((prev) =>
      prev.map((d) => (d._id === donation._id ? updatedDonation : d))
    );
  };

  const handleApprovalUpdate = (donation: Donation, approved: string) => {
    const updatedDonation = { ...donation, approvedByAdmin: approved };
    setPendingChanges((prev) => {
      const existingChange = prev.find((d) => d._id === donation._id);
      if (existingChange) {
        return prev.map((d) => (d._id === donation._id ? updatedDonation : d));
      }
      return [...prev, updatedDonation];
    });
    setDonations((prev) =>
      prev.map((d) => (d._id === donation._id ? updatedDonation : d))
    );
  };

  const handleCheckboxChange = (donationId: string) => {
    setSelectedDonations((prevSelectedDonations) =>
      prevSelectedDonations.includes(donationId)
        ? prevSelectedDonations.filter((id) => id !== donationId)
        : [...prevSelectedDonations, donationId]
    );
  };

  const handleExport = () => {
    const csvData = donations.map((d) => ({
      id: d._id,
      category: d.category,
      productType: d.productType,
      amount: d.amount,
      itemCondition: d.itemCondition,
      expirationDate: d.expirationDate,
      description: d.description,
      pickUpAddress: d.pickUpAddress,
      status: d.status,
      approvedByAdmin: d.approvedByAdmin === 'true' ? "כן" : "לא",
      donor: `${d.donor.firstName} ${d.donor.lastName}`,
    }));
    return csvData;
  };

  const saveChanges = async () => {
    try {
      const updatePromises = pendingChanges.map((donation) =>
        dataService.updateDonation(donation._id, donation)
      );
      await Promise.all(updatePromises);
      setPendingChanges([]);
      alert("השינויים נשמרו בהצלחה!");
    } catch (error) {
      console.error('Error saving changes:', error);
      alert("שמירת השינויים נכשלה.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>ניהול תרומות</h2>
      <CSVLink data={handleExport()} filename="donations.csv" className="btn btn-success mb-3">
        ייצוא לאקסל
      </CSVLink>
      <Button className="mb-3" onClick={saveChanges} disabled={pendingChanges.length === 0}>
        שמור שינויים
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>בחירה</th>
            <th>קטגוריה</th>
            <th>תיאור</th>
            <th>שם התורם</th>
            <th>סטטוס</th>
            <th>אושר ע"י מנהל</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedDonations.includes(donation._id)}
                  onChange={() => handleCheckboxChange(donation._id)}
                />
              </td>
              <td>{donation.category}</td>
              <td>{donation.description}</td>
              <td>{`${donation.donor.firstName} ${donation.donor.lastName}`}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {donation.status}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'הגיע לעמותה')}>
                      הגיע לעמותה
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStatusUpdate(donation, 'נמסר')}>
                      נמסר
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {donation.approvedByAdmin === 'true' ? "כן" : "לא"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, 'true')}>
                      כן
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleApprovalUpdate(donation, 'false')}>
                      לא
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Button
                  variant="info"
                  className="ms-2"
                  onClick={() => {
                    setCurrentDonation(donation);
                    setShowModal(true);
                  }}
                >
                  הצגת פרטים
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>פרטי תרומה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDonation && (
            <div>
              <p><strong>קטגוריה:</strong> {currentDonation.category}</p>
              <p><strong>תיאור:</strong> {currentDonation.description}</p>
              <p><strong>כמות:</strong> {currentDonation.amount}</p>
              <p><strong>מצב הפריט:</strong> {currentDonation.itemCondition}</p>
              <p><strong>תאריך תפוגה:</strong> {new Date(currentDonation.expirationDate).toLocaleDateString()}</p>
              <p><strong>כתובת לאיסוף:</strong> {currentDonation.pickUpAddress}</p>
              <p><strong>סטטוס:</strong> {currentDonation.status}</p>
              <p><strong>אושר על ידי מנהל:</strong> {currentDonation.approvedByAdmin === 'true' ? "כן" : "לא"}</p>
              {currentDonation.image && (
                <div>
                  <p><strong>תמונה:</strong></p>
                  <img src={currentDonation.image} alt="Donation" className="img-fluid" />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageDonationPage;
