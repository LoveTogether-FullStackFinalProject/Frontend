// DonationModal.tsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { userDonation } from './userDonation';

interface DonationModalProps {
    show: boolean;
    onHide: () => void;
    donation: userDonation | null;
    onEditClick: (donation: userDonation) => void;
    onDeleteClick: (donationId: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ show, onHide, donation, onEditClick, onDeleteClick }) => {
    if (!donation) return null;

    return (
        <Modal show={show} onHide={onHide} className="custom-modal">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>{donation.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <div className="row">
                    <div className="col-md-6">
                        {donation.image && (
                            <img
                                src={donation.image}
                                alt={donation.itemName}
                                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                            />
                        )}
                    </div>
                    <div className="col-md-6">
                        <h4>Details</h4>
                        <p>קטגוריה: {donation.category}</p>
                        <p>כמות: {donation.quantity}</p>
                        <p>מצב הפריט: {donation.condition}</p>
                        <p>תיאור: {donation.description}</p>
                        <p>תאריך תפוגה: {new Date(donation.expirationDate).toLocaleDateString()}</p>
                        <p>כתובת לאיסוף: {donation.pickupAddress}</p>
                        <p>סטטוס: {donation.status}</p>
                    </div>
                </div>
                <Button variant="primary" onClick={() => onEditClick(donation)}>
                    Edit
                </Button>
                <Button variant="danger" onClick={() => onDeleteClick(donation._id)}>
                    Delete
                </Button>
            </Modal.Body>
        </Modal>
    );
};
//its good

export default DonationModal;
