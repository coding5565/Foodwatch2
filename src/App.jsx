import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Form, InputGroup } from 'react-bootstrap';
import { Shield, Search, Bell, History, Camera, User, TrendingUp, AlertTriangle } from 'lucide-react';
import Scanner from './components/Scanner';
import ProductDetails from './components/ProductDetails';
import { getProductByBarcode } from './data/mockProducts';

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const handleScan = (barcode) => {
    let product = null;

    // Try to parse if it's a JSON QR code (Real Data)
    try {
      if (barcode.trim().startsWith('{')) {
        const data = JSON.parse(barcode);
        product = {
          id: Math.random().toString(36).substr(2, 9),
          barcode: barcode,
          name: data.name || "Unknown Product",
          brand: data.brand || "Unknown Brand",
          category: data.cat || "General",
          expiryDate: data.exp || "N/A",
          status: new Date(data.exp) < new Date() ? 'expired' : 'safe',
          reports: Math.floor(Math.random() * 5),
          image: "https://images.unsplash.com/photo-1540340061722-9293d5163008?w=400&auto=format&fit=crop"
        };
      } else {
        product = getProductByBarcode(barcode);
      }
    } catch (e) {
      product = getProductByBarcode(barcode);
    }

    if (product) {
      setSelectedProduct(product);
      setHistory(prev => [product, ...prev.filter(p => p.barcode !== product.barcode)].slice(0, 5));
    } else {
      alert("Product not found in our database. You can still report it!");
    }
    setIsScanning(false);
  };

  const handleReport = () => {
    alert("Thank you! Your report has been submitted to the community database.");
    setSelectedProduct(null);
  };

  return (
    <div className="min-vh-100 pb-5">
      {/* Navigation */}
      <Navbar className="glass-nav py-3" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center gap-2">
            <div className="bg-success p-2 rounded-3 text-white shadow-sm">
              <Shield size={24} />
            </div>
            <span className="fw-bold fs-4">Toza<span className="text-success">Market</span></span>
          </Navbar.Brand>
          <div className="ms-auto d-flex align-items-center gap-3">
            <Button variant="link" className="p-2 text-secondary position-relative text-decoration-none">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ marginTop: '0.5rem', marginLeft: '-0.5rem' }}></span>
            </Button>
            <div className="bg-white rounded-circle border d-flex align-items-center justify-center p-1 shadow-sm" style={{ width: '40px', height: '40px' }}>
              <User size={24} className="text-secondary opacity-50" />
            </div>
          </div>
        </Container>
      </Navbar>

      <Container className="max-width-md mx-auto py-4" style={{ maxWidth: '480px' }}>
        {/* Welcome Section */}
        <header className="mb-5">
          <h1 className="fw-black display-5 text-dark lh-sm mt-3">
            Monitoring for<br />your <span className="text-success text-decoration-underline decoration-4">safety.</span>
          </h1>
          <p className="text-secondary fw-semibold mt-2">Scan any product to check its expiration date and community reports.</p>
        </header>

        {/* Quick Actions Grid */}
        <Row className="g-3 mb-5">
          <Col xs={6}>
            <div
              onClick={() => setIsScanning(true)}
              className="glass-card p-4 d-flex flex-column align-items-center justify-content-center gap-3 ratio-1x1 cursor-pointer"
              style={{ aspectRatio: '1/1' }}
            >
              <div className="bg-primary-light p-4 rounded-4 text-success shadow-sm">
                <Camera size={32} />
              </div>
              <span className="fw-bold text-dark">Scan Product</span>
            </div>
          </Col>
          <Col xs={6}>
            <div className="glass-card p-4 d-flex flex-column align-items-center justify-content-center gap-3 ratio-1x1 cursor-pointer" style={{ aspectRatio: '1/1' }}>
              <div className="bg-warning-subtle p-4 rounded-4 text-warning shadow-sm">
                <TrendingUp size={32} />
              </div>
              <span className="fw-bold text-dark">Safety Trends</span>
            </div>
          </Col>
        </Row>

        {/* Recent History */}
        <div className="glass-card p-4 mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="h6 fw-bold text-dark mb-0">Recent Checks</h3>
            <Button variant="link" className="p-0 text-success fw-bold text-decoration-none small">View All</Button>
          </div>
          <div className="vstack gap-4">
            {history.length > 0 ? history.map(product => (
              <div key={product.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg-light cursor-pointer" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 overflow-hidden border" style={{ width: '48px', height: '48px' }}>
                    <img src={product.image} alt={product.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <div>
                    <p className="small fw-bold text-dark mb-0 text-uppercase tracking-tight">{product.name}</p>
                    <p className="small text-muted mb-0 fw-bold" style={{ fontSize: '10px' }}>{product.brand} • {product.expiryDate}</p>
                  </div>
                </div>
                <div className={`p-2 rounded-3 ${product.status === 'expired' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                  {product.status === 'expired' ? <AlertTriangle size={16} /> : <Shield size={16} />}
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-muted">
                <div className="mb-2 opacity-25">
                  <History size={32} />
                </div>
                <p className="small italic mb-0">No recent scans yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <InputGroup className="mb-5 shadow-sm rounded-4 overflow-hidden border-0">
          <InputGroup.Text className="bg-white border-0 ps-4">
            <Search size={20} className="text-secondary" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search product manually..."
            className="border-0 py-3 fw-medium"
            style={{ fontSize: '1rem' }}
          />
        </InputGroup>
      </Container>

      {/* Floating Action Button */}
      {!isScanning && !selectedProduct && (
        <Button
          onClick={() => setIsScanning(true)}
          variant="dark"
          className="btn-scan d-flex align-items-center gap-3"
        >
          <Camera size={24} className="text-success" />
          Scan & Verify
        </Button>
      )}

      {/* Overlays */}
      {isScanning && (
        <Scanner
          onScan={handleScan}
          onClose={() => setIsScanning(false)}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onReport={handleReport}
        />
      )}
    </div>
  );
}

export default App;
