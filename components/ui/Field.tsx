import React from 'react';

export interface FieldProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className = '',
}: FieldProps) {
  return (
    <div className={`space-y-1 my-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block font-mono text-xs font-semibold text-fg"
        >
          {label}
        </label>
      )}
      <div>{children}</div>
      {hint && <p className="text-xs text-muted font-mono">{hint}</p>}
      {error && <p className="text-xs text-adm-caution-text font-mono font-medium">{error}</p>}
    </div>
  );
}
