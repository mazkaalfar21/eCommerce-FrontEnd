import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produkAPI, brandAPI, kategoriAPI, ukuranAPI } from '../../api';
import ProductCard from '../../components/customer/ProductCard';

export default function ProdukPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produks, setProduks]     = useState([]);
  const [brands, setBrands]       = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [ukurans, setUkurans]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [pagination, setPagination] = useState({});

  const filters = {
    search:      searchParams.get('search') || '',
    brand_id:    searchParams.get('brand_id') || '',
    kategori_id: searchParams.get('kategori_id') || '',
    ukuran_id:   searchParams.get('ukuran_id') || '',
    page:        searchParams.get('page') || 1,
    sort:        searchParams.get('sort') || 'createdAt',
    order:       searchParams.get('order') || 'DESC',
  };

  useEffect(() => {
    Promise.all([brandAPI.getAll(), kategoriAPI.getAll(), ukuranAPI.getAll()]).then(([b, k, u]) => {
      setBrands(b.data.data);
      setKategoris(k.data.data);
      setUkurans(u.data.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    produkAPI.getAll(params)
      .then(res => { setProduks(res.data.data); setPagination(res.data.pagination); })
      .finally(() => setLoading(false));
  }, [searchParams.toString()]);

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const sortOptions = [
    { label: 'Terbaru', value: 'createdAt-DESC' },
    { label: 'Terlama', value: 'createdAt-ASC' },
    { label: 'Harga Terendah', value: 'harga-ASC' },
    { label: 'Harga Tertinggi', value: 'harga-DESC' },
  ];

  return (
    <div className="min-h-screen bg-dark pt-16">
      {/* Page Header */}
      <div className="bg-dark-100 border-b border-dark-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl tracking-wider text-white">PRODUK</h1>
          <p className="text-gray-400 mt-2">{pagination.total || 0} produk ditemukan</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari produk..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-4">Brand</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="brand" checked={!filters.brand_id} onChange={() => setFilter('brand_id', '')} className="accent-primary" />
                  <span className="text-gray-400 group-hover:text-white text-sm transition-colors">Semua</span>
                </label>
                {brands.map(b => (
                  <label key={b.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="brand" checked={filters.brand_id === String(b.id)} onChange={() => setFilter('brand_id', String(b.id))} className="accent-primary" />
                    <span className="text-gray-400 group-hover:text-white text-sm transition-colors">{b.nama_brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Kategori */}
            <div className="mb-6">
              <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-4">Kategori</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="kategori" checked={!filters.kategori_id} onChange={() => setFilter('kategori_id', '')} className="accent-primary" />
                  <span className="text-gray-400 group-hover:text-white text-sm transition-colors">Semua</span>
                </label>
                {kategoris.map(k => (
                  <label key={k.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="kategori" checked={filters.kategori_id === String(k.id)} onChange={() => setFilter('kategori_id', String(k.id))} className="accent-primary" />
                    <span className="text-gray-400 group-hover:text-white text-sm transition-colors">{k.nama_kategori}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ukuran */}
            <div className="mb-6">
              <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-4">Ukuran</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilter('ukuran_id', '')} className={`px-3 py-1 text-xs border transition-colors ${!filters.ukuran_id ? 'bg-primary border-primary text-white' : 'border-dark-300 text-gray-400 hover:border-white hover:text-white'}`}>
                  All
                </button>
                {ukurans.map(u => (
                  <button key={u.id} onClick={() => setFilter('ukuran_id', String(u.id))} className={`px-3 py-1 text-xs border transition-colors ${filters.ukuran_id === String(u.id) ? 'bg-primary border-primary text-white' : 'border-dark-300 text-gray-400 hover:border-white hover:text-white'}`}>
                    {u.ukuran}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">{pagination.total || 0} Produk</p>
              <select
                value={`${filters.sort}-${filters.order}`}
                onChange={e => { const [s, o] = e.target.value.split('-'); setFilter('sort', s); setFilter('order', o); }}
                className="bg-dark-100 border border-dark-300 text-white text-sm px-3 py-2 focus:outline-none focus:border-primary"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-dark-200 animate-pulse aspect-[3/4]" />)}
              </div>
            ) : produks.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {produks.map(p => <ProductCard key={p.id} produk={p} />)}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setFilter('page', String(i + 1))}
                        className={`w-10 h-10 text-sm font-semibold transition-colors ${parseInt(filters.page) === i + 1 ? 'bg-primary text-white' : 'bg-dark-200 text-gray-400 hover:bg-dark-300 hover:text-white'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
