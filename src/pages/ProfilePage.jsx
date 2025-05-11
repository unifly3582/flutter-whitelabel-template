import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoadingOrders(false);
        return;
      }
      setLoadingOrders(true);
      setError('');
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userOrders = [];
        querySnapshot.forEach(doc => {
          userOrders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders: ', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  if (!currentUser) {
    return <p className="text-center text-red-500">Please log in to view your profile and orders.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-700"><span className="font-semibold">Phone Number:</span> {currentUser.phoneNumber}</p>
          {currentUser.email && <p className="text-gray-700"><span className="font-semibold">Email:</span> {currentUser.email}</p>}
          <p className="text-gray-700"><span className="font-semibold">User ID:</span> {currentUser.uid}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">My Order History</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
        {loadingOrders ? (
          <p className="text-gray-600">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.substring(0,8)}...</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{order.status.charAt(0).toUpperCase()+order.status.slice(1)}</span></td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${(order.totalAmount||0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 