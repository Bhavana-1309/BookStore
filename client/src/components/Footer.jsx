import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom pt-5 pb-4 mt-10">
      <div className="container">
        <div className="row g-4">
          
          <div className="col-lg-4 col-md-6">
            <h5 className="font-serif mb-3 text-warning">
              <i className="bi bi-book-half me-2"></i>BookStore
            </h5>
            <p className="text-white-50">
              Your ultimate destination for discovering knowledge, exploring fiction, and finding your next favorite read. Providing quality service and fast delivery at your doorstep.
            </p>
            <p className="mb-0 text-white-50">
              <i className="bi bi-geo-alt me-2 text-warning"></i> 123 Main Street, Cityville
            </p>
            <p className="mb-0 text-white-50">
              <i className="bi bi-telephone me-2 text-warning"></i> +1 234 567 890
            </p>
          </div>

     
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-3">Explore</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/books">All Books</Link></li>
              <li className="mb-2"><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

      
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2"><Link to="/books?genre=Programming">Programming</Link></li>
              <li className="mb-2"><Link to="/books?genre=Technology">Technology</Link></li>
              <li className="mb-2"><Link to="/books?genre=Science">Science</Link></li>
              <li className="mb-2"><Link to="/books?genre=Fiction">Fiction</Link></li>
            </ul>
          </div>

         
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-3">Subscribe</h5>
            <p className="text-white-50">Receive updates on new arrivals, flash sales, and special discounts.</p>
            <form className="mb-3" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your Email Address" required />
                <button className="btn btn-orange text-white" type="submit">Join</button>
              </div>
            </form>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark px-2 py-1.5 fs-7 font-monospace">
                <i className="bi bi-truck me-1"></i> Cash on Delivery Available
              </span>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-white-50">
              &copy; {new Date().getFullYear()} BookStore. Built for Intermediate College Level MERN Project.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 text-white">
              <a href="#" className="text-white-50"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-twitter fs-5"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-instagram fs-5"></i></a>
              <a href="#" className="text-white-50"><i className="bi bi-github fs-5"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
