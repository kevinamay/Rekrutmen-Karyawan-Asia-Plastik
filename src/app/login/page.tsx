'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';

export default function LoginPage() {
  const router = useRouter();
  const { candidate } = useRecruitment();

  const [email, setEmail] = useState('sarah.jenkins@devpro.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard/profile');
    }, 900);
  };

  const handleSendRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafbfe]">
      {/* Left Branding Showcase Column */}
      <div className="w-full md:w-5/12 bg-gradient-to-br from-corporate-900 via-corporate-950 to-[#2c0f1c] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Soft blush pink ambient lighting effect */}
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blush-500/20 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pastel-lavender/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blush-500 to-blush-400 flex items-center justify-center text-white shadow-md shadow-blush-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">
                NexaRecruit <span className="text-blush-400">AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-corporate-400 font-medium">
                Enterprise Candidate Portal
              </span>
            </div>
          </Link>

          <div className="mt-16 space-y-4">
            <Badge variant="blush" className="bg-blush-500/20 text-blush-300 border-blush-400/30">
              Automated Pipeline 2026
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Welcome back to your hiring journey.
            </h2>
            <p className="text-sm text-corporate-300 leading-relaxed max-w-sm">
              Log in to track your 7-stage recruitment progress, upload resume updates, and access your
              tailored competency assessments.
            </p>
          </div>
        </div>

        {/* Testimonial / Security Note */}
        <div className="relative z-10 pt-10 border-t border-corporate-800/80 mt-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blush-400 shrink-0 mt-0.5" />
            <div className="text-xs text-corporate-300">
              <span className="font-semibold text-white">SOC-2 Type II Certified & GDPR Compliant</span>
              <p className="text-[11px] text-corporate-400 mt-0.5">
                All candidate evaluations and AI assessments adhere to strict global hiring fairness regulations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight">
              Sign In to Candidate Portal
            </h1>
            <p className="text-xs sm:text-sm text-corporate-500">
              Enter your corporate applicant credentials below to continue.
            </p>
          </div>

          {/* Quick Demo Pre-fill Pill */}
          <div className="rounded-xl bg-blush-50/70 border border-blush-200/80 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blush-600 shrink-0" />
              <span className="text-corporate-700">
                Demo Profile:{' '}
                <strong className="text-corporate-900">{candidate.fullName}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(candidate.email);
                setPassword('DemoPassword2026!');
              }}
              className="text-[11px] font-bold text-blush-600 hover:text-blush-700 underline"
            >
              Autofill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work or Personal Email"
              type="email"
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              isValid={email.includes('@') && email.includes('.')}
              helperText="The email address you used during your initial job application."
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-corporate-700 tracking-wide uppercase">
                  Password <span className="text-blush-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setRecoverySent(false);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-semibold text-blush-600 hover:text-blush-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="flex h-11 w-full rounded-xl border border-corporate-200 bg-white px-3.5 py-2 text-sm text-corporate-900 shadow-sm transition-all focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-corporate-400 hover:text-corporate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-medium text-rose-500">{errorMessage}</p>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-semibold shadow-blush"
            >
              Sign In & Continue Application <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-corporate-100 text-xs text-corporate-500">
            Don&apos;t have an application account yet?{' '}
            <Link href="/register" className="font-bold text-blush-600 hover:text-blush-700 hover:underline">
              Create New Candidate Account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Candidate Password"
        description="We'll send a secure password reset link to your registered application email."
      >
        {!recoverySent ? (
          <form onSubmit={handleSendRecovery} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="candidate@example.com"
              required
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-corporate-900 text-sm">Recovery Link Dispatched</h4>
              <p className="text-xs text-corporate-500 mt-1 max-w-xs mx-auto">
                If an account exists for <strong className="text-corporate-800">{recoveryEmail}</strong>, you will receive password reset instructions within 2 minutes.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

