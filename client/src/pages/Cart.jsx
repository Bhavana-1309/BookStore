import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalAmount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQtyChange = async (bookId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      return toast.error(`Only ${stock} items available in stock`);
    }
    try {
      await updateQuantity(bookId, newQty);
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (bookId, title) => {
    try {
      await removeFromCart(bookId);
      toast.success(`Removed "${title}" from cart`);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      toast.error('Please log in or create an account to proceed to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 py-5 px-4 bg-white mx-auto rounded-4" style={{ maxWidth: '600px' }}>
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
          <h2 className="fw-bold mt-4 font-serif text-dark-blue">Your Cart is Empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added any books to your cart yet. Explore our collection of programming, science, history, fiction, and more to find your next great read!
          </p>
          <Link to="/books" className="btn btn-orange text-white px-5 py-2.5 fw-bold">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold font-serif mb-4 text-dark-blue">Shopping Cart</h2>

      <div className="row g-4">
      
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="bg-light text-muted small uppercase">
                  <tr>
                    <th scope="col" className="ps-4 py-3">Book</th>
                    <th scope="col" className="py-3 text-center">Quantity</th>
                    <th scope="col" className="py-3 text-end">Price</th>
                    <th scope="col" className="pe-4 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const book = item.bookId;
                    if (!book) return null;
                    return (
                      <tr key={book._id} className="border-bottom">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="rounded shadow-sm"
                              style={{ width: '55px', height: '75px', objectFit: 'contain', backgroundColor: '#f8fafc' }}
                            />
                            <div>
                              <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ maxWidth: '220px' }}>
                                <Link to={`/books/${book._id}`} className="text-decoration-none text-dark hover-orange">
                                  {book.title}
                                </Link>
                              </h6>
                              <span className="text-muted small">By {book.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="d-inline-flex align-items-center bg-light rounded-pill border">
                            <button
                              className="btn btn-sm btn-link text-dark text-decoration-none px-2.5 py-1"
                              onClick={() => handleQtyChange(book._id, item.quantity - 1, book.stock)}
                              disabled={item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="px-2 fw-semibold small text-dark" style={{ minWidth: '24px' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-link text-dark text-decoration-none px-2.5 py-1"
                              onClick={() => handleQtyChange(book._id, item.quantity + 1, book.stock)}
                              disabled={item.quantity >= book.stock}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-end fw-bold text-dark-blue">
                          ₹{book.price * item.quantity}
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <button
                            className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                            onClick={() => handleRemove(book._id, book.title)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash3 fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
            <h4 className="fw-bold text-dark-blue mb-4 pb-2 border-bottom">Order Summary</h4>

            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Total Items</span>
              <span className="fw-semibold text-dark">{totalItems}</span>
            </div>

            <div className="d-flex justify-content-between mb-4 pb-2 text-muted">
              <span>Subtotal</span>
              <span className="fw-semibold text-dark">₹{totalAmount}</span>
            </div>

            <div className="d-flex justify-content-between mb-4 text-dark-blue">
              <span className="fw-bold fs-5">Total Amount</span>
              <span className="fw-bold fs-4">₹{totalAmount}</span>
            </div>

            <div className="alert alert-warning border-0 text-dark small mb-4 py-2.5">
              <i className="bi bi-truck me-2 fs-5 align-middle"></i>
              Cash on Delivery will be applied. Free delivery!
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="btn btn-orange text-white w-100 py-3 fw-bold fs-5 rounded-3 mb-2"
            >
              Proceed to Checkout
            </button>
            <Link to="/books" className="btn btn-outline-dark-blue w-100 py-2.5 fw-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
