import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PageLayout from './components/layout/PageLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import useThemeApplier from './hooks/useThemeApplier.js';
import { useAuth } from './contexts/AuthContext.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import './App.css';
import { layoutConfig } from './config/layoutConfig.js';

// Dynamic homepage variants
const HomePageDefault = lazy(() => import('./pages/home/HomePage_Default.jsx'));
const HomePageVariantA = lazy(() => import('./pages/home/HomePage_VariantA.jsx'));

function App() {
  useThemeApplier();
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading application...</div>
      </div>
    );
  }

  // Determine which homepage variant to render
  let HomeComponent;
  switch (layoutConfig.homePageVariant) {
    case 'variantA':
      HomeComponent = HomePageVariantA;
      break;
    case 'default':
    default:
      HomeComponent = HomePageDefault;
  }

  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-xl font-semibold">Loading page...</div></div>}>
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/"
            element={
              <PageLayout>
                <HomeComponent />
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <ProfilePage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <OrderConfirmationPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
