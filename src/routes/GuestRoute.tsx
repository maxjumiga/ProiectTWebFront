import { Navigate, Outlet } from 'react-router-dom';

export default function GuestRoute() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';

    if (isAuthenticated) {
        if (onboardingCompleted) {
            return <Navigate to="/dashboard" replace />;
        } else {
            return <Navigate to="/onboarding" replace />;
        }
    }

    return <Outlet />;
}
