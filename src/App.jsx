import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/Landing';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';

import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import InterviewPrep from './pages/InterviewPrep';

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public Pages with Top Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/saved" element={<SavedJobs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
      </Route>
    </Routes>
  );
}
