import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Future Navbar Component */}
      <header style={{ 
        borderBottom: '1px solid var(--color-border)', 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
        <div style={{ color: 'var(--color-neon-green)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>GlobeTrotter</div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Navigation pending...</div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
}
