import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-gray-100 text-black border border-gray-300',
  warning: 'bg-gray-200 text-black border border-gray-400',
  error: 'bg-black text-white',
  info: 'bg-gray-100 text-black border border-gray-300',
  neutral: 'bg-gray-50 text-gray-800 border border-gray-200',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
