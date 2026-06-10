import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-100 border-t border-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-[0.25em] text-white">
              SHOE<span className="text-primary">STORE</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium footwear collection. Where style meets comfort. Discover shoes that define your lifestyle.
            </p>
            <div className="flex gap-4 mt-6">
              {['instagram', 'twitter', 'facebook'].map(s => (
                <a key={s} href="#" className="w-10 h-10 bg-dark-200 border border-dark-300 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                  <span className="text-xs uppercase">{s.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Menu</h4>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/produk', 'Produk'], ['/keranjang', 'Keranjang']].map(([href, label]) => (
                <li key={href}><Link to={href} className="text-gray-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Info</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Jl. Premium Shoes No. 1</li>
              <li>Jakarta, Indonesia</li>
              <li>info@shoestore.com</li>
              <li>+62 800 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-300 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 ShoeStore. All rights reserved.</p>
          <p className="text-gray-600 text-xs uppercase tracking-widest">Premium Quality · Authentic Products</p>
        </div>
      </div>
    </footer>
  );
}
