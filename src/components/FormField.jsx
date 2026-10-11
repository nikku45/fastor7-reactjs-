import React from 'react';

export default function FormField({
  label,
  error,
  helper,
  children,
  id,
  className = '',
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs" style={{ color: 'var(--color-error)', fontWeight: 500 }}>
          {error}
        </p>
      )}
      {!error && helper && (
        <p className="text-xs text-muted">
          {helper}
        </p>
      )}
    </div>
  );
}
