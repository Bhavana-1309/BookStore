import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card shadow-sm border-0 py-5 px-4 bg-white rounded-4" style={{ maxWidth: '500px' }}>
        <i className="bi bi-journal-medical text-warning mb-3" style={{ fontSize: '5rem' }}></i>
        <h1 className="display-4 fw-bold font-serif text-dark-blue mb-2">404</h1>
        <h3 className="fw-bold mb-3 text-dark">Page Not Found</h3>
        <p className="text-muted mb-4">
          Oops! The page you are looking for does not exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>
        <Link to="/" className="btn btn-orange text-white px-4 py-2 fw-semibold">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
