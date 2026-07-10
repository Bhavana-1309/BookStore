import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { cartItems, clearCart, totalItems, totalAmount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!fullName || !mobileNumber || !address || !city || !state || !pincode) {
      return toast.error('Please fill in all address fields');
    }

    if (mobileNumber.length < 10) {
      return toast.error('Please enter a valid mobile number');
    }

    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      return toast.error('Pincode must be exactly 6 digits');
    }

    setLoading(true);
    try {
      const orderPayload = {
        address: {
          fullName,
          mobileNumber,
          address,
          city,
          state,
          pincode,
        },
      };

      const { data } = await API.post('/orders', orderPayload);
      setPlacedOrder(data);
      setOrderSuccess(true);
      await clearCart(); // Clean cart items in state and DB
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-lg border-0 py-5 px-4 bg-white mx-auto rounded-4" style={{ maxWidth: '600px' }}>
          <div className="text-success mb-3" style={{ fontSize: '4.5rem' }}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="fw-bold font-serif text-dark-blue mb-2">Order Confirmed!</h2>
          <p className="text-muted mb-4">
            Thank you for shopping with us! Your order of <strong>₹{placedOrder?.totalAmount}</strong> has been successfully registered. We will deliver it to your address shortly via Cash on Delivery.
          </p>

          <div className="p-3 bg-light rounded-3 text-start mb-4 border border-light">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-2">Shipping Information</h6>
            <p className="small text-muted mb-1"><strong>Receiver:</strong> {placedOrder?.address.fullName}</p>
            <p className="small text-muted mb-1"><strong>Mobile:</strong> {placedOrder?.address.mobileNumber}</p>
            <p className="small text-muted mb-1"><strong>Address:</strong> {placedOrder?.address.address}, {placedOrder?.address.city}, {placedOrder?.address.state} - {placedOrder?.address.pincode}</p>
            <p className="small text-muted mb-0"><strong>Status:</strong> <span className="badge bg-secondary">{placedOrder?.status}</span></p>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/myorders" className="btn btn-orange text-white px-4 py-2.5 fw-bold">
              View My Orders
            </Link>
            <Link to="/books" className="btn btn-outline-dark-blue px-4 py-2.5 fw-semibold">
              Browse More Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold font-serif mb-4 text-dark-blue">Checkout</h2>

      <div className="row g-4">
      
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
            <h4 className="fw-bold text-dark-blue mb-4 border-bottom pb-2">
              <i className="bi bi-truck me-2 text-orange"></i>Shipping Address
            </h4>

            <form onSubmit={handleSubmitOrder}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold small">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Receiver's name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              
              <div className="mb-3">
                <label className="form-label fw-semibold small">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control bg-light"
                  placeholder="10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>

           
              <div className="mb-3">
                <label className="form-label fw-semibold small">Address (Street, Area, Landmark)</label>
                <textarea
                  className="form-control bg-light"
                  rows="3"
                  placeholder="Flat No, Building, Area, Street Name"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

            
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">City</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">State</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Pincode</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>
              </div>

             
              <div className="mt-4 pt-3 border-top">
                <h5 className="fw-bold text-dark-blue mb-3">Payment Method</h5>
                <div className="form-check p-3 bg-light rounded border border-warning d-flex align-items-center">
                  <input
                    className="form-check-input ms-0 me-3"
                    type="radio"
                    name="paymentMethod"
                    id="codRadio"
                    defaultChecked
                  />
                  <label className="form-check-label d-flex align-items-center" htmlFor="codRadio">
                    <div>
                      <span className="fw-bold text-dark d-block">Cash on Delivery (COD)</span>
                      <span className="text-muted small">Pay with cash upon package receipt.</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-orange text-white w-100 py-3 fw-bold fs-5 rounded-3 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                Place Order (₹{totalAmount})
              </button>
            </form>
          </div>
        </div>

        
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
            <h4 className="fw-bold text-dark-blue mb-4 border-bottom pb-2">Order Items</h4>
            <div className="overflow-auto mb-4" style={{ maxHeight: '280px' }}>
              {cartItems.map((item) => {
                const book = item.bookId;
                if (!book) return null;
                return (
                  <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3" key={book._id}>
                    <img
                      src={book.image}
                      alt={book.title}
                      className="rounded shadow-sm"
                      style={{ width: '40px', height: '55px', objectFit: 'contain', backgroundColor: '#f8fafc' }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                        {book.title}
                      </h6>
                      <span className="text-muted small">Qty: {item.quantity} × ₹{book.price}</span>
                    </div>
                    <span className="fw-semibold text-dark-blue small">₹{book.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between mb-2 text-muted small">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted small">
              <span>Shipping cost</span>
              <span className="text-success fw-bold">FREE</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-0 text-dark-blue">
              <span className="fw-bold fs-5">Total Due</span>
              <span className="fw-bold fs-4">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
