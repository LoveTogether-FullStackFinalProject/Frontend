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

const DonationModal: React.FC<DonationModalProps> = ({
  show,
  onHide,
  donation,
  onEditClick,
  onDeleteClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Donation | null>(null);
  const [errors, setErrors] = useState({
    quantity: '',
    description: '',
    category: '',
    pickupAddress: '',
  });

  useEffect(() => {
    setEditData(donation);
    if (!show) {
      setIsEditing(false);
      setErrors({ quantity: '', description: '', category: '', pickupAddress: '' });
    }
  }, [donation, show]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    onDeleteClick(id);
    onHide();
  };

  const handleSave = () => {
    if (errors.quantity || errors.description || errors.category || errors.pickupAddress) {
      return;
    }
    if (editData) {
      onEditClick(editData);
      setIsEditing(false);
      onHide();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => (prev ? { ...prev, [name]: value } : null));

    // Validation logic
    const updatedErrors = { ...errors };

    if (name === 'quantity') {
      updatedErrors.quantity = Number(value) < 1 ? 'כמות חייבת להיות לפחות 1' : '';
    }

    if (name === 'description') {
      updatedErrors.description = value.trim().length < 1 ? 'תיאור חייב להיות לפחות תו אחד' : '';
    }

    if (name === 'category') {
      updatedErrors.category = value === '' ? 'חובה לבחור קטגוריה' : '';
    }

    if (name === 'pickupAddress') {
      updatedErrors.pickupAddress =
        editData?.status === 'ממתין לאיסוף' && value.trim().length < 1
          ? 'כתובת לאיסוף היא שדה חובה'
          : '';
    }

    setErrors(updatedErrors);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditData(donation);
    setErrors({ quantity: '', description: '', category: '', pickupAddress: '' });
    onHide();
  };

  if (!donation || !editData) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} dir="rtl" style={{ maxHeight: '100vh' }}>
      <Modal.Header closeButton />
      <Modal.Body>
        <div className="row">
          <div className="col-md-6" style={{ textAlign: 'right' }}>
            <h4 style={{ borderBottom: '3px solid #f9db78', width: '45%' }}>פרטי התרומה:</h4>
            {isEditing ? (
              <Form>
                <Form.Group>
                  <Form.Label>קטגוריה</Form.Label>
                  <Form.Control
                    as="select"
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                  >
                    <option value="">בחר קטגוריה</option>
                    <option value="ציוד לתינוקות">ציוד לתינוקות</option>
                    <option value="ריהוט">ריהוט</option>
                    <option value="מזון ושתייה">מזון ושתייה</option>
                    <option value="ספרים">ספרים</option>
                    <option value="צעצועים">צעצועים</option>
                    <option value="אחר">אחר</option>
                  </Form.Control>
                  {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>כמות</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={editData.quantity}
                    onChange={handleChange}
                    min={1}
                  />
                  {errors.quantity && <div style={{ color: 'red' }}>{errors.quantity}</div>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>מצב הפריט</Form.Label>
                  <Form.Control
                    as="select"
                    name="condition"
                    value={editData.condition}
                    onChange={handleChange}
                  >
                    <option value="חדש">חדש</option>
                    <option value="משומש במצב טוב">משומש במצב טוב</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>תיאור</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                  />
                  {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
                </Form.Group>
                {editData.category === 'מזון ושתייה' && (
                  <Form.Group>
                    <Form.Label>תאריך תפוגה</Form.Label>
                    <Form.Control
                      type="date"
                      name="expirationDate"
                      value={
                        editData.expirationDate
                          ? new Date(editData.expirationDate).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
                {editData.status === 'ממתין לאיסוף' && (
                  <Form.Group>
                    <Form.Label>כתובת לאיסוף</Form.Label>
                    <Form.Control
                      type="text"
                      name="pickupAddress"
                      value={editData.pickupAddress}
                      onChange={handleChange}
                    />
                    {errors.pickupAddress && (
                      <div style={{ color: 'red' }}>{errors.pickupAddress}</div>
                    )}
                  </Form.Group>
                )}
              </Form>
            ) : (
              <>
                <p>
                  <strong>קטגוריה:</strong> {editData.category}
                </p>
                <p>
                  <strong>כמות:</strong> {editData.quantity}
                </p>
                <p>
                  <strong>מצב הפריט:</strong> {editData.condition}
                </p>
                <p>
                  <strong>תיאור:</strong> {editData.description}
                </p>
                {editData.category === 'מזון ושתייה' && editData.expirationDate && (
                  <p>
                    <strong>תאריך תפוגה:</strong>{' '}
                    {new Date(editData.expirationDate).toLocaleDateString()}
                  </p>
                )}
                <p>
                  <strong>סטטוס:</strong> {editData.status}
                </p>
                {editData.status === 'ממתין לאיסוף' && (
                  <p>
                    <strong>כתובת לאיסוף:</strong> {editData.pickupAddress}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="col-md-6">
            {editData.image && (
              <img
                src={editData.image}
                alt={editData.itemName}
                className="img-fluid"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70%',
                  borderRadius: '5px',
                  marginTop: '5px',
                }}
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          סגור
        </Button>
        {isEditing ? (
          <Button variant="primary" onClick={handleSave}>
            שמור
          </Button>
        ) : (
          <Button variant="primary" onClick={handleEdit}>
            ערוך
          </Button>
        )}
        <Button variant="danger" onClick={() => handleDelete(editData._id)}>
          מחק
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationModal;
