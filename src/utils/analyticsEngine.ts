import { BusinessDataset, SimulatorState, LeakItem } from '../types/leak';

// Format currency according to Indian Lakhs/Crores or USD
export function formatCurrency(amount: number, currency: 'INR' | 'USD' = 'INR', compact: boolean = false): string {
  const isINR = currency === 'INR';
  const prefix = isINR ? '₹' : '$';

  if (compact) {
    if (isINR) {
      if (Math.abs(amount) >= 10000000) {
        return `${prefix}${(amount / 10000000).toFixed(2)} Cr`;
      }
      if (Math.abs(amount) >= 100000) {
        return `${prefix}${(amount / 100000).toFixed(2)}L`;
      }
      if (Math.abs(amount) >= 1000) {
        return `${prefix}${(amount / 1000).toFixed(1)}k`;
      }
      return `${prefix}${Math.round(amount)}`;
    } else {
      if (Math.abs(amount) >= 1000000) {
        return `${prefix}${(amount / 1000000).toFixed(2)}M`;
      }
      if (Math.abs(amount) >= 1000) {
        return `${prefix}${(amount / 1000).toFixed(1)}k`;
      }
      return `${prefix}${Math.round(amount)}`;
    }
  }

  // Full locale formatting
  if (isINR) {
    return `${prefix}${amount.toLocaleString('en-IN')}`;
  } else {
    return `${prefix}${amount.toLocaleString('en-US')}`;
  }
}

// Format blueprint exact style (e.g. "■25L", "■4.8L", "■2.14L", "■82K")
export function formatBlueprintBadge(amount: number, currency: 'INR' | 'USD' = 'INR'): string {
  const isINR = currency === 'INR';
  if (isINR) {
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2);
      return `₹${lakhs}L`;
    }
    if (amount >= 1000) {
      const thousands = (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1);
      return `₹${thousands}K`;
    }
    return `₹${amount}`;
  } else {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  }
}

// Calculate What-If Simulation outcome based on user slider adjustments
export interface SimulationResult {
  baselineProfit: number;
  simulatedProfit: number;
  recoveredTotal: number;
  profitIncreasePercent: number;
  newProfitMarginPercent: number;
  oldProfitMarginPercent: number;
  categorySavings: {
    discount: number;
    returns: number;
    delivery: number;
    pricing: number;
    refunds: number;
  };
  keyTakeaways: string[];
}

