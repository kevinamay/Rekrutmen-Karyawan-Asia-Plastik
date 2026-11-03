'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  User,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Save,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { candidate, updateCandidate, updateStageStatus } = useRecruitment();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Personal Data
  const [fullName, setFullName] = useState(candidate.fullName);
  const [email, setEmail] = useState(candidate.email);
  const [phone, setPhone] = useState(candidate.phone);
  const [location, setLocation] = useState(candidate.location);
  const [headline, setHeadline] = useState(candidate.headline);
  const [linkedinUrl, setLinkedinUrl] = useState(candidate.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(candidate.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(candidate.portfolioUrl || '');
  const [summary, setSummary] = useState(candidate.summary);

  // Step 2: Education list
  const [educations, setEducations] = useState([
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Human-Computer Interaction',
      year: '2019',
      grade: '3.92 GPA (High Honors)',
    },
    {
      id: 'edu-2',
      institution: 'Frontend Masters & Meta Certification',
      degree: 'Advanced System Architecture & Web Performance Spec',
      year: '2023',
      grade: 'Verified Professional',
    },
  ]);

  // Step 3: Work Experience
  const [experiences, setExperiences] = useState([
    {
      id: 'exp-1',
      company: 'Veloce Cloud Platform',
      position: 'Staff Frontend Engineer & Design Systems Lead',
      duration: '2021 — Present',
      description:
        'Architected Next.js App Router design system used by 60+ engineers. Reduced web bundle size by 45% and established automated accessibility regression CI pipelines.',
      skills: ['Next.js 14/15', 'React 18', 'TypeScript', 'Tailwind CSS', 'Figma Tokens'],
    },
    {
      id: 'exp-2',
      company: 'Kinetic Labs',
      position: 'Senior UI/UX Software Engineer',
      duration: '2019 — 2021',
      description:
        'Built enterprise analytics dashboards with real-time WebSockets and virtualized data grids handling 100k+ concurrent transactions.',
      skills: ['React', 'TypeScript', 'State Orchestration', 'Jest', 'Storybook'],
    },
  ]);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid corporate or personal email is required';
    if (!phone.trim()) errs.phone = 'Contact telephone is required';
    if (!location.trim()) errs.location = 'Current location or remote timezone is required';
    if (!summary.trim() || summary.length < 30) errs.summary = 'Please provide at least 30 characters summarizing your background';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      // Step 3 Final Submission
      updateCandidate({
        fullName,
        email,
        phone,
        location,
        headline,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        summary,
      });
      updateStageStatus('profile', 'completed', 100);
      router.push('/dashboard/screening');
    }
  };

  const handleSaveDraft = () => {
    updateCandidate({
      fullName,
      email,
      phone,
      location,
      headline,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      summary,
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const stepProgress = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-corporate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="blush">Stage 2 of 7</Badge>
            <span className="text-xs text-corporate-400 font-medium">• Profile Completion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight mt-1">
            Candidate Profile & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-corporate-500 mt-0.5">
            Provide your foundational background, education, and career track record for automated AI verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs font-semibold gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-corporate-600" />
            Save Draft
          </Button>
          {saveSuccessNotice && (
            <span className="text-xs font-medium text-emerald-600 animate-in fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Multi-step progress indicator */}
      <div className="rounded-2xl bg-white border border-corporate-200/80 p-5 shadow-subtle space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-corporate-600">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blush-500" />
            Step {currentStep} of 3:{' '}
            {currentStep === 1
              ? 'Personal & Contact Details'
              : currentStep === 2
              ? 'Education & Certifications'
              : 'Work Experience & Core Competencies'}
          </span>
          <span className="text-blush-600 font-bold">{stepProgress}% Complete</span>
        </div>

        <Progress value={stepProgress} />

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 1
                ? 'bg-blush-50 text-blush-800 border border-blush-200'
                : 'text-corporate-500 hover:bg-corporate-50'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">1. Personal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setCurrentStep(2);
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 2
                ? 'bg-blush-50 text-blush-800 border border-blush-200'
                : 'text-corporate-500 hover:bg-corporate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">2. Education</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setCurrentStep(3);
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 3
                ? 'bg-blush-50 text-blush-800 border border-blush-200'
                : 'text-corporate-500 hover:bg-corporate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">3. Experience</span>
          </button>
        </div>
      </div>

      {/* Step Form Cards */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-corporate-100 pb-3">
                <h3 className="text-base font-bold text-corporate-900">Personal & Identity Information</h3>
                <p className="text-xs text-corporate-500 mt-0.5">
                  Confirm your legal identity, contact channels, and portfolio URLs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  isValid={fullName.trim().length > 2}
                  error={errors.fullName}
                />
                <Input
                  label="Contact Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.jenkins@example.com"
                  required
                  isValid={email.includes('@') && email.includes('.')}
                  error={errors.email}
                />
                <Input
                  label="Telephone / Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  isValid={phone.trim().length > 6}
                  error={errors.phone}
                />
                <Input
                  label="Location (City, Country / Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  required
                  isValid={location.trim().length > 2}
                  error={errors.location}
                />
              </div>

              <Input
                label="Professional Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Staff Frontend Architect & Design Systems Lead"
                isValid={headline.trim().length > 5}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <Input
                  label="LinkedIn Profile URL"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  isValid={linkedinUrl.includes('linkedin.com')}
                />
                <Input
                  label="GitHub Profile URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  isValid={githubUrl.includes('github.com')}
                />
                <Input
                  label="Portfolio / Personal Site"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  isValid={portfolioUrl.startsWith('http')}
                />
              </div>

              <Textarea
                label="Executive Executive Summary"
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe your core engineering focus, leadership experience, and technical philosophies..."
                required
                isValid={summary.trim().length >= 30}
                error={errors.summary}
                helperText="Minimum 30 characters. This summary is used to calibrate conversational prompts in the AI HR interview room."
              />
            </div>
          )}

          {/* STEP 2: Education & Certifications */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-corporate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-corporate-900">Academic Degrees & Professional Certifications</h3>
                  <p className="text-xs text-corporate-500 mt-0.5">
                    List relevant tertiary education, technical degrees, and verified certifications.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEducations([
                      ...educations,
                      {
                        id: `edu-${Date.now()}`,
                        institution: 'Stanford Online / Coursera',
                        degree: 'Cloud Architecture & Distributed Systems',
                        year: '2024',
                        grade: 'Verified Distinction',
                      },
                    ])
                  }
                  className="text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-blush-600" /> Add Credential
                </Button>
              </div>

              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl border border-corporate-200/80 bg-corporate-50/50 hover:border-blush-200 transition-colors relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-white border border-corporate-200 text-blush-600 mt-0.5">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-corporate-900">{edu.institution}</h4>
                          <p className="text-xs font-semibold text-corporate-700 mt-0.5">{edu.degree}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[11px] bg-white">
                              Graduated {edu.year}
                            </Badge>
                            <Badge variant="blush" className="text-[11px]">
                              {edu.grade}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEducations(educations.filter((item) => item.id !== edu.id))}
                        className="text-corporate-400 hover:text-rose-500 p-1 rounded-md"
                        title="Remove credential"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Work Experience & Competencies */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-corporate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-corporate-900">Career History & Key Technical Achievements</h3>
                  <p className="text-xs text-corporate-500 mt-0.5">
                    Highlight recent engineering leadership roles, architecture decisions, and technology stacks.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExperiences([
                      ...experiences,
                      {
                        id: `exp-${Date.now()}`,
                        company: 'TechCorp Solutions',
                        position: 'Full Stack Frontend Developer',
                        duration: '2017 — 2019',
                        description: 'Built customer-facing SaaS portals using React, TypeScript, and REST APIs.',
                        skills: ['React', 'JavaScript', 'CSS3', 'REST API'],
                      },
                    ])
                  }
                  className="text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-blush-600" /> Add Experience
                </Button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl border border-corporate-200/80 bg-white hover:border-blush-200 transition-all shadow-subtle space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-corporate-900">{exp.position}</h4>
                          <span className="text-xs font-medium text-corporate-400">•</span>
                          <span className="text-xs font-semibold text-blush-700">{exp.company}</span>
                        </div>
                        <span className="text-xs text-corporate-400 font-medium">{exp.duration}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExperiences(experiences.filter((i) => i.id !== exp.id))}
                        className="text-corporate-400 hover:text-rose-500 p-1 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-corporate-600 leading-relaxed">{exp.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.skills.map((skill) => (
                        <Badge key={skill} variant="pastel" className="text-[10px] py-0 px-2">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-corporate-100">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="gap-2 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
              </Button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              size="md"
              onClick={handleNext}
              className="gap-2 text-xs font-semibold shadow-blush"
            >
              {currentStep === 3 ? (
                <>
                  Complete Profile & Proceed to CV Screening <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Save & Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

