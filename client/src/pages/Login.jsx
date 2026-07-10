import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { loginUser, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

 
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
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill for grading and demo purposes
  const autofillDemo = (type) => {
    if (type === 'user') {
      setEmail('user@gmail.com');
      setPassword('user123');
    } else {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: '480px', width: '100%', borderRadius: '12px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold font-serif text-dark-blue">Welcome Back</h2>
          <p className="text-muted">Sign in to manage your orders and cart</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-bold small text-dark">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope"></i></span>
              <input
                type="email"
                className="form-control bg-light border-start-0"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-bold small text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control bg-light border-start-0"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-orange text-white w-100 py-2.5 fw-bold mb-3"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Sign In
          </button>
        </form>

        {/* Demo Quick-Fill Buttons */}
        <div className="mb-4 p-3 bg-light border rounded text-center">
          <p className="small fw-semibold text-muted mb-2"><i className="bi bi-lightning-charge-fill text-warning me-1"></i>Demo Accounts for Grading</p>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-2.5"
              onClick={() => autofillDemo('user')}
            >
              Fill Customer
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm px-2.5"
              onClick={() => autofillDemo('admin')}
            >
              Fill Admin
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted small mb-0">
            Don't have an account? <Link to="/register" className="text-orange fw-semibold text-decoration-none">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
