import type { ReactNode } from 'react';

export function DataTable({ columns, rows, renderRow, emptyMessage }: {
  columns: string[];
  rows: any[];
  renderRow: (row: any) => ReactNode;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return <div className="text-ink-faint text-sm py-12 text-center border border-line rounded-xl bg-bg-card">{emptyMessage}</div>;
  }
  return (
    <div className="border border-line rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-bg-card text-ink-faint text-left">
          <tr>{columns.map((c) => <th key={c} className="px-4 py-3 font-medium whitespace-nowrap">{c}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => renderRow(row))}
        </tbody>
      </table>
    </div>
  );
}
