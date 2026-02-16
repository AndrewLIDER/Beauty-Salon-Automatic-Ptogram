import clsx from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-lg shadow-md border border-gray-200 p-6', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={clsx('mb-4 border-b border-gray-200 pb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={clsx('text-2xl font-bold text-gray-900', className)}>{children}</h2>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={clsx('space-y-4', className)}>{children}</div>;
}
