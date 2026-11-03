import React from 'react';

export interface LoginVariantProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  isLoading: boolean;
  errorMessage: string;
  handleSubmit: (e: React.FormEvent) => void;
  openForgotPassword: () => void;
}
