import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { userDonation } from './userDonation';

interface DonationModalProps {
    show: boolean;
    onHide: () => void;
    donation: userDonation | null;
    onEditClick: (donation: userDonation) => void;
    onDeleteClick: (donationId: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ show, onHide, donation, onEditClick, onDeleteClick }) => {
    if (!donation) {
        return null;
    }

    const handleEdit = () => {
        console.log('Edit button clicked in modal'); // Debug statement
        onEditClick(donation);
    };

    return (
        <Modal show={show} onHide={onHide} dir="rtl">
            <Modal.Header closeButton>
                <Modal.Title>{donation.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6" style={{ textAlign: 'right' }}>
                            <h4>פרטים</h4>
                            <p><strong>קטגוריה:</strong> {donation.category}</p>
                            <p><strong>כמות:</strong> {donation.quantity}</p>
                            <p><strong>מצב הפריט:</strong> {donation.condition}</p>
                            <p><strong>תיאור:</strong> {donation.description}</p>
                            <p><strong>תאריך תפוגה:</strong> {new Date(donation.expirationDate).toLocaleDateString()}</p>
                            <p><strong>כתובת לאיסוף:</strong> {donation.pickupAddress}</p>
                            <p><strong>סטטוס:</strong> {donation.status}</p>
                        </div>
                        <div className="col-md-6">
                            <img src={donation.photoUrl} alt={donation.itemName} className="img-fluid" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    סגור
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                    ערוך
                </Button>
                <Button variant="danger" onClick={() => onDeleteClick(donation._id)}>
                    מחק
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DonationModal;
