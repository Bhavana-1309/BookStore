import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to "${newStatus}"!`);
      await fetchOrders(); // reload
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-secondary';
      case 'Confirmed': return 'bg-primary';
      case 'Shipped': return 'bg-warning text-dark';
      case 'Delivered': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  if (loading && orders.length === 0) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold font-serif text-dark-blue mb-0">Manage Customer Orders</h2>
          <p className="text-muted small mb-0">Track customer COD orders, view shipping profiles, and update dispatch statuses</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card shadow-sm border-0 py-5 text-center bg-white rounded-4">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4.5rem' }}></i>
          <h4 className="fw-bold mt-3 text-dark-blue">No Orders Recieved</h4>
          <p className="text-muted">There are currently no orders registered in the system database.</p>
        </div>
      ) : (
        <div className="table-responsive card shadow-sm border-0 rounded-4 bg-white">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="ps-4 py-3">Order ID</th>
                <th scope="col" className="py-3">Customer</th>
                <th scope="col" className="py-3">Date</th>
                <th scope="col" className="py-3">Books (Qty)</th>
                <th scope="col" className="py-3 text-end">Total Due</th>
                <th scope="col" className="py-3 text-center">Status</th>
                <th scope="col" className="pe-4 py-3 text-end">Shipping Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  
                  <td className="ps-4">
                    <span className="font-monospace small fw-bold text-dark d-block mb-1" style={{ fontSize: '0.85rem' }}>
                      {order._id}
                    </span>
                  </td>

                  <td>
                    <div>
                      <span className="fw-bold text-dark d-block small">{order.userId?.name || 'Guest User'}</span>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{order.userId?.email || 'N/A'}</span>
                    </div>
                  </td>

                 
                  <td className="small text-muted">
                    {new Date(order.orderDate).toLocaleDateString(undefined, { dateStyle: 'short' })}
                  </td>

                  
                  <td>
                    <div className="small">
                      {order.books.map((item, idx) => (
                        <div key={idx} className="text-truncate" style={{ maxWidth: '200px', fontSize: '0.8rem' }}>
                          • {item.title} <strong>({item.quantity})</strong>
                        </div>
                      ))}
                    </div>
                  </td>

                 
                  <td className="text-end fw-bold text-dark-blue">
                    ₹{order.totalAmount}
                  </td>

                
                  <td className="text-center">
                    <div className="d-flex flex-column align-items-center gap-1.5">
                      <span className={`badge ${getStatusBadgeClass(order.status)} px-2 py-1 mb-1.5`} style={{ fontSize: '0.75rem' }}>
                        {order.status}
                      </span>
                      <select
                        className="form-select form-select-sm bg-light border-0 fw-semibold"
                        style={{ fontSize: '0.8rem', width: '120px' }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </td>

                  
                  <td className="pe-4 text-end">
                    <div className="text-start d-inline-block p-2 bg-light rounded" style={{ fontSize: '0.75rem', maxWidth: '200px' }}>
                      <strong>{order.address.fullName}</strong> ({order.address.mobileNumber})<br />
                      {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
