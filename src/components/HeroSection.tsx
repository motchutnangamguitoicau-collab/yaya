import React from 'react';
import { Search, PlusCircle, Bot, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react';

interface HeroSectionProps {
  onStartSearch: () => void;
  onOpenBot: () => void;
  onOpenReport: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartSearch,
  onOpenBot,
  onOpenReport
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-sky-100/70 via-white to-emerald-100/60 p-6 sm:p-10 lg:p-12 mb-10 shadow-xs">
      {/* Background illustration banner with subtle opacity */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/studentshield_hero_banner_1791026508213.jpg"
          alt="University students collaborating safely"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-10 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-emerald-50/80" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Verification Pill Indicator in Pastel Green + Sky */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-100 to-emerald-100 text-emerald-900 border border-emerald-200/90 backdrop-blur-sm shadow-2xs">
          <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
          <span>Student Anti-Recruitment Scam Console · Pilot Registry</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
          Verify Job Offers & Detect Recruitment Scams —{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
            StudentShield
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl text-balance">
          Protecting students from fake e-commerce order tasks, upfront uniform/training fee traps, and anonymous Telegram recruiters. Cross-reference suspect phone numbers, task accounts, and company names against our verified registry.
        </p>

        {/* 3 Core Trust Badges with Pastel Blue & Pastel Green Harmony */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-700 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>3-Tier Severity: Green · Yellow · Red</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-sky-600" />
            <span>Prepaid Task & Order Scam Detection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Zalo OA & Telegram Automated Bot Sync</span>
          </div>
        </div>

        {/* Primary Action Row with Pastel Blue & Pastel Green */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onStartSearch}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 rounded-xl transition-colors shadow-sm"
          >
            <Search className="h-4 w-4" />
            <span>Check Recruiter / Job Risk</span>
          </button>

          <button
            onClick={onOpenBot}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 rounded-xl transition-colors shadow-2xs"
          >
            <Bot className="h-4 w-4 text-emerald-700" />
            <span>Try Bot Simulator</span>
          </button>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4 text-rose-500" />
            <span>Report a Job Scam</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
