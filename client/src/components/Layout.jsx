import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
    const { user, logout } = useAuth();

    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="layout">
            <header className="header">
                <div className="header-left">
                    <div className="header-logo">
                        <img src="/kiot-logo.png" alt="KIOT Logo" style={{ height: '40px', width: 'auto' }} />
                    </div>
                    <div className="header-title-group">
                        <h1>Faculty Task Tracker</h1>
                        <span className="header-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Kiot - Placement & IR</span>
                    </div>
                </div>
                <div className="header-center-info" style={{ marginLeft: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>📅 {dateString}</span>
                </div>

                <nav className="header-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        📋 Dashboard
                    </NavLink>
                    <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        📊 Progress
                    </NavLink>
                </nav>

                <div className="header-right">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className={`user-role ${user?.role?.toLowerCase()}`}>
                            {user?.role}
                        </span>
                    </div>
                    <button onClick={logout} className="btn btn-secondary logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
