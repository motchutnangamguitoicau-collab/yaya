import React, { useState } from 'react';
import { RiskRecord, RiskLevel, EntityType } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Eye,
  X,
  Share2,
  CheckCircle2,
  Building,
  Phone,
  CreditCard,
  AtSign,
  Briefcase
} from 'lucide-react';

interface RiskResultCardProps {
  record: RiskRecord | null;
  searchedQuery: string;
  onOpenReportModalWithData?: (identifier: string) => void;
}

export const RiskResultCard: React.FC<RiskResultCardProps> = ({
  record,
  searchedQuery,
  onOpenReportModalWithData
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<{ url: string; caption: string; type: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `[StudentShield Job Alert] Recruitment Check for: "${searchedQuery}" - Status: ${
        record?.riskLevel === 'red'
          ? '🔴 JOB SCAM ALERT / PREVIOUSLY REPORTED'
          : record?.riskLevel === 'yellow'
          ? '🟡 REQUIRES VERIFICATION / SUSPICIOUS'
          : record?.riskLevel === 'green'
          ? '🟢 ACCREDITED EMPLOYER'
          : 'NO RECORD ON FILE (EXERCISE CAUTION)'
      }`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntityIcon = (type?: EntityType) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'bank_account':
        return <CreditCard className="h-4 w-4" />;
      case 'company':
        return <Building className="h-4 w-4" />;
      case 'telegram_zalo':
        return <AtSign className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  // If query had no results in the database
  if (!record) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-sky-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-emerald-50 text-emerald-700 border border-emerald-200">
              <HelpCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Lookup Result</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-amber-600 font-semibold">No Prior Scam Complaints on File</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5 break-all">
                "{searchedQuery}"
              </h3>
            </div>
          </div>

          {onOpenReportModalWithData && (
            <button
              onClick={() => onOpenReportModalWithData(searchedQuery)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>Report this Recruiter / Offer</span>
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            The <strong>StudentShield</strong> recruitment registry has not logged any confirmed complaints for this entry yet. Because scammers frequently cycle through fresh Telegram accounts, SIM cards, and mule bank accounts, please verify thoroughly.
          </p>

          <div className="rounded-xl bg-gradient-to-br from-sky-50/60 to-emerald-50/60 border border-emerald-200/70 p-4">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
              Essential 3-Step Job Verification Checklist:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">1.</span>
                <span><strong>The Zero-Upfront-Fee Rule:</strong> Under Vietnamese labor laws, legitimate employers never charge job applicants for uniforms, ID cards, software, or training fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold">2.</span>
                <span><strong>Reject Prepaid Task Deposits:</strong> Any "job" requiring you to transfer money to buy e-commerce products, rate apps, or fund order tiers is an absolute scam.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">3.</span>
                <span><strong>Verify Official Company Credentials:</strong> Look up the enterprise Tax Code (MST) on the National Business Portal (dangkykinhdoanh.gov.vn) and ensure communication comes from corporate domain emails.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Record exists - Render based on risk level in Pastel Blue & Green Harmony
  const isRed = record.riskLevel === 'red';
  const isYellow = record.riskLevel === 'yellow';
  const isGreen = record.riskLevel === 'green';

  const themeConfig = {
    red: {
      cardBg: 'bg-white',
      bannerBg: 'bg-rose-100/80 border-b border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      statusText: 'JOB SCAM ALERT / PREVIOUSLY REPORTED',
      icon: <ShieldAlert className="h-6 w-6 text-rose-600" />,
      iconBox: 'bg-rose-50 border-rose-200 text-rose-600',
      actionAlert: 'Critical Alert: Confirmed recruitment fraud! Do NOT transfer any deposit or complete prepaid task orders.',
      borderColor: 'border-rose-200',
      accentBg: 'bg-rose-50/70'
    },
    yellow: {
      cardBg: 'bg-white',
      bannerBg: 'bg-amber-100/80 border-b border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      statusText: 'REQUIRES VERIFICATION / SUSPICIOUS OFFER',
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      iconBox: 'bg-amber-50 border-amber-200 text-amber-600',
      actionAlert: 'Caution: Prior student complaints reported regarding withheld pay, undisclosed touring fees, or unverified recruiter credentials.',
      borderColor: 'border-amber-200',
      accentBg: 'bg-amber-50/70'
    },
    green: {
      cardBg: 'bg-white',
      bannerBg: 'bg-emerald-100/90 border-b border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      statusText: 'VERIFIED LEGITIMATE EMPLOYER',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      iconBox: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      actionAlert: 'Accredited Employer: Verified corporate tax registration and transparent recruitment process.',
      borderColor: 'border-emerald-200',
      accentBg: 'bg-emerald-50/70'
    },
    unknown: {
      cardBg: 'bg-white',
      bannerBg: 'bg-sky-100/80 border-b border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      statusText: 'UNDER REVIEW',
      icon: <HelpCircle className="h-6 w-6 text-sky-600" />,
      iconBox: 'bg-sky-50 border-sky-200 text-sky-600',
      actionAlert: 'Recruiter documentation is currently under community review.',
      borderColor: 'border-sky-200',
      accentBg: 'bg-sky-50/70'
    }
  }[record.riskLevel];

  return (
    <div className={`rounded-2xl border ${themeConfig.borderColor} ${themeConfig.cardBg} shadow-xs overflow-hidden transition-all`}>
      {/* Top Banner */}
      <div className={`px-6 py-2.5 flex items-center justify-between text-xs font-semibold ${themeConfig.bannerBg}`}>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-current" />
          <span>{themeConfig.statusText}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <span>Updated: <span className="font-mono tabular-nums text-slate-800">{record.updatedAt}</span></span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            title="Copy alert link"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border ${themeConfig.iconBox}`}>
              {themeConfig.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  {getEntityIcon(record.type)}
                  <span>
                    {record.type === 'phone' && 'Recruiter Phone Number'}
                    {record.type === 'bank_account' && `Task Deposit Bank Account (${record.bankName || 'Financial Institution'})`}
                    {record.type === 'company' && 'Company / Employer Name'}
                    {record.type === 'telegram_zalo' && 'Telegram / Zalo Recruiter Handle'}
                    {record.type === 'other' && 'Other Indicator'}
                  </span>
                </span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">{record.category}</span>
                {record.location && (
                  <>
                    <span>·</span>
                    <span>{record.location}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {record.name}
              </h2>
              <div className="mt-1 flex items-center gap-2 font-mono text-sm text-sky-700 font-semibold">
                <span>{record.identifier}</span>
                {record.bankName && (
                  <span className="text-xs text-slate-500 font-sans font-normal">
                    · Bank: {record.bankName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Qualitative Status Badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-sky-50/70 to-emerald-50/70 border border-emerald-100 px-4 py-2.5 rounded-xl text-xs">
            <div>
              <div className="text-slate-500 font-medium">Audit Status</div>
              <div className="font-semibold text-slate-800">
                {record.status === 'alert' ? 'Active Warning' : record.status === 'caution' ? 'Under Review' : 'Verified Legit'}
              </div>
            </div>
            <div className="h-7 w-px bg-emerald-200" />
            <div>
              <div className="text-slate-500 font-medium">Threat Level</div>
              <div className={`font-bold uppercase ${
                isRed ? 'text-rose-600' : isYellow ? 'text-amber-600' : 'text-emerald-700'
              }`}>
                {isRed ? 'High Risk' : isYellow ? 'Moderate' : 'Safe'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Advice Box */}
        <div className={`p-4 rounded-xl border ${themeConfig.borderColor} ${themeConfig.accentBg}`}>
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {isRed && <ShieldAlert className="h-5 w-5 text-rose-600" />}
              {isYellow && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {isGreen && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-800">
                StudentShield Safety Directive:
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {themeConfig.actionAlert}
              </p>
              {record.verifiedBy && (
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>
                    Verified by: <span className="text-slate-800 font-semibold">{record.verifiedBy}</span>
                  </p>
                  {record.accuracyConfidence && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100/70 border border-emerald-200 text-[10px] font-semibold text-emerald-900">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{record.accuracyConfidence}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-700">
            Reported Modus Operandi & Scam Details:
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-gradient-to-br from-sky-50/30 to-emerald-50/30 p-4 rounded-xl border border-emerald-100 whitespace-pre-wrap">
            {record.details || record.summary}
          </p>
        </div>

        {/* Red Flags Observed */}
        {record.reportedRedFlags && record.reportedRedFlags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              Observed Recruitment Red Flags:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {record.reportedRedFlags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs text-slate-700">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">⚠️</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Photos */}
        {record.evidence && record.evidence.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-700">
              Attached Evidence ({record.evidence.length}):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {record.evidence.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className="group relative rounded-xl border border-emerald-200 overflow-hidden bg-white cursor-pointer hover:border-emerald-400 transition-colors shadow-2xs"
                >
                  <img
                    src={ev.url}
                    alt={ev.caption}
                    referrerPolicy="no-referrer"
                    className="h-24 w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-1.5 text-[10px] text-slate-600 truncate bg-white">
                    {ev.caption}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-3 p-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-semibold text-slate-800 truncate">{selectedEvidence.caption}</span>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <img
              src={selectedEvidence.url}
              alt={selectedEvidence.caption}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] w-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
