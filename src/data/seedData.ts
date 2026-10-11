import { RiskRecord } from '../types';

/**
 * INITIAL_RECORDS is strictly empty.
 * Zero mock, virtual, or simulated data is pre-populated.
 * Records are populated exclusively when community testers submit verified recruitment scam reports or accredited employer data.
 */
export const INITIAL_RECORDS: RiskRecord[] = [];

export interface StudentSafetyTip {
  id: string;
  title: string;
  category: string;
  content: string;
  redFlags: string[];
}

export const STUDENT_SAFETY_TIPS: StudentSafetyTip[] = [
  {
    id: 'tip_upfront_fee',
    title: 'The "Zero Upfront Fee for Employment" Iron Law',
    category: 'Job Application Security',
    content: 'Under Article 16 of the Labor Code, employers and recruiting agencies are strictly prohibited from collecting any money, security deposits, or uniform/training fees from job applicants.',
    redFlags: [
      'Demands 200,000 – 500,000 VND for uniforms, employee badges, or application file processing',
      'Requires paying upfront for "mandatory onboarding training courses" or software setup',
      'Promises full reimbursement of fees with your first monthly paycheck'
    ]
  },
  {
    id: 'tip_task_scam',
    title: 'The "Prepaid Order & Task Commission" Scam Trap',
    category: 'E-Commerce & Online Tasks',
    content: 'Scammers advertise light online jobs like "typing text at home", "liking TikTok videos", or "booking e-commerce orders for Shopee/Tiki/Lazada". They initially pay small 20,000 – 50,000 VND bonuses to build trust, then demand deposits of millions of VND for "VIP orders" and block the victim.',
    redFlags: [
      'Requires transferring money to a personal bank account to "fund task inventory"',
      'Promised returns of 10% to 30% commission per completed task within minutes',
      'Withdrawals are frozen with excuses: "wrong transaction memo", "tax clearance fee required"'
    ]
  },
  {
    id: 'tip_impersonation',
    title: 'Verify Official Tax Code & Corporate Email Domain',
    category: 'Company Credential Verification',
    content: 'Authentic corporations and enterprise HR teams always use corporate domain emails (e.g. hr@unilever.com, careers@shopee.vn), conduct in-person or formal video interviews, and maintain searchable corporate registration on the National Business Portal (dangkykinhdoanh.gov.vn).',
    redFlags: [
      'Recruiter communicates solely via anonymous Telegram, WhatsApp, or disposable Zalo accounts',
      'Uses free Gmail/Outlook addresses with typos (e.g. shopee.recruitment.hr@gmail.com)',
      'Refuses to provide a physical office address, enterprise tax code, or employment contract'
    ]
  }
];
