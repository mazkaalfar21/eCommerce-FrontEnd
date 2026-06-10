import { Link } from 'react-router-dom';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function ProductCard({ produk }) {
  // Hitung total stok dari semua ukuran
  const totalStok = produk.stokUkuran?.reduce((sum, u) => sum + (u.stok || 0), 0) ?? 0;
  const habis = totalStok === 0;

  // Ukuran yang tersedia (stok > 0)
  const ukuranTersedia = produk.stokUkuran?.filter(u => u.stok > 0) || [];

  return (
    <Link to={`/produk/${produk.id}`} className="group block">
      <div className="card hover:border-primary transition-all duration-300 hover:-translate-y-1">
        {/* Gambar */}
        <div className="relative overflow-hidden bg-dark-200 aspect-square">
          {produk.gambar ? (
            <img
              src={produk.gambar}
              alt={produk.nama_produk}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover action */}
          {!habis && (
            <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs font-semibold uppercase tracking-widest py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-center">
              Pilih Ukuran
            </div>
          )}

          {/* Badge featured */}
          {produk.is_featured && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
              Featured
            </span>
          )}

          {/* Overlay habis */}
          {habis && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold uppercase tracking-widest text-sm">Stok Habis</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{produk.brand?.nama_brand}</p>
          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {produk.nama_produk}
          </h3>

          {/* Ukuran tersedia */}
          {ukuranTersedia.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {ukuranTersedia.slice(0, 4).map(u => (
                <span key={u.id} className="text-xs text-gray-400 border border-dark-300 px-1.5 py-0.5">
                  {u.ukuran?.ukuran}
                </span>
              ))}
              {ukuranTersedia.length > 4 && (
                <span className="text-xs text-gray-500">+{ukuranTersedia.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-white font-bold">{formatRupiah(produk.harga)}</span>
            {!habis && (
              <span className="text-gray-500 text-xs">{totalStok} stok</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
