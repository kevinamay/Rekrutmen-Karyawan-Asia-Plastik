// In-memory active interview session state for local engine
declare global {
  var __ASIA_INTERVIEW_SESSION__: any;
}

export function getActiveSession() {
  if (!global.__ASIA_INTERVIEW_SESSION__) {
    global.__ASIA_INTERVIEW_SESSION__ = {
      phase: 'idle',
      application_id: null,
      job_id: null,
      conversation_id: null,
      candidate_name: 'Pelamar',
      job_role: 'Supervisor Quality Control (QC)',
      mic: 'default_mic',
      speaker: 'default_speaker',
      muted: false,
      transcript: [],
      scorecard: null,
      started_at: null,
      error: null,
    };
  }
  return global.__ASIA_INTERVIEW_SESSION__;
}
