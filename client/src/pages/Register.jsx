import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { registerUser, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Admin or User selector for project demo flexibility
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error('Please fill in all required fields');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = await registerUser(name, email, password, phone, role);
      toast.success(`Account registered! Welcome, ${data.name}`);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: '520px', width: '100%', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold font-serif text-dark-blue">Create Account</h2>
          <p className="text-muted">Join BookStore and discover great titles</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Full Name <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Email Address <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control bg-light"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Mobile Number</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
              <input
                type="tel"
                className="form-control bg-light"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Role Dropdown (for demo purposes) */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Account Role (Demo Select)</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-shield-check"></i></span>
              <select className="form-select bg-light" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">Customer (Normal User)</option>
                <option value="admin">Administrator (Admin Dashboard access)</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold small text-dark">Password <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control bg-light"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small text-dark">Confirm Password <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control bg-light"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-orange text-white w-100 py-2.5 fw-bold mb-3 mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted small mb-0">
            Already have an account? <Link to="/login" className="text-orange fw-semibold text-decoration-none">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
