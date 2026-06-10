import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <AdminSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onToggle={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f1117]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
