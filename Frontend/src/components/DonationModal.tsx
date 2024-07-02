import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { userDonation } from './userDonation';

interface DonationModalProps {
    show: boolean;
    onHide: () => void;
    donation: userDonation | null;
    onEditClick: (donation: userDonation) => void;
    onDeleteClick: (donationId: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ show, onHide, donation, onEditClick, onDeleteClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(donation ?? { /* default userDonation object */ });

    useEffect(() => {
        setEditData(donation);
    }, [donation]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onEditClick(editData);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (!donation) {
        return null;
    }

    return (
        <Modal show={show} onHide={() => {
            setIsEditing(false);
            onHide();
        }} dir="rtl">
            <Modal.Header closeButton>
                <Modal.Title>{donation.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6" style={{ textAlign: 'right' }}>
                            <h4>פרטים</h4>
                            {isEditing ? (
                                <Form>
                                    <Form.Group>
                                        <Form.Label>קטגוריה</Form.Label>
                                        <Form.Control as="select" name="category" value={editData.category} onChange={handleChange}>
                                            <option value="">בחר קטגוריה</option>
                                            <option value="מזון ושתייה">מזון ושתייה</option>
                                            <option value="אביזרים">אביזרים</option>
                                            <option value="אלקטרוניקה">אלקטרוניקה</option>
                                            <option value="ביגוד">ביגוד</option>
                                            <option value="הנעלה">הנעלה</option>
                                            <option value="אחר">אחר</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>כמות</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="quantity"
                                            value={editData?.quantity}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>מצב הפריט</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="condition"
                                            value={editData.condition}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>תיאור</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={editData.description}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>תאריך תפוגה</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="expirationDate"
                                            value={editData.expirationDate ? new Date(editData.expirationDate).toISOString().split('T')[0] : ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>כתובת לאיסוף</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pickupAddress"
                                            value={editData.pickupAddress}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Form>
                            ) : (
                                <>
                                    <p><strong>קטגוריה:</strong> {donation.category}</p>
                                    <p><strong>כמות:</strong> {donation.quantity}</p>
                                    <p><strong>מצב הפריט:</strong> {donation.condition}</p>
                                    <p><strong>תיאור:</strong> {donation.description}</p>
                                    <p><strong>תאריך תפוגה:</strong> {new Date(donation.expirationDate).toLocaleDateString()}</p>
                                    <p><strong>כתובת לאיסוף:</strong> {donation.pickupAddress}</p>
                                </>
                            )}
                        </div>
                        <div className="col-md-6">
                            <img src={donation.image} alt={donation.itemName} className="img-fluid" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>סגור</Button>
                {isEditing ? (
                    <Button variant="primary" onClick={handleSave}>שמור</Button>
                ) : (
                    <Button variant="primary" onClick={handleEdit}>ערוך</Button>
                )}
                <Button variant="danger" onClick={() => onDeleteClick(donation._id)}>מחק</Button>
            </Modal.Footer>
        </Modal>
    );
};
//CHANGE TO PUSH
export default DonationModal;
