import React, { useState } from 'react';
import { EntityType, JobScamCategory, NewReportSubmission, RiskRecord } from '../types';
import { submitNewReport } from '../services/storageService';
import {
  X,
  Upload,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Building,
  Phone,
  CreditCard,
  AtSign
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillIdentifier?: string;
  onReportSubmitted?: (record: RiskRecord) => void;
}

const COMMON_JOB_RED_FLAGS = [
  'Demanded deposit for uniforms, employee badge, or onboarding training',
  'Required transferring money to complete e-commerce orders or review tasks',
  'Recruiter communicated exclusively via anonymous Telegram or disposable Zalo',
  'Unrealistically high wages for minimal effort (e.g. 500k – 1M VND/day for liking videos)',
  'Demanded bank login credentials, OTP codes, or personal identity card front/back',
  'Initial small commission was paid out, but subsequent large deposit was frozen',
  'Refused in-person interview or lacked verifiable corporate business tax code',
  'Recruiter used personal free Gmail address claiming to represent major brand'
];

const UNIVERSITIES = [
  'Đại học Quốc gia Hà Nội (VNU-HN)',
  'Đại học Bách Khoa Hà Nội (HUST)',
  'Đại học Ngoại Thương (FTU)',
  'Đại học Kinh Tế Quốc Dân (NEU)',
  'ĐHQG TP. Hồ Chí Minh (VNU-HCM)',
  'ĐH Bách Khoa TP.HCM (HCMUT)',
  'ĐH Kinh Tế TP.HCM (UEH)',
  'Other Institution / Undisclosed'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  prefillIdentifier = '',
  onReportSubmitted
}) => {
  const [entityType, setEntityType] = useState<EntityType>('phone');
  const [identifier, setIdentifier] = useState(prefillIdentifier);
  const [targetName, setTargetName] = useState('');
  const [bankName, setBankName] = useState('');
  const [category, setCategory] = useState<JobScamCategory>('Task & Order Completion Scam');
  const [description, setDescription] = useState('');
  const [lossAmount, setLossAmount] = useState('');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [reporterAffiliation, setReporterAffiliation] = useState(UNIVERSITIES[0]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [evidenceList, setEvidenceList] = useState<Array<{ name: string; url: string; caption: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RiskRecord | null>(null);

  if (!isOpen) return null;

  const handleToggleFlag = (flag: string) => {
    setSelectedFlags(prev =>
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEvidenceList(prev => [
            ...prev,
            {
              name: file.name,
              url: event.target?.result as string,
              caption: `Evidence: ${file.name}`
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    const submission: NewReportSubmission = {
      identifier: identifier.trim(),
      targetName: targetName.trim() || identifier.trim(),
      type: entityType,
      bankName: entityType === 'bank_account' ? bankName.trim() : undefined,
      category,
      description: description.trim(),
      lossAmount: lossAmount.trim(),
      redFlags: selectedFlags,
      evidenceFiles: evidenceList,
      reporterAffiliation: isAnonymous ? `Anonymous Student (${reporterAffiliation})` : `${reporterName || 'Student'} (${reporterAffiliation})`
    };

    const newRecord = submitNewReport(submission);
    setIsSubmitting(false);
    setSubmittedRecord(newRecord);
    if (onReportSubmitted) {
      onReportSubmitted(newRecord);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRecord(null);
    setIdentifier('');
    setTargetName('');
    setBankName('');
    setDescription('');
    setLossAmount('');
    setSelectedFlags([]);
    setEvidenceList([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-5 backdrop-blur-2xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-emerald-200/90 shadow-2xl overflow-hidden my-6">
        {/* Modal Header in Pastel Blue + Green */}
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4 bg-gradient-to-r from-sky-50 to-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Report a Job or Recruitment Scam
              </h3>
              <p className="text-xs text-slate-500">
                Data will be recorded directly into the student anti-recruitment fraud registry
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Screen after submission */}
        {submittedRecord ? (
          <div className="p-8 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">
                Job Scam Reported Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The report for recruiter / account <strong>"{submittedRecord.identifier}"</strong> is now live in the central pilot registry to protect fellow students.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Suspect Recruiter / Entity:</span>
                <span className="font-semibold text-slate-900">{submittedRecord.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Scam Classification:</span>
                <span className="font-bold text-rose-600 uppercase">
                  🔴 Scam Alert / Red
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Attached Task Evidence:</span>
                <span className="font-mono text-slate-900">{submittedRecord.evidence.length} file(s)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-xl transition-all shadow-xs"
              >
                Close and Test Verification
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Target Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Recruitment Indicator Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'phone', label: 'Recruiter Phone', icon: Phone },
                  { id: 'bank_account', label: 'Task Deposit Bank', icon: CreditCard },
                  { id: 'company', label: 'Company / Brand', icon: Building },
                  { id: 'telegram_zalo', label: 'Telegram / Zalo ID', icon: AtSign }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = entityType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEntityType(item.id as EntityType)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-sky-100 to-emerald-100 border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                          : 'bg-sky-50/20 border-sky-100 text-slate-600 hover:bg-emerald-50/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Identifier & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  {entityType === 'phone' && 'Recruiter Phone Number *'}
                  {entityType === 'bank_account' && 'Task Transfer Account Number *'}
                  {entityType === 'company' && 'Company / Brand Name *'}
                  {entityType === 'telegram_zalo' && 'Telegram Username or Zalo ID *'}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    entityType === 'phone'
                      ? 'e.g. 0901234567'
                      : entityType === 'bank_account'
                      ? 'e.g. 1903xxxxxx'
                      : entityType === 'company'
                      ? 'e.g. Tập đoàn Thương mại Global...'
                      : 'e.g. @tuyendung_shopee2026'
                  }
                  className="w-full rounded-xl bg-sky-50/30 border border-sky-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {entityType === 'bank_account' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Bank / Financial Institution
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Techcombank, Vietcombank, MB..."
                    className="w-full rounded-xl bg-sky-50/30 border border-sky-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Recruiter Alias / Contact Name
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="e.g. Trợ lý Tuyển Dụng Mai, HR Manager..."
                    className="w-full rounded-xl bg-sky-50/30 border border-sky-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Category and Loss amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Recruitment Scam Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobScamCategory)}
                  className="w-full rounded-xl bg-sky-50/30 border border-sky-200 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Task & Order Completion Scam">E-Commerce Task & Order Booking Scam</option>
                  <option value="Fake Online Typing / Data Entry">Fake Online Typing / Document Copying</option>
                  <option value="Upfront Uniform & Training Deposit">Upfront Uniform & Training Fee Trap</option>
                  <option value="Fake Brand Ambassador / Model">Fake Model Casting / Brand Ambassador</option>
                  <option value="Corporate Impersonation">Impersonation of Corporate Brand (Shopee, Lazada...)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Financial Loss Incurred (if any)
                </label>
                <input
                  type="text"
                  value={lossAmount}
                  onChange={(e) => setLossAmount(e.target.value)}
                  placeholder="e.g. 2,000,000 VND (or 0 VND if blocked in time)"
                  className="w-full rounded-xl bg-sky-50/30 border border-sky-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Red Flags Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Observed Recruitment Red Flags (Select all applicable)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_JOB_RED_FLAGS.map((flag, idx) => {
                  const isChecked = selectedFlags.includes(flag);
                  return (
                    <label
                      key={idx}
                      onClick={() => handleToggleFlag(flag)}
                      className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                        isChecked
                          ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                          : 'bg-emerald-50/20 border-emerald-100/70 text-slate-600 hover:bg-emerald-50/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-0"
                      />
                      <span>{flag}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Incident Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Recruitment Process & Modus Operandi Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how the recruiter reached out (Facebook group, Telegram message), what tasks were assigned, how deposits were demanded, and when payment was withheld..."
                className="w-full rounded-xl bg-sky-50/30 border border-sky-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Evidence Upload Section */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span>Attach Verifiable Evidence (Chat screenshots, transfer receipts, task slips)</span>
              </label>

              {/* Upload Dropzone with Pastel Blue & Green */}
              <div className="relative border-2 border-dashed border-emerald-200 rounded-2xl p-4 text-center hover:border-emerald-300 transition-colors bg-gradient-to-br from-sky-50/20 to-emerald-50/20">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <Upload className="h-6 w-6 text-emerald-500" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click or drag & drop recruiter screenshots or wire receipts here
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Real documents ensure data accuracy across the recruitment fraud registry.
                  </p>
                </div>
              </div>

              {/* Uploaded Evidence Previews */}
              {evidenceList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {evidenceList.map((item, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border border-emerald-100 bg-white overflow-hidden shadow-2xs"
                    >
                      <img
                        src={item.url}
                        alt={item.caption}
                        referrerPolicy="no-referrer"
                        className="h-20 w-full object-cover"
                      />
                      <div className="p-1.5 text-[10px] text-slate-600 truncate">
                        {item.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reporter Profile & Anonymity */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50/50 to-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Submit Anonymously</span>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAnonymous ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isAnonymous ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {!isAnonymous && (
                <div>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full rounded-xl bg-white border border-emerald-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">
                  University Affiliation
                </label>
                <select
                  value={reporterAffiliation}
                  onChange={(e) => setReporterAffiliation(e.target.value)}
                  className="w-full rounded-xl bg-white border border-emerald-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {UNIVERSITIES.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !identifier.trim() || !description.trim()}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 disabled:opacity-40 rounded-xl transition-all shadow-xs"
              >
                {isSubmitting ? 'Recording...' : 'Submit to Scam Registry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
