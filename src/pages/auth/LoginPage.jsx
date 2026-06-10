import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Selamat datang, ${data.user.nama}!`);
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-4xl tracking-wider text-white mb-2">MASUK</h2>
      <p className="text-gray-400 text-sm mb-10">Belum punya akun? <Link to="/register" className="text-primary hover:underline">Daftar sekarang</Link></p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field pr-12"
              placeholder="••••••••"
              required
            />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              {showPw ? '👁' : '👁‍🗨'}
            </button>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="bg-dark-200 border border-dark-300 p-3 text-xs text-gray-400">
          <p className="font-semibold text-gray-300 mb-1">Demo:</p>
          <p>Admin: admin2@shoestore.com / admin123</p>
          <p>Customer: customer@gmail.com / customer123</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Masuk...</> : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
