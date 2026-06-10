import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { produkAPI, brandAPI, kategoriAPI } from '../../api';
import ProductCard from '../../components/customer/ProductCard';

export default function HomePage() {
  const [featured, setFeatured]     = useState([]);
  const [brands, setBrands]         = useState([]);
  const [kategoris, setKategoris]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([produkAPI.getFeatured(), brandAPI.getAll(), kategoriAPI.getAll()])
      .then(([fp, br, kat]) => {
        setFeatured(fp.data.data);
        setBrands(br.data.data);
        setKategoris(kat.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920')] bg-cover bg-center opacity-30" />

        {/* Grid overlay */}
        <div className="absolute inset-0 z-5 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-3xl">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.4em] mb-6 animate-fade-in">New Collection 2026</p>
            <h1 className="font-display text-7xl md:text-9xl tracking-wider text-white leading-none animate-slide-up">
              MOVE<br />
              <span className="text-primary">FASTER</span><br />
              LIVE BOLD
            </h1>
            <p className="mt-8 text-gray-400 text-lg leading-relaxed max-w-xl animate-fade-in">
              Temukan koleksi sepatu premium terbaik. Dari running hingga lifestyle — setiap langkah dengan penuh gaya.
            </p>
            <div className="flex flex-wrap gap-4 mt-10 animate-slide-up">
              <Link to="/produk" className="btn-primary text-base px-8 py-4">
                Shop Now
              </Link>
              <Link to="/produk?featured=true" className="btn-outline text-base px-8 py-4">
                Explore Collection
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 mt-16 pt-8 border-t border-dark-300">
              {[['500+', 'Produk'], ['50K+', 'Pelanggan'], ['99%', 'Kepuasan']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl text-white">{num}</div>
                  <div className="text-gray-500 text-sm uppercase tracking-wider mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-500">
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-16 bg-dark-100 border-y border-dark-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12">
            {brands.map(brand => (
              <Link key={brand.id} to={`/produk?brand_id=${brand.id}`} className="text-gray-500 hover:text-white transition-colors">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.nama_brand} className="h-10 object-contain grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <span className="font-display text-2xl tracking-widest">{brand.nama_brand.toUpperCase()}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <h2 className="section-title text-white">Kategori</h2>
            <Link to="/produk" className="text-primary text-sm uppercase tracking-widest hover:underline">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kategoris.map((kat, i) => (
              <Link key={kat.id} to={`/produk?kategori_id=${kat.id}`}
                className="group relative bg-dark-100 border border-dark-300 hover:border-primary p-6 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-3">
                  {['🏀', '👞', '👟', '💪', '✨'][i % 5]}
                </div>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">
                  {kat.nama_kategori}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.4em] mb-3">Top Picks</p>
              <h2 className="section-title text-white">Featured</h2>
            </div>
            <Link to="/produk" className="text-primary text-sm uppercase tracking-widest hover:underline hidden md:block">
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-dark-200 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p.id} produk={p} />)}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link to="/produk" className="btn-outline">Lihat Semua Produk</Link>
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="relative py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-7xl tracking-wider text-white mb-6">
            UPGRADE YOUR GAME
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Dapatkan koleksi terbaru dengan harga spesial. Pengiriman cepat ke seluruh Indonesia.
          </p>
          <Link to="/produk" className="inline-block bg-dark text-white font-semibold py-4 px-10 uppercase tracking-widest text-sm hover:bg-dark-200 transition-colors">
            Shop The Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
