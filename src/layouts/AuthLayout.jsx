import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark-100 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 text-center px-12">
          <Link to="/" className="font-display text-6xl tracking-[0.3em] text-white block mb-6">
            SHOE<span className="text-primary">STORE</span>
          </Link>
          <p className="text-gray-400 text-lg leading-relaxed">
            Premium Shoes Collection.<br />
            Style that moves with you.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {['QUALITY', 'STYLE', 'COMFORT'].map(tag => (
              <div key={tag} className="border border-dark-300 p-4 text-center">
                <span className="text-primary font-display text-2xl">{tag}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-3xl tracking-[0.2em] text-white lg:hidden block mb-10">
            SHOE<span className="text-primary">STORE</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
