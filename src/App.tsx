import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from "./autentificare/autentificare";
import RegisterPage from "./inregistrare/inregistrare";
import { ForgotPasswordPage, VerifyCodePage } from "./recuperarecont/recuperare-parola";
import Dashboard from "./main/main_page";
import ProfilePage from "./profile/profil";
import SettingsPage from "./setari/setari";
// import CalendarPage from "./calendar/calendar";
import { useState } from 'react'

function App() {
    const navigate = useNavigate();
    const [recoveryEmail, setRecoveryEmail] = useState("");

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
                    username="Ion"
                    onProfile={() => navigate("/profile")}
                    onSettings={() => navigate("/settings")}
                />
            } />
            {/* <Route path="/calendar" element={
                <CalendarPage
                    onProfile={() => navigate("/profile")}
                    onSettings={() => navigate("/settings")}
                    onDashboard={() => navigate("/dashboard")}
                />
            } /> */}

            <Route path="/profile" element={
                <ProfilePage
                    username="Ion Popescu"
                    email="ion.popescu@gmail.com"
                    onLogin={() => navigate("/login")}
                    onSettings={() => navigate("/settings")}
                    onDashboard={() => navigate("/dashboard")}
                />
            } />

            <Route path="/settings" element={
                <SettingsPage
                    username="Ion"
                    onLogin={() => navigate("/login")}
                    onDashboard={() => navigate("/dashboard")}
                    onProfile={() => navigate("/profile")}
                />
            } />
        </Routes>
    );
}

export default App;