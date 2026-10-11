import React, { useState, useRef, useEffect } from 'react';
import { BotChatMessage } from '../types';
import { searchRecords } from '../services/storageService';
import {
  Send,
  RotateCcw,
  CheckCircle,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

interface BotSimulatorProps {
  onOpenReportModalWithData: (identifier: string) => void;
}

type BotPlatform = 'zalo' | 'telegram';

export const BotSimulator: React.FC<BotSimulatorProps> = ({ onOpenReportModalWithData }) => {
  const [platform, setPlatform] = useState<BotPlatform>('zalo');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotMessages: BotChatMessage[] = [
    {
      id: 'm1',
      sender: 'bot',
      text: 'Hello! I am StudentShield Job Verification Bot 🛡️ — Automated real-time risk lookup & recruitment scam prevention assistant for students.',
      timestamp: '09:00',
      actionButtons: [
        { label: '🚨 Report Job Scam with Evidence', action: 'report' },
        { label: '🛡️ 3 Golden Rules Against Job Scams', action: 'tips' },
        { label: '📞 Official Support Hotlines', action: 'hotlines' },
        { label: 'ℹ️ How Verification Works', action: 'info' }
      ]
    },
    {
      id: 'm2',
      sender: 'bot',
      text: 'Send any suspect recruiter phone number, task deposit bank account, company name, or Telegram handle to instantly check against our real-time database!',
      timestamp: '09:00'
    }
  ];

  const [messages, setMessages] = useState<BotChatMessage[]>(initialBotMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: BotChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processBotResponse(text.trim());
      setIsTyping(false);
    }, 500);
  };

  const processBotResponse = (userInput: string) => {
    const raw = userInput.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Handle command / action triggers
    if (raw.includes('tips') || raw.includes('rule') || raw === '/tips') {
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `🛡️ 3 RULES TO AVOID STUDENT RECRUITMENT SCAMS:\n\n1. Zero Upfront Fees: Legitimate companies never charge fees for uniforms, employee badges, or onboarding training.\n2. Reject Prepaid Task Orders: Any job requiring you to deposit money to "fund e-commerce orders" or "unlock VIP tasks" is 100% fraud.\n3. Verify Company Tax Code: Authentic corporate recruiters conduct interviews and communicate via official domain emails (@company.vn), never anonymous Telegram accounts.\n\nEmergency Hotlines: Cybercrime Dept (A05) 069.219.4053 | Consumer Protection 1800.6838.`,
          timestamp: time,
          actionButtons: [
            { label: '🚨 Report a Suspect Job', action: 'report' },
            { label: '📞 Support Hotlines', action: 'hotlines' }
          ]
        }
      ]);
      return;
    }

    if (raw.includes('hotline') || raw.includes('emergency') || raw === '/hotlines') {
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `📞 OFFICIAL STUDENT SUPPORT HOTLINES:\n\n1. Department of Cybersecurity & High-Tech Crime Prevention (A05):\n   ☎️ 069.219.4053\n\n2. National Consumer Rights & Protection Helpline:\n   ☎️ 1800.6838 (Toll-Free)`,
          timestamp: time,
          actionButtons: [
            { label: '🚨 Submit Incident Report', action: 'report' },
            { label: '🛡️ Safety Rules', action: 'tips' }
          ]
        }
      ]);
      return;
    }

    if (raw.includes('info') || raw.includes('how') || raw === '/info') {
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `ℹ️ HOW JOB VERIFICATION WORKS:\n\n• Live Community Pilot: Zero mock data is pre-populated.\n• When you type any recruiter phone, bank account, company name, or Telegram handle, we cross-reference our verified recruitment fraud registry.\n• Threat Levels:\n  🟢 Green: Verified legitimate accredited employer\n  🟡 Yellow: Suspicious offer / unverified broker\n  🔴 Red: Confirmed task scam / uniform deposit trap\n• To catalog a new scam offer, submit a report with chat logs or wire receipts.`,
          timestamp: time,
          actionButtons: [
            { label: '🚨 Submit Test Report', action: 'report' }
          ]
        }
      ]);
      return;
    }

    if (raw.includes('report') || raw === '/report') {
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `🚨 READY TO REPORT RECRUITMENT FRAUD\n\nTo ensure data accuracy, please attach verifiable evidence (screenshots of recruiter chat, task order slips, or wire transfer receipts). Open our verification form:`,
          timestamp: time,
          actionButtons: [
            { label: '📝 Open Job Scam Report Form', action: 'report' }
          ]
        }
      ]);
      return;
    }

    // Real Database Query
    const searchRes = searchRecords(userInput);

    if (searchRes.record) {
      const rec = searchRes.record;
      const statusEmoji = rec.riskLevel === 'red' ? '🔴' : rec.riskLevel === 'yellow' ? '🟡' : '🟢';
      const statusTitle =
        rec.riskLevel === 'red'
          ? 'JOB SCAM ALERT / CONFIRMED FRAUD'
          : rec.riskLevel === 'yellow'
          ? 'SUSPICIOUS OFFER / DISPUTED'
          : 'VERIFIED LEGITIMATE EMPLOYER';

      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `${statusEmoji} RECRUITMENT VERIFICATION FOUND:\n\n• Recruiter / Entity: ${rec.name}\n• Identifier: ${rec.identifier}\n• Threat Level: ${statusTitle}\n• Category: ${rec.category}\n• Audit Status: ${rec.accuracyConfidence || 'Student Verified'}\n\nSummary: ${rec.summary}`,
          timestamp: time,
          riskAlert: rec,
          actionButtons: [
            { label: '🚨 Report Related Activity', action: 'report', payload: rec.identifier },
            { label: '🛡️ Safety Tips', action: 'tips' }
          ]
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: `⚪ LOOKUP RESULT FOR: "${userInput}"\n\nNo records found in recruitment database.\n\nThis recruiter or account has not been reported or verified during our pilot testing phase.\n\n⚠️ Caution: Scammers constantly create new Telegram accounts and SIM cards. Remember: Legitimate jobs NEVER require you to transfer money to work!`,
          timestamp: time,
          actionButtons: [
            { label: `🚨 Report "${userInput.slice(0, 18)}" as Scam`, action: 'report', payload: userInput },
            { label: '🛡️ View 3 Golden Rules', action: 'tips' }
          ]
        }
      ]);
    }
  };

  const handleActionButton = (btn: { label: string; action: string; payload?: string }) => {
    if (btn.action === 'report') {
      onOpenReportModalWithData(btn.payload || '');
    } else if (btn.action === 'tips') {
      handleSendMessage('tips');
    } else if (btn.action === 'hotlines') {
      handleSendMessage('hotlines');
    } else if (btn.action === 'info') {
      handleSendMessage('info');
    } else if (btn.action === 'query' && btn.payload) {
      handleSendMessage(btn.payload);
    }
  };

  const handleResetChat = () => {
    setMessages(initialBotMessages);
  };

  return (
    <div className="space-y-6">
      {/* Platform Switcher Header in Pastel Blue + Green */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 p-4 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Briefcase className="h-4 w-4" />
            <span>Automated Job Verification Bot</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Zalo Official Account & Telegram Bot Integration
          </h2>
          <p className="text-xs text-slate-500">
            Verify recruiter numbers, task accounts, and company names directly in chat before sending money or applying.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Channel Toggle */}
          <div className="flex items-center bg-sky-50/60 p-1 rounded-xl border border-sky-100">
            <button
              onClick={() => setPlatform('zalo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platform === 'zalo'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Zalo Official Account
            </button>
            <button
              onClick={() => setPlatform('telegram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platform === 'telegram'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Telegram Bot
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 text-slate-400 hover:text-emerald-700 bg-emerald-50/50 rounded-xl border border-emerald-100 transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Simulator Device Shell with Pastel Blue & Pastel Green */}
      <div className="max-w-2xl mx-auto rounded-3xl border border-emerald-200/80 bg-white overflow-hidden shadow-sm flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className={`px-5 py-3.5 flex items-center justify-between text-white ${
          platform === 'zalo' ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base text-white border border-white/30 backdrop-blur-xs">
              💼
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>StudentShield Job Bot</span>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-100 fill-emerald-100/20" />
              </div>
              <div className="text-[11px] text-white/90 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span>Active Recruitment Verification · {platform === 'zalo' ? 'Zalo OA' : 'Telegram'}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono bg-black/15 px-2 py-0.5 rounded text-white/90">
            v2.2 Pilot
          </span>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-sky-50/20 via-white to-emerald-50/20">
          <div className="text-center my-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70 shadow-2xs">
              Real-Time Recruitment Fraud Registry
            </span>
          </div>

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-emerald-100 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Risk Alert Card inside Bot message */}
                {msg.riskAlert && (
                  <div className={`mt-3 p-3 rounded-xl border text-xs ${
                    msg.riskAlert.riskLevel === 'red'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : msg.riskAlert.riskLevel === 'yellow'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {msg.riskAlert.riskLevel === 'red' && <ShieldAlert className="h-4 w-4 text-rose-600" />}
                      {msg.riskAlert.riskLevel === 'yellow' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                      {msg.riskAlert.riskLevel === 'green' && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                      <span>{msg.riskAlert.name}</span>
                    </div>
                    <div className="font-mono text-sky-800 font-semibold">{msg.riskAlert.identifier}</div>
                    <div className="text-[11px] text-slate-600 mt-1 font-medium">{msg.riskAlert.category}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionButton(btn)}
                      className="text-xs bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-emerald-100 rounded-2xl px-3 py-2 w-16 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-sky-100">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Send recruiter phone, task bank account, or Telegram handle..."
              className="flex-1 bg-gradient-to-r from-sky-50/30 to-emerald-50/30 border border-sky-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
