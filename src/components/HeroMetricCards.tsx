import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';
import { BusinessDataset } from '../types/leak';
import { formatCurrency, formatBlueprintBadge } from '../utils/analyticsEngine';

interface HeroMetricCardsProps {
  dataset: BusinessDataset;
  currency: 'INR' | 'USD';
  onNavigateToSimulator: () => void;
  onNavigateToLeaks: () => void;
}

export const HeroMetricCards: React.FC<HeroMetricCardsProps> = ({
  dataset,
  currency,
  onNavigateToSimulator,
  onNavigateToLeaks,
}) => {
  const { monthlyRevenue, estimatedProfit, potentialLeakage, leaks } = dataset;
  
  const profitMargin = monthlyRevenue > 0 ? ((estimatedProfit / monthlyRevenue) * 100).toFixed(1) : '0';
  const leakageRatioOfProfit = estimatedProfit > 0 ? ((potentialLeakage / estimatedProfit) * 100).toFixed(1) : '0';
  const totalPotentialProfit = estimatedProfit + potentialLeakage;

  return (
    <div className="space-y-4">
      {/* Blueprint Benchmark Cards (Page 5: ■25L Monthly revenue | ■4.8L Estimated profit | ■2.14L Potential leakage) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Monthly Revenue */}
        <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Monthly Revenue
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Gross Volume
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              <span className="inline-block w-3.5 h-3.5 bg-blue-500 mr-2 rounded-sm align-middle mb-1"></span>
              {formatBlueprintBadge(monthlyRevenue, currency)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatCurrency(monthlyRevenue, currency)})
            </span>
          </div>

          <div className="mt-3 flex items-center text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400 mr-1" />
            <span>High top-line volume across 3,840+ customer orders</span>
          </div>
        </div>

        {/* Card 2: Estimated Profit */}
        <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estimated Profit
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {profitMargin}% Net Margin
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400">
              <span className="inline-block w-3.5 h-3.5 bg-emerald-500 mr-2 rounded-sm align-middle mb-1"></span>
              {formatBlueprintBadge(estimatedProfit, currency)}
            </span>
            <span className="text-xs text-slate-400">
              ({formatCurrency(estimatedProfit, currency)})
            </span>
          </div>

          <div className="mt-3 flex items-center text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <span>Actual realized earnings after COGS & direct fulfillment</span>
          </div>
        </div>

        {/* Card 3: Potential Leakage */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900 border border-rose-900/40 rounded-2xl p-5 shadow-lg shadow-rose-950/20 hover:border-rose-700/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400 animate-pulse" />
              Potential Leakage
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
              {leakageRatioOfProfit}% Profit At Risk!
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-rose-400">
              <span className="inline-block w-3.5 h-3.5 bg-rose-500 mr-2 rounded-sm align-middle mb-1"></span>
              {formatBlueprintBadge(potentialLeakage, currency)}
            </span>
            <span className="text-xs text-rose-300/80">
              ({formatCurrency(potentialLeakage, currency)})
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-rose-300 font-medium">
              Across {leaks.length} core operational failure modes
            </span>
            <button
              onClick={onNavigateToLeaks}
              className="text-rose-400 hover:text-rose-200 underline flex items-center"
            >
              Inspect Leaks <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Margin Erosion Callout & Profit Bridge */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3 max-w-2xl">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center">
              <span>The Revenue Illusion: High Sales Hiding Hidden Drain</span>
              <span className="ml-2 text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Hackathon Blueprint 01 • The Problem
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              For every {formatBlueprintBadge(estimatedProfit, currency)} in profit earned, an additional{' '}
              <strong className="text-rose-400 font-semibold">{formatBlueprintBadge(potentialLeakage, currency)}</strong> slips away through coupon stacking, sizing returns, free-delivery thresholds, and stale SKU pricing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={onNavigateToSimulator}
            className="w-full md:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch What-if Simulator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
