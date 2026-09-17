import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-bg-card', className)} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="w-[190px] flex-none">
      <Skeleton className="aspect-[2/3] w-full mb-2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="row-scroll">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
