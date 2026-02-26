import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/utilizatori/UserManagement';
import GestionareAlimente from './pages/alimente/GestionareAlimente';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Header />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/utilizatori" element={<UserManagement />} />
              <Route path="/alimente" element={<GestionareAlimente />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
