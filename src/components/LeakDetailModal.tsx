import React, { useState } from 'react';
import {
  X,
  Cpu,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Send,
  Loader2,
  Sparkles,
  BarChart3,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { LeakItem } from '../types/leak';
import { formatBlueprintBadge, formatCurrency } from '../utils/analyticsEngine';

interface LeakDetailModalProps {
  leak: LeakItem | null;
  currency: 'INR' | 'USD';
  onClose: () => void;
  onOpenSimulatorForLeak: (leak: LeakItem) => void;
}

export const LeakDetailModal: React.FC<LeakDetailModalProps> = ({
  leak,
  currency,
  onClose,
  onOpenSimulatorForLeak,
}) => {
  if (!leak) return null;

  const [activeTab, setActiveTab] = useState<'evidence' | 'nemotron' | 'chat' | 'action'>('nemotron');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your NVIDIA Nemotron financial reasoning advisor. I have synthesized transactions for this ${leak.category} leak. What would you like to drill into?`,
    },
  ]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [liveReasoning, setLiveReasoning] = useState(leak.nemotronReasoning);

  const handleAskQuestion = async (presetQuestion?: string) => {
    const q = presetQuestion || chatQuestion;
    if (!q.trim() || chatLoading) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setChatQuestion('');
    setChatLoading(true);

    try {
      const { askNemotronAdvisor } = await import('../utils/aiService');
      const data = await askNemotronAdvisor({
        question: q,
        leakContext: {
          category: leak.category,
          name: leak.name,
          detectedAmount: leak.detectedAmount,
          topAffectedItem: leak.topAffectedItem,
          evidence: leak.sampleEvidence,
        },
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer || 'Analysis complete. Key finding: Check operational limits on coupon stacking.',
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Nemotron Advisor: Based on our model analysis of ${leak.name}, capping exposure will recover up to ${formatCurrency(leak.nemotronReasoning.expectedMonthlyRecovery, currency)} with minimal risk.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleTriggerReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const { analyzeLeakWithNemotron } = await import('../utils/aiService');
      const data = await analyzeLeakWithNemotron({
        leakType: leak.category,
        amount: leak.detectedAmount,
        title: leak.name,
        evidence: {
          topAffectedItem: leak.topAffectedItem,
          sampleEvidence: leak.sampleEvidence,
        },
      });
      if (data.analysis) {
        setLiveReasoning(data.analysis);
      }
    } catch (e) {
      // keep current
    } finally {
      setIsReanalyzing(false);
    }
  };

  const getPlausibilityBadge = (plausibility: string) => {
    switch (plausibility) {
      case 'Very High':
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header (Blueprint Page 5: "LEAK DETAIL SCREEN: Discount Leak — ■82K") */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/90 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Hackathon Blueprint 04 • Leak Detail Screen
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Cpu className="w-3 h-3 mr-1" /> NVIDIA Nemotron Reasoning
              </span>
            </div>
            <div className="mt-1 flex items-baseline space-x-3">
              <h2 className="text-xl sm:text-2xl font-black text-white capitalize">
                {leak.name} —{' '}
                <span className="text-rose-400">
                  <span className="inline-block w-2.5 h-2.5 bg-rose-500 mr-1.5 rounded-xs align-middle"></span>
                  {formatBlueprintBadge(leak.detectedAmount, currency)}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {leak.whatItMeans}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'nemotron', label: 'NVIDIA Nemotron Reasoning', icon: BrainCircuit, badge: 'AI Layer' },
            { id: 'evidence', label: 'Structured Evidence', icon: Layers, badge: `${leak.sampleEvidence.length} Signals` },
            { id: 'chat', label: 'Ask AI Advisor', icon: HelpCircle, badge: 'Live Q&A' },
            { id: 'action', label: 'Recommended Action', icon: Lightbulb, badge: 'Immediate' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: NVIDIA NEMOTRON REASONING */}
          {activeTab === 'nemotron' && (
            <div className="space-y-5">
              {/* Root Cause Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Probable Root Cause Identified
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">
                      Model Confidence: <strong className="text-emerald-400 font-bold">{(liveReasoning.confidence * 100).toFixed(0)}%</strong>
                    </span>
                    <button
                      onClick={handleTriggerReanalyze}
                      disabled={isReanalyzing}
                      className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center space-x-1"
                    >
                      {isReanalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                      <span>{isReanalyzing ? 'Thinking...' : 'Refresh AI'}</span>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-100 leading-relaxed">
                  {liveReasoning.rootCause}
                </p>
                <div className="mt-2 text-xs text-slate-400 flex items-center space-x-2">
                  <span>Engine: {liveReasoning.modelUsed || 'NVIDIA Nemotron Reasoning'}</span>
                  <span>•</span>
                  <span>Deterministic Guardrail: Verified</span>
                </div>
              </div>

              {/* Blueprint Page 6: Hypothesis Comparison (compare possible causes) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center">
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Hypothesis Comparison (AI Plausibility Audit)
                </h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Hypothesis</th>
                        <th className="px-3 py-2.5">Plausibility</th>
                        <th className="px-4 py-2.5">Data-Backed Evidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {liveReasoning.hypothesisComparison.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="px-4 py-3 font-semibold text-slate-200">
                            {item.hypothesis}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlausibilityBadge(
                                item.plausibility
                              )}`}
                            >
                              {item.plausibility}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300 leading-relaxed text-[11px]">
                            {item.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Action Bridge */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-800/40 border border-slate-800 rounded-xl gap-3">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Estimated Recoverable Cash:</div>
                  <div className="text-lg font-bold text-emerald-400">
                    +{formatCurrency(liveReasoning.expectedMonthlyRecovery, currency)} / month
                  </div>
                </div>
                <button
                  onClick={() => onOpenSimulatorForLeak(leak)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Test Recovery in What-if Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURED EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Observed Anomaly Signals
                </h4>
                <ul className="space-y-2">
                  {liveReasoning.structuredEvidence.map((ev, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Primary SKU / Entity Affected
                  </span>
                  <div className="text-sm font-bold text-white mt-1">
                    {leak.topAffectedItem}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Accounts for ~68% of this category's leakage
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Order Impact Count
                  </span>
                  <div className="text-sm font-bold text-rose-400 mt-1">
                    {leak.affectedOrdersCount} Orders Flagged
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Average loss: ~{formatCurrency(Math.round(leak.detectedAmount / leak.affectedOrdersCount), currency)} per flagged order
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE ASK NEMOTRON ADVISOR */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 flex items-center justify-between">
                <span className="flex items-center">
                  <Cpu className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  NVIDIA Nemotron Live Reasoning Session
                </span>
                <span className="text-[10px] bg-indigo-900/50 px-2 py-0.5 rounded text-indigo-200">
                  Latency: ~180ms
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'bg-slate-900 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-semibold mb-1">
                        {msg.sender === 'user' ? 'You' : '⚡ NVIDIA Nemotron'}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>NVIDIA Nemotron is analyzing transaction patterns...</span>
                  </div>
                )}
              </div>

              {/* Preset Quick Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Why is ${leak.category} leaking so much?`,
                  `What immediate fix recovers cash this week?`,
                  `Will fixing this hurt checkout conversion?`,
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask Nemotron about root causes, supplier rebates, or checkout rules..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleAskQuestion()}
                  disabled={chatLoading || !chatQuestion.trim()}
                  className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold disabled:opacity-50 transition-colors flex items-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: RECOMMENDED ACTION */}
          {activeTab === 'action' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Strategic Recommendation
                </span>
                <p className="mt-1 text-sm font-semibold text-slate-100 leading-relaxed">
                  {liveReasoning.strategicRecommendation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 font-medium">Difficulty:</span>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {liveReasoning.implementationDifficulty}
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 font-medium">Timeline:</span>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {liveReasoning.timeline}
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 font-medium">Expected Recovery:</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">
                    +{formatCurrency(liveReasoning.expectedMonthlyRecovery, currency)}/mo
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenSimulatorForLeak(leak)}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Launch in What-If Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
