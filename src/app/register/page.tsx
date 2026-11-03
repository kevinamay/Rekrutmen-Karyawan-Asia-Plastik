'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { useRecruitment } from '@/context/RecruitmentContext';

export default function RegisterPage() {
  const router = useRouter();
  const { updateCandidate } = useRecruitment();

  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('sarah.jenkins@devpro.io');
  const [password, setPassword] = useState('DemoSecure2026!');
  const [selectedRole, setSelectedRole] = useState('Lead Frontend Architect');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableRoles = [
    { title: 'Lead Frontend Architect', department: 'Platform Engineering', openings: 2 },
    { title: 'Staff Next.js Engineer', department: 'Core Product Squad', openings: 3 },
    { title: 'Design Systems Architect', department: 'Design Technology', openings: 1 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid work email is required';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!agreeTerms) newErrors.terms = 'Please accept candidate privacy guidelines';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Save candidate data to context
    updateCandidate({
      fullName,
      email,
      appliedRole: selectedRole,
    });

    setTimeout(() => {
      setIsLoading(false);
      // Smooth onboarding transition directly to profile setup
      router.push('/dashboard/profile');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafbfe]">
      {/* Left Branding Showcase Column */}
      <div className="w-full md:w-5/12 bg-gradient-to-br from-corporate-900 via-corporate-950 to-[#2c0f1c] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
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
              Stage 1 of 7: Initial Registration
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              Begin your career application in 60 seconds.
            </h2>
            <p className="text-sm text-corporate-300 leading-relaxed max-w-sm">
              Our automated recruitment platform instantly pairs your profile with our role competencies,
              providing immediate objective feedback.
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="relative z-10 pt-8 border-t border-corporate-800/80 mt-8 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-corporate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant CV parsing & skill benchmarking</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-corporate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Transparent 7-stage hiring timeline & progress tracker</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-corporate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Fast-track technical interview with role-constrained AI</span>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-lg space-y-7">
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight">
              Create Candidate Account
            </h1>
            <p className="text-xs sm:text-sm text-corporate-500">
              Fill in your details below to begin the automated onboarding process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Legal Name"
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              isValid={fullName.length > 2}
              error={errors.fullName}
            />

            <Input
              label="Work or Personal Email"
              type="email"
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              isValid={email.includes('@') && email.includes('.')}
              error={errors.email}
              helperText="Notifications and interview invites will be routed here."
            />

            <Input
              label="Account Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              isValid={password.length >= 8}
              error={errors.password}
            />

            {/* Target Role Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-corporate-700 tracking-wide uppercase">
                Target Position <span className="text-blush-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {availableRoles.map((role) => {
                  const isSelected = selectedRole === role.title;
                  return (
                    <div
                      key={role.title}
                      onClick={() => setSelectedRole(role.title)}
                      className={`cursor-pointer rounded-xl p-3 border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blush-400 bg-blush-50/70 text-blush-950 font-semibold ring-1 ring-blush-300'
                          : 'border-corporate-200 bg-white hover:border-corporate-300 text-corporate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-blush-600 bg-blush-500 text-white'
                              : 'border-corporate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="font-semibold text-corporate-900">{role.title}</div>
                          <div className="text-[11px] text-corporate-400">{role.department}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {role.openings} Openings
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-corporate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-corporate-300 text-blush-600 focus:ring-blush-500 h-4 w-4"
                />
                <span>
                  I consent to automated CV parsing and fair AI competency screening under NexaRecruit&apos;s{' '}
                  <span className="text-blush-600 underline font-medium">Candidate Data Agreement</span>.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.terms}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-semibold shadow-blush mt-2"
            >
              Register & Proceed to Profile Setup <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-corporate-100 text-xs text-corporate-500">
            Already registered with NexaRecruit?{' '}
            <Link href="/login" className="font-bold text-blush-600 hover:text-blush-700 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

