import { Outlet } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
