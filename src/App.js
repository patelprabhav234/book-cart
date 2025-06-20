import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
  InputGroup,
  Modal,
}
from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showAbout, setShowAbout] = useState(false);

  const API_URL = 'https://api.itbook.store/1.0/new';
  const categories = ['All', 'Web', 'Python', 'JavaScript', 'Data', 'Security'];

  // Multi-currency price formatter
  const formatPrices = (usdPrice) => {
    const usd = parseFloat(usdPrice.replace('$', '')) || 0;
    const inrRate = 83;
    const eurRate = 0.93;

    return {
      USD: `$${usd.toFixed(2)}`,
      INR: `₹${Math.round(usd * inrRate)}`,
      EUR: `€${(usd * eurRate).toFixed(2)}`,
    };
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setBooks(data.books);
        setFilteredBooks(data.books);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterBooks(searchTerm, category);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterBooks(term, selectedCategory);
  };

  const filterBooks = (term, category) => {
    let filtered = books;

    if (category !== 'All') {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (term) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const toggleFavorite = (isbn13) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(isbn13)
        ? prevFavorites.filter((id) => id !== isbn13)
        : [...prevFavorites, isbn13]
    );
  };

  const addToCart = (book) => {
    setCart((prevCart) => [...prevCart, book]);
  };

  const handleChatSend = () => {
    if (!chatInput) return;
    const userMessage = { sender: 'user', text: chatInput };
    const botReply = { sender: 'bot', text: `You said: "${chatInput}"` };
    setChatMessages((msgs) => [...msgs, userMessage, botReply]);
    setChatInput('');
  };

  const getCartTotalINR = () => {
    return cart.reduce(
      (acc, book) => acc + (parseFloat(book.price.replace('$', '')) || 0) * 83,
      0
    ).toFixed(2);
  };

  return (
    <div style={{ backgroundColor: '#e6f2ff', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container>
        <h1 className="text-center mb-4" style={{ color: '#003366' }}>
          📚 <strong>New IT Books</strong>
        </h1>
        {loading && <Spinner animation="border" variant="primary" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <>
            <Form.Group className="mb-3" controlId="searchBar">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="🔍 Search by title..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="categorySelect">
              <Form.Label style={{ color: '#00509e' }}>
                <strong>Select Category</strong>
              </Form.Label>
              <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="info" className="mb-4 me-2" onClick={() => setShowTerms(true)}>
              📄 Terms & Conditions
            </Button>

            <Button variant="success" className="mb-4 me-2" onClick={() => setShowPayment(true)}>
              🛒 View Cart ({cart.length})
            </Button>

            <Button variant="dark" className="mb-4 me-2" onClick={() => setShowChatbot(!showChatbot)}>
              💬 Chat with Us
            </Button>

            <Button variant="secondary" className="mb-4" onClick={() => setShowAbout(true)}>
              ℹ️ About Us
            </Button>

            <Row>
              {filteredBooks.map((book) => (
                <Col key={book.isbn13} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100 shadow fade-in-card">
                    <Card.Img variant="top" src={book.image} alt={book.title} className="card-img-top" />
                    <Card.Body>
                      <Card.Title style={{ color: '#0d6efd' }}>{book.title}</Card.Title>

                      <Card.Text>
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>💵 Prices:</span>
                        <ul style={{ paddingLeft: '1.2rem', marginBottom: '0' }}>
                          <li><strong>INR:</strong> {formatPrices(book.price).INR}</li>
                          <li><strong>USD:</strong> {formatPrices(book.price).USD}</li>
                          <li><strong>EUR:</strong> {formatPrices(book.price).EUR}</li>
                        </ul>
                      </Card.Text>

                      <Card.Text style={{ color: 'green', fontWeight: '500' }}>
                        🎓 Student Discount: 15% off
                      </Card.Text>

                      <Card.Text>
                        <small className="text-muted">{book.subtitle}</small>
                      </Card.Text>

                      <div className="mt-2">
                        <p><strong>EMI Options:</strong> Available from ₹499/month</p>
                        <p><strong>Bank Offers:</strong> Get 10% off with XYZ Bank!</p>
                      </div>

                      <div className="d-flex gap-2 flex-wrap mt-2">
                        <Button size="sm" variant="outline-secondary">⬇️ PDF</Button>
                        <Button size="sm" variant="outline-secondary">⬇️ Word</Button>
                      </div>
                    </Card.Body>
                    <Card.Footer className="d-flex flex-column gap-2">
                      <Button
                        variant={favorites.includes(book.isbn13) ? 'danger' : 'outline-primary'}
                        onClick={() => toggleFavorite(book.isbn13)}
                      >
                        {favorites.includes(book.isbn13) ? '❤️ Remove Favorite' : '🤍 Add to Favorites'}
                      </Button>
                      <Button variant="warning" onClick={() => addToCart(book)}>
                        🛍️ Buy Now
                      </Button>
                      <Button variant="outline-warning" onClick={() => addToCart(book)}>
                        ➕ Add to Cart
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Terms Modal */}
            <Modal show={showTerms} onHide={() => setShowTerms(false)}>
              <Modal.Header closeButton>
                <Modal.Title>📜 Terms & Conditions</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>All purchases are subject to availability and ITBookStore policies.</p>
                <p>Prices and book availability may change without prior notice.</p>
                <p>Favorites and cart are not saved after page reload unless saved to storage.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowTerms(false)}>Close</Button>
              </Modal.Footer>
            </Modal>

            {/* Cart Modal */}
            <Modal show={showPayment} onHide={() => setShowPayment(false)}>
              <Modal.Header closeButton>
                <Modal.Title>💳 Checkout</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <>
                    <ul>
                      {cart.map((item, idx) => (
                        <li key={idx}>
                          {item.title} – {formatPrices(item.price).INR} / {formatPrices(item.price).USD}
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <p>
                      <strong>Total:</strong> ₹{getCartTotalINR()}
                    </p>
                  </>
                )}
                <p>This is a mock checkout – no real payment will be processed.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPayment(false)}>Cancel</Button>
                <Button variant="success" onClick={() => setCart([])}>Complete Purchase</Button>
              </Modal.Footer>
            </Modal>

            {/* About Modal */}
            <Modal show={showAbout} onHide={() => setShowAbout(false)}>
              <Modal.Header closeButton>
                <Modal.Title>ℹ️ About Us</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Welcome to the IT Book Store! We provide the latest and most popular IT books to help you learn and grow in the tech industry.</p>
                <p>Our goal is to make tech education accessible, enjoyable, and up-to-date with the fast-paced world of information technology.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAbout(false)}>Close</Button>
              </Modal.Footer>
            </Modal>

            {/* Chatbot */}
            {showChatbot && (
              <div style={{ position: 'fixed', bottom: 20, right: 20, width: 300, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <h6>💬 Chatbot</h6>
                <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                      <span style={{ backgroundColor: msg.sender === 'user' ? '#d1e7dd' : '#f8d7da', padding: '4px 8px', borderRadius: 5, display: 'inline-block', margin: '2px 0' }}>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                  />
                  <Button variant="primary" onClick={handleChatSend}>Send</Button>
                </InputGroup>
              </div>
            )}
          </>
        )}
      </Container>
      <div className="text-center mt-5 mb-3 text-muted">
        <hr />
        <p>🙏 <strong>Thank you</strong> for visiting our IT Book Store. We hope you found the perfect book for your tech journey. Happy Learning...</p>
        <p style={{ fontSize: '0.9rem' }}>Prabhav Patel. Built with React & Bootstrap</p>
      </div>
    </div>
  );
}

export default App;  