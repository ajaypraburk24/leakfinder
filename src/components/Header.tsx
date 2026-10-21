import React, { useState } from 'react';
import { Sparkles, Cpu, PlayCircle, ShieldCheck, Settings, Database, ArrowUpRight, DollarSign } from 'lucide-react';
import { BusinessDataset } from '../types/leak';

interface HeaderProps {
  currentDataset: BusinessDataset;
  allDatasets: BusinessDataset[];
  onSelectDataset: (dataset: BusinessDataset) => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: (currency: 'INR' | 'USD') => void;
  onOpenPitchMode: () => void;
  onOpenDefenseModal: () => void;
  onOpenSettingsModal: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDataset,
  allDatasets,
  onSelectDataset,
  currency,
  onToggleCurrency,
  onOpenPitchMode,
  onOpenDefenseModal,
  onOpenSettingsModal,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  LEAKFINDER AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Cpu className="w-3 h-3 mr-1" /> NVIDIA Nemotron
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                AI Revenue Leak Detection & Action System
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dataset Switcher */}
            <div className="relative hidden lg:flex items-center">
              <Database className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                aria-label="Select Dataset"
                value={currentDataset.id}
                onChange={(e) => {
                  const found = allDatasets.find((d) => d.id === e.target.value);
                  if (found) onSelectDataset(found);
                }}
                className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-xs text-slate-200 pl-8 pr-7 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none appearance-none cursor-pointer"
              >
                {allDatasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => onToggleCurrency('INR')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  currency === 'INR'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Indian Rupees (Lakhs / Crores)"
              >
                ₹ INR
              </button>
              <button
                onClick={() => onToggleCurrency('USD')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  currency === 'USD'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="US Dollars ($)"
              >
                $ USD
              </button>
            </div>

            {/* 3-Minute Live Demo Pitch Button (Hackathon Blueprint Page 7) */}
            <button
              onClick={onOpenPitchMode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Launch guided 3-minute hackathon pitch flow from blueprint"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3-Min Pitch Mode</span>
              <span className="sm:hidden">Pitch</span>
            </button>

            {/* Hackathon Defense & Architecture (Page 8) */}
            <button
              onClick={onOpenDefenseModal}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-600 hover:text-white transition-colors"
              title="Judge Q&A & Technical Defense Architecture"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Judge Q&A</span>
            </button>

            {/* NVIDIA API Settings Modal */}
            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors"
              title="NVIDIA API Key & Model Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (The Core Product Loop) */}
        <div className="flex space-x-1 border-t border-slate-800/80 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'dashboard', label: '01. Executive Dashboard', badge: 'Blueprint' },
            { id: 'scanner', label: '02. Revenue Leak Scanner', badge: 'Data' },
            { id: 'leaks', label: '03. Detected Leaks', badge: `${currentDataset.leaks.length} Found` },
            { id: 'simulator', label: '04. What-if Simulator', badge: 'Visual Hook', highlight: true },
            { id: 'action-plan', label: '05. Action Plan', badge: 'SOPs' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? tab.highlight
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                      : 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive && tab.highlight
                        ? 'bg-emerald-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
