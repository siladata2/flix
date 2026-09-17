export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-line rounded-xl p-5 bg-bg-card">
      <p className="text-ink-faint text-xs mb-1.5">{label}</p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}
