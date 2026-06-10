import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { produkAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function DetailProdukPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [produk, setProduk]                 = useState(null);
  const [loading, setLoading]               = useState(true);
  const [qty, setQty]                       = useState(1);
  const [selectedUkuran, setSelectedUkuran] = useState(null);

  useEffect(() => {
    produkAPI.getById(id)
      .then(res => {
        const d = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setProduk(d);
        const available = d?.stokUkuran?.find(u => u.stok > 0);
        if (available) setSelectedUkuran(available);
      })
      .catch(() => setProduk(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!produk) return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-xl mb-6">Produk tidak ditemukan</p>
        <Link to="/produk" className="btn-primary">Kembali ke Produk</Link>
      </div>
    </div>
  );

  const totalStok  = produk.stokUkuran?.reduce((sum, u) => sum + (u.stok || 0), 0) ?? 0;
  const maxQty     = selectedUkuran?.stok || 0;

  const handleAddCart = () => {
    if (!selectedUkuran) { toast.error('Pilih ukuran terlebih dahulu'); return; }
    if (selectedUkuran.stok === 0) { toast.error('Stok ukuran ini habis'); return; }
    addItem({ ...produk, selectedUkuran }, qty);
    toast.success(`${produk.nama_produk} - UK ${selectedUkuran.ukuran?.ukuran} (x${qty}) ditambahkan`);
  };

  return (
    <div className="min-h-screen bg-dark pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/produk" className="hover:text-white transition-colors">Produk</Link>
          <span>/</span>
          <span className="text-white">{produk.nama_produk}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Gambar */}
          <div className="relative">
            <div className="aspect-square bg-dark-100 border border-dark-300 overflow-hidden">
              {produk.gambar ? (
                <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-32 h-32 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {produk.is_featured && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">Featured</span>
            )}
            {totalStok === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold uppercase tracking-widest text-lg">Stok Habis</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-primary text-xs uppercase tracking-[0.4em] mb-3">{produk.brand?.nama_brand}</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-wider text-white leading-tight">
              {produk.nama_produk.toUpperCase()}
            </h1>
            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">{produk.kategori?.nama_kategori}</p>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-3xl font-bold text-white">{formatRupiah(produk.harga)}</span>
              <span className={`text-sm uppercase tracking-widest font-semibold ${totalStok > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalStok > 0 ? `${totalStok} stok` : 'Habis'}
              </span>
            </div>

            {/* Pilih Ukuran */}
            {totalStok > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-semibold text-sm uppercase tracking-wider">
                    Pilih Ukuran
                    {selectedUkuran && <span className="ml-2 text-primary">— UK {selectedUkuran.ukuran?.ukuran}</span>}
                  </p>
                  {selectedUkuran && (
                    <p className="text-gray-400 text-xs">
                      Stok: <span className="text-green-400 font-semibold">{selectedUkuran.stok}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {produk.stokUkuran?.sort((a, b) => a.ukuran_id - b.ukuran_id).map(u => {
                    const isSelected = selectedUkuran?.id === u.id;
                    const isHabis    = u.stok === 0;
                    return (
                      <button
                        key={u.id}
                        onClick={() => { if (!isHabis) { setSelectedUkuran(u); setQty(1); } }}
                        disabled={isHabis}
                        className={`
                          w-14 h-14 text-sm font-semibold border transition-all duration-200
                          ${isSelected
                            ? 'bg-primary border-primary text-white'
                            : isHabis
                              ? 'border-dark-300 text-dark-300 cursor-not-allowed opacity-40 line-through'
                              : 'border-dark-300 text-gray-300 hover:border-white hover:text-white'
                          }
                        `}
                      >
                        {u.ukuran?.ukuran}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detail Info */}
            <div className="mt-8 space-y-3 border-t border-dark-300 pt-8">
              {[
                ['Kategori', produk.kategori?.nama_kategori],
                ['Brand',    produk.brand?.nama_brand],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-6">
                  <span className="text-gray-500 text-xs uppercase tracking-widest w-24">{label}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>

            {produk.deskripsi && (
              <p className="mt-6 text-gray-400 leading-relaxed text-sm">{produk.deskripsi}</p>
            )}

            {/* Qty + Add to Cart */}
            {totalStok > 0 && (
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-dark-300">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-white hover:bg-dark-200 transition-colors text-lg">−</button>
                  <span className="px-6 py-3 text-white font-semibold border-x border-dark-300 min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={!selectedUkuran || qty >= maxQty} className="px-4 py-3 text-white hover:bg-dark-200 transition-colors text-lg disabled:opacity-40">+</button>
                </div>
                <button onClick={handleAddCart} disabled={!selectedUkuran} className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  {selectedUkuran ? 'Tambah ke Keranjang' : 'Pilih Ukuran Dulu'}
                </button>
              </div>
            )}

            <Link to="/keranjang" className="btn-outline mt-4 text-center block">
              Lihat Keranjang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
