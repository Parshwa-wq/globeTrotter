import React from 'react';
import AuthForm from '../components/AuthForm';

export default function SignupPage() {
  return (
    <div className="w-full">
      <AuthForm initialMode="register" />
    </div>
  );
}
