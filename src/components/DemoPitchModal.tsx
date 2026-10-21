import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface DemoPitchModalProps {
  onClose: () => void;
  onNavigateStep: (stepId: number) => void;
}

interface PitchStep {
  id: number;
  timeRange: string;
  phase: string;
  title: string;
  actionText: string;
  spokenScript: string;
  uiTarget: string;
}

export const DemoPitchModal: React.FC<DemoPitchModalProps> = ({
  onClose,
  onNavigateStep,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const steps: PitchStep[] = [
    {
      id: 0,
      timeRange: '00:00 – 00:20',
      phase: 'HOOK',
      title: 'Show Top-Line Revenue & Pose the Problem',
      actionText: 'Display the ₹25L Monthly Revenue metric and pose the core question.',
      spokenScript:
        '"Judges, businesses can have strong top-line sales like ₹25 Lakhs a month, yet wonder why profits feel thin. The problem is: revenue is not the same as profit. Where is the money actually leaking?"',
      uiTarget: 'dashboard',
    },
    {
      id: 1,
      timeRange: '00:20 – 00:40',
      phase: 'SCAN',
      title: 'Upload Data & Start LeakFinder AI',
      actionText: 'Switch to Revenue Leak Scanner and trigger multi-source ingestion.',
      spokenScript:
        '"LeakFinder AI connects scattered business data — orders, discounts, refunds, shipping, and COGS — into a unified detection engine."',
      uiTarget: 'scanner',
    },
    {
      id: 2,
      timeRange: '00:40 – 01:10',
      phase: 'DETECT',
      title: 'Show Headline: ₹2.14L Potential Leakage',
      actionText: 'Highlight the red leakage badge and the 4 leak categories.',
      spokenScript:
        '"In seconds, LeakFinder uncovers the headline: ₹2.14 Lakhs of potential leakage — that is nearly 45% of our net profit silently draining across discounts, returns, logistics, and pricing."',
      uiTarget: 'leaks',
    },
    {
      id: 3,
      timeRange: '01:10 – 01:50',
      phase: 'EXPLAIN',
      title: 'NVIDIA Nemotron AI Reasoning on Largest Leak',
      actionText: 'Open the Discount Leak (₹82K) and show the hypothesis comparison table.',
      spokenScript:
        '"Why did this happen? Instead of leaving the owner to guess, our NVIDIA Nemotron reasoning layer evaluates structured evidence, eliminates competing hypotheses, and proves an unauthenticated coupon SUMMER30 was stacked with welcome points."',
      uiTarget: 'explain-discount',
    },
    {
      id: 4,
      timeRange: '01:50 – 02:20',
      phase: 'ACT',
      title: 'Generate Recommended Business Action Plan',
      actionText: 'Open 30-Day Recovery Roadmap with assigned owners and timelines.',
      spokenScript:
        '"LeakFinder doesn’t stop at analytics. It converts diagnoses into a 4-week prioritized roadmap with specific operational owners and expected cash return."',
      uiTarget: 'action-plan',
    },
    {
      id: 5,
      timeRange: '02:20 – 02:45',
      phase: 'SIMULATE',
      title: 'Visual Hook: What-If Simulator',
      actionText: 'Adjust the discount cap slider and delivery floor to show +₹1.48L recovery.',
      spokenScript:
        '"The What-if Simulator lets the owner test what happens next. When we cap discounts at 15% and enforce a ₹499 shipping floor, we instantly see a projected profit recovery of +₹1.48 Lakhs per month."',
      uiTarget: 'simulator',
    },
    {
      id: 6,
      timeRange: '02:45 – 03:00',
      phase: 'CLOSE',
      title: 'Deliver the One-Line Value Proposition',
      actionText: 'Display the final summary and conclude the pitch cleanly.',
      spokenScript:
        '"LeakFinder doesn\'t just tell businesses what happened. It identifies where money is leaking, explains why, and helps them decide what to do next. Thank you."',
      uiTarget: 'dashboard',
    },
  ];

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= 180) {
            setIsRunning(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const currentStep = steps[activeStepIndex];

  const handleStepSelect = (index: number) => {
    setActiveStepIndex(index);
    onNavigateStep(index);
  };

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      handleStepSelect(activeStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      handleStepSelect(activeStepIndex - 1);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center">
                <span>The 3-Minute Hackathon Demo Story</span>
                <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  Page 7 Script
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual, fast, and controlled demonstration flow
              </p>
            </div>
          </div>

          {/* Stopwatch */}
          <div className="flex items-center space-x-2">
            <div className="font-mono text-base font-black px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
              {formatTimer(timerSeconds)} <span className="text-xs text-slate-500">/ 03:00</span>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title={isRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleStepSelect(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-all ${
                idx === activeStepIndex
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : idx < activeStepIndex
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.phase} ({s.timeRange.split('–')[0].trim()})
            </button>
          ))}
        </div>

        {/* Current Step Cue Card */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              Phase {activeStepIndex + 1} of 7: {currentStep.phase} ({currentStep.timeRange})
            </span>
            <button
              onClick={() => onNavigateStep(activeStepIndex)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Auto-Navigate UI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h4 className="text-lg font-black text-white">{currentStep.title}</h4>
            <div className="mt-1 text-xs text-slate-400 flex items-center space-x-1.5">
              <span className="font-semibold text-slate-300">Action on screen:</span>
              <span>{currentStep.actionText}</span>
            </div>
          </div>

          {/* Teleprompter Script Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              Presenter Pitch Script (Say this clearly):
            </span>
            <p className="text-sm font-medium text-slate-100 italic leading-relaxed">
              {currentStep.spokenScript}
            </p>
          </div>

          {/* Blueprint Demo Rule Callout */}
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>
              <strong>Blueprint Rule:</strong> Use prepared data, keep every click intentional, and show the AI reasoning and business action — not just the dashboard.
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={activeStepIndex === 0}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-500">
            Step {activeStepIndex + 1} of {steps.length}
          </div>

          {activeStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-1 shadow-md shadow-amber-500/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Finish Demo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
