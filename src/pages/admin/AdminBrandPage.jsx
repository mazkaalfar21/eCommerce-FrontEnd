import { useState, useEffect } from 'react';
import { brandAPI } from '../../api';
import CRUDTable from '../../components/admin/CRUDTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

export default function AdminBrandPage() {
  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, mode: 'create', data: null });
  const [form, setForm]       = useState({ nama_brand: '', logo: null });
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    brandAPI.getAll().then(r => setBrands(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ nama_brand: '', logo: null }); setModal({ open: true, mode: 'create', data: null }); };
  const openEdit   = (row) => { setForm({ nama_brand: row.nama_brand, logo: null }); setModal({ open: true, mode: 'edit', data: row }); };
  const closeModal = () => setModal({ open: false, mode: 'create', data: null });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nama_brand', form.nama_brand);
      if (form.logo) fd.append('logo', form.logo);
      if (modal.mode === 'create') await brandAPI.create(fd);
      else await brandAPI.update(modal.data.id, fd);
      toast.success(`Brand berhasil ${modal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}`);
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Hapus brand "${row.nama_brand}"?`)) return;
    try { await brandAPI.delete(row.id); toast.success('Brand dihapus'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const columns = [
    { key: 'logo', label: 'Logo', render: (row) => row.logo
      ? <img src={row.logo} alt={row.nama_brand} className="h-9 w-9 object-contain rounded-lg bg-white/5 p-1" />
      : <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 text-xs">N/A</div>
    },
    { key: 'nama_brand', label: 'Nama Brand', render: (row) => <span className="font-medium text-white">{row.nama_brand}</span> },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Brand</h1>
          <p className="text-gray-500 text-xs mt-0.5">{brands.length} brand terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
          <span className="text-base leading-none">+</span> Tambah Brand
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <CRUDTable columns={columns} data={brands} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? '+ Tambah Brand' : 'Edit Brand'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Nama Brand <span className="text-red-400">*</span></label>
            <input type="text" value={form.nama_brand} onChange={e => setForm(f => ({ ...f, nama_brand: e.target.value }))} className="w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors" placeholder="Nama brand..." required />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Logo</label>
            <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, logo: e.target.files[0] }))} className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs cursor-pointer" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
