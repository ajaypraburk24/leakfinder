import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
} from 'lucide-react';

interface JudgeDefenseModalProps {
  onClose: () => void;
}

export const JudgeDefenseModal: React.FC<JudgeDefenseModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'architecture' | 'plan'>('qa');

  const qaItems = [
    {
      q: 'Why AI? Why not just standard analytics charts?',
      a: 'Analytics calculates raw numbers in silos; standard dashboards show discounts, returns, and costs separately and leave the owner to guess why margin collapsed. The AI layer (NVIDIA Nemotron) acts as the reasoning engine: it synthesizes multiple cross-functional signals, compares competing hypotheses, and translates raw numbers into an explainable business action.',
    },
    {
      q: 'Why NVIDIA Nemotron specifically?',
      a: 'Nemotron is purpose-engineered for high-throughput enterprise reasoning over structured and tabular evidence. In financial leak detection, hallucination is fatal. Nemotron excels at evaluating multiple plausible hypotheses against hard operational facts without inventing arbitrary mathematical rules.',
    },
    {
      q: 'Is the money saved real or simulated?',
      a: 'For this MVP prototype, the ₹2.14L leakage and projected recoveries are simulated based on deterministic business logic and the benchmark dataset. We explicitly label all recoveries as projected/simulated to uphold financial integrity.',
    },
    {
      q: 'How does it scale to production enterprise data?',
      a: 'The pipeline is decoupled: the ingestion layer accepts webhooks from Shopify, Stripe, WooCommerce, SAP, and Tally. The deterministic metrics engine processes thousands of records in sub-second memory, while only structured anomaly bundles are passed to the NVIDIA Nemotron inference API.',
    },
    {
      q: 'What if the AI makes an erroneous recommendation?',
      a: 'We adhere to the strict AI Boundary Principle: all calculations remain 100% deterministic. Nemotron only suggests actions alongside full transparent evidence, allowing human stakeholders to audit and approve every change before checkout rules or pricing are modified.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <span>Judge Q&A & Technical Defense</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Blueprint Page 8
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Architectural boundaries, NVIDIA model role, and technical depth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 gap-2">
          {[
            { id: 'qa', label: 'Judge Q&A Defense', icon: HelpCircle },
            { id: 'architecture', label: 'Division of Responsibility', icon: Layers },
            { id: 'plan', label: '48-Hour Build Blueprint', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'qa' && (
            <div className="space-y-3">
              {qaItems.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-100 flex items-start">
                    <span className="text-indigo-400 mr-2 shrink-0">Q{i + 1}:</span>
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
                <strong>Core Architectural Rule:</strong> Never let LLMs perform raw accounting arithmetic. Math is deterministic; Nemotron is strictly the synthesis & reasoning layer.
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5">Component</th>
                      <th className="px-4 py-2.5">Responsibility</th>
                      <th className="px-4 py-2.5">Boundary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr>
                      <td className="px-4 py-3 font-bold text-blue-400">Deterministic Analytics</td>
                      <td className="px-4 py-3 text-slate-300">Calculate revenue, costs, margins, discount exposure, and return rates.</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">Node.js / TypeScript</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-rose-400">Leak Detection</td>
                      <td className="px-4 py-3 text-slate-300">Flag unusual or high-impact patterns using transparent rules & thresholds.</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">Rule-Engine</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-emerald-400">NVIDIA Nemotron</td>
                      <td className="px-4 py-3 text-slate-300">Interpret structured evidence, explain findings, compare possible causes, and formulate actions.</td>
                      <td className="px-4 py-3 text-emerald-400 font-mono text-[11px]">nvidia/llama-3.1-nemotron-70b</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-amber-400">User Interface</td>
                      <td className="px-4 py-3 text-slate-300">Present evidence, explanation, recommendation, and what-if impact clearly.</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">React 19 + Tailwind</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Blueprint 48-Hour Build Milestones
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { num: 1, title: 'NVIDIA Model', desc: 'Get Nemotron running and verify simple end-to-end request.' },
                  { num: 2, title: 'Data Pipeline', desc: 'Prepare clean sample dataset with realistic business fields.' },
                  { num: 3, title: 'Analytics', desc: 'Build transparent calculations and leak-detection rules.' },
                  { num: 4, title: 'AI Reasoning', desc: 'Send structured evidence to model and return explanations.' },
                  { num: 5, title: 'UI Dashboard & Simulator', desc: 'Build dashboard, leak detail and simulator screens.' },
                  { num: 6, title: 'Integration & Live Demo', desc: 'Rehearse the exact 3-minute pitch repeatedly.' },
                ].map((m) => (
                  <div key={m.num} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-[11px]">
                        {m.num}
                      </span>
                      <span className="font-bold text-slate-200">{m.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed pl-7">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Final Principle: Understand in 15s • Meaningful AI in 60s • Remember in 3m</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
