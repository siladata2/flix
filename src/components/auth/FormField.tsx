import type { InputHTMLAttributes } from 'react';

export function FormField({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-3.5">
      <label className="block text-[12.5px] text-ink-dim mb-1.5">{label}</label>
      <input
        className="w-full bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-gold/60"
        {...props}
      />
    </div>
  );
}
