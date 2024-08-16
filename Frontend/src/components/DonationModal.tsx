import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Donation } from './donation';

interface DonationModalProps {
    show: boolean;
    onHide: () => void;
    donation: Donation | null;
    onEditClick: (donation: Donation) => void;
    onDeleteClick: (donationId: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ show, onHide, donation, onEditClick, onDeleteClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Donation | null>(null);

    useEffect(() => {
        setEditData(donation);
    }, [donation]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        onDeleteClick(id);
        onHide();
    };

    const handleSave = () => {
        if (editData) {
            onEditClick(editData);
            setIsEditing(false);
            onHide();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleClose = () => {
        setIsEditing(false);
        setEditData(donation); 
        onHide();
    };

    if (!donation || !editData) {
        return null;
    }

    return (
        <Modal show={show} onHide={handleClose} dir="rtl">
            <Modal.Header closeButton />
            <Modal.Body>
                <div className="row">
                    <div className="col-md-6" style={{ textAlign: 'right' }}>
                        <h4>פרטי התרומה:</h4>
                        {isEditing ? (
                            <Form>
                                <Form.Group>
                                    <Form.Label>קטגוריה</Form.Label>
                                    <Form.Control as="select" name="category" value={editData.category} onChange={handleChange}>
                                        <option value="">בחר קטגוריה</option>
                                        <option value="ביגוד">ביגוד</option>
                                        <option value="הנעלה">הנעלה</option>
                                        <option value="ציוד לתינוקות">ציוד לתינוקות</option>
                                        <option value="כלי בית">כלי בית</option>
                                        <option value="ריהוט">ריהוט</option>
                                        <option value="מזון ושתייה">מזון ושתייה</option>
                                        <option value="ספרים">ספרים</option>
                                        <option value="צעצועים">צעצועים</option>
                                        <option value="אחר">אחר</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>כמות</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={editData.quantity}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>מצב הפריט</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="itemCondition"
                                        value={editData.itemCondition}
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
                                {editData.category === 'מזון ושתייה' && (
                                    <Form.Group>
                                        <Form.Label>תאריך תפוגה</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="expirationDate"
                                            value={editData.expirationDate ? new Date(editData.expirationDate).toISOString().split('T')[0] : ''}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group>
                                    <Form.Label>סטטוס</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="status"
                                        value={editData.status}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                {editData.status === 'ממתין לאיסוף מבית התורם' && (
                                    <Form.Group>
                                        <Form.Label>כתובת לאיסוף</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pickupAddress"
                                            value={editData.pickUpAddress}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                )}
                                {editData.status === 'טרם הגיע לעמותה' && (
                                    <Form.Group>
                                        <Form.Label>סניף עמותה</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="branch"
                                            value={editData.branch}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                )}
                            </Form>
                        ) : (
                            <>
                                <p><strong>קטגוריה:</strong> {editData.category}</p>
                                <p><strong>כמות:</strong> {editData.quantity}</p>
                                <p><strong>מצב הפריט:</strong> {editData.itemCondition}</p>
                                <p><strong>תיאור:</strong> {editData.description}</p>
                                {editData.category === 'מזון ושתייה' && editData.expirationDate && (
                                    <p><strong>תאריך תפוגה:</strong> {new Date(editData.expirationDate).toLocaleDateString()}</p>
                                )}
                                <p><strong>סטטוס:</strong> {editData.status}</p>
                                {editData.status === 'ממתין לאיסוף מבית התורם' && editData.pickUpAddress && (
                                    <p><strong>כתובת לאיסוף:</strong> {editData.pickUpAddress}</p>
                                )}
                                {editData.status === 'טרם הגיע לעמותה' && editData.branch && (
                                    <p><strong>סניף עמותה:</strong> {editData.branch}</p>
                                )}
                            </>
                        )}
                    </div>
                    <div className="col-md-6">
                        <img src={editData.image} alt={editData.itemName} className="img-fluid" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>סגור</Button>
                {isEditing ? (
                    <Button variant="primary" onClick={handleSave}>שמור</Button>
                ) : (
                    <Button variant="primary" onClick={handleEdit}>ערוך</Button>
                )}
                <Button variant="danger" onClick={() => handleDelete(editData._id)}>מחק</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DonationModal;
