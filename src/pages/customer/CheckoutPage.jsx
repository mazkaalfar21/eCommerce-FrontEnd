import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api';
import toast from 'react-hot-toast';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function CheckoutPage() {
  const { items, totalHarga, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    alamat_pengiriman: user?.alamat || '',
    catatan: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.alamat_pengiriman.trim()) { toast.error('Alamat pengiriman wajib diisi'); return; }

    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          produk_id: i.produk.id,
          ukuran_id: i.ukuranId,   // kirim ukuran_id yang dipilih
          qty: i.qty,
        })),
        alamat_pengiriman: form.alamat_pengiriman,
        catatan: form.catatan,
      };
      await orderAPI.checkout(payload);
      clearCart();
      toast.success('Pesanan berhasil dibuat!');
      navigate('/pesanan');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl tracking-wider text-white mb-10">CHECKOUT</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form Pengiriman */}
            <div>
              <div className="card p-6">
                <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Informasi Pengiriman</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Nama</label>
                    <input type="text" value={user?.nama} disabled className="input-field opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Email</label>
                    <input type="text" value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                      Alamat Pengiriman <span className="text-primary">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.alamat_pengiriman}
                      onChange={e => setForm(f => ({ ...f, alamat_pengiriman: e.target.value }))}
                      className="input-field resize-none"
                      placeholder="Masukkan alamat lengkap..."
                      required
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Catatan (opsional)</label>
                    <textarea
                      rows={2}
                      value={form.catatan}
                      onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                      className="input-field resize-none"
                      placeholder="Catatan untuk penjual..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ringkasan Order */}
            <div>
              <div className="card p-6">
                <h3 className="text-white font-display text-2xl tracking-wider mb-6">PESANAN</h3>
                <div className="space-y-4 mb-6">
                  {items.map(({ key, produk, ukuran, qty }) => (
                    <div key={key} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-dark-200 flex-shrink-0">
                        {produk.gambar && <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{produk.nama_produk}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {ukuran && (
                            <span className="text-primary text-xs font-semibold">UK {ukuran.ukuran}</span>
                          )}
                          <span className="text-gray-500 text-xs">x{qty}</span>
                        </div>
                      </div>
                      <span className="text-white text-sm font-semibold">
                        {formatRupiah(parseFloat(produk.harga) * qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark-300 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({items.length} item)</span>
                    <span>{formatRupiah(totalHarga)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Pengiriman</span>
                    <span className="text-green-400">Gratis</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-dark-300">
                    <span>Total</span>
                    <span>{formatRupiah(totalHarga)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                    : 'Konfirmasi Pesanan'
                  }
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
