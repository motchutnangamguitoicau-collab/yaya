import React, { useState, useEffect } from 'react';
import { EntityType, RiskRecord } from '../types';
import { searchRecords } from '../services/storageService';
import { RiskResultCard } from './RiskResultCard';
import {
  Search,
  X,
  Phone,
  CreditCard,
  Building,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  AtSign,
  Briefcase
} from 'lucide-react';

interface QuickSearchProps {
  onOpenReportModalWithData: (identifier: string) => void;
  prefillQuery?: string;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
  onOpenReportModalWithData,
  prefillQuery = ''
}) => {
  const [query, setQuery] = useState(prefillQuery);
  const [selectedType, setSelectedType] = useState<EntityType | 'all'>('all');
  const [searchResult, setSearchResult] = useState<{ record: RiskRecord | null; matches: RiskRecord[] } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (prefillQuery) {
      setQuery(prefillQuery);
      executeSearch(prefillQuery, selectedType === 'all' ? undefined : selectedType);
    }
  }, [prefillQuery]);

  const executeSearch = (targetQuery: string, type?: EntityType) => {
    const trimmed = targetQuery.trim();
    if (!trimmed) {
      setSearchResult(null);
      setHasSearched(false);
      return;
    }
    const res = searchRecords(trimmed, type);
    setSearchResult(res);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, selectedType === 'all' ? undefined : selectedType);
  };

  const handleTypeSelect = (type: EntityType | 'all') => {
    setSelectedType(type);
    if (query.trim()) {
      executeSearch(query, type === 'all' ? undefined : type);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResult(null);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Console Container with Pastel Blue & Pastel Green Harmony */}
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 md:p-8 shadow-xs relative overflow-hidden">
        {/* Dual pastel glows: Pastel Blue (top-right) + Pastel Green (bottom-left) */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              <Briefcase className="h-4 w-4" />
              <span>Job Scam & Recruiter Risk Verification Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              Check Recruiter Phone, Task Account, Company or Telegram Handle
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Verify hiring managers, task deposit accounts, employer business names, or Telegram/Zalo recruitment handles against authentic student scam reports. Zero mock data — test directly with live inquiries.
            </p>
          </div>

          {/* Real-time Category Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-sky-100 pb-3">
            {[
              { id: 'all', label: 'All Indicators', icon: Search },
              { id: 'phone', label: 'Recruiter Phone', icon: Phone },
              { id: 'bank_account', label: 'Task Deposit Account', icon: CreditCard },
              { id: 'company', label: 'Company / Employer', icon: Building },
              { id: 'telegram_zalo', label: 'Telegram / Zalo Handle', icon: AtSign }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTypeSelect(tab.id as EntityType | 'all')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-100 to-emerald-100 text-slate-900 font-semibold border border-emerald-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-700" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Form with Pastel Blue & Green Accents */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-slate-400">
                <Search className="h-5 w-5 text-emerald-600" />
              </div>

              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={
                  selectedType === 'phone'
                    ? 'Enter recruiter phone number (e.g. 0901234567)...'
                    : selectedType === 'bank_account'
                    ? 'Enter beneficiary bank account for task transfer...'
                    : selectedType === 'company'
                    ? 'Enter company, agency, or brand name...'
                    : selectedType === 'telegram_zalo'
                    ? 'Enter Telegram username, group link, or Zalo ID...'
                    : 'Enter recruiter phone, task bank account, company name, or Telegram handle...'
                }
                className="w-full pl-12 pr-28 py-3.5 bg-sky-50/30 text-slate-900 placeholder:text-slate-400 text-sm md:text-base rounded-xl border border-sky-200 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-emerald-200/50 transition-all font-mono"
              />

              <div className="absolute right-2.5 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    title="Clear"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 active:from-sky-700 active:to-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1"
                >
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quality Assurance Note in Pastel Blue & Green */}
          <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-gradient-to-r from-sky-50/80 to-emerald-50/80 border border-emerald-200/80 rounded-xl p-3">
            <Info className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero Mock Data:</strong> This registry is dedicated solely to student job scams (e-commerce task traps, upfront uniform fees, fake data typing). No virtual records are pre-populated.
            </span>
          </div>

          {/* 3-Tier Recruitment Threat Levels in Pastel Tones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-start gap-2.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900">🟢 Green: Accredited Employer</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Verified enterprise tax code, official corporate recruitment channel.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-start gap-2.5 shadow-2xs">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">🟡 Yellow: Suspicious Offer</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Unverified broker, ambiguous contract terms, or commission dispute.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs flex items-start gap-2.5 shadow-2xs">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-900">🔴 Red: Job Scam Alert</span>
                <p className="text-slate-600 text-[11px] mt-0.5">Prepaid task fraud, uniform/deposit extortion, or corporate impersonation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Result Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Verification Result for "{query}"</span>
            </h3>
            {searchResult?.matches && searchResult.matches.length > 1 && (
              <span className="text-xs text-slate-500 font-mono">
                {searchResult.matches.length} matches found
              </span>
            )}
          </div>

          {searchResult && searchResult.record ? (
            <div className="space-y-4">
              <RiskResultCard
                record={searchResult.record}
                searchedQuery={query}
                onOpenReportModalWithData={onOpenReportModalWithData}
              />

              {searchResult.matches.length > 1 && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Additional Related Records ({searchResult.matches.length - 1}):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResult.matches.slice(1).map(match => (
                      <div
                        key={match.id}
                        onClick={() => setSearchResult({ record: match, matches: searchResult.matches })}
                        className="p-4 rounded-xl border border-sky-100 bg-white hover:border-emerald-300 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold uppercase ${
                            match.riskLevel === 'red' ? 'text-rose-600' : match.riskLevel === 'yellow' ? 'text-amber-600' : 'text-emerald-700'
                          }`}>
                            {match.riskLevel === 'red' ? '🔴 Scam Alert' : match.riskLevel === 'yellow' ? '🟡 Suspicious' : '🟢 Verified Employer'}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">{match.updatedAt}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{match.name}</h5>
                        <p className="text-xs text-sky-700 font-mono truncate">{match.identifier}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{match.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <RiskResultCard
              record={null}
              searchedQuery={query}
              onOpenReportModalWithData={onOpenReportModalWithData}
            />
          )}
        </div>
      )}
    </div>
  );
};
