import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/landing/Landing';
import Autentificare from '../features/autentificare/Autentificare';
import Inregistrare from '../features/inregistrare/Inregistrare';
import Dashboard from '../pages/Dashboard/Dashboard';
import Profile from '../pages/Dashboard/profile/Profil';
import Settings from '../pages/Dashboard/settings/Settings';
import Calendar from '../pages/Dashboard/calendar/Calendar';
import Onboarding from '../features/onboarding/Onboarding';
import AuthRoute from './AuthRoute';
import GuestRoute from './GuestRoute';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />

                {/* Guest Routes */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Autentificare />} />
                    <Route path="/register" element={<Inregistrare />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<AuthRoute />}>
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
