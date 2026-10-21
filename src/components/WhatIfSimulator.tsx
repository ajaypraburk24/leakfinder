import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Tag,
  Truck,
  DollarSign,
  ArrowRight,
  Zap,
  CheckCircle2,
  BookmarkCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BusinessDataset, SimulatorState } from '../types/leak';
import { runWhatIfSimulation, formatCurrency, formatBlueprintBadge } from '../utils/analyticsEngine';

interface WhatIfSimulatorProps {
  dataset: BusinessDataset;
  currency: 'INR' | 'USD';
  onApplyToActionPlan: (recoverySummary: any) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  dataset,
  currency,
  onApplyToActionPlan,
}) => {
  // Simulator State
  const [state, setState] = useState<SimulatorState>({
    discountCapPercent: 15, // Cap discount at 15%
    freeDeliveryThreshold: 499, // ₹499 free shipping min
    returnPolicyStrictness: 65, // 65% sizing QA & return reduction
    priceOptimizationPercent: 12, // +12% on underpriced SKUs
    preventCouponStacking: true,
    zoneDeliverySurcharge: true,
  });

  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Run calculation dynamically
  const simulation = useMemo(() => {
    return runWhatIfSimulation(dataset, state);
  }, [dataset, state]);

  // Presets
  const applyPreset = (preset: 'blueprint' | 'aggressive' | 'balanced' | 'reset') => {
    if (preset === 'blueprint') {
      setState({
        discountCapPercent: 15,
        freeDeliveryThreshold: 499,
        returnPolicyStrictness: 65,
        priceOptimizationPercent: 12,
        preventCouponStacking: true,
        zoneDeliverySurcharge: true,
      });
    } else if (preset === 'aggressive') {
      setState({
        discountCapPercent: 10,
        freeDeliveryThreshold: 799,
        returnPolicyStrictness: 85,
        priceOptimizationPercent: 18,
        preventCouponStacking: true,
        zoneDeliverySurcharge: true,
      });
    } else if (preset === 'balanced') {
      setState({
        discountCapPercent: 20,
        freeDeliveryThreshold: 399,
        returnPolicyStrictness: 45,
        priceOptimizationPercent: 6,
        preventCouponStacking: true,
        zoneDeliverySurcharge: false,
      });
    } else {
      // Reset
      setState({
        discountCapPercent: 35,
        freeDeliveryThreshold: 0,
        returnPolicyStrictness: 0,
        priceOptimizationPercent: 0,
        preventCouponStacking: false,
        zoneDeliverySurcharge: false,
      });
    }

    // Trigger celebration confetti
    triggerCelebration();
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
    });
    setHasCelebrated(true);
  };

  return (
    <div className="space-y-6">
      {/* Visual Hook Header (Blueprint Page 4: "The What-if Simulator is the product's visual hook") */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Hackathon Blueprint 05 • What-If Simulator
              </span>
              <span className="text-xs text-slate-400">
                Move from "What happened?" to "What could happen if I change this?"
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Interactive Margin Recovery Simulator
            </h2>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Presets:</span>
            <button
              onClick={() => applyPreset('blueprint')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
            >
              ⭐ Blueprint Optimal
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              Aggressive Shield
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              Balanced Growth
            </button>
            <button
              onClick={() => applyPreset('reset')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Reset to baseline leaks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Projected Real-time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Controls & Sliders): 7 cols */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
              <Sliders className="w-4 h-4 mr-1.5 text-emerald-400" />
              Adjust Business Variables
            </h3>
            <span className="text-[11px] text-slate-400">
              Deterministic calculations without hallucinations
            </span>
          </div>

          {/* Slider 1: Promotional Discount Cap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                Cap Maximum Promo Discount
              </span>
              <span className="font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                {state.discountCapPercent}% Max
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={state.discountCapPercent}
              onChange={(e) =>
                setState((prev) => ({ ...prev, discountCapPercent: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Strict 5%</span>
              <span className="text-emerald-400 font-semibold">Blueprint Target: 15%</span>
              <span>Uncapped 35%</span>
            </div>
          </div>

          {/* Slider 2: Free Delivery Minimum Cart Value */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Free Shipping Order Floor
              </span>
              <span className="font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                {formatBlueprintBadge(state.freeDeliveryThreshold, currency)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="999"
              step="50"
              value={state.freeDeliveryThreshold}
              onChange={(e) =>
                setState((prev) => ({ ...prev, freeDeliveryThreshold: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹0 (Free for all)</span>
              <span className="text-cyan-400 font-semibold">Recommended: ₹499</span>
              <span>₹999 (High basket)</span>
            </div>
          </div>

          {/* Slider 3: Sizing QA & Return Policy Audit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Sizing QA & Return Defect Reduction
              </span>
              <span className="font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {state.returnPolicyStrictness}% Reduction
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={state.returnPolicyStrictness}
              onChange={(e) =>
                setState((prev) => ({ ...prev, returnPolicyStrictness: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (No change)</span>
              <span className="text-amber-400 font-semibold">Supplier Audit: ~65%</span>
              <span>100% (Zero defects)</span>
            </div>
          </div>

          {/* Slider 4: Price Adjustment on Underpriced SKUs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Optimize Price on Zero-Margin SKUs
              </span>
              <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                +{state.priceOptimizationPercent}% Reprice
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={state.priceOptimizationPercent}
              onChange={(e) =>
                setState((prev) => ({ ...prev, priceOptimizationPercent: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Hold price)</span>
              <span className="text-emerald-400 font-semibold">+12% (MSRP Alignment)</span>
              <span>+20% (Aggressive)</span>
            </div>
          </div>

          {/* Operational Policy Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={state.preventCouponStacking}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, preventCouponStacking: e.target.checked }))
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium leading-tight">
                Block Multi-Coupon & Point Stacking at Checkout
              </span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={state.zoneDeliverySurcharge}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, zoneDeliverySurcharge: e.target.checked }))
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium leading-tight">
                Route Tier-3 via Surface Couriers (₹49 Flat Surcharge)
              </span>
            </label>
          </div>
        </div>

        {/* Right Column (Live Projected Results & Impact): 5 cols */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1" />
              Projected Financial Impact
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">
              Live Recalculation
            </span>
          </div>

          {/* Big Number Recovery Spotlight */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center relative overflow-hidden">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Total Monthly Cash Recovered
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
              +{formatCurrency(simulation.recoveredTotal, currency)}
            </div>
            <div className="mt-2 flex items-center justify-center space-x-2 text-xs">
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                +{simulation.profitIncreasePercent}% Net Profit
              </span>
              <span className="text-slate-400">straight to bottom line</span>
            </div>
          </div>

          {/* Profit Comparison Before vs After */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Baseline Net Profit:</span>
              <span className="font-semibold text-slate-200">
                {formatCurrency(simulation.baselineProfit, currency)} ({simulation.oldProfitMarginPercent}% margin)
              </span>
            </div>
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>Simulated Net Profit:</span>
              <span>
                {formatCurrency(simulation.simulatedProfit, currency)} ({simulation.newProfitMarginPercent}% margin)
              </span>
            </div>

            {/* Visual Margin Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex mt-2">
              <div
                className="bg-slate-600 h-full"
                style={{ width: `${(simulation.baselineProfit / simulation.simulatedProfit) * 100}%` }}
                title="Baseline Profit"
              />
              <div
                className="bg-emerald-500 h-full animate-pulse"
                style={{
                  width: `${(simulation.recoveredTotal / simulation.simulatedProfit) * 100}%`,
                }}
                title="Recovered Profit"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Current Profit ({formatBlueprintBadge(simulation.baselineProfit, currency)})</span>
              <span className="text-emerald-400 font-semibold">
                + Recovered ({formatBlueprintBadge(simulation.recoveredTotal, currency)})
              </span>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recovery Breakdown by Lever
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Discounts</span>
                <span className="font-bold text-rose-400">
                  +{formatCurrency(simulation.categorySavings.discount, currency, true)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Returns</span>
                <span className="font-bold text-amber-400">
                  +{formatCurrency(simulation.categorySavings.returns, currency, true)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Delivery</span>
                <span className="font-bold text-cyan-400">
                  +{formatCurrency(simulation.categorySavings.delivery, currency, true)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Pricing</span>
                <span className="font-bold text-emerald-400">
                  +{formatCurrency(simulation.categorySavings.pricing, currency, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Apply To Action Plan Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                triggerCelebration();
                onApplyToActionPlan(simulation);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Apply Simulation to Executive Action Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
