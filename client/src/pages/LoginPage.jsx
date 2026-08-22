import React from 'react';
import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    <div className="w-full">
      <AuthForm initialMode="login" />
    </div>
  );
}
