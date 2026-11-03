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
  INITIAL_INTERVIEW_MESSAGES,
} from '@/data/mockRecruitmentData';

interface RecruitmentContextType {
  candidate: Candidate;
  stages: StageInfo[];
  cvResult: CVScreeningResult;
  isAnalyzingCV: boolean;
  cvUploadProgress: number;
  competencyAnswers: Record<number, string>;
  competencyFlagged: number[];
  interviewMessages: InterviewMessage[];
  isAiTyping: boolean;
  psychAnswers: Record<number, number>;
  practicalSubmitted: boolean;
  practicalSubmissionData: { repoUrl: string; previewUrl: string; notes: string } | null;

  // Actions
  updateCandidate: (data: Partial<Candidate>) => void;
  triggerCVAnalysis: (simulatePassed?: boolean) => void;
  setCVOutcome: (outcome: 'passed' | 'disqualified') => void;
  setCompetencyAnswer: (questionId: number, optionId: string) => void;
  toggleFlagQuestion: (questionId: number) => void;
  submitCompetencyTest: () => void;
  sendCandidateMessage: (text: string) => void;
  setPsychAnswer: (questionId: number, value: number) => void;
  submitPsychTest: () => void;
  submitPracticalTest: (data: { repoUrl: string; previewUrl: string; notes: string }) => void;
  setFinalDecision: (decision: 'pending' | 'practical_required' | 'hired' | 'rejected') => void;
  updateStageStatus: (stageId: ApplicationStageId, status: StageInfo['status'], score?: number) => void;
  resetAllDemoData: () => void;
}

const RecruitmentContext = createContext<RecruitmentContextType | undefined>(undefined);

export function RecruitmentProvider({ children }: { children: React.ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate>(INITIAL_CANDIDATE);
  const [stages, setStages] = useState<StageInfo[]>(INITIAL_STAGES);
  const [cvResult, setCVResult] = useState<CVScreeningResult>(MOCK_PASSED_CV_RESULT);
  const [isAnalyzingCV, setIsAnalyzingCV] = useState(false);
  const [cvUploadProgress, setCvUploadProgress] = useState(100);

  // Competency quiz state
  const [competencyAnswers, setCompetencyAnswers] = useState<Record<number, string>>({
    1: 'A',
    2: 'A',
    3: 'A',
    4: 'A',
  });
  const [competencyFlagged, setCompetencyFlagged] = useState<number[]>([]);

  // AI Interview state
  const [interviewMessages, setInterviewMessages] = useState<InterviewMessage[]>(INITIAL_INTERVIEW_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Psych test state
  const [psychAnswers, setPsychAnswers] = useState<Record<number, number>>({
    1: 5,
    2: 5,
    3: 4,
    4: 5,
    5: 5,
    6: 4,
    7: 5,
    8: 4,
  });

  // Practical test submission
  const [practicalSubmitted, setPracticalSubmitted] = useState(false);
  const [practicalSubmissionData, setPracticalSubmissionData] = useState<{
    repoUrl: string;
    previewUrl: string;
    notes: string;
  } | null>({
    repoUrl: 'https://github.com/sarah-jenkins/nexacorp-lead-analytics',
    previewUrl: 'https://nexacorp-challenge.vercel.app',
    notes: 'Completed all 5 core requirements including 91% Vitest coverage and WCAG 2.1 AA keyboard support.',
  });

  const updateCandidate = (data: Partial<Candidate>) => {
    setCandidate((prev) => ({ ...prev, ...data }));
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

  const triggerCVAnalysis = (simulatePassed = true) => {
    setIsAnalyzingCV(true);
    setCvUploadProgress(15);

    const stepInterval = setInterval(() => {
      setCvUploadProgress((curr) => {
        if (curr >= 95) {
          clearInterval(stepInterval);
          return 95;
        }
        return curr + 20;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(stepInterval);
      setCvUploadProgress(100);
      setIsAnalyzingCV(false);
      setCVResult(simulatePassed ? MOCK_PASSED_CV_RESULT : MOCK_DISQUALIFIED_CV_RESULT);
      updateStageStatus('cv-screening', simulatePassed ? 'passed' : 'disqualified', simulatePassed ? 94 : 42);
    }, 2400);
  };

  const setCVOutcome = (outcome: 'passed' | 'disqualified') => {
    setCVResult(outcome === 'passed' ? MOCK_PASSED_CV_RESULT : MOCK_DISQUALIFIED_CV_RESULT);
    updateStageStatus('cv-screening', outcome, outcome === 'passed' ? 94 : 42);
  };

  const setCompetencyAnswer = (questionId: number, optionId: string) => {
    setCompetencyAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleFlagQuestion = (questionId: number) => {
    setCompetencyFlagged((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const submitCompetencyTest = () => {
    updateStageStatus('competency-test', 'passed', 92);
  };

  const sendCandidateMessage = (text: string) => {
    const newMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      sender: 'candidate',
      senderName: candidate.fullName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      competencyEvaluation: {
        clarityScore: 94,
        depthScore: 90,
        demonstratedSkills: ['System Design', 'Defensive Programming', 'Frontend Resiliency'],
        feedbackTip: 'Strong structured rationale and focus on high availability.',
      },
    };

    setInterviewMessages((prev) => [...prev, newMsg]);
    setIsAiTyping(true);

    // AI HR automatic contextual reply simulation
    setTimeout(() => {
      setIsAiTyping(false);
      const aiReply: InterviewMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        senderName: 'Aura HR (AI Recruiter)',
        avatar: '/ai-avatar.png',
        text: `Impressive response, ${candidate.fullName.split(' ')[0]}. That demonstrates deep architectural maturity. One final question regarding team leadership: When mentoring senior developers who disagree on adopting a new standard or pattern, how do you facilitate consensus without slowing sprint velocity?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setInterviewMessages((prev) => [...prev, aiReply]);
      updateStageStatus('ai-interview', 'passed', 91);
    }, 2200);
  };

  const setPsychAnswer = (questionId: number, value: number) => {
    setPsychAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitPsychTest = () => {
    updateStageStatus('psychology-test', 'passed', 95);
  };

  const submitPracticalTest = (data: { repoUrl: string; previewUrl: string; notes: string }) => {
    setPracticalSubmissionData(data);
    setPracticalSubmitted(true);
    updateStageStatus('practical-final', 'completed', 96);
  };

  const setFinalDecision = (decision: 'pending' | 'practical_required' | 'hired' | 'rejected') => {
    setCandidate((prev) => ({ ...prev, finalDecision: decision }));
  };

  const resetAllDemoData = () => {
    setCandidate(INITIAL_CANDIDATE);
    setStages(INITIAL_STAGES);
    setCVResult(MOCK_PASSED_CV_RESULT);
    setInterviewMessages(INITIAL_INTERVIEW_MESSAGES);
    setPracticalSubmitted(false);
  };

  return (
    <RecruitmentContext.Provider
      value={{
        candidate,
        stages,
        cvResult,
        isAnalyzingCV,
        cvUploadProgress,
        competencyAnswers,
        competencyFlagged,
        interviewMessages,
        isAiTyping,
        psychAnswers,
        practicalSubmitted,
        practicalSubmissionData,
        updateCandidate,
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
        updateStageStatus,
        resetAllDemoData,
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

