import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function KeranjangPage() {
  const { items, removeItem, updateQty, totalHarga, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) { toast.error('Silakan login terlebih dahulu'); navigate('/login'); return; }
    if (items.length === 0) { toast.error('Keranjang kosong'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center">
      <div className="text-center">
        <svg className="w-24 h-24 text-dark-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-white text-2xl font-display tracking-wider mb-4">Keranjang Kosong</h2>
        <p className="text-gray-400 mb-8">Belum ada produk di keranjang.</p>
        <Link to="/produk" className="btn-primary">Mulai Belanja</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl tracking-wider text-white mb-10">KERANJANG</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ key, produk, ukuran, qty }) => (
              <div key={key} className="card flex gap-6 p-4">
                {/* Gambar */}
                <div className="w-24 h-24 bg-dark-200 flex-shrink-0 overflow-hidden">
                  {produk.gambar
                    ? <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-dark-300" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-xs uppercase tracking-widest">{produk.brand?.nama_brand}</p>
                  <h3 className="text-white font-semibold mt-1 truncate">{produk.nama_produk}</h3>
                  {/* Tampilkan ukuran yang dipilih */}
                  {ukuran && (
                    <p className="text-primary text-xs font-semibold uppercase tracking-widest mt-1">
                      UK {ukuran.ukuran}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty control */}
                    <div className="flex items-center border border-dark-300">
                      <button onClick={() => updateQty(key, qty - 1)} className="px-3 py-1 text-white hover:bg-dark-200 text-sm">−</button>
                      <span className="px-4 py-1 text-white text-sm border-x border-dark-300">{qty}</span>
                      <button onClick={() => updateQty(key, qty + 1)} className="px-3 py-1 text-white hover:bg-dark-200 text-sm">+</button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-white font-bold">{formatRupiah(parseFloat(produk.harga) * qty)}</span>

                    {/* Hapus */}
                    <button onClick={() => removeItem(key)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-gray-500 hover:text-red-400 text-sm uppercase tracking-widest transition-colors mt-4">
              Kosongkan Keranjang
            </button>
          </div>

          {/* Ringkasan */}
          <div className="card p-6 h-fit">
            <h3 className="text-white font-display text-2xl tracking-wider mb-6">RINGKASAN</h3>
            <div className="space-y-3 text-sm">
              {/* List item */}
              {items.map(({ key, produk, ukuran, qty }) => (
                <div key={key} className="flex justify-between text-gray-400 text-xs">
                  <span className="truncate max-w-[60%]">
                    {produk.nama_produk} {ukuran ? `(UK ${ukuran.ukuran})` : ''} x{qty}
                  </span>
                  <span>{formatRupiah(parseFloat(produk.harga) * qty)}</span>
                </div>
              ))}
              <hr className="border-dark-300" />
              <div className="flex justify-between text-gray-400">
                <span>Pengiriman</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-dark-300">
                <span>Total</span>
                <span>{formatRupiah(totalHarga)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full mt-8">Checkout</button>
            <Link to="/produk" className="block text-center text-gray-500 hover:text-white text-sm mt-4 transition-colors">
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
