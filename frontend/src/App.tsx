import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';

import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import Budget from './pages/Budget';
import Packing from './pages/Packing';
import Notes from './pages/Notes';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import SharedView from './pages/SharedView';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/shared/:token" element={<SharedView />} />

        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/trips" element={<Protected><MyTrips /></Protected>} />
        <Route path="/trips/new" element={<Protected><CreateTrip /></Protected>} />
        <Route path="/trips/:id" element={<Protected><ItineraryView /></Protected>} />
        <Route path="/trips/:id/edit" element={<Protected><CreateTrip /></Protected>} />
        <Route path="/itinerary" element={<Protected><ItineraryBuilder /></Protected>} />
        <Route path="/itinerary/:id" element={<Protected><ItineraryBuilder /></Protected>} />
        <Route path="/budget" element={<Protected><Budget /></Protected>} />
        <Route path="/packing" element={<Protected><Packing /></Protected>} />
        <Route path="/notes" element={<Protected><Notes /></Protected>} />
        <Route path="/cities" element={<Protected><CitySearch /></Protected>} />
        <Route path="/activities" element={<Protected><ActivitySearch /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/admin" element={<Protected><Admin /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
