import { useState, useEffect } from 'react';
import { kategoriAPI } from '../../api';
import CRUDTable from '../../components/admin/CRUDTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

export default function AdminKategoriPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, mode: 'create', row: null });
  const [form, setForm]       = useState({ nama_kategori: '', deskripsi: '' });
  const [saving, setSaving]   = useState(false);

  const load = () => { setLoading(true); kategoriAPI.getAll().then(r => setData(r.data.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ nama_kategori: '', deskripsi: '' }); setModal({ open: true, mode: 'create', row: null }); };
  const openEdit   = (row) => { setForm({ nama_kategori: row.nama_kategori, deskripsi: row.deskripsi || '' }); setModal({ open: true, mode: 'edit', row }); };
  const closeModal = () => setModal({ open: false, mode: 'create', row: null });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode === 'create') await kategoriAPI.create(form);
      else await kategoriAPI.update(modal.row.id, form);
      toast.success(`Kategori berhasil ${modal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}`);
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Hapus kategori "${row.nama_kategori}"?`)) return;
    try { await kategoriAPI.delete(row.id); toast.success('Kategori dihapus'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const columns = [
    { key: 'nama_kategori', label: 'Nama Kategori', render: (row) => <span className="font-medium text-white">{row.nama_kategori}</span> },
    { key: 'deskripsi', label: 'Deskripsi', render: (row) => <span className="text-gray-400 text-xs line-clamp-1">{row.deskripsi || '—'}</span> },
  ];

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors";

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Kategori</h1>
          <p className="text-gray-500 text-xs mt-0.5">{data.length} kategori terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
          <span>+</span> Tambah Kategori
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <CRUDTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? '+ Tambah Kategori' : 'Edit Kategori'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Nama Kategori <span className="text-red-400">*</span></label>
            <input type="text" value={form.nama_kategori} onChange={e => setForm(f => ({ ...f, nama_kategori: e.target.value }))} className={inputClass} placeholder="Nama kategori..." required />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Deskripsi</label>
            <textarea rows={3} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Deskripsi kategori..." />
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
