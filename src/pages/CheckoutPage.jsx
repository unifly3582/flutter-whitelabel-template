import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fullAddress: '',
    pincode: '',
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [orderMessage, setOrderMessage] = useState(''); // For success/error messages
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false); // For loading state on submit button

  // Pre-fill email if user is logged in and has an email (phone auth users might not)
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setFormData(prevData => ({ ...prevData, email: currentUser.email }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');
    setOrderMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLoading(false);
        const { latitude, longitude } = position.coords;
        alert(`Location fetched: Lat: ${latitude}, Lng: ${longitude}. \nWe can pre-fill address fields if a reverse geocoding service is integrated.`);
        console.log('Latitude:', latitude, 'Longitude:', longitude);
      },
      (error) => {
        setLocationLoading(false);
        console.error('Error getting location:', error);
        let message = 'Error getting location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'The request to get user location timed out.';
            break;
          default:
            message += 'An unknown error occurred.';
            break;
        }
        setLocationError(message);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderMessage(''); // Clear previous messages
    setLocationError(''); // Clear location errors

    // Basic validation
    if (!formData.name.trim() || !formData.fullAddress.trim() || !formData.pincode.trim()) {
      setOrderMessage('Error: Please fill in all required fields (Name, Full Address, Pincode).');
      window.scrollTo(0, 0);
      return;
    }
    if (!currentUser || !currentUser.uid) {
      setOrderMessage('Error: User not authenticated. Please log in again.');
      window.scrollTo(0, 0);
      return;
    }

    setIsSubmittingOrder(true);

    const orderData = {
      userId: currentUser.uid,
      userName: formData.name.trim(),
      userEmail: formData.email.trim() || null,
      phoneNumber: currentUser.phoneNumber,
      shippingAddress: {
        name: formData.name.trim(),
        fullAddress: formData.fullAddress.trim(),
        pincode: formData.pincode.trim(),
      },
      items: [],
      totalAmount: 0,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order placed successfully with ID: ', docRef.id);
      setOrderMessage(`Success! Your order has been placed. Order ID: ${docRef.id}`);
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error('Error placing order: ', error);
      setOrderMessage(`Error: Could not place your order. ${error.message}`);
    } finally {
      setIsSubmittingOrder(false);
      window.scrollTo(0, 0);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p className="text-xl font-semibold text-red-600">Please log in to proceed to checkout.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h2>

        {orderMessage && (
          <p className={`p-3 rounded mb-4 text-sm ${orderMessage.startsWith('Error:') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {orderMessage}
          </p>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="fullAddress"
              id="fullAddress"
              rows="3"
              value={formData.fullAddress}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode / ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-dashed border-indigo-400 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {locationLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              )}
              {locationLoading ? 'Fetching Location...' : 'Get My Location (Browser GPS)'}
            </button>
            {locationError && <p className="text-xs text-red-600 mt-1">{locationError}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingOrder || locationLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSubmittingOrder ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage; 