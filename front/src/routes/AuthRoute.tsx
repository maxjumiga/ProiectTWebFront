import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AuthRoute() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (location.pathname === '/dashboard' && !onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    if (location.pathname === '/onboarding' && onboardingCompleted) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
