import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Autentificare from '../autentificare/autentificare';
import Inregistrare from '../inregistrare/inregistrare';
import Dashboard from '../pages/Dashboard';
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
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
