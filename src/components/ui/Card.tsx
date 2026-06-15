import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'stat' | 'elevated';
}

export function Card({ children, className = '', hover = false, variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'bg-gray-900 border border-gray-700 shadow-sm',
    stat: 'bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 shadow-md',
    elevated: 'bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl',
  };

  return (
    <div
      className={`
        rounded-lg overflow-hidden
        ${variantStyles[variant]}
        ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : 'transition-shadow duration-200'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  divider?: boolean;
}

export function CardHeader({ children, className = '', divider = true }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 ${divider ? 'border-b border-gray-800' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-black border-t border-gray-800 ${className}`}>
      {children}
    </div>
  );
}
