import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminHeader({ onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil');
    navigate('/login');
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{ background: '#0f1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb placeholder */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span>Admin</span>
          <span>/</span>
          <span className="text-white">Panel</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notif */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all relative">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(o => !o)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xs">
              {user?.nama?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-xs font-semibold leading-none">{user?.nama?.split(' ')[0]}</p>
              <p className="text-gray-500 text-[10px] mt-0.5 capitalize">{user?.role}</p>
            </div>
            <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50 py-1"
              style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
            >
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-white text-xs font-semibold">{user?.nama}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
              <Link
                to="/"
                onClick={() => setDropOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 text-xs transition-all"
              >
                <span>🏪</span> Lihat Toko
              </Link>
              <button
                onClick={() => { setDropOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs transition-all"
              >
                <span>🚪</span> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
