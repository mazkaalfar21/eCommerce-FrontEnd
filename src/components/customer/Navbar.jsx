import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur-md border-b border-dark-300' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-[0.25em] text-white hover:text-primary transition-colors">
            SHOE<span className="text-primary">STORE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={({ isActive }) => `text-sm font-medium uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`}>
              Home
            </NavLink>
            <NavLink to="/produk" className={({ isActive }) => `text-sm font-medium uppercase tracking-wider transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-white'}`}>
              Produk
            </NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/keranjang" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(o => !o)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.nama?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user?.nama?.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-100 border border-dark-300 shadow-xl animate-slide-down">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-200 transition-colors">
                        Dashboard Admin
                      </Link>
                    )}
                    <Link to="/pesanan" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-200 transition-colors">
                      Pesanan Saya
                    </Link>
                    <hr className="border-dark-300" />
                    <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-dark-200 transition-colors">
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn-ghost py-2 px-4 text-xs">Masuk</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-xs">Daftar</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-100 border-t border-dark-300 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white uppercase text-sm tracking-wider">Home</NavLink>
            <NavLink to="/produk" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white uppercase text-sm tracking-wider">Produk</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/pesanan" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white uppercase text-sm tracking-wider">Pesanan</NavLink>
                {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-primary uppercase text-sm tracking-wider">Admin Panel</NavLink>}
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="block py-2 text-red-400 uppercase text-sm tracking-wider">Keluar</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white uppercase text-sm tracking-wider">Masuk</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-primary uppercase text-sm tracking-wider font-semibold">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
