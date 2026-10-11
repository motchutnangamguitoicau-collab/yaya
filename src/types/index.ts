export type RiskLevel = 'green' | 'yellow' | 'red' | 'unknown';

export type EntityType = 'phone' | 'bank_account' | 'company' | 'telegram_zalo' | 'other';

export type JobScamCategory =
  | 'Task & Order Completion Scam'
  | 'Fake Online Typing / Data Entry'
  | 'Upfront Uniform & Training Deposit'
  | 'Fake Brand Ambassador / Model'
  | 'Corporate Impersonation'
  | 'Verified Legitimate Employer';

export interface EvidenceItem {
  id: string;
  type: 'screenshot' | 'receipt' | 'contract' | 'chat_log';
  url: string;
  caption: string;
  timestamp: string;
}

export interface RiskRecord {
  id: string;
  name: string; // Company name or recruiter alias
  identifier: string; // Recruiter phone, task bank account, company name, or telegram handle
  type: EntityType;
  bankName?: string;
  riskLevel: RiskLevel;
  status: 'verified' | 'caution' | 'alert' | 'pending_review';
  category: JobScamCategory;
  incidentCount: number;
  reportCount: number;
  verifiedBy?: string;
  legalRefNumber?: string;
  accuracyConfidence?: string;
  summary: string;
  details: string;
  reportedRedFlags: string[];
  evidence: EvidenceItem[];
  location?: string;
  updatedAt: string;
  createdAt: string;
  reporterAffiliation?: string;
}

export interface NewReportSubmission {
  name?: string;
  targetName: string;
  identifier: string;
  type: EntityType;
  bankName?: string;
  category: JobScamCategory;
  description: string;
  lossAmount?: string;
  redFlags: string[];
  evidenceFiles: { name: string; url: string; caption: string }[];
  location?: string;
  reporterName?: string;
  reporterAffiliation?: string;
  contactEmailOrPhone?: string;
}

export interface BotChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  riskAlert?: RiskRecord;
  attachment?: {
    type: 'card' | 'image' | 'action_buttons';
    data?: any;
  };
  actionButtons?: { label: string; action: string; payload?: string }[];
}
