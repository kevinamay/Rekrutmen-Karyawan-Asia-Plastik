import {
  Candidate,
  StageInfo,
  CVScreeningResult,
  CompetencyQuestion,
  InterviewMessage,
  PsychQuestion,
  PracticalTestDetails,
} from '@/types/recruitment';

export const INITIAL_STAGES: StageInfo[] = [
  {
    id: 'application',
    title: 'Application & Account',
    shortTitle: 'Applied',
    description: 'Account created and verified on corporate portal',
    route: '/login',
    status: 'completed',
    completedAt: 'Oct 28, 2026',
  },
  {
    id: 'profile',
    title: 'Personal Data & Profile',
    shortTitle: 'Profile',
    description: 'Candidate verified personal, education, and career details',
    route: '/dashboard/profile',
    status: 'completed',
    score: 100,
    completedAt: 'Oct 29, 2026',
  },
  {
    id: 'cv-screening',
    title: 'AI CV Screening',
    shortTitle: 'CV Analysis',
    description: 'Automated skill extraction & semantic resume parsing',
    route: '/dashboard/screening',
    status: 'passed',
    score: 94,
    completedAt: 'Oct 30, 2026',
  },
  {
    id: 'competency-test',
    title: 'Online Competency Test',
    shortTitle: 'Technical Quiz',
    description: 'Timed assessment on Next.js, TypeScript, & Architecture',
    route: '/dashboard/competency-test',
    status: 'passed',
    score: 92,
    completedAt: 'Oct 31, 2026',
  },
  {
    id: 'ai-interview',
    title: 'AI HR Interview Room',
    shortTitle: 'AI Interview',
    description: 'Conversational assessment constrained to role scope',
    route: '/dashboard/ai-interview',
    status: 'passed',
    score: 89,
    completedAt: 'Nov 01, 2026',
  },
  {
    id: 'psychology-test',
    title: 'Psychological Assessment',
    shortTitle: 'Behavioral Test',
    description: 'Likert behavioral & situational workplace dynamics',
    route: '/dashboard/psychology-test',
    status: 'passed',
    score: 95,
    completedAt: 'Nov 02, 2026',
  },
  {
    id: 'practical-final',
    title: 'Practical Test & Final Decision',
    shortTitle: 'Final Verdict',
    description: 'Hands-on practical assignment and executive hiring decision',
    route: '/dashboard/status',
    status: 'in_progress',
  },
];

export const INITIAL_CANDIDATE: Candidate = {
  id: 'cand_asp_0891',
  fullName: 'Kevina Maydiva Heriansaputri',
  email: 'kevinamay23@gmail.com',
  phone: '082244109503',
  location: 'Sidoarjo, Jawa Timur (Pabrik CV. Asia Plastik)',
  headline: 'Pelamar Calon Supervisor Quality Control (QC)',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary:
    'Kandidat pelamar kerja posisi Supervisor Quality Control (QC) CV. Asia Plastik di Sidoarjo. Memiliki integritas tinggi, dedikasi terhadap standar mutu ISO 9001, dan kepemimpinan operasional.',
  appliedRole: 'Supervisor Quality Control (QC)',
  appliedDepartment: 'Quality Assurance & Control',
  appliedDate: '11 Februari 2027',
  currentStage: 'profile',
  overallScore: 88,
  finalDecision: 'pending',
};

