import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',          label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users',    label: 'User',      icon: '👥' },
  { to: '/admin/brand',    label: 'Brand',     icon: '🏷️' },
  { to: '/admin/kategori', label: 'Kategori',  icon: '📁' },
  { to: '/admin/ukuran',   label: 'Ukuran',    icon: '📏' },
  { to: '/admin/produk',   label: 'Produk',    icon: '👟' },
  { to: '/admin/order',    label: 'Order',     icon: '🛒' },
  { to: '/admin/laporan',  label: 'Laporan',   icon: '📈' },
];

export default function AdminSidebar({ collapsed }) {
  const { user } = useAuth();

  return (
    <aside
      className={`${collapsed ? 'w-[70px]' : 'w-[240px]'} flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out`}
      style={{ background: 'linear-gradient(180deg, #13151e 0%, #0f1117 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        {!collapsed ? (
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide leading-none">ShoeStore</p>
              <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          </Link>
        ) : (
          <Link to="/admin" className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-black text-sm">S</span>
          </Link>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.nama?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{user?.nama}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.15em] font-semibold px-3 pb-2 pt-1">Menu</p>
        )}
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-red-600/15 text-red-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-base flex-shrink-0 transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {icon}
                </span>
                {!collapsed && (
                  <span className="truncate">{label}</span>
                )}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-3 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 text-xs transition-all"
          >
            <span>🏪</span>
            <span>Lihat Toko</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
