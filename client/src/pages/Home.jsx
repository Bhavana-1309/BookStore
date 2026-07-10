import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await API.get('/books');
        setBooks(data);
      } catch (error) {
        console.error('Error fetching home page books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Derive book listings
  const newArrivals = books.slice(0, 4);
  const popularBooks = [...books].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const featuredBooks = books.filter(b => b.rating >= 4.8).slice(0, 4);

  // Genre categories with display icons
  const categories = [
    { name: 'Programming', icon: 'bi-code-slash' },
    { name: 'Technology', icon: 'bi-cpu' },
    { name: 'Science', icon: 'bi-activity' },
    { name: 'History', icon: 'bi-globe-americas' },
    { name: 'Biography', icon: 'bi-person-badge' },
    { name: 'Self-Help', icon: 'bi-journal-bookmark' },
    { name: 'Business', icon: 'bi-briefcase' },
    { name: 'Mystery', icon: 'bi-fingerprint' },
    { name: 'Romance', icon: 'bi-heart' },
    { name: 'Fiction', icon: 'bi-lightbulb' },
  ];

  return (
    <div>
      {/* Hero Header */}
      <header className="hero-banner d-flex align-items-center">
        <div className="container hero-content py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold font-serif mb-3 text-warning">
                Discover Your Next <span className="text-warning">Literary Adventure</span>
              </h1>
              <p className="lead mb-4 text-white-50">
                Explore thousands of books across different fields—including engineering, computer programming, science, history, romance, and biography. Access outstanding titles curated just for you.
              </p>
              <form onSubmit={handleSearchSubmit} className="d-flex bg-white p-2 rounded shadow-lg">
                <input
                  type="text"
                  className="form-control border-0 bg-transparent text-dark"
                  placeholder="Search by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <button type="submit" className="btn btn-orange text-white px-4">
                  Explore
                </button>
              </form>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <img
                src="https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
                alt="Book Collection"
                className="img-fluid rounded-4 shadow-lg"
                style={{ transform: 'rotate(2deg)', maxHeight: '420px' }}
              />
            </div>
          </div>
        </div>
      </header>


      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-orange fw-bold text-uppercase small">Browse Books By</span>
            <h2 className="fw-bold font-serif">Popular Genres</h2>
            <div className="mx-auto bg-orange mt-2" style={{ width: '60px', height: '3px' }}></div>
          </div>
          <div className="row row-cols-2 row-cols-md-5 g-4">
            {categories.map((cat, idx) => (
              <div className="col" key={idx}>
                <Link
                  to={`/books?genre=${cat.name}`}
                  className="card text-center p-4 border border-light h-100 text-decoration-none bg-light d-block shadow-sm rounded-3 transition"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="text-orange fs-1 mb-3">
                    <i className={`bi ${cat.icon}`}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          
          {featuredBooks.length > 0 && (
            <section className="py-5 bg-light">
              <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <span className="text-orange fw-bold text-uppercase small">Handpicked</span>
                    <h2 className="fw-bold font-serif mb-0">Featured Books</h2>
                  </div>
                  <Link to="/books" className="btn btn-outline-orange btn-sm">
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="row g-4">
                  {featuredBooks.map((book) => (
                    <div className="col-lg-3 col-md-6 col-sm-6" key={book._id}>
                      <div className="book-card card border-0 h-100">
                        <div className="book-card-img-wrapper">
                          <img src={book.image} alt={book.title} className="book-card-img" />
                          <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark font-monospace">
                            <i className="bi bi-star-fill text-dark me-1"></i>{book.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="card-body d-flex flex-column p-4">
                          <span className="text-orange small fw-bold text-uppercase">{book.genre}</span>
                          <h6 className="card-title fw-bold text-dark my-1 text-truncate" title={book.title}>
                            {book.title}
                          </h6>
                          <p className="card-text text-muted small text-truncate-2 mb-3">
                            By {book.author}
                          </p>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <span className="fw-bold fs-5 text-dark-blue">₹{book.price}</span>
                            <Link to={`/books/${book._id}`} className="btn btn-sm btn-dark-blue px-3">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        
          {newArrivals.length > 0 && (
            <section className="py-5 bg-white">
              <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <span className="text-orange fw-bold text-uppercase small">Fresh Collection</span>
                    <h2 className="fw-bold font-serif mb-0">New Arrivals</h2>
                  </div>
                  <Link to="/books" className="btn btn-outline-orange btn-sm">
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="row g-4">
                  {newArrivals.map((book) => (
                    <div className="col-lg-3 col-md-6 col-sm-6" key={book._id}>
                      <div className="book-card card border-0 h-100">
                        <div className="book-card-img-wrapper">
                          <img src={book.image} alt={book.title} className="book-card-img" />
                          {book.stock === 0 && (
                            <span className="position-absolute top-0 end-0 m-3 badge bg-danger text-white">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div className="card-body d-flex flex-column p-4">
                          <span className="text-orange small fw-bold text-uppercase">{book.genre}</span>
                          <h6 className="card-title fw-bold text-dark my-1 text-truncate" title={book.title}>
                            {book.title}
                          </h6>
                          <p className="card-text text-muted small text-truncate-2 mb-3">
                            By {book.author}
                          </p>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <span className="fw-bold fs-5 text-dark-blue">₹{book.price}</span>
                            <Link to={`/books/${book._id}`} className="btn btn-sm btn-dark-blue px-3">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          
          {popularBooks.length > 0 && (
            <section className="py-5 bg-light">
              <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <span className="text-orange fw-bold text-uppercase small">Highly Rated</span>
                    <h2 className="fw-bold font-serif mb-0">Best Sellers</h2>
                  </div>
                  <Link to="/books" className="btn btn-outline-orange btn-sm">
                    View All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
                <div className="row g-4">
                  {popularBooks.map((book) => (
                    <div className="col-lg-3 col-md-6 col-sm-6" key={book._id}>
                      <div className="book-card card border-0 h-100">
                        <div className="book-card-img-wrapper">
                          <img src={book.image} alt={book.title} className="book-card-img" />
                        </div>
                        <div className="card-body d-flex flex-column p-4">
                          <span className="text-orange small fw-bold text-uppercase">{book.genre}</span>
                          <h6 className="card-title fw-bold text-dark my-1 text-truncate" title={book.title}>
                            {book.title}
                          </h6>
                          <p className="card-text text-muted small text-truncate-2 mb-3">
                            By {book.author}
                          </p>
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <span className="fw-bold fs-5 text-dark-blue">₹{book.price}</span>
                            <Link to={`/books/${book._id}`} className="btn btn-sm btn-dark-blue px-3">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

   
      <section className="py-5 text-white bg-dark-blue-light position-relative">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <i className="bi bi-truck text-warning" style={{ fontSize: '3rem' }}></i>
              <h2 className="fw-bold font-serif mt-3 mb-2">Shop Risk-Free with Cash on Delivery</h2>
              <p className="lead text-white-50 mb-4">
                We believe in simple shopping. Pay for your order right at your doorstep. Fast shipping, easy checkout, and no credit card required.
              </p>
              <Link to="/books" className="btn btn-orange text-white px-4 py-2 fs-6">
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
