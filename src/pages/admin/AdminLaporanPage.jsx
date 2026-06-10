import { exportAPI } from '../../api';
import toast from 'react-hot-toast';

const downloadFile = async (apiCall, filename) => {
  try {
    const res = await apiCall();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${filename} berhasil diunduh`);
  } catch { toast.error('Gagal mengunduh file'); }
};

const cards = [
  {
    title: 'Laporan Produk',
    desc: 'Export seluruh data produk beserta detail brand, kategori, dan stok ukuran.',
    icon: '👟',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    actions: [
      { label: 'Excel', icon: '📊', color: '#22c55e', fn: () => downloadFile(exportAPI.produkExcel, 'produk.xlsx') },
      { label: 'PDF',   icon: '📄', color: '#ef4444', fn: () => downloadFile(exportAPI.produkPDF,   'produk.pdf') },
    ],
  },
  {
    title: 'Laporan Order',
    desc: 'Export seluruh data transaksi order beserta informasi pelanggan dan status.',
    icon: '🛒',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    actions: [
      { label: 'Excel', icon: '📊', color: '#22c55e', fn: () => downloadFile(exportAPI.orderExcel, 'orders.xlsx') },
      { label: 'PDF',   icon: '📄', color: '#ef4444', fn: () => downloadFile(exportAPI.orderPDF,   'orders.pdf') },
    ],
  },
];

export default function AdminLaporanPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-white text-xl font-bold">Laporan</h1>
        <p className="text-gray-500 text-xs mt-0.5">Export data dalam format Excel dan PDF</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(card => (
          <div key={card.title} className="rounded-2xl p-6" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: card.bg }}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold">{card.title}</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {card.actions.map(action => (
                <button key={action.label} onClick={action.fn}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ color: action.color, background: `${action.color}15`, border: `1px solid ${action.color}30` }}>
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-2xl p-5" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white text-sm font-semibold mb-4">📋 Panduan Export</h3>
        <ul className="space-y-2.5">
          {[
            'File Excel (.xlsx) dapat dibuka di Microsoft Excel atau Google Sheets',
            'File PDF dapat langsung dicetak sebagai laporan resmi',
            'Data yang diexport adalah data terkini dari database',
            'Pastikan koneksi internet stabil saat proses unduh',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
              <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
