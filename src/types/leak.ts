export type LeakCategory = 'discount' | 'returns' | 'delivery' | 'pricing' | 'refunds';

export interface TransactionRecord {
  id: string;
  orderNumber: string;
  date: string;
  customerSegment: 'First-time' | 'Repeat' | 'VIP' | 'Guest';
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  grossAmount: number;
  discountAmount: number;
  discountCode?: string;
  cogs: number;
  deliveryCost: number;
  deliveryRegion: 'Tier-1 Metro' | 'Tier-2' | 'Tier-3 North' | 'Tier-3 South' | 'Remote';
  returnStatus: 'Kept' | 'Returned' | 'Refunded';
  returnReason?: string;
  netMargin: number;
  isFlaggedLeak: boolean;
  leakTypes: LeakCategory[];
}

export interface Hypothesis {
  hypothesis: string;
  plausibility: 'High' | 'Medium' | 'Low' | 'Very High';
  reason: string;
}

export interface NemotronReasoning {
  rootCause: string;
  confidence: number;
  structuredEvidence: string[];
  hypothesisComparison: Hypothesis[];
  strategicRecommendation: string;
  expectedMonthlyRecovery: number;
  implementationDifficulty: 'Immediate' | 'Easy' | 'Medium' | 'Complex';
  timeline: string;
  modelUsed?: string;
}

export interface LeakItem {
  id: string;
  category: LeakCategory;
  name: string;
  detectedAmount: number;
  severity: 'Critical' | 'High' | 'Medium';
  whatItMeans: string;
  affectedOrdersCount: number;
  sampleEvidence: string[];
  topAffectedItem: string;
  nemotronReasoning: NemotronReasoning;
}

export interface BusinessDataset {
  id: string;
  name: string;
  industry: string;
  description: string;
  currency: 'INR' | 'USD';
  currencySymbol: string;
  monthlyRevenue: number;
  estimatedProfit: number;
  potentialLeakage: number;
  transactionCount: number;
  dateRange: string;
  leaks: LeakItem[];
  transactions?: TransactionRecord[];
}

export interface SimulatorState {
  discountCapPercent: number; // e.g. 15%
  freeDeliveryThreshold: number; // e.g. 499
  returnPolicyStrictness: number; // 0 to 100%
  priceOptimizationPercent: number; // 0 to 15%
  preventCouponStacking: boolean;
  zoneDeliverySurcharge: boolean;
}
