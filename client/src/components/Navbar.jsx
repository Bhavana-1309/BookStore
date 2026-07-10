import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-book-half me-2 text-warning"></i>
          Book<span>Store</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
         
          <form className="d-flex mx-auto my-2 my-lg-0 w-50" onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <button className="btn btn-orange text-white" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`} to="/books">
                Books
              </Link>
            </li>

            
            <li className="nav-item me-2">
              <Link
                className={`nav-link position-relative ${location.pathname === '/cart' ? 'active' : ''}`}
                to="/cart"
              >
                <i className="bi bi-cart3 fs-5"></i>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            </li>

           
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle btn btn-outline-light text-white text-start px-3 py-1 ms-lg-2 mt-2 mt-lg-0"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i> {user.name.split(' ')[0]}
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/myorders">
                      <i className="bi bi-bag-check me-2"></i> My Orders
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item py-2 text-primary" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i> Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={logoutUser}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2 ms-lg-3 mt-2 mt-lg-0">
                <Link className="btn btn-outline-light btn-sm px-3 py-1.5" to="/login">
                  Login
                </Link>
                <Link className="btn btn-orange btn-sm px-3 py-1.5 text-white" to="/register">
                  Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
