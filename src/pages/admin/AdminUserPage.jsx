import { useState, useEffect } from 'react';
import { userAPI } from '../../api';
import CRUDTable from '../../components/admin/CRUDTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

import Select from '../../components/admin/Select';

const emptyForm = { nama: '', email: '', password: '', role: 'customer', alamat: '', telepon: '' };

export default function AdminUserPage() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState({ open: false, mode: 'create', data: null });
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({});

  const load = () => {
    setLoading(true);
    userAPI.getAll({ search, role: roleFilter }).then(r => { setUsers(r.data.data); setPagination(r.data.pagination); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [search, roleFilter]);

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, mode: 'create', data: null }); };
  const openEdit   = (row) => { setForm({ nama: row.nama, email: row.email, password: '', role: row.role, alamat: row.alamat || '', telepon: row.telepon || '' }); setModal({ open: true, mode: 'edit', data: row }); };
  const closeModal = () => setModal({ open: false, mode: 'create', data: null });

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode === 'create') await userAPI.create(form);
      else await userAPI.update(modal.data.id, form);
      toast.success(`User berhasil ${modal.mode === 'create' ? 'ditambahkan' : 'diperbarui'}`);
      closeModal(); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Hapus user "${row.nama}"?`)) return;
    try { await userAPI.delete(row.id); toast.success('User dihapus'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Gagal'); }
  };

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors";

  const columns = [
    { key: 'avatar', label: '', render: (row) => (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
        {row.nama?.charAt(0).toUpperCase()}
      </div>
    )},
    { key: 'nama', label: 'Nama', render: (row) => <span className="font-medium text-white">{row.nama}</span> },
    { key: 'email', label: 'Email', render: (row) => <span className="text-gray-400 text-xs">{row.email}</span> },
    { key: 'role', label: 'Role', render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${row.role === 'admin' ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {row.role}
      </span>
    )},
    { key: 'telepon', label: 'Telepon', render: (row) => <span className="text-gray-500 text-xs">{row.telepon || '—'}</span> },
    { key: 'createdAt', label: 'Bergabung', render: (row) => <span className="text-gray-500 text-xs">{new Date(row.createdAt).toLocaleDateString('id-ID')}</span> },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">User</h1>
          <p className="text-gray-500 text-xs mt-0.5">{pagination.total || 0} user terdaftar</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all">
          <span>+</span> Tambah User
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="🔍  Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/5 border border-white/8 focus:outline-none focus:border-red-500/50 transition-colors w-64 placeholder-gray-500" />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          placeholder="Semua Role"
          options={[
            { value: '', label: 'Semua Role' },
            { value: 'admin', label: 'Admin' },
            { value: 'customer', label: 'Customer' },
          ]}
          className="w-44"
        />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <CRUDTable columns={columns} data={users} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <Modal isOpen={modal.open} onClose={closeModal} title={modal.mode === 'create' ? '+ Tambah User' : 'Edit User'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Nama <span className="text-red-400">*</span></label>
              <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Role</label>
              <Select
                value={form.role}
                onChange={(val) => setForm(f => ({ ...f, role: val }))}
                options={[
                  { value: 'customer', label: 'Customer' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Email <span className="text-red-400">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} required />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">
              Password {modal.mode === 'edit' && <span className="text-gray-500 normal-case">(kosongkan jika tidak diubah)</span>}
              {modal.mode === 'create' && <span className="text-red-400">*</span>}
            </label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputClass} placeholder="••••••••" required={modal.mode === 'create'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Telepon</label>
              <input type="tel" value={form.telepon} onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))} className={inputClass} placeholder="08xx..." />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-medium block mb-1.5">Alamat</label>
            <textarea rows={2} value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} className={`${inputClass} resize-none`} />
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
