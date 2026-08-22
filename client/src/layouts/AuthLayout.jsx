import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--color-bg-primary)',
      padding: '20px'
    }}>
      {/* Background decorations could go here (e.g. subtle grid or glow) */}
      
      <div style={{ width: '100%', maxWidth: '400px', zIndex: 10 }}>
        {/* Render child components (Login or Signup) */}
        <Outlet />
      </div>
    </div>
  );
}
