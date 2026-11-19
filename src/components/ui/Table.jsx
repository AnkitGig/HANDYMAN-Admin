export function Table({ columns, rows, ctx, selectedId, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-600">
            {columns.map((c) => <th key={c.h} className="whitespace-nowrap px-4 py-3 font-bold">{c.h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`border-t border-slate-100 hover:bg-slate-50/70 ${selectedId === r.id ? 'bg-red-50/40' : ''}`}>
              {columns.map((c) => <td key={c.h} className="whitespace-nowrap px-4 py-3">{c.r(r, ctx)}</td>)}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={columns.length}>{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
