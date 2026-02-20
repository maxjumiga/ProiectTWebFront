import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
    {
        to: '/dashboard',
        label: 'Panou Principal',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        to: '/utilizatori',
        label: 'Utilizatori',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <div className="logo-text">
                    <span className="logo-name">SănătateApp</span>
                    <span className="logo-sub">Panou Admin</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <span className="nav-section-label">Navigare</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            'nav-link' + (isActive ? ' nav-link--active' : '')
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="admin-chip">
                    <div className="admin-avatar">A</div>
                    <div className="admin-info">
                        <span className="admin-name">Administrator</span>
                        <span className="admin-role">Super Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
