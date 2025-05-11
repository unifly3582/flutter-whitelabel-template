import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Thank You for Your Order!</h1>
      <p className="text-lg text-gray-600 mb-2">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="text-md text-gray-500 mb-6">
          Your Order ID is: <span className="font-semibold text-gray-700">{orderId}</span>
        </p>
      )}
      <Link 
        to="/" 
        className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationPage; 