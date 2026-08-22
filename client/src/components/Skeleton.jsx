import React from 'react';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`skeleton ${className}`}
      {...props}
    />
  );
}
