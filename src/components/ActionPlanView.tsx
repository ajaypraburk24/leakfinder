import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Share2,
  User,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  Tag,
  Truck,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { BusinessDataset } from '../types/leak';
import { formatCurrency, formatBlueprintBadge } from '../utils/analyticsEngine';

interface ActionPlanProps {
  dataset: BusinessDataset;
  currency: 'INR' | 'USD';
  onNavigateToSimulator: () => void;
}

interface ActionTask {
  id: string;
  week: number;
  category: string;
  title: string;
  description: string;
  owner: string;
  difficulty: 'Immediate' | 'Easy' | 'Medium';
  expectedRecovery: number;
  completed: boolean;
  priority: 'Critical' | 'High' | 'Medium';
}

export const ActionPlanView: React.FC<ActionPlanProps> = ({
  dataset,
  currency,
  onNavigateToSimulator,
}) => {
  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState<ActionTask[]>([
    {
      id: 'task-1',
      week: 1,
      category: 'Discount',
      title: 'Cap Checkout Promo Codes at 15% & Disable Coupon Stacking',
      description: 'Update cart rules in Shopify/WooCommerce so promo codes cannot be combined with welcome points or loyalty credit.',
      owner: 'Lead Frontend / eCommerce Dev',
      difficulty: 'Immediate',
      expectedRecovery: 59000,
      completed: false,
      priority: 'Critical',
    },
    {
      id: 'task-2',
      week: 1,
      category: 'Pricing',
      title: 'Reprice SKU-305 (Canvas Tote) from ₹399 to ₹479',
      description: 'Absorb raw cotton material price hikes. Relegate SKU-305 from standalone paid ads to high-margin checkout add-on.',
      owner: 'Merchandising & Pricing Lead',
      difficulty: 'Immediate',
      expectedRecovery: 28000,
      completed: false,
      priority: 'High',
    },
    {
      id: 'task-3',
      week: 2,
      category: 'Delivery',
      title: 'Enforce ₹499 Free Shipping Floor & ₹49 Tier-3 Surface Fee',
      description: 'Stop subsidizing free delivery on single sub-₹499 items. Integrate dynamic rate shopper for Delhivery/Bluedart.',
      owner: 'Logistics & 3PL Manager',
      difficulty: 'Easy',
      expectedRecovery: 33000,
      completed: false,
      priority: 'Critical',
    },
    {
      id: 'task-4',
      week: 2,
      category: 'Returns',
      title: 'Deploy "Runs Small — Size Up" Alert on SKU-104',
      description: 'Add prominent sizing badge and interactive sizing calculator on product pages for Batch 2026B inventory.',
      owner: 'UI/UX & Product Merchandiser',
      difficulty: 'Easy',
      expectedRecovery: 24000,
      completed: false,
      priority: 'High',
    },
    {
      id: 'task-5',
      week: 3,
      category: 'Returns',
      title: 'Supplier Batch 2026B Sizing Audit & ₹35k Credit Claim',
      description: 'Present manufacturer with dimensional variance report and claim credit note against future production orders.',
      owner: 'Sourcing & Vendor Relations',
      difficulty: 'Medium',
      expectedRecovery: 14000,
      completed: false,
      priority: 'Medium',
    },
    {
      id: 'task-6',
      week: 4,
      category: 'AI Guardrail',
      title: 'Automate NVIDIA Nemotron Weekly Leak Audits',
      description: 'Set up automated background transaction ingestion to catch new coupon leaks or carrier overcharges in under 24 hours.',
      owner: 'Operations Head',
      difficulty: 'Medium',
      expectedRecovery: 10000,
      completed: false,
      priority: 'Medium',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const totalRecoveryTarget = tasks.reduce((acc, t) => acc + t.expectedRecovery, 0);
  const completedRecovery = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.expectedRecovery, 0);
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleCopyBrief = () => {
    const brief = `LEAKFINDER AI — EXECUTIVE RECOVERY ROADMAP
Target Recovery: ${formatCurrency(totalRecoveryTarget, currency)}/month
Realized Profit Growth: +${((totalRecoveryTarget / dataset.estimatedProfit) * 100).toFixed(1)}%

Week 1 Actions:
1. Cap Checkout Promo Codes at 15% & Disable Coupon Stacking (+${formatCurrency(59000, currency)}/mo)
2. Reprice SKU-305 (Canvas Tote) from ₹399 to ₹479 (+${formatCurrency(28000, currency)}/mo)

Week 2 Actions:
3. Enforce ₹499 Free Shipping Floor & ₹49 Tier-3 Surface Fee (+${formatCurrency(33000, currency)}/mo)
4. Deploy "Runs Small — Size Up" Alert on SKU-104 (+${formatCurrency(24000, currency)}/mo)

Week 3 & 4 Actions:
5. Supplier Batch 2026B Sizing Audit & Credit Claim (+${formatCurrency(14000, currency)}/mo)
6. Automated Weekly NVIDIA Nemotron Leak Guardrails (+${formatCurrency(10000, currency)}/mo)`;

    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Hackathon Blueprint 04 • Action Plan
              </span>
              <span className="text-xs text-slate-400">
                Turn findings into clear recommendations instead of stopping at analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              30-Day Executive Revenue Recovery Roadmap
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyBrief}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Brief!' : 'Copy Brief'}</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate ROI</span>
            </button>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">
              Target Monthly Recovery
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              +{formatCurrency(totalRecoveryTarget, currency)}
            </div>
            <span className="text-[11px] text-slate-400">
              +{((totalRecoveryTarget / dataset.estimatedProfit) * 100).toFixed(1)}% profit expansion
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">
              Tasks Executed
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {completedCount} / {tasks.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              {Math.round((completedCount / tasks.length) * 100)}% implemented
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">
              Realized Cash Recaptured
            </span>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">
              +{formatCurrency(completedRecovery, currency)}
            </div>
            <span className="text-[11px] text-slate-400">
              verified across updated transaction rules
            </span>
          </div>
        </div>
      </div>

      {/* Task List Organised by Week */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((weekNum) => {
          const weekTasks = tasks.filter((t) => t.week === weekNum);
          if (weekTasks.length === 0) return null;

          const weekTitles: Record<number, string> = {
            1: 'Week 1: Immediate Checkout & Pricing Quick Wins (+₹87,000 / mo)',
            2: 'Week 2: Logistics Thresholds & Sizing Friction Reduction (+₹57,000 / mo)',
            3: 'Week 3: Supplier Sizing Claims & Courier Rate Shopping (+₹14,000 / mo)',
            4: 'Week 4: Permanent AI Guardrails & Continuous Ingestion (+₹10,000 / mo)',
          };

          return (
            <div key={weekNum} className="space-y-2">
              <div className="flex items-center space-x-2 px-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {weekTitles[weekNum]}
                </h3>
              </div>

              <div className="space-y-2">
                {weekTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-bold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded font-semibold border ${
                              task.priority === 'Critical'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-slate-500" />
                            {task.owner}
                          </span>
                          <span>•</span>
                          <span>Difficulty: {task.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-[11px] text-slate-400">Expected Recovery</div>
                      <div className="text-sm font-black text-emerald-400">
                        +{formatCurrency(task.expectedRecovery, currency)}/mo
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
