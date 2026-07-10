import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Books = () => {
  const { addToCart } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search parameters state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([
    'All', 'Programming', 'Technology', 'Science', 'Fiction', 
    'History', 'Biography', 'Self-Help', 'Business', 'Mystery', 'Romance'
  ]);
  
  // Local filter states (synced with searchParams)
  const searchVal = searchParams.get('search') || '';
  const genreVal = searchParams.get('genre') || 'All';
  const authorVal = searchParams.get('author') || '';
  const minPriceVal = searchParams.get('minPrice') || '';
  const maxPriceVal = searchParams.get('maxPrice') || '';
  const sortByVal = searchParams.get('sortBy') || '';

  const [search, setSearch] = useState(searchVal);
  const [genre, setGenre] = useState(genreVal);
  const [author, setAuthor] = useState(authorVal);
  const [minPrice, setMinPrice] = useState(minPriceVal);
  const [maxPrice, setMaxPrice] = useState(maxPriceVal);
  const [sortBy, setSortBy] = useState(sortByVal);

  // Sync state with URL params changes (e.g. searching from Navbar)
  useEffect(() => {
    setSearch(searchVal);
    setGenre(genreVal);
    setAuthor(authorVal);
    setMinPrice(minPriceVal);
    setMaxPrice(maxPriceVal);
    setSortBy(sortByVal);
  }, [searchParams]);

  // Fetch books matching current search parameters
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (genreVal && genreVal !== 'All') params.genre = genreVal;
      if (authorVal) params.author = authorVal;
      if (minPriceVal) params.minPrice = minPriceVal;
      if (maxPriceVal) params.maxPrice = maxPriceVal;
      if (sortByVal) params.sortBy = sortByVal;

      const { data } = await API.get('/books', { params });
      setBooks(data);
    } catch (error) {
      console.error('Error fetching catalog books:', error);
      toast.error('Failed to load books. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  // Update URL params triggering fetch
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (genre !== 'All') newParams.genre = genre;
    if (author.trim()) newParams.author = author.trim();
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (sortBy) newParams.sortBy = sortBy;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setGenre('All');
    setAuthor('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchParams({});
  };

  const handleAddToCart = async (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(book, 1);
      toast.success(`"${book.title}" added to cart!`);
    } catch (error) {
      toast.error(error.message || 'Could not add book to cart');
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 p-4 rounded-3 glass-panel">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-dark-blue">Filters</h5>
              <button className="btn btn-link text-orange text-decoration-none p-0 small fw-bold" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <form onSubmit={applyFilters}>
              {/* Category Filter */}
              <div className="mb-4">
                <label className="filter-title">Genre</label>
                <select
                  className="form-select bg-light border-0"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  {genres.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div className="mb-4">
                <label className="filter-title">Author</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Filter by author..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <label className="filter-title">Price Range (₹)</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control bg-light border-0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    className="form-control bg-light border-0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-4">
                <label className="filter-title">Sort By</label>
                <select
                  className="form-select bg-light border-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Latest Arrivals</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <button type="submit" className="btn btn-orange text-white w-100 py-2 fw-semibold">
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        
        <div className="col-lg-9">
        
          <div className="card shadow-sm border-0 px-4 py-3 rounded-3 mb-4 bg-white d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <p className="mb-0 text-muted">
                Showing <span className="fw-semibold text-dark">{books.length}</span> books
              </p>
            </div>
          
            <div style={{ maxWidth: '300px', width: '100%' }}>
              <form onSubmit={applyFilters} className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search catalog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-orange text-white" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          </div>

       
          {loading ? (
            <LoadingSpinner />
          ) : books.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-3 py-5 text-center bg-white">
              <i className="bi bi-journal-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="fw-bold mt-3 text-dark-blue">No Books Found</h4>
              <p className="text-muted mb-4 px-3">We couldn't find any books matching your search filters.</p>
              <button className="btn btn-orange text-white mx-auto px-4" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {books.map((book) => (
                <div className="col-md-4 col-sm-6" key={book._id}>
                  <div className="book-card card border-0 h-100">
                  
                    <div className="book-card-img-wrapper">
                      <img src={book.image} alt={book.title} className="book-card-img" />
                      
                      <span className="position-absolute bottom-0 start-0 m-3 badge badge-orange">
                        {book.genre}
                      </span>
                    
                      {book.stock === 0 ? (
                        <span className="position-absolute top-0 end-0 m-3 badge bg-danger text-white">
                          Out of stock
                        </span>
                      ) : book.stock <= 5 ? (
                        <span className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark">
                          Only {book.stock} left
                        </span>
                      ) : null}
                    </div>

                    
                    <div className="card-body d-flex flex-column p-4">
                    
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning small me-2">
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <span className="small text-muted font-monospace">{book.rating.toFixed(1)} / 5.0</span>
                      </div>

                      <h6 className="card-title fw-bold text-dark my-1 text-truncate" title={book.title}>
                        {book.title}
                      </h6>
                      <p className="card-text text-muted small text-truncate mb-3">
                        By {book.author}
                      </p>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-5 text-dark-blue">₹{book.price}</span>
                        <div className="d-flex gap-2">
                          <button
                            onClick={(e) => handleAddToCart(e, book)}
                            className="btn btn-sm btn-orange px-2"
                            title="Add to Cart"
                            disabled={book.stock === 0}
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                          <a href={`/books/${book._id}`} className="btn btn-sm btn-outline-dark-blue px-2.5">
                            Info
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
