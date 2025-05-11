import React from 'react';
import LoginPage from './pages/LoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import './App.css';

function App() {
  const { currentUser, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <div className="App">
      <header className="p-4 bg-gray-100 text-center">
        <h1 className="text-2xl font-bold">My Whitelabel App</h1>
        {currentUser && (
          <div className="mt-2">
            <p>Logged in as: {currentUser.phoneNumber}</p>
            <button
              onClick={async () => {
                try {
                  await logout();
                  console.log("User logged out");
                } catch (error) {
                  console.error("Logout failed", error);
                }
              }}
              className="mt-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main>
        {!currentUser ? (
          <LoginPage />
        ) : (
          <CheckoutPage />
        )}
      </main>
    </div>
  );
}

export default App;
