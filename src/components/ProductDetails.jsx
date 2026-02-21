import React from 'react';
import { Container, Button, Badge, Row, Col, Card } from 'react-bootstrap';
import { Calendar, ShieldAlert, ShieldCheck, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

const ProductDetails = ({ product, onBack, onReport }) => {
    if (!product) return null;

    const isExpired = product.status === 'expired';

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex flex-column z-idx-100 overflow-auto" style={{ zIndex: 2000 }}>
            {/* Header */}
            <div className="bg-white px-3 py-3 d-flex align-items-center gap-3 border-bottom position-sticky top-0">
                <Button variant="link" onClick={onBack} className="p-2 text-dark text-decoration-none">
                    <ArrowLeft size={24} />
                </Button>
                <span className="fw-bold fs-5">Product Info</span>
            </div>

            <div className="flex-grow-1">
                {/* Product Image & Title */}
                <div className="p-4 d-flex gap-4 bg-white shadow-sm mb-2">
                    <div className="bg-light rounded-4 overflow-hidden border d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                        <img src={product.image} alt={product.name} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="py-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <Badge bg="light" className="text-secondary text-uppercase py-1" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                                {product.category}
                            </Badge>
                            <span className="text-muted opacity-50 small">|</span>
                            <span className="small fw-bold text-muted">{product.brand}</span>
                        </div>
                        <h2 className="h4 fw-black text-dark mb-1">{product.name}</h2>
                        <p className="text-muted mb-0 font-monospace" style={{ fontSize: '10px' }}>CODE: {product.barcode}</p>
                    </div>
                </div>

                {/* Status Card */}
                <Container className="p-4">
                    <div className={`rounded-5 p-4 shadow-lg mb-4 ${isExpired ? 'bg-danger-light border border-danger-subtle' : 'bg-primary-light border border-success-subtle'}`}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className={`p-3 rounded-4 shadow-sm ${isExpired ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                {isExpired ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                            </div>
                            <div>
                                <p className={`small fw-bold text-uppercase mb-0 tracking-wider ${isExpired ? 'text-danger' : 'text-success'}`}>
                                    {isExpired ? 'Danger Found' : 'Safe to Buy'}
                                </p>
                                <h3 className="h2 fw-black text-dark mb-0 mt-1">
                                    {isExpired ? 'EXPIRED' : 'VERIFIED'}
                                </h3>
                            </div>
                        </div>

                        <hr className="opacity-10 mb-4" />

                        <Row className="g-3">
                            <Col xs={6}>
                                <p className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: '9px' }}>Expected Expiry</p>
                                <div className="d-flex align-items-center gap-2 font-bold text-dark">
                                    <Calendar size={14} className="text-muted" />
                                    <span className="fw-bold small">{product.expiryDate}</span>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <p className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: '9px' }}>Community Reports</p>
                                <div className="d-flex align-items-center gap-2 text-dark">
                                    <AlertCircle size={14} className={product.reports > 0 ? 'text-danger' : 'text-muted'} />
                                    <span className="fw-bold small">{product.reports} reports</span>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Tips Overlay */}
                    <div className="bg-white border rounded-4 p-3 d-flex gap-3 align-items-start shadow-sm mb-5">
                        <div className="bg-primary-light p-2 rounded-3 text-success">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="fw-bold text-dark small mb-1">Nearby Activity</p>
                            <p className="text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                Safety checks for this item are active in your local area.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-top position-sticky bottom-0">
                <div className="vstack gap-2">
                    {isExpired ? (
                        <Button
                            onClick={onReport}
                            variant="danger"
                            className="w-100 py-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-2"
                        >
                            <ShieldAlert size={20} />
                            REPORT EXPIRED PRODUCT
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            className="w-100 py-3 rounded-4 fw-bold shadow-sm mb-2"
                        >
                            Add to My Safety List
                        </Button>
                    )}
                    <Button
                        variant="link"
                        onClick={onBack}
                        className="w-100 text-muted fw-bold text-decoration-none small"
                    >
                        Check Another Product
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
