'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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

export function isCandidateProfileComplete(data: any): boolean {
  if (!data) return false;
  const nikStr = (data.nik || '').toString().trim();
  const hasStep1 =
    nikStr.length >= 16 &&
    Boolean(data.fullName && data.fullName.trim().length > 0) &&
    Boolean(data.dob && data.dob.trim().length > 0);

  const hasStep2 =
    Boolean(data.phone && data.phone.trim().length > 0) &&
    Boolean(data.ktpAddress && data.ktpAddress.trim().length > 0) &&
    Boolean(data.emergencyName && data.emergencyName.trim().length > 0) &&
    Boolean(data.emergencyPhone && data.emergencyPhone.trim().length > 0);

  const hasStep3 =
    Boolean(data.schoolName && data.schoolName.trim().length > 0) &&
    Boolean(data.major && data.major.trim().length > 0) &&
    Boolean(data.gradYear && data.gradYear.trim().length > 0);

  const hasStep4 = Boolean(data.expectedSalary && data.expectedSalary.trim().length > 0);

  return Boolean(hasStep1 && hasStep2 && hasStep3 && hasStep4);
}

interface RecruitmentContextType {
  candidate: Candidate;
  stages: StageInfo[];
  uploadedDocs: UploadedDocItem[];
  profileCompleted: boolean;
  competencyAnswers: Record<number, string>;
  competencyScore: number | null;
  competencyPassed: boolean | null;
  competencyCompletedAt: string | null;

  // Psikotes Online (Tahap 4)
  psychologyScore: number | null;
  psychologyPassed: boolean | null;
  psychologyCompletedAt: string | null;
  savePsychologyResult: (score: number, passed: boolean) => void;

  // Prerequisite & Strict Stage Locking Helpers
  isProfileCompleted: boolean;
  isDocsCompleted: boolean;
  isDocsUnlocked: boolean;
  isPsychologyUnlocked: boolean;
  isPsychologyCompleted: boolean;
  isSkillTestUnlocked: boolean;
  isSkillTestCompleted: boolean;

  // Actions
  updateCandidate: (data: Partial<Candidate>) => void;
  setUploadedDocs: React.Dispatch<React.SetStateAction<UploadedDocItem[]>>;
  saveProfileData: (data: any, markAsComplete?: boolean) => void;
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

