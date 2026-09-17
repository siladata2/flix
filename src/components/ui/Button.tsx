import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'gold' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-[#171412] hover:bg-[#f0b25a]',
  ghost: 'bg-transparent border border-line text-ink hover:border-ink-dim',
  danger: 'bg-transparent border border-brand text-brand hover:bg-brand/10',
};
const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[13px]',
  md: 'px-[18px] py-2.5 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'gold', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[7px] font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
