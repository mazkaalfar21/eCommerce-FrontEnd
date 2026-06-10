import { useState, useEffect } from 'react';
import { orderAPI, produkAPI, userAPI } from '../../api';
import Modal from '../../components/admin/Modal';
import Select from '../../components/admin/Select';
import toast from 'react-hot-toast';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const statusConfig = {
  pending:    { label: 'Menunggu',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  diproses:   { label: 'Diproses',  color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  dikirim:    { label: 'Dikirim',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  selesai:    { label: 'Selesai',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  dibatalkan: { label: 'Dibatalkan', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const StatusBadge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: s.color, background: s.bg }}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
};

export default function AdminOrderPage() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage]             = useState(1);
  const [detailModal, setDetailModal] = useState({ open: false, order: null });
  const [createModal, setCreateModal] = useState(false);
  const [users, setUsers]     = useState([]);
  const [produks, setProduks] = useState([]);
  const [saving, setSaving]   = useState(false);
  const [createForm, setCreateForm] = useState({ user_id: '', alamat_pengiriman: '', catatan: '', status: 'pending', items: [{ produk_id: '', qty: 1 }] });

  const load = () => {
    setLoading(true);
    const params = { page, limit: 10, ...(statusFilter && { status: statusFilter }) };
    orderAPI.getAll(params).then(r => { setOrders(r.data.data); setPagination(r.data.pagination); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [statusFilter, page]);

  const openCreate = async () => {
    setCreateForm({ user_id: '', alamat_pengiriman: '', catatan: '', status: 'pending', items: [{ produk_id: '', qty: 1 }] });
    const [u, p] = await Promise.all([userAPI.getAll({ limit: 100 }), produkAPI.getAll({ limit: 100 })]);
    setUsers(u.data.data); setProduks(p.data.data); setCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const validItems = createForm.items.filter(i => i.produk_id && i.qty > 0);
    if (!createForm.user_id || validItems.length === 0) { toast.error('Lengkapi form terlebih dahulu'); return; }
    setSaving(true);
    try {
      await orderAPI.createManual({ ...createForm, items: validItems });
      toast.success('Order berhasil dibuat'); setCreateModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const addItem    = () => setCreateForm(f => ({ ...f, items: [...f.items, { produk_id: '', qty: 1 }] }));
  const removeItem = (i) => setCreateForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const setItem    = (i, k, v) => setCreateForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));

  const handleUpdateStatus = async (orderId, status) => {
    try { await orderAPI.updateStatus(orderId, status); toast.success('Status diperbarui'); load(); setDetailModal({ open: false, order: null }); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const handleDelete = async (order) => {
    if (!confirm(`Hapus Order #${order.id}?`)) return;
    try { await orderAPI.delete(order.id); toast.success('Order dihapus'); load(); setDetailModal({ open: false, order: null }); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors";

  const formTotal = createForm.items.reduce((sum, item) => {
    const p = produks.find(x => String(x.id) === String(item.produk_id));
    return sum + (p ? parseFloat(p.harga) * (parseInt(item.qty) || 0) : 0);
  }, 0);

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Order</h1>
          <p className="text-gray-500 text-xs mt-0.5">{pagination.total || 0} total order</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            placeholder="Semua Status"
            options={[
              { value: '', label: 'Semua Status' },
              ...Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))
            ]}
          />
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
            <span>+</span> Buat Order
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Pelanggan', 'Tanggal', 'Total', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-gray-500 font-medium text-xs px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-500 text-sm">Tidak ada order</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3.5 text-white font-semibold text-sm">#{order.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-white text-sm font-medium">{order.user?.nama || '—'}</p>
                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {new Date(order.tanggal_order).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 text-white font-semibold text-sm">{formatRupiah(order.total_harga)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setDetailModal({ open: true, order })} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-all">
                        Detail
                      </button>
                      <button onClick={() => handleDelete(order)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-all">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-1.5">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === i + 1 ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={detailModal.open} onClose={() => setDetailModal({ open: false, order: null })} title={`Order #${detailModal.order?.id}`} size="lg">
        {detailModal.order && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Pelanggan', detailModal.order.user?.nama],
                ['Email', detailModal.order.user?.email],
                ['Total', formatRupiah(detailModal.order.total_harga)],
                ['Status', <StatusBadge status={detailModal.order.status} />],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-gray-500 text-xs mb-1">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>

            {detailModal.order.alamat_pengiriman && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-gray-500 text-xs mb-1">Alamat</p>
                <p className="text-white text-sm">{detailModal.order.alamat_pengiriman}</p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-xs font-medium mb-3">Produk Dipesan</p>
              <div className="space-y-2">
                {detailModal.order.details?.map(d => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      {d.produk?.gambar && <img src={d.produk.gambar} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{d.produk?.nama_produk}</p>
                      <p className="text-gray-500 text-xs">x{d.qty} × {formatRupiah(d.harga)}</p>
                    </div>
                    <span className="text-white text-sm font-semibold">{formatRupiah(d.qty * d.harga)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs font-medium mb-3">Ubah Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([k, v]) => (
                  <button key={k} onClick={() => handleUpdateStatus(detailModal.order.id, k)}
                    disabled={detailModal.order.status === k}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30"
                    style={{ color: v.color, background: detailModal.order.status === k ? v.bg : 'rgba(255,255,255,0.05)' }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => handleDelete(detailModal.order)}
              className="w-full py-2.5 rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/15 text-sm font-medium transition-all">
              🗑️ Hapus Order Ini
            </button>
          </div>
        )}
      </Modal>

      {/* Create Order Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="+ Buat Order Manual" size="lg">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Pelanggan <span className="text-red-400">*</span></label>
              <Select
                value={createForm.user_id}
                onChange={(val) => setCreateForm(f => ({ ...f, user_id: val }))}
                placeholder="Pilih user..."
                options={users.map(u => ({ value: u.id, label: `${u.nama} (${u.email})` }))}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Status Awal</label>
              <Select
                value={createForm.status}
                onChange={(val) => setCreateForm(f => ({ ...f, status: val }))}
                options={Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs font-medium">Produk <span className="text-red-400">*</span></label>
              <button type="button" onClick={addItem} className="text-red-400 hover:text-red-300 text-xs font-medium">+ Tambah produk</button>
            </div>
            <div className="space-y-2">
              {createForm.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={item.produk_id}
                      onChange={(val) => setItem(idx, 'produk_id', val)}
                      placeholder="Pilih produk..."
                      options={produks.map(p => ({ value: p.id, label: `${p.nama_produk} — ${formatRupiah(p.harga)}` }))}
                    />
                  </div>
                  <input type="number" min="1" value={item.qty} onChange={e => setItem(idx, 'qty', e.target.value)} className="w-16 rounded-xl px-3 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 text-center" />
                  {createForm.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="w-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-lg leading-none flex items-center justify-center">×</button>
                  )}
                </div>
              ))}
              {formTotal > 0 && (
                <p className="text-right text-sm font-semibold text-white pt-1">Total: {formatRupiah(formTotal)}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Alamat Pengiriman</label>
            <textarea rows={2} value={createForm.alamat_pengiriman} onChange={e => setCreateForm(f => ({ ...f, alamat_pengiriman: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Alamat lengkap..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Buat Order'}
            </button>
            <button type="button" onClick={() => setCreateModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
