import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres] = useState([
    'Programming', 'Technology', 'Science', 'Fiction', 
    'History', 'Biography', 'Self-Help', 'Business', 'Mystery', 'Romance'
  ]);

  // Form toggle and inputs state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Programming');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books');
      setBooks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load books catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddForm = () => {
    setIsEditing(false);
    setCurrentBookId(null);
    setTitle('');
    setAuthor('');
    setGenre('Programming');
    setDescription('');
    setPrice('');
    setStock('');
    setImage('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditForm = (book) => {
    setIsEditing(true);
    setCurrentBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setDescription(book.description);
    setPrice(book.price.toString());
    setStock(book.stock.toString());
    setImage(book.image);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentBookId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !description || price === '' || stock === '' || !image) {
      return toast.error('Please fill in all fields');
    }

    const numPrice = Number(price);
    const numStock = Number(stock);

    if (numPrice < 0 || numStock < 0) {
      return toast.error('Price and stock must be positive numbers');
    }

    const payload = {
      title,
      author,
      genre,
      description,
      price: numPrice,
      stock: numStock,
      image,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await API.put(`/books/${currentBookId}`, payload);
        toast.success('Book updated successfully!');
      } else {
        await API.post('/books', payload);
        toast.success('Book added successfully!');
      }
      closeForm();
      await fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving book details');
      setLoading(false);
    }
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      setLoading(true);
      try {
        await API.delete(`/books/${bookId}`);
        toast.success('Book removed successfully');
        await fetchBooks();
      } catch (error) {
        toast.error('Failed to delete book');
        setLoading(false);
      }
    }
  };

  if (loading && books.length === 0) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold font-serif text-dark-blue mb-0">Manage Books Catalog</h2>
          <p className="text-muted small mb-0">Add, edit, or delete items from the bookstore listings</p>
        </div>
        {!showForm && (
          <button className="btn btn-orange text-white fw-semibold" onClick={openAddForm}>
            <i className="bi bi-plus-lg me-2"></i>Add New Book
          </button>
        )}
      </div>

     
      {showForm && (
        <div className="card shadow border-0 p-4 rounded-3 mb-5 bg-white">
          <h4 className="fw-bold text-dark-blue mb-4 border-bottom pb-2">
            {isEditing ? 'Edit Book Details' : 'Add New Book to Inventory'}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small">Book Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Clean Code"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

             
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold small">Author</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Robert C. Martin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

             
              <div className="col-md-4 mb-2">
                <label className="form-label fw-semibold small">Genre</label>
                <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                  {genres.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              
              <div className="col-md-4 mb-2">
                <label className="form-label fw-semibold small">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 599"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>

             
              <div className="col-md-4 mb-2">
                <label className="form-label fw-semibold small">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 15"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  required
                />
              </div>

             
              <div className="col-md-12 mb-2">
                <label className="form-label fw-semibold small">Cover Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Paste URL (e.g. https://images.unsplash.com/...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold small">Description / Synopsis</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Provide book details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-orange text-white px-4">
                Save Book
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="ps-4">Cover</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Genre</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col" className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="ps-4 py-2">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="rounded"
                      style={{ width: '40px', height: '55px', objectFit: 'contain', backgroundColor: '#f8fafc' }}
                    />
                  </td>
                  <td>
                    <h6 className="fw-semibold mb-0 text-truncate" style={{ maxWidth: '200px' }} title={book.title}>
                      {book.title}
                    </h6>
                  </td>
                  <td className="text-muted small">{book.author}</td>
                  <td><span className="badge bg-secondary">{book.genre}</span></td>
                  <td className="fw-bold">₹{book.price}</td>
                  <td>
                    {book.stock === 0 ? (
                      <span className="text-danger fw-bold small">Out of stock</span>
                    ) : book.stock <= 5 ? (
                      <span className="text-warning fw-bold small">{book.stock} left</span>
                    ) : (
                      <span className="text-success small">{book.stock} units</span>
                    )}
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEditForm(book)}
                      title="Edit book details"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(book._id, book.title)}
                      title="Delete book from system"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
