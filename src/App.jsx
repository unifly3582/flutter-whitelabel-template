import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PageLayout from './components/layout/PageLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import './App.css';

function App() {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <PageLayout>
              <HomePage />
            </PageLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageLayout>
                <CheckoutPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
