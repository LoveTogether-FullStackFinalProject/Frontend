import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  approvedByAdmin: string;
}

const ManageDonationPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonations, setSelectedDonations] = useState<string[]>([]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`/api/donations/`);
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching all donations:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const unapprovedDonations = donations.filter(
    (donation) => donation.approvedByAdmin === ''
  );

  const notArrivedDonations = donations.filter(
    (donation) => donation.status === 'not arrived'
  );

  const handleCheckboxChange = (donationId: string) => {
    setSelectedDonations((prevSelectedDonations) =>
      prevSelectedDonations.includes(donationId)
        ? prevSelectedDonations.filter((id) => id !== donationId)
        : [...prevSelectedDonations, donationId]
    );
  };

  return (
    <div>
      <h2>תרומות שטרם אושרו על ידי מנהל</h2>
      <ul>
        {unapprovedDonations.map((donation) => (
            //Modal
            //add image of the donation
          <li key={donation._id}>
            <input
              type="checkbox"
              checked={selectedDonations.includes(donation._id)}
              onChange={() => handleCheckboxChange(donation._id)}
            />
            <h3>{donation.category}</h3>
            <p>{donation.description}</p>
          </li>
        ))}
      </ul>

      <h2>תרומות שטרם הגיעו</h2>
      <ul>
        {notArrivedDonations.map((donation) => (
            //Modal
            //add image of the donation
          <li key={donation._id}>
            <h3>{donation.category}</h3>
            <p>{donation.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDonationPage;