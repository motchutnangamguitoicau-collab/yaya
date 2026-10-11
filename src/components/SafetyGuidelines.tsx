import React from 'react';
import { STUDENT_SAFETY_TIPS } from '../data/seedData';
import {
  PhoneCall,
  FileCheck,
  Briefcase,
  CreditCard,
  Building,
  Search
} from 'lucide-react';

interface SafetyGuidelinesProps {
  onStartSearch?: () => void;
}

export const SafetyGuidelines: React.FC<SafetyGuidelinesProps> = ({ onStartSearch }) => {
  return (
    <div className="space-y-10">
      {/* Header with Pastel Blue & Pastel Green */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Briefcase className="h-4 w-4" />
            <span>Student Anti-Recruitment Scam Handbook</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Collegiate Job & Recruitment Scam Defense Handbook
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Essential legal survival rules and verification checklists synthesized to protect students seeking part-time jobs, internships, or online work.
          </p>
        </div>

        {onStartSearch && (
          <button
            onClick={onStartSearch}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-xl transition-all shadow-xs shrink-0"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Verify a Recruiter Now</span>
          </button>
        )}
      </div>

      {/* 3 Core Rule Cards in Pastel Blue & Green Harmony */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STUDENT_SAFETY_TIPS.map((tip) => (
          <div
            key={tip.id}
            className="rounded-2xl border border-emerald-100 bg-white p-6 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors shadow-xs"
          >
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-700 flex items-center gap-1.5">
                {tip.category === 'Job Application Security' && <Briefcase className="h-3.5 w-3.5" />}
                {tip.category === 'E-Commerce & Online Tasks' && <CreditCard className="h-3.5 w-3.5" />}
                {tip.category === 'Company Credential Verification' && <Building className="h-3.5 w-3.5" />}
                <span>{tip.category}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {tip.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tip.content}
              </p>
            </div>

            <div className="pt-3 border-t border-sky-100 space-y-1.5">
              <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                Common Recruitment Red Flags:
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {tip.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold shrink-0">·</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Step by Step Job Offer Safety Checklist */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 space-y-6 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-600" />
            <span>5-Step Job Offer & Recruiter Audit Protocol</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Always verify these five checkpoints before accepting an offer, transferring funds, or submitting personal data:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '01',
              title: 'Check Enterprise Registration on National Business Portal',
              desc: 'Search the hiring company name and enterprise Tax Code (MST) on the official National Business Registration Portal (dangkykinhdoanh.gov.vn) to verify it is legally registered and active.'
            },
            {
              step: '02',
              title: 'Verify Official Corporate Email Domain',
              desc: 'Legitimate HR teams communicate using corporate domain email addresses (e.g. hr@company.com), never anonymous free webmail accounts like gmail.com or outlook.com.'
            },
            {
              step: '03',
              title: 'Refuse Any Upfront Payment Request Under Article 16',
              desc: 'Under Article 16 of the Labor Code, employers and recruiting agencies are prohibited from taking money or asset deposits from job applicants. Any uniform fee or training deposit is a red flag.'
            },
            {
              step: '04',
              title: 'Reject "Order Booking" & Task Commission Schemes',
              desc: 'Never transfer funds to personal bank accounts to "unlock task orders" or "advance VIP levels" for Shopee, Lazada, TikTok, or e-commerce reviews. This is a classic pyramid deposit trap.'
            },
            {
              step: '05',
              title: 'Demand a Transparent Written Labor Contract',
              desc: 'Review working hours, base wage, duties, and probation terms in writing. Never begin employment based on informal verbal promises on Telegram or social media chat groups.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-50/40 to-emerald-50/40 border border-emerald-100/80"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-emerald-800 font-mono font-bold text-sm border border-emerald-200">
                {item.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotlines in Pastel Blue + Green */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50/80 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-emerald-700 border border-emerald-200">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Official Student Support & Cybercrime Hotlines
            </h3>
            <p className="text-xs text-slate-600">
              If you have fallen victim to task order fraud, prepaid deposit extortion, or recruitment scams:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">Department of Cybersecurity & High-Tech Crime Prevention (A05)</div>
            <div className="text-lg font-bold font-mono text-emerald-700 tracking-wide">069.219.4053</div>
            <div className="text-[10px] text-slate-500">Official national cybercrime intake & digital recruitment fraud unit</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-emerald-200/80 space-y-1.5 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-medium">National Consumer Rights & Protection Helpline</div>
            <div className="text-lg font-bold font-mono text-sky-700 tracking-wide">1800.6838</div>
            <div className="text-[10px] text-slate-500">Toll-free national consumer assistance & dispute resolution guidance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
