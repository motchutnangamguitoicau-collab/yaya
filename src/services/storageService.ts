import { RiskRecord, NewReportSubmission, EntityType, RiskLevel, EvidenceItem } from '../types';

// Storage key for student recruitment scam registry pilot
const STORAGE_KEY = 'studentshield_recruitment_scams_v1';
const LISTENERS: Array<() => void> = [];

export const getStoredRecords = (): RiskRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading records from localStorage', err);
    return [];
  }
};

export const saveRecords = (records: RiskRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    LISTENERS.forEach(cb => cb());
  } catch (err) {
    console.error('Error saving records to localStorage', err);
  }
};

export const subscribeToRecords = (callback: () => void): (() => void) => {
  LISTENERS.push(callback);
  return () => {
    const idx = LISTENERS.indexOf(callback);
    if (idx !== -1) LISTENERS.splice(idx, 1);
  };
};

export const normalizeQuery = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[+.\-\s()@]/g, '');
};

export const searchRecords = (
  query: string,
  typeFilter?: EntityType
): { record: RiskRecord | null; matches: RiskRecord[] } => {
  if (!query || !query.trim()) return { record: null, matches: [] };
  const records = getStoredRecords();
  const rawQ = query.trim().toLowerCase();
  const normalizedQ = normalizeQuery(query);

  let pool = records;
  if (typeFilter && typeFilter !== 'other') {
    pool = pool.filter(r => r.type === typeFilter);
  }

  // Exact match
  const exact = pool.find(r => {
    const normId = normalizeQuery(r.identifier);
    return normId === normalizedQ || r.identifier.toLowerCase() === rawQ;
  });

  if (exact) {
    return { record: exact, matches: [exact] };
  }

  // Partial matches
  const matches = pool.filter(r => {
    const normId = normalizeQuery(r.identifier);
    const idLower = r.identifier.toLowerCase();
    const nameLower = r.name.toLowerCase();
    const sumLower = r.summary.toLowerCase();

    return (
      (normalizedQ.length >= 3 && normId.includes(normalizedQ)) ||
      idLower.includes(rawQ) ||
      nameLower.includes(rawQ) ||
      sumLower.includes(rawQ)
    );
  });

  return {
    record: matches.length > 0 ? matches[0] : null,
    matches
  };
};

export const submitNewReport = (submission: NewReportSubmission): RiskRecord => {
  const records = getStoredRecords();
  const now = new Date().toISOString().split('T')[0];
  const normalizedNew = normalizeQuery(submission.identifier);

  const mappedEvidence: EvidenceItem[] = (submission.evidenceFiles || []).map((file, idx) => ({
    id: `ev_${Date.now()}_${idx}`,
    type: 'screenshot',
    url: file.url,
    caption: file.caption || file.name,
    timestamp: now
  }));

  // Check if identifier already exists in DB
  const existingIdx = records.findIndex(r => normalizeQuery(r.identifier) === normalizedNew);

  if (existingIdx !== -1) {
    const existing = records[existingIdx];
    const updated: RiskRecord = {
      ...existing,
      riskLevel: 'red',
      status: 'alert',
      reportCount: (existing.reportCount || 1) + 1,
      updatedAt: now,
      summary: `${existing.summary} | New Student Report: ${submission.description.slice(0, 120)}...`,
      reportedRedFlags: Array.from(new Set([...existing.reportedRedFlags, ...submission.redFlags])),
      evidence: [...existing.evidence, ...mappedEvidence],
      accuracyConfidence: 'Verified by Student Tester'
    };
    records[existingIdx] = updated;
    saveRecords(records);
    return updated;
  }

  const newRecord: RiskRecord = {
    id: `rec_job_${Date.now()}`,
    name: submission.targetName || submission.name || `Suspect Recruiter (${submission.identifier})`,
    identifier: submission.identifier,
    bankName: submission.bankName,
    type: submission.type,
    riskLevel: 'red',
    status: 'alert',
    category: submission.category,
    incidentCount: 1,
    reportCount: 1,
    verifiedBy: 'Student Community Pilot Submission',
    summary: submission.description,
    details: submission.description,
    reportedRedFlags: submission.redFlags,
    evidence: mappedEvidence,
    location: submission.location,
    updatedAt: now,
    createdAt: now,
    reporterAffiliation: submission.reporterAffiliation || 'Student Job Applicant',
    accuracyConfidence: mappedEvidence.length > 0 ? 'Documented with Task Evidence' : 'Reported by Student Tester'
  };

  const updatedRecords = [newRecord, ...records];
  saveRecords(updatedRecords);
  return newRecord;
};

export const updateRecordStatus = (
  id: string,
  newRiskLevel: RiskLevel,
  note?: string
): RiskRecord | null => {
  const records = getStoredRecords();
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return null;

  const current = records[idx];
  const now = new Date().toISOString().split('T')[0];

  const updated: RiskRecord = {
    ...current,
    riskLevel: newRiskLevel,
    status: newRiskLevel === 'red' ? 'alert' : newRiskLevel === 'yellow' ? 'caution' : 'verified',
    updatedAt: now,
    verifiedBy: note ? `Audited: ${note}` : current.verifiedBy,
    accuracyConfidence: 'Verified by Audit Review'
  };

  records[idx] = updated;
  saveRecords(records);
  return updated;
};

export const clearAllData = (): void => {
  saveRecords([]);
};

export const resetToInitialData = (): void => {
  saveRecords([]);
};
