import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from "./pages/autentificare/autentificare";
import RegisterPage from "./pages/inregistrare/inregistrare";
import { ForgotPasswordPage, VerifyCodePage } from "./pages/recuperarecont/recuperare-parola";
import Dashboard from "./pages/main/main_page";
import ProfilePage from "./pages/profile/profil";
import SettingsPage from "./pages/setari/setari";
import CalendarPage from "./pages/calendar/calendar";
import { useState } from 'react'
import { useUser } from './store/UserContext';

function App() {
    const navigate = useNavigate();
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const { state } = useUser();
    const { profile } = state;

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={
                <LoginPage
                    onBack={() => console.log("Înapoi")}
                    onRegister={() => navigate("/register")}
                    onForgotPassword={() => navigate("/forgotpassword")}
                    onSubmit={(email, password) => {
                        console.log("Login:", email, password);
                        navigate("/dashboard");
                    }}
                />
            } />

            <Route path="/register" element={
                <RegisterPage
                    onBack={() => navigate("/login")}
                    onLogin={() => navigate("/login")}
                    onSubmit={(nickname, email, password) => {
                        console.log("Register:", nickname, email, password);
                    }}
                />
            } />

            <Route path="/forgotpassword" element={
                <ForgotPasswordPage
                    onBack={() => navigate("/login")}
                    onSubmit={(email) => {
                        setRecoveryEmail(email);
                        navigate("/verify");
                    }}
                />
            } />

            <Route path="/verify" element={
                <VerifyCodePage
                    email={recoveryEmail}
                    onBack={() => navigate("/forgotpassword")}
                    onSubmit={(code) => console.log("Cod introdus:", code)}
                    onResend={() => console.log("Cod retrimis")}
                />
            } />

            <Route path="/dashboard" element={
                <Dashboard
                    username={profile.fullName.split(" ")[0]}
                    onProfile={() => navigate("/profile")}
                    onSettings={() => navigate("/settings")}
                    onCalendar={() => navigate("/calendar")}
                />
            } />

            <Route path="/calendar" element={
                <CalendarPage
                    onProfile={() => navigate("/profile")}
                    onSettings={() => navigate("/settings")}
                    onDashboard={() => navigate("/dashboard")}
                />
            } />

            <Route path="/profile" element={
                <ProfilePage
                    onLogin={() => navigate("/login")}
                    onSettings={() => navigate("/settings")}
                    onDashboard={() => navigate("/dashboard")}
                    onCalendar={() => navigate("/calendar")}
                />
            } />

            <Route path="/settings" element={
                <SettingsPage
                    onLogin={() => navigate("/login")}
                    onDashboard={() => navigate("/dashboard")}
                    onProfile={() => navigate("/profile")}
                    onCalendar={() => navigate("/calendar")}
                />
            } />
        </Routes>
    );
}

export default App;