  // Psikotes Online (Tahap 4) State
  const [psychologyScore, setPsychologyScore] = useState<number | null>(null);
  const [psychologyPassed, setPsychologyPassed] = useState<boolean | null>(null);
  const [psychologyCompletedAt, setPsychologyCompletedAt] = useState<string | null>(null);

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
        if (parsed.psychologyScore !== undefined) setPsychologyScore(parsed.psychologyScore);
        if (parsed.psychologyPassed !== undefined) setPsychologyPassed(parsed.psychologyPassed);
        if (parsed.psychologyCompletedAt) setPsychologyCompletedAt(parsed.psychologyCompletedAt);
      }

      // Check specific storage keys
      const savedProfile = localStorage.getItem('asiaplastik_profile_data');
      const savedCompleted = localStorage.getItem('asiaplastik_profile_completed');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        const isValid = isCandidateProfileComplete(p);
        const isDone = Boolean(savedCompleted === 'true' && isValid);
        setProfileCompleted(isDone);
      } else {
        setProfileCompleted(false);
      }

      const savedDocs = localStorage.getItem('asiaplastik_uploaded_docs');
      if (savedDocs) {
        const d = JSON.parse(savedDocs);
        if (Array.isArray(d) && d.length > 0) {
          setUploadedDocs(d);
        }
      }

      const savedPsycho = localStorage.getItem('asiaplastik_psychology_result');
      if (savedPsycho) {
        const py = JSON.parse(savedPsycho);
        if (py.totalScore !== undefined) {
          setPsychologyScore(py.totalScore);
          setPsychologyPassed(Boolean(py.passed));
          if (py.completedAt) setPsychologyCompletedAt(py.completedAt);
        }
      }

      const savedSkill = localStorage.getItem('asiaplastik_skill_test_answers');
      if (savedSkill) {
        const sk = JSON.parse(savedSkill);
        if (sk.result) {
          setCompetencyScore(sk.result.score);
          setCompetencyPassed(Boolean(sk.result.passed));
        }
      }
    } catch (e) {
      console.warn('Error reading recruitment state from localStorage:', e);
    }
  }, []);

  // Sync with Firebase Auth and Firestore for authenticated candidate
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'candidates', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const valid = isCandidateProfileComplete(data);
            const isDone = Boolean(data.profileCompleted && valid);
            setProfileCompleted(isDone);
            if (data.uploadedDocs && Array.isArray(data.uploadedDocs)) setUploadedDocs(data.uploadedDocs);
            if (data.psychologyScore !== undefined) {
              setPsychologyScore(data.psychologyScore);
              setPsychologyPassed(Boolean(data.psychologyPassed));
            }
            if (data.competencyScore !== undefined) {
              setCompetencyScore(data.competencyScore);
              setCompetencyPassed(Boolean(data.competencyPassed));
            }
            if (data.appliedRole || data.fullName) {
              setCandidate((prev) => ({
                ...prev,
                fullName: data.fullName || prev.fullName,
                email: data.email || prev.email,
                phone: data.phone || prev.phone,
                appliedRole: data.appliedRole || prev.appliedRole,
              }));
            }
          }
        } catch (err) {
          console.error('Error synchronizing candidate state from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
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
        psychologyScore,
        psychologyPassed,
        psychologyCompletedAt,
        ...overrides,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Error saving recruitment state to localStorage:', e);
    }
  };

  // Helper flags for prerequisite checks
  const isProfileCompleted = Boolean(profileCompleted);
  const requiredDocs = uploadedDocs.filter((d) => d.type === 'Wajib');
  const uploadedRequiredCount = requiredDocs.filter((d) => Boolean(d.fileName)).length;
  const isDocsCompleted = requiredDocs.length > 0 && uploadedRequiredCount >= requiredDocs.length;
  const isDocsUnlocked = isProfileCompleted;
  const isPsychologyUnlocked = isDocsCompleted && isProfileCompleted;
  const isPsychologyCompleted = psychologyScore !== null;
  const isSkillTestUnlocked = isPsychologyCompleted && Boolean(psychologyPassed);
  const isSkillTestCompleted = competencyScore !== null;

  // Dynamically recalculate stages based on real candidate progress
  useEffect(() => {
    setStages((prev) =>
      prev.map((s) => {
        if (s.id === 'application') {
          return { ...s, status: 'completed', score: 100 };
        }
        if (s.id === 'profile') {
          return {
            ...s,
            status: isProfileCompleted ? 'completed' : 'in_progress',
            score: isProfileCompleted ? 100 : undefined,
          };
        }
        if (s.id === 'cv-screening') {
          if (isDocsCompleted) {
            return { ...s, status: 'passed', score: 95 };
          }
          if (uploadedRequiredCount > 0) {
            return { ...s, status: 'in_progress' };
          }
          return { ...s, status: isDocsUnlocked ? 'in_progress' : 'pending' };
        }
        if (s.id === 'competency-test') {
          if (isPsychologyCompleted) {
            return {
              ...s,
              status: (psychologyPassed ? 'passed' : 'disqualified') as StageInfo['status'],
              score: psychologyScore ?? 0,
            };
          }
          return { ...s, status: isPsychologyUnlocked ? 'in_progress' : 'pending' };
        }
        if (s.id === 'interview') {
          if (isSkillTestCompleted && competencyPassed) {
            return { ...s, status: 'in_progress' };
          }
          return { ...s, status: 'pending' };
        }
        return s;
      })
    );
  }, [
    isProfileCompleted,
    isDocsCompleted,
    isDocsUnlocked,
    isPsychologyUnlocked,
    isPsychologyCompleted,
    psychologyScore,
    psychologyPassed,
    isSkillTestCompleted,
    competencyPassed,
    uploadedRequiredCount,
  ]);

  const updateCandidate = (data: Partial<Candidate>) => {
    setCandidate((prev) => {
      const updated = { ...prev, ...data };
      persistState({ candidate: updated });
      return updated;
    });
  };

  const saveProfileData = (data: any, markAsComplete = false) => {
    const isComplete = Boolean(markAsComplete && isCandidateProfileComplete(data));
    setProfileCompleted(isComplete);
    if (data.fullName || data.phone || data.email || data.nik) {
      updateCandidate({
        fullName: data.fullName || candidate.fullName,
        phone: data.phone || candidate.phone,
        email: data.email || candidate.email,
        nik: data.nik || candidate.nik,
      });
    }
    try {
      if (isComplete) {
        localStorage.setItem('asiaplastik_profile_completed', 'true');
      } else {
        localStorage.removeItem('asiaplastik_profile_completed');
      }
    } catch (e) {}
    persistState({ profileCompleted: isComplete });
  };

  const savePsychologyResult = (score: number, passed: boolean) => {
    const completedAt = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setPsychologyScore(score);
    setPsychologyPassed(passed);
    setPsychologyCompletedAt(completedAt);
    try {
      localStorage.setItem('asiaplastik_psychology_result', JSON.stringify({
        totalScore: score,
        passed,
        completedAt,
      }));
    } catch (e) {}
    persistState({
      psychologyScore: score,
      psychologyPassed: passed,
      psychologyCompletedAt: completedAt,
    });
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
    setPsychologyScore(null);
    setPsychologyPassed(null);
    setPsychologyCompletedAt(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('asiaplastik_profile_data');
      localStorage.removeItem('asiaplastik_uploaded_docs');
      localStorage.removeItem('asiaplastik_psychology_result');
      localStorage.removeItem('asiaplastik_skill_test_answers');
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
        psychologyScore,
        psychologyPassed,
        psychologyCompletedAt,
        savePsychologyResult,
        isProfileCompleted,
        isDocsCompleted,
        isDocsUnlocked,
        isPsychologyUnlocked,
        isPsychologyCompleted,
        isSkillTestUnlocked,
        isSkillTestCompleted,
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
