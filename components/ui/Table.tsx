import React from 'react';

export function Table({
  children,
  className = '',
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto my-3 border border-border">
      <table
        className={`w-full border-collapse text-left text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-border bg-code-bg font-mono font-semibold ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-border ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-code-bg/50 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = '',
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`p-2 border-r border-border last:border-r-0 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = '',
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-2 border-r border-border last:border-r-0 align-top ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
