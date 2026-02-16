import clsx from 'clsx';
import { ReactNode } from 'react';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: TableProps) {
  return (
    <thead className={clsx('bg-gray-50 border-b border-gray-200', className)}>
      {children}
    </thead>
  );
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr className={clsx('border-b border-gray-200 hover:bg-gray-50', className)}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <th className={clsx('px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableProps) {
  return <td className={clsx('px-6 py-4 whitespace-nowrap', className)}>{children}</td>;
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={clsx('bg-white', className)}>{children}</tbody>;
}
