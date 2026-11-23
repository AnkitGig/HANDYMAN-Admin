export function Table({ columns, rows, ctx, selectedId, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            {columns.map((c) => (
              <th key={c.h} className="whitespace-nowrap px-3.5 py-2.5 font-bold text-[11px] uppercase tracking-wider text-slate-500">
                {c.h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80">
          {rows.map((r) => (
            <tr
              key={r.id}
              className={`hover:bg-brand-50/50 transition-colors duration-150 ${
                selectedId === r.id ? 'bg-brand-50/40' : ''
              }`}
            >
              {columns.map((c) => (
                <td key={c.h} className="whitespace-nowrap px-3.5 py-2.5 text-slate-700">
                  {c.r(r, ctx)}
                </td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
