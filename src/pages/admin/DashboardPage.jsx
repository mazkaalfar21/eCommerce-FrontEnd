import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const statCards = (data) => [
  {
    label: 'Total Produk',
    value: data?.totalProduk || 0,
    icon: '👟',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
  },
  {
    label: 'Total User',
    value: data?.totalUser || 0,
    icon: '👥',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    label: 'Total Order',
    value: data?.totalOrder || 0,
    icon: '🛒',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    label: 'Pendapatan',
    value: formatRupiah(data?.totalPendapatan || 0),
    icon: '💰',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-gray-400 mb-1.5 font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 999 ? formatRupiah(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [chart, setChart]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getSummary(), dashboardAPI.getChart()])
      .then(([s, c]) => { setSummary(s.data.data); setChart(c.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const penjualanChart = chart?.penjualanBulanan?.map(p => ({
    name: MONTH_NAMES[(parseInt(p.dataValues?.bulan || p.bulan) - 1)],
    total: parseFloat(p.dataValues?.total || p.total || 0),
    orders: parseInt(p.dataValues?.jumlah_order || p.jumlah_order || 0),
  })) || [];

  const terlarisChart = chart?.produkTerlaris?.map(p => ({
    name: p.produk?.nama_produk?.split(' ').slice(0, 2).join(' ') || '-',
    terjual: parseInt(p.dataValues?.total_terjual || p.total_terjual || 0),
  })) || [];

  const statusColors = {
    pending: '#f59e0b', diproses: '#6366f1',
    dikirim: '#8b5cf6', selesai: '#22c55e', dibatalkan: '#ef4444',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-white text-2xl font-bold">
          Selamat datang, {user?.nama?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards(summary).map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: card.bg }}>
                {card.icon}
              </div>
            </div>
            <p className="text-gray-400 text-xs font-medium mb-1">{card.label}</p>
            <p className="text-white text-2xl font-bold tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Status Order Pills */}
      <div className="rounded-2xl p-5" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white text-sm font-semibold mb-4">Status Order</h3>
        <div className="flex flex-wrap gap-3">
          {summary?.orderByStatus?.map(s => {
            const val = s.dataValues || s;
            const color = statusColors[val.status] || '#6b7280';
            return (
              <div
                key={val.status}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-sm text-white capitalize font-medium">{val.status}</span>
                <span className="text-sm font-bold" style={{ color }}>{val.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Area Chart - Penjualan */}
        <div className="xl:col-span-3 rounded-2xl p-5" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-sm font-semibold">Penjualan per Bulan</h3>
              <p className="text-gray-500 text-xs mt-0.5">12 bulan terakhir</p>
            </div>
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={penjualanChart}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" stroke="transparent" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <YAxis stroke="transparent" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} fill="url(#colorTotal)" name="Pendapatan" dot={false} activeDot={{ r: 4, fill: '#ef4444' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Produk Terlaris */}
        <div className="xl:col-span-2 rounded-2xl p-5" style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold">Produk Terlaris</h3>
            <p className="text-gray-500 text-xs mt-0.5">Top 5 produk</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={terlarisChart} layout="vertical" barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" stroke="transparent" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="transparent" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="terjual" fill="#ef4444" name="Terjual" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.03)', radius: [0, 4, 4, 0] }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
