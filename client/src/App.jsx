import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TripsPage from './pages/TripsPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<MainLayout />}>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<CreateTripPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
