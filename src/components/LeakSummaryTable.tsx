import React from 'react';
import { Tag, RotateCcw, Truck, DollarSign, AlertCircle, ArrowRight, BrainCircuit, Sliders, ChevronRight } from 'lucide-react';
import { LeakItem, LeakCategory } from '../types/leak';
import { formatBlueprintBadge, formatCurrency } from '../utils/analyticsEngine';

interface LeakSummaryTableProps {
  leaks: LeakItem[];
  currency: 'INR' | 'USD';
  onSelectLeak: (leak: LeakItem) => void;
  onSimulateLeak: (leak: LeakItem) => void;
  selectedLeakId?: string;
}

export const LeakSummaryTable: React.FC<LeakSummaryTableProps> = ({
  leaks,
  currency,
  onSelectLeak,
  onSimulateLeak,
  selectedLeakId,
}) => {
  const getCategoryIcon = (cat: LeakCategory) => {
    switch (cat) {
      case 'discount':
        return <Tag className="w-4 h-4 text-rose-400" />;
      case 'returns':
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
      case 'delivery':
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'pricing':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: LeakCategory) => {
    switch (cat) {
      case 'discount':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'returns':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'delivery':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'pricing':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const totalLeakAmount = leaks.reduce((acc, l) => acc + l.detectedAmount, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Header / Subtitle */}
      <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/60">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-ping" />
            Detected Revenue Leaks Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured business anomaly findings categorized across operational drivers
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          Total Exposure:{' '}
          <span className="text-rose-400 font-bold ml-1">
            {formatBlueprintBadge(totalLeakAmount, currency)} ({formatCurrency(totalLeakAmount, currency)})
          </span>
        </div>
      </div>

      {/* Main Table Matching Blueprint Page 5 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                LEAK TYPE
              </th>
              <th scope="col" className="px-4 py-3.5">
                DETECTED
              </th>
              <th scope="col" className="px-4 py-3.5">
                SHARE
              </th>
              <th scope="col" className="px-5 py-3.5">
                WHAT IT MEANS
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leaks.map((leak) => {
              const sharePercent = totalLeakAmount > 0 ? ((leak.detectedAmount / totalLeakAmount) * 100).toFixed(0) : '0';
              const isSelected = selectedLeakId === leak.id;

              return (
                <tr
                  key={leak.id}
                  onClick={() => onSelectLeak(leak)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Column 1: Leak Type */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:border-slate-600 transition-colors">
                        {getCategoryIcon(leak.category)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 capitalize text-sm group-hover:text-emerald-300 transition-colors flex items-center">
                          {leak.category}
                          <span
                            className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded border capitalize ${getCategoryBadgeClass(
                              leak.category
                            )}`}
                          >
                            {leak.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {leak.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Detected (Page 5: ■82K, ■56K, ■41K, ■35.5K) */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center font-black text-sm text-slate-100 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      <span className="w-2.5 h-2.5 bg-rose-500 mr-2 rounded-xs"></span>
                      <span>{formatBlueprintBadge(leak.detectedAmount, currency)}</span>
                    </div>
                  </td>

                  {/* Column 3: Share of Leakage */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{sharePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${sharePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Column 4: What It Means (Page 5 exact text) */}
                  <td className="px-5 py-4">
                    <p className="text-slate-300 font-medium leading-relaxed max-w-md">
                      {leak.whatItMeans}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      Primary impact: <span className="text-slate-300">{leak.topAffectedItem}</span>
                    </p>
                  </td>

                  {/* Column 5: Action Buttons */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLeak(leak);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                        title="View NVIDIA Nemotron structured evidence and root cause"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 mr-1" />
                        <span>AI Explain</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSimulateLeak(leak);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                        title="Open in What-If Simulator"
                      >
                        <Sliders className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span>Simulate</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
