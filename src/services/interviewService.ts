/**
 * Client Service for CV. Asia Plastik AI Voice Interview
 * Matches https://github.com/kevinamay/ai-interview-backendAsia & frontend
 */

export interface TranscriptTurn {
  speaker: 'agent' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewScorecard {
  candidate_name: string;
  job_role: string;
  conversation_id?: string;
  evaluated_at: string;
  evaluator_source: string;
  cv_alignment_score: number;
  explanation_clarity_score: number;
  technical_depth_score: number;
  problem_solving_score: number;
  overall_score: number;
  verdict: string;
  cv_based_summary: string;
  explanation_clarity_assessment: string;
  technical_and_reasoning_notes: string;
  strengths: string[];
  gaps_and_red_flags: string[];
  evidence_quotes: string[];
  recommended_followups: string[];
}

export interface AudioDevice {
  id: string;
  name: string;
}

export interface InterviewDevicesResponse {
  mics: AudioDevice[];
  speakers: AudioDevice[];
  active_mic?: string;
  active_speaker?: string;
}

export interface HealthCheckResponse {
  status: string;
  rust_backend_connected: boolean;
  mode: 'rust_axum_engine' | 'nextjs_integrated_engine';
  rust_backend_url?: string;
}

export class InterviewService {
  private static baseUrl = '';
  private static wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8787/api/interview/ws';

  static async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    return {
      status: 'ok',
      rust_backend_connected: false,
      mode: 'nextjs_integrated_engine',
    };
  }

  static async getDevices(): Promise<InterviewDevicesResponse> {
    try {
      const res = await fetch('/api/devices');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Fallback devices notice:', e);
    }
    return {
      mics: [{ id: 'default_mic', name: 'Microphone Standar Sistem' }],
      speakers: [{ id: 'default_speaker', name: 'Speakers Standar Sistem' }],
    };
  }

  static async startInterview(params: {
    candidate_name: string;
    candidate_email?: string;
    job_role: string;
    cv_content?: string;
    mic?: string;
    speaker?: string;
    language?: string;
  }) {
    const res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal memulai sesi wawancara');
    }
    return await res.json();
  }

  static async sendAnswer(userText: string, currentQuestionIndex: number) {
    const res = await fetch('/api/interview/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText, currentQuestionIndex }),
    });
    if (!res.ok) {
      throw new Error('Gagal mengirim jawaban wawancara');
    }
    return await res.json();
  }

  static async stopInterview(): Promise<{ scorecard: InterviewScorecard }> {
    const res = await fetch('/api/interview/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error('Gagal mengakhiri wawancara dan mengevaluasi hasil');
    }
    return await res.json();
  }

  static async setMute(muted: boolean) {
    try {
      await fetch('/api/interview/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muted }),
      });
    } catch (e) {
      console.warn('Set mute notice:', e);
    }
  }

  /**
   * Connect WebSocket if external Rust engine is available
   */
  static connectWebSocket(onMessage: (event: any) => void): () => void {
    let ws: WebSocket | null = null;
    let isClosed = false;

    try {
      ws = new WebSocket(this.wsUrl);
      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          onMessage(parsed);
        } catch (e) {
          // non json
        }
      };
      ws.onerror = (e) => {
        console.info('Rust WebSocket not reachable, using local integrated engine events.');
      };
    } catch (e) {
      // ignore
    }

    return () => {
      isClosed = true;
      if (ws) {
        ws.close();
      }
    };
  }
}
