export type ApplicationStageId =
  | 'application'
  | 'profile'
  | 'cv-screening'
  | 'competency-test'
  | 'interview'
  | 'mcu'
  | 'offering'
  | 'ai-interview'
  | 'psychology-test'
  | 'practical-final';

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'passed' | 'disqualified';

export interface StageInfo {
  id: ApplicationStageId;
  title: string;
  shortTitle: string;
  description: string;
  route: string;
  status: StageStatus;
  score?: number;
  completedAt?: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nik?: string;
  location: string;
  headline: string;
  avatarUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  appliedRole: string;
  appliedDepartment: string;
  appliedDate: string;
  currentStage: ApplicationStageId;
  overallScore: number;
  finalDecision: 'pending' | 'practical_required' | 'hired' | 'rejected';
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade?: string;
  activities?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
  technologies: string[];
}

export interface SkillItem {
  name: string;
  category: 'core' | 'frontend' | 'backend' | 'devops' | 'soft_skills';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
}

export interface CVScreeningResult {
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'passed' | 'disqualified' | 'analyzing';
  matchScore: number;
  verdict: string;
  matchingSkills: {
    name: string;
    level: string;
    relevance: number; // percentage
  }[];
  missingSkills: string[];
  keyStrengths: string[];
  recommendationNotes: string;
  aiModelVersion: string;
}

export interface CompetencyQuestion {
  id: number;
  category: 'Next.js & React' | 'TypeScript & State' | 'Web Performance' | 'Architecture';
  question: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface CompetencyTestSubmission {
  totalQuestions: number;
  answeredCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  status: 'in_progress' | 'submitted';
  answers: Record<number, string>;
  flaggedQuestions: number[];
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'candidate';
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  competencyEvaluation?: {
    clarityScore: number;
    depthScore: number;
    demonstratedSkills: string[];
    feedbackTip?: string;
  };
}

export interface PsychQuestion {
  id: number;
  category: 'Team Collaboration' | 'Stress Resilience & Adaptability' | 'Ownership & Initiative' | 'Constructive Communication';
  statement: string;
  dimension: 'positive' | 'negative';
}

export interface PracticalTestDetails {
  title: string;
  description: string;
  deadlineHours: number;
  submissionDeadline: string;
  repositoryTemplateUrl: string;
  figmaDesignUrl: string;
  requirements: string[];
  evaluationCriteria: {
    name: string;
    weight: string;
    description: string;
  }[];
}

