import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Book not found or connection issue.');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id, navigate]);

  const handleQtyChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 1 && val <= (book?.stock || 1)) {
      setQuantity(val);
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;
    setAdding(true);
    try {
      await addToCart(book, quantity);
      toast.success(`Added ${quantity} item(s) of "${book.title}" to cart!`);
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage={true} />;
  if (!book) return null;

  return (
    <div className="container py-5">
      
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-orange">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/books" className="text-decoration-none text-orange">Books</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{book.title}</li>
        </ol>
      </nav>

      
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white p-4 p-md-5">
        <div className="row g-5">
          
          <div className="col-md-5 text-center bg-light p-4 rounded-3 d-flex align-items-center justify-content-center" style={{ minHeight: '380px' }}>
            <img
              src={book.image}
              alt={book.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '350px', objectFit: 'contain' }}
            />
          </div>

          <div className="col-md-7 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge badge-orange">{book.genre}</span>
                
                {book.stock === 0 ? (
                  <span className="badge bg-danger text-white">Out of Stock</span>
                ) : book.stock <= 5 ? (
                  <span className="badge bg-warning text-dark">Low Stock (Only {book.stock} left)</span>
                ) : (
                  <span className="badge bg-success text-white">In Stock</span>
                )}
              </div>

              <h1 className="fw-bold text-dark-blue font-serif mb-2">{book.title}</h1>
              <h5 className="text-muted mb-4">By <span className="text-dark fw-semibold">{book.author}</span></h5>

            
              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3" style={{ width: 'fit-content' }}>
                <div className="text-warning fs-5 me-2">
                  <i className="bi bi-star-fill"></i>
                </div>
                <span className="fw-bold text-dark me-2">{book.rating.toFixed(1)}</span>
                <span className="text-muted border-start ps-2">Demo Rating</span>
              </div>

              <h6 className="fw-bold text-dark mb-2">Synopsis</h6>
              <p className="text-muted leading-relaxed mb-4" style={{ textAlign: 'justify' }}>
                {book.description}
              </p>
            </div>

     
            <div className="pt-4 border-top">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-muted small d-block">Price</span>
                  <span className="fw-bold fs-2 text-dark-blue">₹{book.price}</span>
                </div>

                {book.stock > 0 && (
                  <div className="d-flex align-items-center gap-2" style={{ maxWidth: '140px' }}>
                    <span className="small text-muted fw-bold">Qty:</span>
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary px-2"
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center bg-white border"
                        value={quantity}
                        onChange={handleQtyChange}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary px-2"
                        type="button"
                        onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                        disabled={quantity >= book.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-orange text-white flex-grow-1 py-3 fw-bold fs-5"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0 || adding}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link to="/books" className="btn btn-outline-dark-blue px-4 py-3 fw-bold">
                  Back to Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
