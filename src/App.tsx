/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroMetricCards } from './components/HeroMetricCards';
import { LeakSummaryTable } from './components/LeakSummaryTable';
import { LeakDetailModal } from './components/LeakDetailModal';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ActionPlanView } from './components/ActionPlanView';
import { RevenueLeakScanner } from './components/RevenueLeakScanner';
import { DemoPitchModal } from './components/DemoPitchModal';
import { JudgeDefenseModal } from './components/JudgeDefenseModal';
import { NvidiaSettingsModal } from './components/NvidiaSettingsModal';
import { ALL_DATASETS, BLUEPRINT_DATASET } from './data/mockDatasets';
import { BusinessDataset, LeakItem } from './types/leak';
import { formatCurrency, formatBlueprintBadge } from './utils/analyticsEngine';
import {
  Sparkles,
  Cpu,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<BusinessDataset>(BLUEPRINT_DATASET);
  const [currency, setCurrency] = useState<'INR' | 'USD'>(BLUEPRINT_DATASET.currency);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeak, setSelectedLeak] = useState<LeakItem | null>(null);

  // Modals
  const [isPitchModeOpen, setIsPitchModeOpen] = useState(false);
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('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');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSelectDataset = (dataset: BusinessDataset) => {
    setCurrentDataset(dataset);
    setCurrency(dataset.currency);
    showToast(`Loaded: ${dataset.name}`);
  };

  const handleSimulateForLeak = (leak: LeakItem) => {
    setSelectedLeak(null);
    setActiveTab('simulator');
    showToast(`Loaded ${leak.name} into What-If Simulator.`);
  };

  const handleScanCompleted = (scannedData?: Partial<BusinessDataset>) => {
    if (scannedData && scannedData.monthlyRevenue) {
      setCurrentDataset((prev) => ({
        ...prev,
        monthlyRevenue: scannedData.monthlyRevenue || prev.monthlyRevenue,
        estimatedProfit: scannedData.estimatedProfit || prev.estimatedProfit,
        potentialLeakage: scannedData.potentialLeakage || prev.potentialLeakage,
      }));
    }
    setActiveTab('leaks');
    showToast('Scan complete: 4 Revenue Leaks detected by NVIDIA Nemotron!');
  };

  const handlePitchStepNavigate = (stepId: number) => {
    switch (stepId) {
      case 0:
        setActiveTab('dashboard');
        setSelectedLeak(null);
        break;
      case 1:
        setActiveTab('scanner');
        break;
      case 2:
        setActiveTab('leaks');
        setSelectedLeak(null);
        break;
      case 3:
        // Open largest leak (Discount Leak)
        const discountLeak = currentDataset.leaks.find((l) => l.category === 'discount') || currentDataset.leaks[0];
        setSelectedLeak(discountLeak);
        break;
      case 4:
        setSelectedLeak(null);
        setActiveTab('action-plan');
        break;
      case 5:
        setSelectedLeak(null);
        setActiveTab('simulator');
        break;
      case 6:
        setSelectedLeak(null);
        setActiveTab('dashboard');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs">{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentDataset={currentDataset}
        allDatasets={ALL_DATASETS}
        onSelectDataset={handleSelectDataset}
        currency={currency}
        onToggleCurrency={setCurrency}
        onOpenPitchMode={() => setIsPitchModeOpen(true)}
        onOpenDefenseModal={() => setIsDefenseModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Metrics Cards (Blueprint Page 5) */}
            <HeroMetricCards
              dataset={currentDataset}
              currency={currency}
              onNavigateToSimulator={() => setActiveTab('simulator')}
              onNavigateToLeaks={() => setActiveTab('leaks')}
            />

            {/* Quick Summary Leak Breakdown Table (Page 5) */}
            <LeakSummaryTable
              leaks={currentDataset.leaks}
              currency={currency}
              onSelectLeak={(leak) => setSelectedLeak(leak)}
              onSimulateLeak={handleSimulateForLeak}
            />

            {/* Operational Signals & Recent Flagged Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: NVIDIA AI Reasoning Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <Cpu className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    NVIDIA Nemotron Reasoning Status
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-white flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    nvidia/llama-3.1-nemotron-70b-instruct
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Active reasoning layer analyzing cross-signal patterns in {currentDataset.transactionCount.toLocaleString()} transactions.
                  </p>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Audit Status:</span>
                    <span className="text-emerald-400 font-semibold">Deterministic Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hypothesis Plausibility:</span>
                    <span className="text-slate-200">3 Hypotheses Scored</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Top Leak Concentration */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                    Top Margin Drain: SKU-104
                  </span>
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold border border-rose-500/30">
                    High Vulnerability
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SKU-104 (Linen Shirts) accounts for both ₹82,000 in stacked coupon leaks and ₹56,000 in reverse logistics sizing returns.
                </p>
                <button
                  onClick={() => {
                    const discountLeak = currentDataset.leaks.find((l) => l.category === 'discount');
                    if (discountLeak) setSelectedLeak(discountLeak);
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center space-x-1"
                >
                  <span>Inspect SKU-104 Root Cause</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-emerald-400" />
                </button>
              </div>

              {/* Card 3: Hackathon Demo Pitch Trigger */}
              <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-900/40 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    3-Minute Live Demo Walkthrough
                  </span>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Designed specifically for hackathon judging: walk through the 7-phase story (Hook → Scan → Detect → Explain → Act → Simulate → Close).
                  </p>
                </div>
                <button
                  onClick={() => setIsPitchModeOpen(true)}
                  className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1"
                >
                  <span>Start 3-Minute Demo Pitch</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REVENUE LEAK SCANNER */}
        {activeTab === 'scanner' && (
          <div className="animate-in fade-in duration-300">
            <RevenueLeakScanner
              currentDataset={currentDataset}
              onScanCompleted={handleScanCompleted}
              currency={currency}
            />
          </div>
        )}

        {/* VIEW 3: DETECTED LEAKS TABLE & DETAIL */}
        {activeTab === 'leaks' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                  All Detected Revenue Leaks ({currentDataset.leaks.length})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any row to open the full NVIDIA Nemotron Root Cause & Hypothesis audit
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('simulator')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open in What-If Simulator</span>
                </button>
              </div>
            </div>

            <LeakSummaryTable
              leaks={currentDataset.leaks}
              currency={currency}
              onSelectLeak={(leak) => setSelectedLeak(leak)}
              onSimulateLeak={handleSimulateForLeak}
            />
          </div>
        )}

        {/* VIEW 4: WHAT-IF SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="animate-in fade-in duration-300">
            <WhatIfSimulator
              dataset={currentDataset}
              currency={currency}
              onApplyToActionPlan={(sim) => {
                showToast(`Simulation saved! Target recovery: +${formatCurrency(sim.recoveredTotal, currency)}/mo`);
                setActiveTab('action-plan');
              }}
            />
          </div>
        )}

        {/* VIEW 5: ACTION PLAN */}
        {activeTab === 'action-plan' && (
          <div className="animate-in fade-in duration-300">
            <ActionPlanView
              dataset={currentDataset}
              currency={currency}
              onNavigateToSimulator={() => setActiveTab('simulator')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 text-slate-500 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">LEAKFINDER AI</span>
            <span>•</span>
            <span>AI Revenue Leak Detection & Action System</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center text-emerald-400">
              <Cpu className="w-3 h-3 mr-1" />
              NVIDIA Nemotron-70B Open-Source Model
            </span>
            <button
              onClick={() => setIsDefenseModalOpen(true)}
              className="text-slate-400 hover:text-white underline"
            >
              Judge Q&A Defense
            </button>
            <button
              onClick={() => setIsPitchModeOpen(true)}
              className="text-amber-400 hover:text-amber-300 underline font-semibold"
            >
              3-Min Demo Script
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: LEAK DETAIL SCREEN (Blueprint Page 5 & 6) */}
      <LeakDetailModal
        leak={selectedLeak}
        currency={currency}
        onClose={() => setSelectedLeak(null)}
        onOpenSimulatorForLeak={handleSimulateForLeak}
      />

      {/* MODAL 2: 3-MINUTE LIVE DEMO PITCH WIZARD (Page 7) */}
      {isPitchModeOpen && (
        <DemoPitchModal
          onClose={() => setIsPitchModeOpen(false)}
          onNavigateStep={handlePitchStepNavigate}
        />
      )}

      {/* MODAL 3: JUDGE DEFENSE & ARCHITECTURE (Page 8) */}
      {isDefenseModalOpen && (
        <JudgeDefenseModal onClose={() => setIsDefenseModalOpen(false)} />
      )}

      {/* MODAL 4: NVIDIA API SETTINGS & DIAGNOSTICS */}
      {isSettingsModalOpen && (
        <NvidiaSettingsModal
          onClose={() => setIsSettingsModalOpen(false)}
          customApiKey={customApiKey}
          onSaveCustomApiKey={(k) => {
            setCustomApiKey(k);
            showToast('NVIDIA API Key updated and proxied successfully.');
          }}
        />
      )}
    </div>
  );
}
