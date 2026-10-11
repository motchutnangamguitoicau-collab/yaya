/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { QuickSearch } from './components/QuickSearch';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { BotSimulator } from './components/BotSimulator';
import { SafetyGuidelines } from './components/SafetyGuidelines';
import { ReportModal } from './components/ReportModal';
import { getStoredRecords, subscribeToRecords } from './services/storageService';
import { RiskRecord } from './types';
import {
  ShieldAlert,
  Bot,
  ChevronRight,
  PlusCircle,
  Briefcase
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'database' | 'bot' | 'handbook'>('search');
  const [records, setRecords] = useState<RiskRecord[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [prefillIdentifier, setPrefillIdentifier] = useState('');
  const [searchPrefill, setSearchPrefill] = useState('');

  useEffect(() => {
    // Load records
    setRecords(getStoredRecords());

    // Subscribe to live updates
    const unsubscribe = subscribeToRecords(() => {
      setRecords(getStoredRecords());
    });

    return () => unsubscribe();
  }, []);

  const handleOpenReportWithData = (identifier: string) => {
    setPrefillIdentifier(identifier);
    setIsReportModalOpen(true);
  };

  const handleSearchPrefill = (query: string) => {
    setSearchPrefill(query);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const redAlerts = records.filter(r => r.riskLevel === 'red');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#F4FAF8] to-[#EDFDF5] text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Universal Header in Pastel Blue & Pastel Green */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => handleOpenReportWithData('')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Render Tab Contents */}
        {activeTab === 'search' && (
          <div className="space-y-10">
            {/* Hero Section */}
            <HeroSection
              onStartSearch={() => {
                const el = document.getElementById('search-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenBot={() => setActiveTab('bot')}
              onOpenReport={() => handleOpenReportWithData('')}
            />

            {/* Quick Search Tool */}
            <div id="search-anchor">
              <QuickSearch
                onOpenReportModalWithData={handleOpenReportWithData}
                prefillQuery={searchPrefill}
              />
            </div>

            {/* Scam Alert Feed: Strictly based on real tester submissions */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Verified High-Priority Recruitment Scam Registry
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('database')}
                  className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span>Explore central database</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {redAlerts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Awaiting Pilot Test Data — Zero Mock Records
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                        To maintain rigorous data accuracy, StudentShield never inserts fake or virtual data. As soon as students or testers report suspect recruiters, task order accounts, or fake job links with evidence, they will be cataloged here in real-time.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenReportWithData('')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Report a Job Scam</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {redAlerts.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSearchPrefill(item.identifier)}
                      className="group rounded-2xl border border-rose-100 bg-white p-5 hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span>{item.category}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                          {item.updatedAt}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-xs font-mono text-sky-700 font-semibold truncate">
                          {item.identifier}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-700 font-semibold font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          ✓ {item.accuracyConfidence || 'Documented by Student'}
                        </span>
                        <span className="text-emerald-700 font-semibold group-hover:underline flex items-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Banners: Bot in Pastel Blue & Handbook in Pastel Green */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div
                onClick={() => setActiveTab('bot')}
                className="p-6 rounded-3xl border border-sky-200/80 bg-white hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Zalo Official Account & Telegram Bot</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    Automated Job Verification Without App Installs
                  </h4>
                  <p className="text-xs text-slate-500">
                    Send a suspect recruiter phone number or task account via chat to receive instant risk ratings.
                  </p>
                </div>
                <div className="h-9 w-9 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0 ml-4">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab('handbook')}
                className="p-6 rounded-3xl border border-emerald-200/80 bg-white hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Collegiate Anti-Job Scam Handbook</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    5-Step Job Offer & Recruiter Audit Protocol
                  </h4>
                  <p className="text-xs text-slate-500">
                    Essential labor laws and red flags synthesized to protect students from prepaid tasks and fake typing jobs.
                  </p>
                </div>
                <div className="h-9 w-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0 ml-4">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <DatabaseExplorer
            records={records}
            onOpenReportModal={() => handleOpenReportWithData('')}
            onOpenBot={() => setActiveTab('bot')}
          />
        )}

        {activeTab === 'bot' && (
          <BotSimulator
            onOpenReportModalWithData={handleOpenReportWithData}
          />
        )}

        {activeTab === 'handbook' && (
          <SafetyGuidelines
            onStartSearch={() => {
              setActiveTab('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        prefillIdentifier={prefillIdentifier}
        onReportSubmitted={() => {
          setRecords(getStoredRecords());
        }}
      />

      {/* Pastel Blue & Green Harmonized Footer */}
      <footer className="mt-16 border-t border-emerald-100 bg-white/70 backdrop-blur-xs py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-sky-100 to-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
              💼
            </div>
            <span className="font-bold text-slate-800">StudentShield Platform</span>
            <span>·</span>
            <span>Real-Time Recruitment Scam Verification & Student Job Defense</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <span>Cybercrime Support (A05): <strong className="text-emerald-700 font-mono">069.219.4053</strong></span>
            <span>Consumer Protection: <strong className="text-sky-700 font-mono">1800.6838</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
