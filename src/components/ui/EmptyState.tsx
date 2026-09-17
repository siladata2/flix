import type { ReactNode } from 'react';

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-ink-faint text-sm max-w-sm mx-auto mb-5">{message}</p>
      {action}
    </div>
  );
}
