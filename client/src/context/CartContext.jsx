import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      if (token && user) {
        try {
          const { data } = await API.get('/cart');
          setCartItems(data.items || []);
        } catch (error) {
          console.error('Error fetching cart from DB:', error);
          setCartItems([]);
        }
      } else {
       
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          try {
            setCartItems(JSON.parse(localCart));
          } catch (e) {
            localStorage.removeItem('guestCart');
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    syncCart();
  }, [token, user]);

 
  useEffect(() => {
    if (!token || !user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, token, user]);

  
  const addToCart = async (book, quantity = 1) => {
    if (token && user) {
      try {
        const { data } = await API.post('/cart', { bookId: book._id, quantity });
        setCartItems(data.items || []);
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to add item to cart';
        throw new Error(msg);
      }
    } else {
     
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.bookId._id === book._id
        );

        let updatedItems = [...prevItems];
        if (existingItemIndex > -1) {
          const newQty = updatedItems[existingItemIndex].quantity + quantity;
          if (book.stock < newQty) {
            throw new Error(`Cannot add more. Stock limit reached (${book.stock})`);
          }
          updatedItems[existingItemIndex].quantity = newQty;
        } else {
          if (book.stock < quantity) {
            throw new Error(`Cannot add. Stock limit is ${book.stock}`);
          }
          updatedItems.push({ bookId: book, quantity });
        }
        return updatedItems;
      });
    }
  };

  
  const updateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return;

    if (token && user) {
      try {
        const { data } = await API.put('/cart', { bookId, quantity });
        setCartItems(data.items || []);
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to update quantity';
        throw new Error(msg);
      }
    } else {
      
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.bookId._id === bookId) {
            if (item.bookId.stock < quantity) {
              throw new Error(`Cannot set quantity. Stock limit is ${item.bookId.stock}`);
            }
            return { ...item, quantity };
          }
          return item;
        })
      );
    }
  };

  
  const removeFromCart = async (bookId) => {
    if (token && user) {
      try {
        const { data } = await API.delete(`/cart/${bookId}`);
        setCartItems(data.items || []);
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to remove item';
        throw new Error(msg);
      }
    } else {
    
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.bookId._id !== bookId)
      );
    }
  };

  const clearCart = async () => {
    if (token && user) {
      try {
        await API.delete('/cart');
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart in DB:', error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('guestCart');
    }
  };

 
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.bookId?.price || 0;
    return acc + item.quantity * price;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
