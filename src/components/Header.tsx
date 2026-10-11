import React from 'react';
import { Briefcase, PlusCircle, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'database' | 'bot' | 'handbook';
  onSelectTab: (tab: 'search' | 'database' | 'bot' | 'handbook') => void;
  onOpenReportModal: () => void;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenReportModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark with Pastel Blue + Pastel Green Badge */}
        <button
          onClick={() => onSelectTab('search')}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 text-emerald-700 border border-emerald-200/80 group-hover:from-sky-200 group-hover:to-emerald-200 transition-colors shadow-2xs">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors block leading-tight">
              StudentShield
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase block">
              Recruitment Scam Defense
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links in Pastel Harmony */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('search')}
            className={`transition-colors hover:text-emerald-600 py-1 ${
              activeTab === 'search' ? 'text-emerald-700 font-bold border-b-2 border-emerald-500' : ''
            }`}
          >
            Recruiter Lookup
          </button>
          <button
            onClick={() => onSelectTab('database')}
            className={`transition-colors hover:text-emerald-600 flex items-center gap-1.5 py-1 ${
              activeTab === 'database' ? 'text-emerald-700 font-bold border-b-2 border-emerald-500' : ''
            }`}
          >
            <span>Scam Database</span>
          </button>
          <button
            onClick={() => onSelectTab('bot')}
            className={`transition-colors hover:text-sky-600 flex items-center gap-1.5 py-1 ${
              activeTab === 'bot' ? 'text-sky-700 font-bold border-b-2 border-sky-500' : ''
            }`}
          >
            <span>Bot Simulator</span>
          </button>
          <button
            onClick={() => onSelectTab('handbook')}
            className={`transition-colors hover:text-emerald-600 py-1 ${
              activeTab === 'handbook' ? 'text-emerald-700 font-bold border-b-2 border-emerald-500' : ''
            }`}
          >
            Safety Handbook
          </button>
        </nav>

        {/* Zone 3: Actions in Pastel Blue & Pastel Green */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('bot')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-sky-600" />
            <span>Launch Bot</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-lg transition-all shadow-xs whitespace-nowrap"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Report Job Scam</span>
          </button>
        </div>
      </div>
    </header>
  );
};
