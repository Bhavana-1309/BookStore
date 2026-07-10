import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-secondary';
      case 'Confirmed': return 'bg-primary';
      case 'Shipped': return 'bg-warning text-dark';
      case 'Delivered': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <h2 className="fw-bold font-serif mb-4 text-dark-blue">My Orders</h2>

      {orders.length === 0 ? (
        <div className="card shadow-sm border-0 py-5 px-4 bg-white text-center rounded-4">
          <i className="bi bi-bag-x text-muted" style={{ fontSize: '5rem' }}></i>
          <h3 className="fw-bold mt-3 text-dark-blue">No Orders Placed Yet</h3>
          <p className="text-muted mb-4">You have not placed any orders. Start browsing and complete your first checkout!</p>
          <Link to="/books" className="btn btn-orange text-white px-4 py-2 fw-semibold">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white" key={order._id}>
          
              <div className="card-header bg-light border-0 px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <span className="text-muted small d-block">ORDER ID</span>
                  <span className="font-monospace fw-bold text-dark">{order._id}</span>
                </div>
                <div>
                  <span className="text-muted small d-block text-md-end">DATE PLACED</span>
                  <span className="fw-semibold text-dark">{new Date(order.orderDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
                <div>
                  <span className="text-muted small d-block text-md-end">STATUS</span>
                  <span className={`badge ${getStatusBadgeClass(order.status)} fs-7 px-2.5 py-1.5`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="text-muted small d-block text-md-end">TOTAL DUE</span>
                  <span className="fw-bold text-dark-blue fs-5">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                 
                  <div className="col-md-7">
                    <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Books Purchased</h6>
                    <div className="d-flex flex-column gap-3">
                      {order.books.map((item, idx) => (
                        <div className="d-flex align-items-center gap-3 border-light pb-2 mb-2 border-bottom" key={idx}>
                          <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '55px' }}>
                            <i className="bi bi-book text-muted"></i>
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-semibold text-dark mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>
                              {item.title}
                            </h6>
                            <span className="text-muted small">Price: ₹{item.price} | Qty: {item.quantity}</span>
                          </div>
                          <span className="fw-bold text-dark-blue small">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                 
                  <div className="col-md-5 border-start-md">
                    <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Shipping Information</h6>
                    <div className="p-3 bg-light rounded-3">
                      <p className="small text-dark mb-1"><strong>Receiver Name:</strong> {order.address.fullName}</p>
                      <p className="small text-dark mb-1"><strong>Mobile Number:</strong> {order.address.mobileNumber}</p>
                      <p className="small text-dark mb-1">
                        <strong>Shipping Address:</strong> {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                      <p className="small text-dark mb-0"><strong>Payment Type:</strong> Cash on Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