export const MOCK_PASSED_CV_RESULT: CVScreeningResult = {
  fileName: 'Sarah_Jenkins_Staff_Frontend_Resume.pdf',
  fileSize: '1.42 MB',
  uploadedAt: 'Oct 30, 2026 • 14:22 GMT',
  status: 'passed',
  matchScore: 94,
  verdict: 'High Match — Candidate meets or exceeds all core and secondary competencies.',
  matchingSkills: [
    { name: 'Next.js (App Router, RSC, ISR)', level: 'Expert', relevance: 98 },
    { name: 'React 18/19 & Concurrency', level: 'Expert', relevance: 96 },
    { name: 'TypeScript & Type Safety', level: 'Expert', relevance: 95 },
    { name: 'Tailwind CSS & Design Tokens', level: 'Advanced', relevance: 93 },
    { name: 'Web Vitals & Performance Tuning', level: 'Advanced', relevance: 92 },
    { name: 'State Management (Zustand/Redux)', level: 'Advanced', relevance: 90 },
    { name: 'Automated CI/CD & Testing', level: 'Advanced', relevance: 88 },
  ],
  missingSkills: ['Kubernetes cluster provisioning (Non-critical)'],
  keyStrengths: [
    'Demonstrated architecture experience scaling corporate portals to 2M+ MAU.',
    'Deep expertise with Next.js App Router server actions and streaming hydration.',
    'Strong track record leading accessibility audits adhering to WCAG 2.1 AA.',
  ],
  recommendationNotes:
    'Recommended for immediate progression to Online Competency Assessment. Candidate exhibits exceptional engineering leadership pedigree.',
  aiModelVersion: 'AuraRecruit-NLP-v4.2-Verified',
};

export const MOCK_DISQUALIFIED_CV_RESULT: CVScreeningResult = {
  fileName: 'Candidate_Draft_CV_v1.pdf',
  fileSize: '890 KB',
  uploadedAt: 'Oct 30, 2026 • 11:15 GMT',
  status: 'disqualified',
  matchScore: 42,
  verdict: 'Disqualified (Does not meet minimum role criteria).',
  matchingSkills: [
    { name: 'HTML & CSS', level: 'Intermediate', relevance: 60 },
    { name: 'JavaScript Basics', level: 'Intermediate', relevance: 55 },
  ],
  missingSkills: [
    'Next.js (App Router)',
    'TypeScript (Advanced Generics & Strict Typing)',
    'Enterprise System Architecture (5+ years required)',
    'Component Library & Accessible Design Systems',
  ],
  keyStrengths: ['Basic familiarity with web technologies.'],
  recommendationNotes:
    'The resume lacks required enterprise Next.js, TypeScript, and architectural leadership tenure required for this senior tier.',
  aiModelVersion: 'AuraRecruit-NLP-v4.2-Verified',
};

