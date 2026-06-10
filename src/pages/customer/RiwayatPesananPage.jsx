import { useState, useEffect } from 'react';
import { orderAPI } from '../../api';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const statusConfig = {
  pending:    { label: 'Menunggu',  color: 'text-yellow-400 border-yellow-400' },
  diproses:   { label: 'Diproses', color: 'text-blue-400 border-blue-400' },
  dikirim:    { label: 'Dikirim',  color: 'text-purple-400 border-purple-400' },
  selesai:    { label: 'Selesai',  color: 'text-green-400 border-green-400' },
  dibatalkan: { label: 'Dibatalkan', color: 'text-red-400 border-red-400' },
};

export default function RiwayatPesananPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getAll().then(res => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-dark pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl tracking-wider text-white mb-10">RIWAYAT PESANAN</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="card">
                  <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-white font-semibold">Order #{order.id}</span>
                        <span className={`text-xs uppercase tracking-widest border px-2 py-0.5 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{new Date(order.tanggal_order).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{formatRupiah(order.total_harga)}</p>
                      <p className="text-gray-500 text-xs mt-1">{expanded === order.id ? '▲' : '▼'}</p>
                    </div>
                  </div>

                  {expanded === order.id && (
                    <div className="border-t border-dark-300 p-6 bg-dark-200 animate-fade-in">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Detail Produk</p>
                      <div className="space-y-3">
                        {order.details?.map(d => (
                          <div key={d.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-dark-300 flex-shrink-0">
                              {d.produk?.gambar && <img src={d.produk.gambar} alt={d.produk.nama_produk} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm">{d.produk?.nama_produk}</p>
                              <p className="text-gray-500 text-xs">x{d.qty} × {formatRupiah(d.harga)}</p>
                            </div>
                            <span className="text-white text-sm font-semibold">{formatRupiah(d.qty * d.harga)}</span>
                          </div>
                        ))}
                      </div>
                      {order.alamat_pengiriman && (
                        <div className="mt-4 pt-4 border-t border-dark-300">
                          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Alamat Pengiriman</p>
                          <p className="text-gray-300 text-sm">{order.alamat_pengiriman}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
