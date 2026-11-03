'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecruitment } from '@/context/RecruitmentContext';
import { SUGGESTED_INTERVIEW_RESPONSES } from '@/data/mockRecruitmentData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldAlert,
  Mic,
  MicOff,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
  Volume2,
  Award,
} from 'lucide-react';

export default function AIInterviewPage() {
  const router = useRouter();
  const {
    candidate,
    interviewMessages,
    isAiTyping,
    sendCandidateMessage,
    updateStageStatus,
  } = useRecruitment();

  const [inputMessage, setInputMessage] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [audioSynthesizing, setAudioSynthesizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [interviewMessages, isAiTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiTyping) return;
    const text = inputMessage.trim();
    setInputMessage('');
    sendCandidateMessage(text);
  };

  const handleSuggestedClick = (suggested: string) => {
    if (isAiTyping) return;
    sendCandidateMessage(suggested);
  };

  const handleCompleteInterview = () => {
    updateStageStatus('ai-interview', 'passed', 91);
    router.push('/dashboard/psychology-test');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Stage Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-corporate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="blush">Stage 5 of 7</Badge>
            <span className="text-xs text-corporate-400 font-medium">• Autonomous Conversational AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-corporate-900 tracking-tight mt-1">
            AI HR Technical Interview Room
          </h1>
          <p className="text-xs sm:text-sm text-corporate-500 mt-0.5">
            Real-time conversational interview evaluating architectural judgment, system resilience, and team leadership.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCompleteInterview}
          className="gap-1.5 text-xs font-semibold shadow-blush self-start sm:self-auto"
        >
          Finish & Advance to Stage 6 <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Strict Role-Constrained Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-pastel-blush via-white to-pastel-lavender/50 p-4 border border-blush-200/80 shadow-subtle flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-blush-100 text-blush-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-corporate-700">
          <div className="flex items-center gap-2 font-bold text-corporate-900 text-xs sm:text-sm">
            <span>AI Guardrail & Fair Hiring Boundary Active</span>
            <Badge variant="blush" className="text-[10px] py-0 px-2 font-semibold">
              Constrained Scope
            </Badge>
          </div>
          <p className="mt-1 text-corporate-600 leading-relaxed">
            Aura HR is strictly constrained to the job criteria for <strong className="text-corporate-800">Lead Frontend Architect (Req #842)</strong>.
            The model adheres to ISO/IEC 42001 and EEOC non-discrimination guidelines, focusing exclusively on
            Next.js architecture, component modularity, and technical leadership.
          </p>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <Card className="border border-corporate-200/80 shadow-card flex flex-col h-[600px] overflow-hidden">
        {/* Chat Room Subheader */}
        <div className="p-4 bg-white border-b border-corporate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blush-600 to-blush-400 text-white flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-corporate-900">Aura AI Recruiter</span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-blush-700 bg-blush-50/50">
                  Lead HR Agent
                </Badge>
              </div>
              <p className="text-[11px] text-corporate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Conversational Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioSynthesizing(!audioSynthesizing)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-colors ${
                audioSynthesizing
                  ? 'bg-blush-50 text-blush-700 border-blush-200'
                  : 'text-corporate-500 hover:bg-corporate-50 border-corporate-200'
              }`}
              title="Voice narration simulation"
            >
              <Volume2 className="w-4 h-4 text-blush-500" />
              <span className="hidden sm:inline text-[11px] font-semibold">
                {audioSynthesizing ? 'Voice Active' : 'Listen'}
              </span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#fafbfe]/70">
          {interviewMessages.map((msg) => {
            const isAI = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isAI ? 'self-start' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  {isAI ? (
                    <div className="w-8 h-8 rounded-lg bg-blush-500 text-white flex items-center justify-center text-xs shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-blush-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5">
                  <div className={`flex items-center gap-2 text-[11px] text-corporate-400 ${!isAI ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-corporate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isAI
                        ? 'bg-white text-corporate-800 border border-corporate-200/80 rounded-tl-sm'
                        : 'bg-gradient-to-r from-blush-600 to-blush-500 text-white rounded-tr-sm shadow-blush'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Competency Evaluation Badge for Candidate Responses */}
                  {msg.competencyEvaluation && (
                    <div className="rounded-xl bg-white border border-corporate-200/80 p-2.5 text-xs text-corporate-600 shadow-xs space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Competencies Detected
                        </span>
                        <span className="text-blush-600">
                          Fit: {msg.competencyEvaluation.clarityScore}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.competencyEvaluation.demonstratedSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5 bg-slate-50">
                            {s}
                          </Badge>
                        ))}
                      </div>
                      {msg.competencyEvaluation.feedbackTip && (
                        <p className="text-[10px] text-corporate-400 italic">
                          💡 {msg.competencyEvaluation.feedbackTip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Typing Animation Indicator */}
          {isAiTyping && (
            <div className="flex gap-3 max-w-[85%] self-start animate-in fade-in">
              <div className="w-8 h-8 rounded-lg bg-blush-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl bg-white border border-corporate-200/80 p-4 shadow-xs rounded-tl-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-corporate-600">Aura AI is evaluating & typing</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blush-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blush-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blush-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Responses Toolbar */}
        <div className="p-2.5 bg-corporate-50/80 border-t border-corporate-200/60 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-corporate-400 whitespace-nowrap pl-1">
            Suggested:
          </span>
          {SUGGESTED_INTERVIEW_RESPONSES.map((resp, i) => (
            <button
              key={i}
              type="button"
              disabled={isAiTyping}
              onClick={() => handleSuggestedClick(resp)}
              className="text-left text-xs bg-white hover:bg-blush-50/70 border border-corporate-200/80 hover:border-blush-300 text-corporate-700 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shadow-2xs font-medium disabled:opacity-50"
            >
              {resp.slice(0, 48)}...
            </button>
          ))}
        </div>

        {/* Sticky Input Bar at Bottom */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-corporate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMicActive(!isMicActive)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isMicActive
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'text-corporate-500 hover:text-corporate-700 border-corporate-200'
            }`}
            title="Toggle voice dictation"
          >
            {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAiTyping}
            placeholder={
              isAiTyping
                ? 'Please wait for AI HR to finish typing...'
                : 'Type your architectural rationale or click a suggested answer above...'
            }
            className="flex-1 h-11 rounded-xl border border-corporate-200 bg-white px-3.5 text-xs sm:text-sm text-corporate-900 placeholder:text-corporate-400 focus:outline-none focus:border-blush-400 focus:ring-2 focus:ring-blush-100 disabled:opacity-50"
          />

          <Button
            type="submit"
            disabled={!inputMessage.trim() || isAiTyping}
            size="md"
            className="shrink-0 gap-1.5 text-xs font-semibold shadow-blush"
          >
            <span className="hidden sm:inline">Send Response</span>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