export const MOCK_COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    id: 1,
    category: 'Next.js & React',
    question:
      'In Next.js App Router, what is the key architectural difference between React Server Components (RSC) and Client Components marked with "use client"?',
    options: [
      {
        id: 'A',
        text: 'RSC execute only on the server, producing zero client-side JavaScript bundle footprint for static dependencies.',
      },
      {
        id: 'B',
        text: 'Client Components run exclusively in the browser and cannot perform SSR during initial page load.',
      },
      {
        id: 'C',
        text: 'RSC can directly use React hooks like useState and useEffect without requiring client directives.',
      },
      {
        id: 'D',
        text: 'There is no execution difference; "use client" is merely a TypeScript linter configuration.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'React Server Components execute entirely on the server and render into an intermediate format (RSC payload), transmitting zero JavaScript code for server-only dependencies to the client bundle.',
  },
  {
    id: 2,
    category: 'TypeScript & State',
    question:
      'Given an enterprise form handling state, which TypeScript utility pattern provides type-safe discriminated unions for asynchronous operations?',
    codeSnippet: `type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };`,
    options: [
      {
        id: 'A',
        text: 'Discriminated unions with a shared literal tag ("status") allowing exhaustive narrowing in switch/if branches.',
      },
      {
        id: 'B',
        text: 'Optional property chaining with non-null assertion operators on every property.',
      },
      {
        id: 'C',
        text: 'Type casting with "any" to avoid runtime compilation errors.',
      },
      {
        id: 'D',
        text: 'Global variable augmentation within declaration files.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'Discriminated unions use a common literal discriminant property (here, "status") to enable TypeScript to reliably narrow each variant safely.',
  },
  {
    id: 3,
    category: 'Web Performance',
    question:
      'Which metric directly measures visual stability and prevents jarring layout shifts as images and dynamic ads load?',
    options: [
      { id: 'A', text: 'Cumulative Layout Shift (CLS)' },
      { id: 'B', text: 'Largest Contentful Paint (LCP)' },
      { id: 'C', text: 'First Input Delay (FID) / Interaction to Next Paint (INP)' },
      { id: 'D', text: 'Time to First Byte (TTFB)' },
    ],
    correctOptionId: 'A',
    explanation:
      'Cumulative Layout Shift (CLS) measures visual stability by tracking unexpected layout shifts occurring during the lifespan of a page.',
  },
  {
    id: 4,
    category: 'Architecture',
    question:
      'When designing a scalable corporate Design System with Tailwind CSS, what is the best practice for managing semantic theme tokens?',
    options: [
      {
        id: 'A',
        text: 'Map CSS variables with HSL/RGB values to Tailwind config theme extensions for clean theme switching and accessible contrast ratios.',
      },
      {
        id: 'B',
        text: 'Hardcode hex color codes directly into every individual component className.',
      },
      {
        id: 'C',
        text: 'Use inline !important styles in JSX style attributes.',
      },
      {
        id: 'D',
        text: 'Disable Tailwind purging and generate arbitrary 10,000 utility classes.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'Using CSS custom properties combined with Tailwind config tokens guarantees consistent corporate brand governance and seamless theming.',
  },
  {
    id: 5,
    category: 'Next.js & React',
    question:
      'How does React 18 useTransition hook optimize the user experience during expensive UI rendering updates?',
    options: [
      {
        id: 'A',
        text: 'It marks state updates as non-urgent transitions, keeping the main thread responsive to urgent user inputs like typing or clicking.',
      },
      {
        id: 'B',
        text: 'It completely disables React reconciliation and forces browser paints.',
      },
      {
        id: 'C',
        text: 'It offloads JavaScript execution to a separate WebAssembly background worker automatically.',
      },
      {
        id: 'D',
        text: 'It replaces all CSS animations with JavaScript setTimeout loops.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'useTransition allows developers to mark state updates as non-blocking transitions, ensuring user input responsiveness remains instantaneous.',
  },
  {
    id: 6,
    category: 'Architecture',
    question:
      'In a micro-frontend or modular component architecture, what is the primary benefit of the Container/Presentational or Headless UI pattern?',
    options: [
      {
        id: 'A',
        text: 'Separation of concerns: decoupling state logic and accessibility from styling allows maximum design flexibility and testability.',
      },
      {
        id: 'B',
        text: 'It reduces the need for any unit tests.',
      },
      {
        id: 'C',
        text: 'It automatically generates server-side SQL queries without an ORM.',
      },
      {
        id: 'D',
        text: 'It merges HTML head elements into a single script bundle.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'Headless components handle keyboard navigation, ARIA attributes, and state machines while leaving markup and visual styling entirely to design teams.',
  },
];

export const INITIAL_INTERVIEW_MESSAGES: InterviewMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    senderName: 'Aura HR (AI Recruiter)',
    avatar: '/ai-avatar.png',
    text: "Welcome Sarah! I'm Aura, your automated AI Technical Recruiter at NexaCorp. I'm strictly constrained to assessing competencies for the Lead Frontend Architect position. Let's begin: Could you describe an architectural decision you made in Next.js where you had to balance SSR performance with dynamic client interactions?",
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-2',
    sender: 'candidate',
    senderName: 'Sarah Jenkins',
    text: "In my previous project, we built a real-time analytics dashboard with 50+ data widgets. We designed the layout using Next.js App Router Server Components to fetch initial heavy dataset aggregations with cached fetch tags, while using granular client boundaries wrapped in Suspense for the interactive filters and live chart toggles. This reduced our initial JS bundle by 64% and brought our LCP under 1.1s.",
    timestamp: '10:04 AM',
    competencyEvaluation: {
      clarityScore: 95,
      depthScore: 92,
      demonstratedSkills: ['Next.js App Router', 'Streaming SSR', 'Suspense Boundaries', 'Bundle Optimization'],
      feedbackTip: 'Strong concrete metrics (64% bundle reduction, 1.1s LCP). High technical credibility.',
    },
  },
  {
    id: 'msg-3',
    sender: 'ai',
    senderName: 'Aura HR (AI Recruiter)',
    avatar: '/ai-avatar.png',
    text: "Excellent strategy using Suspense boundaries. How did you handle edge cases such as network latency or partial data fetching failures across those 50+ widgets without crashing the entire dashboard?",
    timestamp: '10:05 AM',
  },
];

export const SUGGESTED_INTERVIEW_RESPONSES = [
  "We implemented isolated Error Boundaries per widget card combined with optimistic UI rollbacks and exponential backoff retry policies.",
  "We utilized TanStack Query's prefetching cache together with stale-while-revalidate headers on our Next.js Route Handlers to ensure resilient fallbacks.",
  "We established strict TypeScript contracts with Zod validation at the API boundary, logging errors to Sentry while rendering graceful skeleton fallbacks.",
];

export const MOCK_PSYCH_QUESTIONS: PsychQuestion[] = [
  {
    id: 1,
    category: 'Team Collaboration',
    statement:
      'When an engineering peer proposes an alternative architecture different from mine, I proactively seek to understand their reasoning before defending my approach.',
    dimension: 'positive',
  },
  {
    id: 2,
    category: 'Stress Resilience & Adaptability',
    statement:
      'When production release deadlines shift abruptly or specifications change mid-sprint, I maintain calm focus and guide the team in re-prioritizing deliverables.',
    dimension: 'positive',
  },
  {
    id: 3,
    category: 'Ownership & Initiative',
    statement:
      'If I discover a performance bottleneck or accessibility issue that is outside my assigned ticket, I document it and take initiative to address or triage it.',
    dimension: 'positive',
  },
  {
    id: 4,
    category: 'Constructive Communication',
    statement:
      'I deliver critical code review feedback focusing objectively on system impact, maintainability, and testing standards rather than personal preferences.',
    dimension: 'positive',
  },
  {
    id: 5,
    category: 'Team Collaboration',
    statement:
      'I actively mentor junior and mid-level engineers, taking satisfaction in leveling up team capability rather than hoarding domain knowledge.',
    dimension: 'positive',
  },
  {
    id: 6,
    category: 'Stress Resilience & Adaptability',
    statement:
      'I remain composed during major incident bridge calls, methodically troubleshooting root causes rather than allocating blame.',
    dimension: 'positive',
  },
  {
    id: 7,
    category: 'Ownership & Initiative',
    statement:
      'I proactively collaborate with Product and UX Design partners early in the discovery phase to identify technical trade-offs before implementation begins.',
    dimension: 'positive',
  },
  {
    id: 8,
    category: 'Constructive Communication',
    statement:
      'I welcome feedback on my architectural RFCs openly and view constructive critique as an essential step toward building resilient systems.',
    dimension: 'positive',
  },
];

export const MOCK_PRACTICAL_TEST: PracticalTestDetails = {
  title: 'Lead Frontend System Challenge: High-Frequency Analytics Dashboard',
  description:
    'Build a modular, accessible data dashboard with interactive chart widgets, responsive data tables with multi-column filtering, and WCAG 2.1 AA keyboard navigation using Next.js App Router and Tailwind CSS.',
  deadlineHours: 48,
  submissionDeadline: 'Nov 05, 2026 • 23:59 PST',
  repositoryTemplateUrl: 'https://github.com/nexacorp-enterprise/frontend-practical-starter',
  figmaDesignUrl: 'https://figma.com/@nexacorp/design-systems-lead-spec',
  requirements: [
    'Implement App Router with streaming SSR and granular Suspense boundaries',
    'Follow accessible WAI-ARIA patterns with full keyboard navigation for modals and tables',
    'Use Tailwind CSS with clean token variables conforming to corporate guidelines',
    'Include unit/integration test coverage with React Testing Library or Vitest (>80%)',
    'Provide clean README documenting architectural trade-offs, state choices, and benchmark results',
  ],
  evaluationCriteria: [
    { name: 'Component Modularity & Clean Architecture', weight: '30%', description: 'Code readability, reusable UI primitives, folder organization' },
    { name: 'Performance & Web Vitals', weight: '25%', description: 'Bundle size, rendering optimization, minimal re-renders' },
    { name: 'Accessibility & Responsiveness', weight: '25%', description: 'Keyboard navigation, screen-reader friendliness, seamless mobile layout' },
    { name: 'Testing & Documentation', weight: '20%', description: 'High test coverage, clear setup instructions, architectural rationale' },
  ],
};

