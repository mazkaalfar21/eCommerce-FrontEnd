import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ nama: '', email: '', password: '', alamat: '', telepon: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Registrasi berhasil! Selamat berbelanja.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-4xl tracking-wider text-white mb-2">DAFTAR</h2>
      <p className="text-gray-400 text-sm mb-8">Sudah punya akun? <Link to="/login" className="text-primary hover:underline">Masuk</Link></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap Anda', required: true },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com', required: true },
          { key: 'password', label: 'Password', type: 'password', placeholder: 'Minimal 6 karakter', required: true },
          { key: 'telepon', label: 'Telepon', type: 'tel', placeholder: '08xxxxxxxxxx', required: false },
        ].map(({ key, label, type, placeholder, required }) => (
          <div key={key}>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">{label}{required && <span className="text-primary ml-1">*</span>}</label>
            <input type={type} value={form[key]} onChange={set(key)} className="input-field" placeholder={placeholder} required={required} />
          </div>
        ))}
        <div>
          <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Alamat</label>
          <textarea rows={3} value={form.alamat} onChange={set('alamat')} className="input-field resize-none" placeholder="Alamat lengkap Anda" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-2">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mendaftar...</> : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  );
}
