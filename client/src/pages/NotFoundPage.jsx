import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'var(--color-neon-green)', fontSize: '4rem', margin: '0' }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Destination not found.</p>
      <Link to="/" style={{ color: 'var(--color-neon-green)', textDecoration: 'none', borderBottom: '1px solid var(--color-neon-green)' }}>
        Return to Safety
      </Link>
    </div>
  );
}
