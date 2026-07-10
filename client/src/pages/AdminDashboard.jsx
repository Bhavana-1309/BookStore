import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes, usersRes] = await Promise.all([
          API.get('/books'),
          API.get('/orders'),
          API.get('/auth/users'), // We'll add this admin-only endpoint next
        ]);

        const books = booksRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        setStats({
          totalUsers: users.length,
          totalBooks: books.length,
          totalOrders: orders.length,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
        <div>
          <span className="badge bg-primary text-uppercase mb-1">Overview</span>
          <h2 className="fw-bold font-serif text-dark-blue mb-0">Admin Control Panel</h2>
        </div>
        <span className="text-muted small">Logged in as <strong>Admin</strong></span>
      </div>

      
      <div className="row g-4 mb-5">
        
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-row align-items-center justify-content-between border-start border-4 border-primary">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Customers</span>
              <h3 className="fw-bold mb-0 text-dark-blue">{stats.totalUsers}</h3>
            </div>
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 fs-3">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>

       
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-row align-items-center justify-content-between border-start border-4 border-warning">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Books</span>
              <h3 className="fw-bold mb-0 text-dark-blue">{stats.totalBooks}</h3>
            </div>
            <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 fs-3">
              <i className="bi bi-book-half"></i>
            </div>
          </div>
        </div>

       
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-row align-items-center justify-content-between border-start border-4 border-success">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Orders</span>
              <h3 className="fw-bold mb-0 text-dark-blue">{stats.totalOrders}</h3>
            </div>
            <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 fs-3">
              <i className="bi bi-cart-check-fill"></i>
            </div>
          </div>
        </div>

        
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-row align-items-center justify-content-between border-start border-4 border-danger">
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Revenue</span>
              <h3 className="fw-bold mb-0 text-dark-blue">₹{stats.totalRevenue}</h3>
            </div>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 fs-3">
              <i className="bi bi-currency-rupee"></i>
            </div>
          </div>
        </div>
      </div>


      <h4 className="fw-bold text-dark-blue mb-4 font-serif">Quick Actions</h4>
      <div className="row g-4">
    
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-dark-blue mb-2">
                <i className="bi bi-journal-plus text-warning me-2"></i>Book Inventory Management
              </h5>
              <p className="text-muted small mb-4">
                Add new arrivals, update current stock counts, modify selling prices, delete old catalogs, and adjust genres details.
              </p>
            </div>
            <Link to="/admin/books" className="btn btn-dark-blue mt-auto text-start py-2.5 w-100 d-flex justify-content-between align-items-center">
              <span>Go to Inventory manager</span>
              <i className="bi bi-arrow-right-short fs-5"></i>
            </Link>
          </div>
        </div>

      
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-dark-blue mb-2">
                <i className="bi bi-truck-flatbed text-success me-2"></i>Customer Orders Management
              </h5>
              <p className="text-muted small mb-4">
                Track placed orders, view shipping addresses, update statuses (Pending &rarr; Confirmed &rarr; Shipped &rarr; Delivered), and log billing.
              </p>
            </div>
            <Link to="/admin/orders" className="btn btn-dark-blue mt-auto text-start py-2.5 w-100 d-flex justify-content-between align-items-center">
              <span>Go to Orders manager</span>
              <i className="bi bi-arrow-right-short fs-5"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
