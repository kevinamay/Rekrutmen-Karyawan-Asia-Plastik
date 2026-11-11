'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Candidate,
  StageInfo,
  ApplicationStageId,
  CVScreeningResult,
  InterviewMessage,
} from '@/types/recruitment';
import {
  INITIAL_CANDIDATE,
  INITIAL_STAGES,
  MOCK_PASSED_CV_RESULT,
  MOCK_DISQUALIFIED_CV_RESULT,
} from '@/data/mockRecruitmentData';

export interface UploadedDocItem {
  id: string;
  name: string;
  type: 'Wajib' | 'Opsional';
  fileName: string | null;
  size: string | null;
  verified: boolean;
  updatedAt: string;
}

export const DEFAULT_REQUIRED_DOCS: UploadedDocItem[] = [
  {
    id: 'cv',
    name: 'Curriculum Vitae (CV) Pelamar',
    type: 'Wajib',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
  {
    id: 'ktp',
    name: 'Scan e-KTP Asli',
    type: 'Wajib',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
  {
    id: 'ijazah',
    name: 'Scan Ijazah & Transkrip S1/D4',
    type: 'Wajib',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
  {
    id: 'foto',
    name: 'Pas Foto Formal 4x6 (Latar Merah)',
    type: 'Wajib',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
  {
    id: 'skck',
    name: 'Surat Catatan Kepolisian (SKCK)',
    type: 'Wajib',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
  {
    id: 'k3',
    name: 'Sertifikat K3 / Sertifikat Pelatihan Mutu',
    type: 'Opsional',
    fileName: null,
    size: null,
    verified: false,
    updatedAt: '-',
  },
];

interface RecruitmentContextType {
  candidate: Candidate;
  stages: StageInfo[];
  uploadedDocs: UploadedDocItem[];
  profileCompleted: boolean;
  competencyAnswers: Record<number, string>;
  competencyScore: number | null;
  competencyPassed: boolean | null;
  competencyCompletedAt: string | null;

  // Actions
  updateCandidate: (data: Partial<Candidate>) => void;
  setUploadedDocs: React.Dispatch<React.SetStateAction<UploadedDocItem[]>>;
  saveProfileData: (data: any) => void;
  saveCompetencyResult: (answers: Record<number, string>, score: number, passed: boolean) => void;
  updateStageStatus: (stageId: ApplicationStageId, status: StageInfo['status'], score?: number) => void;
  resetAllData: () => void;
  recalculateStages: () => void;

  // Legacy stubs for compatibility
  cvResult: CVScreeningResult;
  isAnalyzingCV: boolean;
  cvUploadProgress: number;
  triggerCVAnalysis: (simulatePassed?: boolean) => void;
  setCVOutcome: (outcome: 'passed' | 'disqualified') => void;
  setCompetencyAnswer: (questionId: number, optionId: string) => void;
  toggleFlagQuestion: (questionId: number) => void;
  submitCompetencyTest: () => void;
  sendCandidateMessage: (text: string) => void;
  setPsychAnswer: (questionId: number, value: number) => void;
  submitPsychTest: () => void;
  submitPracticalTest: (data: any) => void;
  setFinalDecision: (decision: any) => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'asiaplastik_recruitment_v1';

export function RecruitmentProvider({ children }: { children: React.ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate>(INITIAL_CANDIDATE);
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocItem[]>(DEFAULT_REQUIRED_DOCS);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [competencyAnswers, setCompetencyAnswers] = useState<Record<number, string>>({});
  const [competencyScore, setCompetencyScore] = useState<number | null>(null);
  const [competencyPassed, setCompetencyPassed] = useState<boolean | null>(null);
  const [competencyCompletedAt, setCompetencyCompletedAt] = useState<string | null>(null);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.candidate) setCandidate(parsed.candidate);
        if (parsed.uploadedDocs) setUploadedDocs(parsed.uploadedDocs);
        if (parsed.profileCompleted !== undefined) setProfileCompleted(parsed.profileCompleted);
        if (parsed.competencyAnswers) setCompetencyAnswers(parsed.competencyAnswers);
        if (parsed.competencyScore !== undefined) setCompetencyScore(parsed.competencyScore);
        if (parsed.competencyPassed !== undefined) setCompetencyPassed(parsed.competencyPassed);
        if (parsed.competencyCompletedAt) setCompetencyCompletedAt(parsed.competencyCompletedAt);
      }
    } catch (e) {
      console.warn('Error reading recruitment state from localStorage:', e);
    }
  }, []);

  // Save changes to localStorage
  const persistState = (overrides?: any) => {
    try {
      const stateToSave = {
        candidate,
        uploadedDocs,
        profileCompleted,
        competencyAnswers,
        competencyScore,
        competencyPassed,
        competencyCompletedAt,
        ...overrides,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Error saving recruitment state to localStorage:', e);
    }
  };

  // Dynamically recalculate stages based on real candidate progress
  useEffect(() => {
    const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
    const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;
    const allRequiredUploaded = requiredDocs.length > 0 && uploadedRequiredCount === requiredDocs.length;

    setStages((prev) =>
      prev.map((s) => {
        if (s.id === 'application') {
          return { ...s, status: 'completed', score: 100 };
        }
        if (s.id === 'profile') {
          return {
            ...s,
            status: profileCompleted ? 'completed' : 'in_progress',
            score: profileCompleted ? 100 : undefined,
          };
        }
        if (s.id === 'cv-screening') {
          if (allRequiredUploaded) {
            return { ...s, status: 'passed', score: 95 };
          }
          if (uploadedRequiredCount > 0) {
            return { ...s, status: 'in_progress' };
          }
          return { ...s, status: profileCompleted ? 'in_progress' : 'pending' };
        }
        if (s.id === 'competency-test') {
          if (competencyScore !== null) {
            return {
              ...s,
              status: (competencyPassed ? 'passed' : 'disqualified') as StageInfo['status'],
              score: competencyScore,
            };
          }
          return { ...s, status: allRequiredUploaded ? 'in_progress' : 'pending' };
        }
        if (s.id === 'interview') {
          if (competencyPassed) {
            return { ...s, status: 'in_progress' };
          }
          return { ...s, status: 'pending' };
        }
        return s;
      })
    );
  }, [profileCompleted, uploadedDocs, competencyScore, competencyPassed]);

  const updateCandidate = (data: Partial<Candidate>) => {
    setCandidate((prev) => {
      const updated = { ...prev, ...data };
      persistState({ candidate: updated });
      return updated;
    });
  };

  const saveProfileData = (data: any) => {
    setProfileCompleted(true);
    if (data.fullName || data.phone || data.email) {
      updateCandidate({
        fullName: data.fullName || candidate.fullName,
        phone: data.phone || candidate.phone,
        email: data.email || candidate.email,
      });
    }
    persistState({ profileCompleted: true });
  };

  const saveCompetencyResult = (
    answers: Record<number, string>,
    score: number,
    passed: boolean
  ) => {
    const completedAt = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCompetencyAnswers(answers);
    setCompetencyScore(score);
    setCompetencyPassed(passed);
    setCompetencyCompletedAt(completedAt);
    persistState({
      competencyAnswers: answers,
      competencyScore: score,
      competencyPassed: passed,
      competencyCompletedAt: completedAt,
    });
  };

  const updateStageStatus = (
    stageId: ApplicationStageId,
    status: StageInfo['status'],
    score?: number
  ) => {
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, status, score: score ?? s.score } : s))
    );
  };

  const resetAllData = () => {
    setCandidate(INITIAL_CANDIDATE);
    setStages(INITIAL_STAGES);
    setUploadedDocs(DEFAULT_REQUIRED_DOCS);
    setProfileCompleted(false);
    setCompetencyAnswers({});
    setCompetencyScore(null);
    setCompetencyPassed(null);
    setCompetencyCompletedAt(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
  };

  const recalculateStages = () => {
    // Triggers dynamic effect re-evaluation
  };

  // Legacy stubs
  const [cvResult, setCVResult] = useState<CVScreeningResult>(MOCK_PASSED_CV_RESULT);
  const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);
  const [cvUploadProgress, setCvUploadProgress] = useState(100);

  const triggerCVAnalysis = (simulatePassed = true) => {
    setIsAnalyzingCV(true);
    setTimeout(() => {
      setIsAnalyzingCV(false);
      setCVResult(simulatePassed ? MOCK_PASSED_CV_RESULT : MOCK_DISQUALIFIED_CV_RESULT);
    }, 1000);
  };

  const setCVOutcome = (outcome: 'passed' | 'disqualified') => {
    setCVResult(outcome === 'passed' ? MOCK_PASSED_CV_RESULT : MOCK_DISQUALIFIED_CV_RESULT);
  };

  const setCompetencyAnswer = (qId: number, optId: string) => {
    setCompetencyAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const toggleFlagQuestion = () => {};
  const submitCompetencyTest = () => {};
  const sendCandidateMessage = () => {};
  const setPsychAnswer = () => {};
  const submitPsychTest = () => {};
  const submitPracticalTest = () => {};
  const setFinalDecision = () => {};

  return (
    <RecruitmentContext.Provider
      value={{
        candidate,
        stages,
        uploadedDocs,
        profileCompleted,
        competencyAnswers,
        competencyScore,
        competencyPassed,
        competencyCompletedAt,
        updateCandidate,
        setUploadedDocs,
        saveProfileData,
        saveCompetencyResult,
        updateStageStatus,
        resetAllData,
        recalculateStages,
        cvResult,
        isAnalyzingCV,
        cvUploadProgress,
        triggerCVAnalysis,
        setCVOutcome,
        setCompetencyAnswer,
        toggleFlagQuestion,
        submitCompetencyTest,
        sendCandidateMessage,
        setPsychAnswer,
        submitPsychTest,
        submitPracticalTest,
        setFinalDecision,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
}

export function useRecruitment() {
  const context = useContext(RecruitmentContext);
  if (!context) {
    throw new Error('useRecruitment must be used within a RecruitmentProvider');
  }
  return context;
}
