import { useState, useEffect } from 'react';
import { ukuranAPI } from '../../api';
import CRUDTable from '../../components/admin/CRUDTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

export default function AdminUkuranPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, mode: 'create', row: null });
  const [form, setForm]       = useState({ ukuran: '' });
  const [saving, setSaving]   = useState(false);

  const load = () => { setLoading(true); ukuranAPI.getAll().then(r => setData(r.data.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ ukuran: '' }); setModal({ open: true, mode: 'create', row: null }); };
  const openEdit   = (row) => { setForm({ ukuran: row.ukuran }); setModal({ open: true, mode: 'edit', row }); };
  const closeModal = () => setModal({ open: false, mode: 'create', row: null });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode === 'create') await ukuranAPI.create(form);
      else await ukuranAPI.update(modal.row.id, form);
      toast.success(`Ukuran berhasil ${modal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}`);
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Hapus ukuran "${row.ukuran}"?`)) return;
    try { await ukuranAPI.delete(row.id); toast.success('Ukuran dihapus'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const columns = [
    { key: 'ukuran', label: 'Ukuran (EU)', render: (row) => (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-white font-semibold text-sm">
        {row.ukuran}
      </span>
    )},
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Ukuran</h1>
          <p className="text-gray-500 text-xs mt-0.5">{data.length} ukuran tersedia</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
          <span>+</span> Tambah Ukuran
        </button>
      </div>

      {/* Grid ukuran */}
      <div className="flex flex-wrap gap-3">
        {data.map(u => (
          <div key={u.id} className="group relative w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:-translate-y-0.5 transition-all"
            style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)' }}>
            {u.ukuran}
            <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button onClick={() => openEdit(u)} className="p-1 hover:text-blue-400 text-xs">✏️</button>
              <button onClick={() => handleDelete(u)} className="p-1 hover:text-red-400 text-xs">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <CRUDTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? '+ Tambah Ukuran' : 'Edit Ukuran'} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Ukuran EU <span className="text-red-400">*</span></label>
            <input type="text" value={form.ukuran} onChange={e => setForm({ ukuran: e.target.value })} className="w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors" placeholder="contoh: 42" required />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
