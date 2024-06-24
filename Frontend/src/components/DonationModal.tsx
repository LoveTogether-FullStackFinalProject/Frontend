// DonationModal.tsx

import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { Donation } from "../types";

interface DonationModalProps {
    donation: Donation | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedDonation: Donation) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ donation, isOpen, onClose, onUpdate }) => {
    const [updatedDonation, setUpdatedDonation] = useState<Donation | null>(donation);

    useEffect(() => {
        setUpdatedDonation(donation);
    }, [donation]);

    if (!donation) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedDonation((prevDonation) => prevDonation ? ({ ...prevDonation, [name]: value }) : null);
    };

    const handleSubmit = () => {
        if (updatedDonation) {
            onUpdate(updatedDonation);
            onClose();
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} className="custom-modal">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Update Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white">
                <div className="row">
                    <div className="col-md-12">
                        <form>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    value={updatedDonation?.category || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Product Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="productType"
                                    value={updatedDonation?.productType || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="amount"
                                    value={updatedDonation?.amount || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Item Condition</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="itemCondition"
                                    value={updatedDonation?.itemCondition || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={updatedDonation?.description || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Pick Up Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pickUpAddress"
                                    value={updatedDonation?.pickUpAddress || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            {updatedDonation?.category === "food" && (
                                <div className="form-group">
                                    <label>Expiration Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="expirationDate"
                                        value={updatedDonation?.expirationDate.toISOString().split('T')[0] || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white"></Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Update
                </Button>
                    </Modal.Footer>
                </Modal> // Add the closing tag for the 'Modal' component
                    

    );
};

export default DonationModal;
