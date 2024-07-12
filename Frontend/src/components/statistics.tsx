import { useEffect, useState } from 'react';
import { Donation } from './donation.tsx';
import { requestedDonation } from "../services/upload-requested-product-service";
import dataService, { CanceledError } from "../services/data-service.ts";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './statistics.css';

function Statistics() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Donation[]>([]);
    const [requests, setRequests] = useState<requestedDonation[]>([]);
    const [error, setError] = useState<string | null>(null);

        const navigate = useNavigate();
    useEffect(() => {
        const { req, abort } = dataService.getDonations();
        req.then((res) => {
            setProducts(res.data);
        }).catch((err) => {
            if (err instanceof CanceledError) return;
            setError(err.message);
        });
        return () => abort();
    }, []);

    useEffect(() => {
        const { req, abort } = dataService.getRequestedProducts();
        req.then((res) => {
            setRequests(res.data);
        }).catch((err) => {
            if (err instanceof CanceledError) return;
            setError(err.message);
        });
        return () => abort();
    }, []);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return (
            <div className="login-prompt">
                <p className="error-message">שגיאה: אינך מחובר בתור מנהל</p>
                <button onClick={() => navigate('/adminDashboard')} className="btn btn-primary">התחבר בתור מנהל</button>
            </div>
        );
    }

    return (
        <Container fluid className="statistics-container">
            <Row className="mb-4">
                <Col>
                    <h1 className="text-center">דוחות נתונים וסטטיסטיקות של התרומות בעמותה</h1>
                    {error && <p className="text-danger">{error}</p>}
                </Col>
            </Row>
            <Row>
                <Col lg={6} md={12} className="mb-4">
                    <Card>
                        <Card.Header className="bg-success text-white">
                            נתוני התרומות בשנה האחרונה
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>שם המוצר</th>
                                        <th>כמות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.itemName}</td>
                                            <td>{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} md={12} className="mb-4">
                    <Card>
                        <Card.Header className="bg-danger text-white">
                            נתוני פריטים חסרים בעמותה שנדרשים לתרומות
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>שם המוצר</th>
                                        <th>כמות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => (
                                        <tr key={index}>
                                            <td>{request.itemName}</td>
                                            <td>{request.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Statistics;