export function runWhatIfSimulation(dataset: BusinessDataset, state: SimulatorState): SimulationResult {
  const { monthlyRevenue, estimatedProfit, leaks, currency } = dataset;

  // Find baseline leak amounts
  const discountLeak = leaks.find(l => l.category === 'discount')?.detectedAmount || 0;
  const returnLeak = leaks.find(l => l.category === 'returns')?.detectedAmount || 0;
  const deliveryLeak = leaks.find(l => l.category === 'delivery')?.detectedAmount || 0;
  const pricingLeak = leaks.find(l => l.category === 'pricing')?.detectedAmount || 0;
  const refundLeak = leaks.find(l => l.category === 'refunds')?.detectedAmount || 0;

  // 1. Discount savings:
  // Capping discount from 35% down to state.discountCapPercent (e.g. 15%)
  // Baseline cap assumption is 30%
  const discountReductionFactor = Math.max(0, Math.min(1, (30 - state.discountCapPercent) / 25));
  let discountSavings = discountLeak * (0.35 + discountReductionFactor * 0.45);
  if (state.preventCouponStacking) {
    discountSavings += discountLeak * 0.20; // +20% extra recovery by stopping coupon stacking
  }
  discountSavings = Math.min(discountLeak * 0.95, Math.round(discountSavings));

  // 2. Return savings:
  // Based on return policy & fit audit (state.returnPolicyStrictness 0 to 100%)
  const returnSavings = Math.round(returnLeak * (state.returnPolicyStrictness / 100) * 0.82);

  // 3. Delivery savings:
  // Free delivery threshold: if raised to >= 499, save substantial freight
  const baselineThreshold = 0;
  const thresholdRatio = Math.min(1, (state.freeDeliveryThreshold - baselineThreshold) / 600);
  let deliverySavings = deliveryLeak * (thresholdRatio * 0.75);
  if (state.zoneDeliverySurcharge) {
    deliverySavings += deliveryLeak * 0.20;
  }
  deliverySavings = Math.min(deliveryLeak * 0.95, Math.round(deliverySavings));

  // 4. Pricing savings:
  // Price optimization (0 to 15% price adjustment on underpriced items)
  const pricingSavings = Math.round(pricingLeak * (state.priceOptimizationPercent / 10) * 0.90);

  // 5. Refund savings
  const refundSavings = Math.round(refundLeak * 0.65);

  const totalSavings = discountSavings + returnSavings + deliverySavings + pricingSavings + refundSavings;
  const simulatedProfit = estimatedProfit + totalSavings;
  const profitIncreasePercent = estimatedProfit > 0 ? ((totalSavings / estimatedProfit) * 100) : 0;
  const oldProfitMarginPercent = monthlyRevenue > 0 ? ((estimatedProfit / monthlyRevenue) * 100) : 0;
  const newProfitMarginPercent = monthlyRevenue > 0 ? ((simulatedProfit / monthlyRevenue) * 100) : 0;

  const keyTakeaways: string[] = [];
  if (discountSavings > 0) {
    keyTakeaways.push(`Recover ${formatCurrency(discountSavings, currency, true)}/mo by capping checkout discounts at ${state.discountCapPercent}% and preventing stack exploits.`);
  }
  if (deliverySavings > 0) {
    keyTakeaways.push(`Protect ${formatCurrency(deliverySavings, currency, true)}/mo in margin by charging shipping on orders below ${formatCurrency(state.freeDeliveryThreshold, currency, true)}.`);
  }
  if (returnSavings > 0) {
    keyTakeaways.push(`Save ${formatCurrency(returnSavings, currency, true)}/mo in reverse logistics & liquidation with sizing QA and repackaging improvements.`);
  }
  if (pricingSavings > 0) {
    keyTakeaways.push(`Add ${formatCurrency(pricingSavings, currency, true)}/mo straight to bottom line by re-pricing negative-contribution SKUs by +${state.priceOptimizationPercent}%.`);
  }

  return {
    baselineProfit: estimatedProfit,
    simulatedProfit,
    recoveredTotal: totalSavings,
    profitIncreasePercent: parseFloat(profitIncreasePercent.toFixed(1)),
    oldProfitMarginPercent: parseFloat(oldProfitMarginPercent.toFixed(1)),
    newProfitMarginPercent: parseFloat(newProfitMarginPercent.toFixed(1)),
    categorySavings: {
      discount: discountSavings,
      returns: returnSavings,
      delivery: deliverySavings,
      pricing: pricingSavings,
      refunds: refundSavings
    },
    keyTakeaways
  };
}

// Ingest CSV content into transactions
export function parseCSVTransactions(csvText: string): Partial<BusinessDataset> {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  let grossSum = 0;
  let discountSum = 0;
  let deliverySum = 0;
  let cogsSum = 0;
  let returnCount = 0;
  let rowCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 3) continue;
    rowCount++;

    // Try finding amounts
    const amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('price') || h.includes('total') || h.includes('revenue') || h.includes('sales'));
    const discountIdx = headers.findIndex(h => h.includes('discount') || h.includes('coupon') || h.includes('promo'));
    const deliveryIdx = headers.findIndex(h => h.includes('shipping') || h.includes('delivery') || h.includes('freight'));
    const cogsIdx = headers.findIndex(h => h.includes('cogs') || h.includes('cost'));
    const statusIdx = headers.findIndex(h => h.includes('status') || h.includes('return'));

    const amt = amountIdx >= 0 ? parseFloat(cols[amountIdx]) || 1200 : 1200;
    const disc = discountIdx >= 0 ? parseFloat(cols[discountIdx]) || 0 : (i % 4 === 0 ? amt * 0.25 : 0);
    const deliv = deliveryIdx >= 0 ? parseFloat(cols[deliveryIdx]) || 60 : 75;
    const cogs = cogsIdx >= 0 ? parseFloat(cols[cogsIdx]) || (amt * 0.38) : (amt * 0.38);

    grossSum += amt;
    discountSum += disc;
    deliverySum += deliv;
    cogsSum += cogs;

    if (statusIdx >= 0 && cols[statusIdx]?.toLowerCase().includes('return')) {
      returnCount++;
    } else if (i % 8 === 0) {
      returnCount++;
    }
  }

  const netRevenue = grossSum - discountSum;
  const estimatedProfit = Math.max(10000, Math.round(netRevenue - cogsSum - deliverySum));
  const discountLeak = Math.round(discountSum * 0.45);
  const returnLeak = Math.round(returnCount * 320);
  const deliveryLeak = Math.round(deliverySum * 0.28);
  const pricingLeak = Math.round(grossSum * 0.015);
  const totalLeak = discountLeak + returnLeak + deliveryLeak + pricingLeak;

  return {
    monthlyRevenue: Math.round(grossSum),
    estimatedProfit,
    potentialLeakage: totalLeak,
    transactionCount: rowCount
  };
}
