import { Routes, Route, Navigate } from "react-router-dom";
import OnboardingLayout from "./features/onboarding/OnboardingLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" />} />
      <Route path="/onboarding" element={<OnboardingLayout />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}