import React, { useState } from 'react';
import { RiskRecord, RiskLevel, EntityType } from '../types';
import { updateRecordStatus, clearAllData } from '../services/storageService';
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  Building,
  Phone,
  CreditCard,
  AtSign,
  X,
  CheckCircle2,
  PlusCircle,
  Bot,
  Briefcase
} from 'lucide-react';

interface DatabaseExplorerProps {
  records: RiskRecord[];
  onOpenReportModal: () => void;
  onOpenBot?: () => void;
  onSelectRecordForInspection?: (record: RiskRecord) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  records,
  onOpenReportModal,
  onOpenBot
}) => {
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all');
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [inspectRecord, setInspectRecord] = useState<RiskRecord | null>(null);
  const [moderatorNote, setModeratorNote] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter records
  const filtered = records.filter(item => {
    if (filterRisk !== 'all' && item.riskLevel !== filterRisk) return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.identifier.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.bankName && item.bankName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleUpdateStatus = (newLevel: RiskLevel) => {
    if (!inspectRecord) return;
    const updated = updateRecordStatus(inspectRecord.id, newLevel, moderatorNote);
    if (updated) {
      setInspectRecord(updated);
      setModeratorNote('');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Recruiter / Entity Name', 'Identifier (Phone/Account/Telegram)', 'Type', 'Threat Level', 'Scam Category', 'Verification', 'Updated At', 'Summary'];
    const rows = filtered.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.identifier.replace(/"/g, '""')}"`,
      r.type,
      r.riskLevel,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${(r.legalRefNumber || r.verifiedBy || '').replace(/"/g, '""')}"`,
      r.updatedAt,
      `"${r.summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentShield_RecruitmentScams_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-3.5 w-3.5" />;
      case 'bank_account':
        return <CreditCard className="h-3.5 w-3.5" />;
      case 'company':
        return <Building className="h-3.5 w-3.5" />;
      case 'telegram_zalo':
        return <AtSign className="h-3.5 w-3.5" />;
      default:
        return <Briefcase className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls with Pastel Blue + Green */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Briefcase className="h-4 w-4" />
            <span>Recruitment & Job Scam Directory · Pilot Registry</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Anti-Recruitment Scam Database
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Zero mock records. All cataloged entries derive strictly from verified student incident submissions regarding fake tasks, deposit demands, or accredited employers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-sky-200 rounded-lg hover:bg-sky-50 hover:text-sky-800 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-sky-600" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-lg transition-all shadow-xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Report a Scam</span>
          </button>

          {records.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 bg-sky-50/50 border border-sky-100 rounded-lg hover:text-rose-600 hover:border-rose-200 transition-colors"
              title="Clear all test records"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFilterRisk(filterRisk === 'red' ? 'all' : 'red')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterRisk === 'red'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white border-rose-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              <span>Job Scam Alerts</span>
            </span>
            <span className="text-[11px] text-rose-500 font-medium">Red</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            Prepaid Tasks & Deposit Frauds
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            E-commerce order booking, uniform fee extortion, frozen withdrawals
          </div>
        </button>

        <button
          onClick={() => setFilterRisk(filterRisk === 'yellow' ? 'all' : 'yellow')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterRisk === 'yellow'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-amber-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 text-amber-600 font-semibold uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              <span>Suspicious Offers</span>
            </span>
            <span className="text-[11px] text-amber-500 font-medium">Yellow</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            Under Investigation & Disputed
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Unregistered brokers, ambiguous compensation, undisclosed fees
          </div>
        </button>

        <button
          onClick={() => setFilterRisk(filterRisk === 'green' ? 'all' : 'green')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterRisk === 'green'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-white border-emerald-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Accredited Employers</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Green</span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            Verified Businesses & Agencies
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active corporate tax ID, transparent hiring, official domain emails
          </div>
        </button>
      </div>

      {/* Table Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-emerald-100 p-3 rounded-2xl shadow-xs">
        {/* Search in table */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter records by recruiter, phone, bank account, or company..."
            className="w-full bg-sky-50/30 border border-sky-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* Type select */}
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EntityType | 'all')}
            className="bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Formats</option>
            <option value="phone">Recruiter Phones</option>
            <option value="bank_account">Task Bank Accounts</option>
            <option value="company">Companies & Agencies</option>
            <option value="telegram_zalo">Telegram / Zalo Handles</option>
          </select>

          {/* Risk Level clear */}
          {filterRisk !== 'all' && (
            <button
              onClick={() => setFilterRisk('all')}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 bg-emerald-100/70 rounded-md"
            >
              <span>Clear Filter</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Database Table with Pastel Blue & Green Harmony */}
      <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-sky-100 bg-gradient-to-r from-sky-50/70 to-emerald-50/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Threat Level</th>
                <th className="py-3 px-4">Company / Recruiter</th>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Scam Category</th>
                <th className="py-3 px-4">Verification Source</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800">
                        {records.length === 0
                          ? 'No Recruitment Scam Records Yet'
                          : 'No matching records for current filters'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {records.length === 0
                          ? 'This database contains zero mock or virtual data. It is awaiting live pilot submissions from students testing job offers.'
                          : 'Try adjusting your category or threat level filter.'}
                      </p>
                      {records.length === 0 && (
                        <div className="pt-2 flex items-center justify-center gap-3">
                          <button
                            onClick={onOpenReportModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-xl transition-all shadow-xs"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Submit a Job Scam Report</span>
                          </button>
                          {onOpenBot && (
                            <button
                              onClick={onOpenBot}
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300/80 rounded-xl transition-colors"
                            >
                              <Bot className="h-3.5 w-3.5 text-emerald-700" />
                              <span>Test Bot Simulator</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isRed = item.riskLevel === 'red';
                  const isYellow = item.riskLevel === 'yellow';
                  const isGreen = item.riskLevel === 'green';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gradient-to-r hover:from-sky-50/40 hover:to-emerald-50/40 transition-colors group cursor-pointer"
                      onClick={() => setInspectRecord(item)}
                    >
                      {/* Risk Level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold text-[11px] ${
                            isRed
                              ? 'text-rose-600'
                              : isYellow
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isRed ? 'bg-rose-500' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span>
                            {isRed ? 'Scam Alert' : isYellow ? 'Suspicious' : 'Accredited'}
                          </span>
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-[180px] truncate">
                        {item.name}
                      </td>

                      {/* Identifier */}
                      <td className="py-3 px-4 font-mono text-sky-700 font-semibold max-w-[200px] truncate">
                        <div className="flex items-center gap-1.5">
                          {getEntityIcon(item.type)}
                          <span>{item.identifier}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-emerald-800 whitespace-nowrap font-medium">
                        {item.category}
                      </td>

                      {/* Authority / Verified By */}
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                        {item.legalRefNumber || item.verifiedBy || 'Student Report'}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {item.updatedAt}
                      </td>

                      {/* Inspect */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectRecord(item);
                          }}
                          className="px-2.5 py-1 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors font-medium text-[11px]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Record Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-emerald-200 max-w-2xl w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${
                  inspectRecord.riskLevel === 'red' ? 'bg-rose-500' : inspectRecord.riskLevel === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h3 className="text-lg font-bold text-slate-900">
                  Recruiter Inspection & Incident Details
                </h3>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-sky-50/50 to-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div>
                  <div className="text-slate-500 font-medium">Recruiter / Entity</div>
                  <div className="font-bold text-slate-900 mt-0.5">{inspectRecord.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Identifier</div>
                  <div className="font-mono font-bold text-sky-700 mt-0.5">{inspectRecord.identifier}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Scam Category</div>
                  <div className="text-emerald-800 font-semibold mt-0.5">{inspectRecord.category}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Recorded Date</div>
                  <div className="font-mono text-slate-800 mt-0.5">{inspectRecord.updatedAt}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-700 mb-1">Incident Modus Operandi:</div>
                <p className="text-slate-600 bg-white p-3 rounded-xl border border-sky-100 leading-relaxed whitespace-pre-wrap">
                  {inspectRecord.details || inspectRecord.summary}
                </p>
              </div>

              {inspectRecord.reportedRedFlags && inspectRecord.reportedRedFlags.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-700 mb-1">Reported Red Flags:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {inspectRecord.reportedRedFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Update / Moderation */}
              <div className="pt-3 border-t border-sky-100 space-y-3">
                <div className="font-semibold text-slate-800">
                  Moderator Action / Status Change:
                </div>
                <input
                  type="text"
                  value={moderatorNote}
                  onChange={e => setModeratorNote(e.target.value)}
                  placeholder="Optional audit verification note..."
                  className="w-full bg-sky-50/30 border border-sky-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus('green')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Set Accredited (Green)</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('yellow')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Set Suspicious (Yellow)</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('red')}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Set Scam Alert (Red)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-sky-200 max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h4 className="text-base font-bold text-slate-900">Clear All Job Scam Records?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all tester submissions and reset the recruitment registry to an empty state.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
