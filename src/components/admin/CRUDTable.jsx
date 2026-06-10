export default function CRUDTable({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-xs">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <th className="text-left text-gray-500 font-medium text-xs px-4 py-3 uppercase tracking-wider w-10">No</th>
            {columns.map(col => (
              <th key={col.key} className="text-left text-gray-500 font-medium text-xs px-4 py-3 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-left text-gray-500 font-medium text-xs px-4 py-3 uppercase tracking-wider w-32">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-gray-600 text-3xl">—</p>
                  <p className="text-gray-500 text-sm">Tidak ada data</p>
                </div>
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr
              key={row.id}
              className="transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <td className="px-4 py-3.5 text-gray-600 text-sm">{i + 1}</td>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3.5 text-gray-300 text-sm">
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
