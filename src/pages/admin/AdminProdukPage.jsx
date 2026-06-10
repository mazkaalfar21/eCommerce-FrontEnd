import { useState, useEffect } from 'react';
import { produkAPI, brandAPI, kategoriAPI, ukuranAPI } from '../../api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

import Select from '../../components/admin/Select';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const emptyForm = { nama_produk: '', brand_id: '', kategori_id: '', harga: '', deskripsi: '', is_featured: false, gambar: null, ukurans: [] };

export default function AdminProdukPage() {
  const [produks, setProduks]       = useState([]);
  const [brands, setBrands]         = useState([]);
  const [kategoris, setKategoris]   = useState([]);
  const [ukuranList, setUkuranList] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState({ open: false, mode: 'create', data: null });
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([produkAPI.getAll({ limit: 100, search }), brandAPI.getAll(), kategoriAPI.getAll(), ukuranAPI.getAll()])
      .then(([p, b, k, u]) => { setProduks(p.data.data); setBrands(b.data.data); setKategoris(k.data.data); setUkuranList(u.data.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search]);

  const buildUkuranForm = (existing = []) =>
    ukuranList.map(u => ({ ukuran_id: u.id, ukuran: u.ukuran, stok: existing.find(s => s.ukuran_id === u.id)?.stok || 0 }));

  const openCreate = () => { setForm({ ...emptyForm, ukurans: buildUkuranForm() }); setModal({ open: true, mode: 'create', data: null }); };
  const openEdit   = (row) => {
    setForm({ nama_produk: row.nama_produk, brand_id: row.brand_id, kategori_id: row.kategori_id, harga: row.harga, deskripsi: row.deskripsi || '', is_featured: row.is_featured, gambar: null, ukurans: buildUkuranForm(row.stokUkuran || []) });
    setModal({ open: true, mode: 'edit', data: row });
  };
  const closeModal = () => setModal({ open: false, mode: 'create', data: null });

  const setUkuranStok = (ukuran_id, stok) => setForm(f => ({ ...f, ukurans: f.ukurans.map(u => u.ukuran_id === ukuran_id ? { ...u, stok: parseInt(stok) || 0 } : u) }));
  const totalStok = form.ukurans.reduce((s, u) => s + (u.stok || 0), 0);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      ['nama_produk','brand_id','kategori_id','harga','deskripsi'].forEach(k => fd.append(k, form[k]));
      fd.append('is_featured', form.is_featured);
      fd.append('ukurans', JSON.stringify(form.ukurans));
      if (form.gambar) fd.append('gambar', form.gambar);
      if (modal.mode === 'create') await produkAPI.create(fd);
      else await produkAPI.update(modal.data.id, fd);
      toast.success(`Produk berhasil ${modal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}`);
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Hapus produk "${row.nama_produk}"?`)) return;
    try { await produkAPI.delete(row.id); toast.success('Produk dihapus'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors";

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Produk</h1>
          <p className="text-gray-500 text-xs mt-0.5">{produks.length} produk</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
          <span>+</span> Tambah Produk
        </button>
      </div>

      <input type="text" placeholder="🔍  Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
        className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors w-72 placeholder-gray-500" />

      {/* Product Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {produks.map(p => {
            const totalStokProduk = p.stokUkuran?.reduce((s, u) => s + u.stok, 0) || 0;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-0.5" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative aspect-square bg-white/3 overflow-hidden">
                  {p.gambar ? (
                    <img src={p.gambar} alt={p.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">👟</div>
                  )}
                  {p.is_featured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">FEATURED</span>
                  )}
                  {totalStokProduk === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-red-500/80 px-3 py-1 rounded-full">Habis</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-0.5">{p.brand?.nama_brand}</p>
                  <h3 className="text-white text-sm font-semibold truncate">{p.nama_produk}</h3>
                  <p className="text-white font-bold mt-1">{formatRupiah(p.harga)}</p>
                  <p className="text-gray-500 text-xs mt-1">Stok total: {totalStokProduk}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(p)} className="flex-1 py-2 rounded-xl text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-all">Edit</button>
                    <button onClick={() => handleDelete(p)} className="flex-1 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-all">Hapus</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? '+ Tambah Produk' : 'Edit Produk'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Nama Produk <span className="text-red-400">*</span></label>
            <input type="text" value={form.nama_produk} onChange={e => setForm(f => ({ ...f, nama_produk: e.target.value }))} className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Brand <span className="text-red-400">*</span></label>
              <Select
                value={form.brand_id}
                onChange={(val) => setForm(f => ({ ...f, brand_id: val }))}
                placeholder="Pilih brand..."
                options={brands.map(b => ({ value: b.id, label: b.nama_brand }))}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Kategori <span className="text-red-400">*</span></label>
              <Select
                value={form.kategori_id}
                onChange={(val) => setForm(f => ({ ...f, kategori_id: val }))}
                placeholder="Pilih kategori..."
                options={kategoris.map(k => ({ value: k.id, label: k.nama_kategori }))}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Harga (Rp) <span className="text-red-400">*</span></label>
            <input type="number" value={form.harga} onChange={e => setForm(f => ({ ...f, harga: e.target.value }))} className={inputClass} min="0" required />
          </div>

          {/* Stok per ukuran */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-xs font-medium">Stok per Ukuran</label>
              <span className="text-xs text-gray-500">Total: <span className="text-white font-semibold">{totalStok}</span></span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {form.ukurans.map(u => (
                <div key={u.ukuran_id} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-center py-1.5 text-gray-400 text-xs border-b border-white/5">UK {u.ukuran}</div>
                  <input type="number" min="0" value={u.stok}
                    onChange={e => setUkuranStok(u.ukuran_id, e.target.value)}
                    className="w-full bg-transparent text-white text-center text-sm py-2 focus:outline-none" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Deskripsi</label>
            <textarea rows={2} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Gambar</label>
            {modal.mode === 'edit' && modal.data?.gambar && (
              <img src={modal.data.gambar} alt="" className="w-16 h-16 object-cover rounded-xl mb-2" />
            )}
            <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, gambar: e.target.files[0] }))}
              className="w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs cursor-pointer" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 accent-red-500 rounded" />
            <label htmlFor="featured" className="text-gray-300 text-sm cursor-pointer">Tampilkan di Homepage (Featured)</label>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
