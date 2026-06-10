import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Guards
import PrivateRoute from './components/guards/PrivateRoute';
import AdminRoute from './components/guards/AdminRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProdukPage from './pages/customer/ProdukPage';
import DetailProdukPage from './pages/customer/DetailProdukPage';
import KeranjangPage from './pages/customer/KeranjangPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import RiwayatPesananPage from './pages/customer/RiwayatPesananPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminBrandPage from './pages/admin/AdminBrandPage';
import AdminKategoriPage from './pages/admin/AdminKategoriPage';
import AdminUkuranPage from './pages/admin/AdminUkuranPage';
import AdminProdukPage from './pages/admin/AdminProdukPage';
import AdminOrderPage from './pages/admin/AdminOrderPage';
import AdminLaporanPage from './pages/admin/AdminLaporanPage';
import AdminUserPage from './pages/admin/AdminUserPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Customer */}
          <Route element={<CustomerLayout />}>
            <Route path="/"              element={<HomePage />} />
            <Route path="/produk"        element={<ProdukPage />} />
            <Route path="/produk/:id"    element={<DetailProdukPage />} />
            <Route path="/keranjang"     element={<KeranjangPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/checkout"    element={<CheckoutPage />} />
              <Route path="/pesanan"     element={<RiwayatPesananPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"           element={<DashboardPage />} />
              <Route path="/admin/brand"     element={<AdminBrandPage />} />
              <Route path="/admin/kategori"  element={<AdminKategoriPage />} />
              <Route path="/admin/ukuran"    element={<AdminUkuranPage />} />
              <Route path="/admin/produk"    element={<AdminProdukPage />} />
              <Route path="/admin/order"     element={<AdminOrderPage />} />
              <Route path="/admin/laporan"   element={<AdminLaporanPage />} />
              <Route path="/admin/users"    element={<AdminUserPage />} />
            </Route>
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
