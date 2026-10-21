import { BusinessDataset, TransactionRecord, LeakItem } from '../types/leak';

// Generate realistic transactions for the official Blueprint Dataset
function generateBlueprintTransactions(): TransactionRecord[] {
  const transactions: TransactionRecord[] = [];
  const skus = [
    { sku: 'SKU-104', name: 'Premium Linen Shirt', category: 'Apparel', basePrice: 1299, cogs: 480 },
    { sku: 'SKU-202', name: 'Slim Chino Trousers', category: 'Apparel', basePrice: 1599, cogs: 620 },
    { sku: 'SKU-305', name: 'Canvas Everyday Tote', category: 'Accessories', basePrice: 399, cogs: 230 },
    { sku: 'SKU-401', name: 'Supima Cotton Crewneck', category: 'Apparel', basePrice: 799, cogs: 290 },
    { sku: 'SKU-506', name: 'Handcrafted Leather Belt', category: 'Accessories', basePrice: 899, cogs: 340 },
    { sku: 'SKU-612', name: 'Merino Wool Pullover', category: 'Winterwear', basePrice: 2499, cogs: 980 },
  ];

  const regions: ('Tier-1 Metro' | 'Tier-2' | 'Tier-3 North' | 'Tier-3 South' | 'Remote')[] = [
    'Tier-1 Metro', 'Tier-1 Metro', 'Tier-2', 'Tier-3 North', 'Tier-3 South'
  ];

  const customerSegments: ('First-time' | 'Repeat' | 'VIP' | 'Guest')[] = [
    'First-time', 'Repeat', 'VIP', 'Repeat', 'First-time'
  ];

  // Specific seeds to produce realistic patterns
  for (let i = 1; i <= 120; i++) {
    const skuObj = skus[i % skus.length];
    const qty = (i % 5 === 0) ? 2 : 1;
    const grossAmount = skuObj.basePrice * qty;
    let discountAmount = 0;
    let discountCode: string | undefined = undefined;
    let returnStatus: 'Kept' | 'Returned' | 'Refunded' = 'Kept';
    let returnReason: string | undefined = undefined;
    const region = regions[i % regions.length];
    
    // Region shipping cost
    let deliveryCost = region === 'Tier-1 Metro' ? 45 : region === 'Tier-2' ? 70 : 135;
    const isLeakFlagged: LeakItem['category'][] = [];

    // Simulate Discount Leak (heavy coupon usage on SKU-104 & SKU-401)
    if (i % 3 === 0) {
      discountCode = 'SUMMER30';
      discountAmount = Math.round(grossAmount * 0.32); // 30% promo + stack
      isLeakFlagged.push('discount');
    } else if (i % 7 === 0) {
      discountCode = 'VIPFLAT500';
      discountAmount = 500;
      isLeakFlagged.push('discount');
    }

    // Simulate Return Leak (heavy return rate on SKU-104 sizing issue)
    if (skuObj.sku === 'SKU-104' && (i % 2 === 0 || i % 5 === 0)) {
      returnStatus = 'Returned';
      returnReason = 'Runs small in chest (Batch 2026B)';
      deliveryCost += 180; // reverse shipping cost
      isLeakFlagged.push('returns');
    } else if (i % 14 === 0) {
      returnStatus = 'Returned';
      returnReason = 'Fabric crease/stitching issue';
      deliveryCost += 160;
      isLeakFlagged.push('returns');
    }

    // Simulate Delivery Leak (free delivery on cheap tote bag SKU-305 to Tier-3)
    if (skuObj.sku === 'SKU-305' && (region === 'Tier-3 North' || region === 'Tier-3 South')) {
      deliveryCost = 145; // exceeds item margin
      isLeakFlagged.push('delivery');
    }

    // Simulate Pricing Leak (SKU-305 base price 399 - cogs 230 - ad CAC 180 = negative)
    if (skuObj.sku === 'SKU-305' && discountAmount > 50) {
      isLeakFlagged.push('pricing');
    }

    const totalCogs = skuObj.cogs * qty;
    const netRevenue = grossAmount - discountAmount;
    const netMargin = returnStatus === 'Returned' 
      ? -(deliveryCost + 95) // reverse shipping + inspection loss
      : (netRevenue - totalCogs - deliveryCost);

    transactions.push({
      id: `TXN-${10000 + i}`,
      orderNumber: `ORD-2026-${String(i).padStart(4, '0')}`,
      date: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
      customerSegment: customerSegments[i % customerSegments.length],
      sku: skuObj.sku,
      productName: skuObj.name,
      category: skuObj.category,
      quantity: qty,
      grossAmount,
      discountAmount,
      discountCode,
      cogs: totalCogs,
      deliveryCost,
      deliveryRegion: region,
      returnStatus,
      returnReason,
      netMargin,
      isFlaggedLeak: isLeakFlagged.length > 0,
      leakTypes: isLeakFlagged
    });
  }

  return transactions;
}

// Blueprint Dataset matching Page 5 of the Hackathon Blueprint PDF exactly
export const BLUEPRINT_DATASET: BusinessDataset = {
  id: 'blueprint-d2c',
  name: 'AuraStyle D2C Apparel & Lifestyle (Blueprint Case)',
  industry: 'D2C Fashion & Apparel',
  description: 'Official benchmark dataset from Hackathon Blueprint: Strong monthly revenue of ₹25L but ₹2.14L is quietly leaking.',
  currency: 'INR',
  currencySymbol: '₹',
  monthlyRevenue: 2500000, // 25L
  estimatedProfit: 480000,  // 4.8L (19.2%)
  potentialLeakage: 214500, // 2.14L (44.5% of net profit leaking!)
  transactionCount: 3840,
  dateRange: 'Past 30 Days (Oct 2026)',
  transactions: generateBlueprintTransactions(),
  leaks: [
    {
      id: 'leak-discount',
      category: 'discount',
      name: 'Discount Exposure Leak',
      detectedAmount: 82000, // 82K
      severity: 'Critical',
      whatItMeans: 'Discount exposure may be reducing contribution margin to unsustainable levels.',
      affectedOrdersCount: 410,
      sampleEvidence: [
        '38.4% of checkout carts stacked promo code SUMMER30 with loyalty points',
        'SKU-104 contribution margin dropped from 42% down to 8.3%',
        '284 transactions produced negative net contribution after fulfillment'
      ],
      topAffectedItem: 'SKU-104 (Premium Linen Shirt) & Promo Code SUMMER30',
      nemotronReasoning: {
        rootCause: 'Unrestricted promo code SUMMER30 leaked to voucher sites and stacked with first-order welcome credit',
        confidence: 0.94,
        structuredEvidence: [
          'Affiliate promo code SUMMER30 was used in 62% of discounted orders without referral parameter validation',
          'Cart engine allows combining 30% percentage coupon with fixed ₹100 signup credit',
          'Contribution margin on discounted orders plummeted from 42.1% to 8.3%'
        ],
        hypothesisComparison: [
          { hypothesis: 'General customer price resistance', plausibility: 'Low', reason: 'Full-price conversion remained steady at 3.1% in non-promotional periods.' },
          { hypothesis: 'Voucher aggregator leak + multi-coupon stacking loophole', plausibility: 'Very High', reason: 'Direct traffic checkouts using SUMMER30 increased by 410% without attribution.' },
          { hypothesis: 'Dynamic repricing rule conflict', plausibility: 'Medium', reason: 'Automated seasonal flash sale lowered base list price prior to coupon application.' }
        ],
        strategicRecommendation: 'Cap max discount at 18%, disable multi-coupon stacking in cart checkout, and restrict SUMMER30 to verified first-order newsletter subscribers with a minimum order value of ₹799.',
        expectedMonthlyRecovery: 59000,
        implementationDifficulty: 'Easy',
        timeline: '24-48 hours',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-returns',
      category: 'returns',
      name: 'High Return Rate & Sizing Defect Leak',
      detectedAmount: 56000, // 56K
      severity: 'High',
      whatItMeans: 'Return patterns indicate severe product specification and packaging defects.',
      affectedOrdersCount: 204,
      sampleEvidence: [
        'SKU-104 return rate climbed to 34.8% vs catalog baseline of 12.1%',
        '72% of return logs report "runs tight in chest/shoulders"',
        'Reverse shipping (₹180) + restock QA & repackaging (₹95) = ₹275 loss per return'
      ],
      topAffectedItem: 'SKU-104 (Batch 2026B Linen Shirts)',
      nemotronReasoning: {
        rootCause: 'Manufacturer specification deviation in Batch 2026B causing chest dimension mismatch by 2.4cm',
        confidence: 0.91,
        structuredEvidence: [
          'Supplier measurement QA revealed Batch 2026B was cut 2.4cm smaller than master size specs',
          'Customer feedback keyword analysis: "tight chest", "armhole small", "creased packaging"',
          'Grade-B degradation: 14% of returned linen shirts were stained/creased beyond Grade-A resale'
        ],
        hypothesisComparison: [
          { hypothesis: 'Buyer remorse / serial return behavior', plausibility: 'Low', reason: 'Only 3.8% of returning customers placed more than 2 returns in the quarter.' },
          { hypothesis: 'Supplier garment specification drift in Batch-2026B', plausibility: 'Very High', reason: '91% of size complaints originated exclusively from batch tag 2026B.' },
          { hypothesis: 'Slow courier transit causing buyer cancellations', plausibility: 'Medium', reason: 'Transit times averaged 3.8 days, which is within industry standard.' }
        ],
        strategicRecommendation: 'Place immediate "Runs 1 Size Small — Order Next Size Up" notice on product page, request supplier credit rebate of ₹35,000 for defective batch, and switch to 3-ply carton packaging.',
        expectedMonthlyRecovery: 38000,
        implementationDifficulty: 'Medium',
        timeline: '3-7 days',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-delivery',
      category: 'delivery',
      name: 'Disproportionate Delivery Cost Leak',
      detectedAmount: 41000, // 41K
      severity: 'High',
      whatItMeans: 'Certain orders and low-ticket baskets consume an unusually large share of shipping cost.',
      affectedOrdersCount: 388,
      sampleEvidence: [
        '1,210 low-ticket orders (<₹499) shipped with free delivery',
        'Tier-3 non-metro shipping fees averaged ₹142 per parcel against gross margin of ₹118',
        'Logistics consumed 16.4% of total revenue vs targeted standard of 7.5%'
      ],
      topAffectedItem: 'Tier-3 North/South Pin codes & Low Basket Carts',
      nemotronReasoning: {
        rootCause: 'Unrestricted free shipping without basket minimums and lack of dynamic 3PL regional routing',
        confidence: 0.93,
        structuredEvidence: [
          'Free delivery policy was applied to single-item orders as low as ₹299',
          'Tier-3 courier delivery costs averaged ₹142/shipment, directly wiping out gross contribution',
          'Courier weight misdeclaration: 19% of lightweight shirts billed at 1.0kg volumetric weight bracket'
        ],
        hypothesisComparison: [
          { hypothesis: 'National fuel surcharge hikes', plausibility: 'Medium', reason: 'Surcharges rose 4.2%, but total freight expense exploded by 29% due to policy loopholes.' },
          { hypothesis: 'Sub-threshold free shipping without regional delivery charge', plausibility: 'Very High', reason: 'Zero shipping charge was collected on 68% of orders with cart value below ₹499.' },
          { hypothesis: 'Courier service level over-provisioning', plausibility: 'High', reason: 'Non-urgent orders dispatched via express air courier instead of ground surface freight.' }
        ],
        strategicRecommendation: 'Introduce a firm ₹499 free delivery cart minimum, add a flat ₹49 nominal shipping fee for smaller orders, and switch non-metro parcels to surface logistics.',
        expectedMonthlyRecovery: 33000,
        implementationDifficulty: 'Easy',
        timeline: '24-48 hours',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-pricing',
      category: 'pricing',
      name: 'High-Volume Weak Margin / Pricing Leak',
      detectedAmount: 35500, // 35.5K
      severity: 'Medium',
      whatItMeans: 'High-selling products have paper-thin or negative net margins after direct costs and discounts.',
      affectedOrdersCount: 520,
      sampleEvidence: [
        'SKU-305 (Canvas Everyday Tote) sold 520 units at ₹399 but suffered net loss of -₹18 per unit after ad CAC',
        'COGS increased 14% last quarter while retail price was left unadjusted',
        'Gateway transaction fee (2.4%) + packaging (₹35) pushes margins into the red'
      ],
      topAffectedItem: 'SKU-305 (Canvas Everyday Tote Bag)',
      nemotronReasoning: {
        rootCause: 'Unadjusted catalog pricing failing to reflect supplier raw cotton price hikes and high paid acquisition CAC',
        confidence: 0.89,
        structuredEvidence: [
          'Raw material cotton inflation pushed unit COGS from ₹190 to ₹230 (+21%)',
          'Meta ad acquisition CAC on SKU-305 is ₹180/order, leaving zero buffer on ₹399 retail price',
          'Competitor price benchmarking confirms market average for organic canvas tote is ₹499-₹549'
        ],
        hypothesisComparison: [
          { hypothesis: 'Market price collapse from intense competitors', plausibility: 'Low', reason: 'Benchmark competitors increased prices by 12% in the same 6-month period.' },
          { hypothesis: 'Stale ERP unit cost master data and standalone ad spend on entry items', plausibility: 'Very High', reason: 'Price point was fixed in 2024 and never reviewed against refreshed supplier invoices.' },
          { hypothesis: 'Unexpected packaging cost surge', plausibility: 'Medium', reason: 'Custom dust-bag packaging added ₹35 per tote without factoring into unit retail price.' }
        ],
        strategicRecommendation: 'Reprice SKU-305 from ₹399 to ₹479 (+20%), convert it from standalone paid ads into a high-margin cart upsell add-on (+₹299 at checkout), and recover ₹28,000/month.',
        expectedMonthlyRecovery: 28000,
        implementationDifficulty: 'Immediate',
        timeline: '1 day',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    }
  ]
};

// Second realistic dataset: Electronics & Tech Gadgets
export const ELECTRONICS_DATASET: BusinessDataset = {
  id: 'electronics-retail',
  name: 'VoltWave Consumer Electronics & Accessories',
  industry: 'Consumer Tech & Electronics',
  description: 'Fast-growing gadget retailer with high sales volume but severe margin bleeding from transit damage and open-box returns.',
  currency: 'INR',
  currencySymbol: '₹',
  monthlyRevenue: 4200000, // 42L
  estimatedProfit: 630000,  // 6.3L (15%)
  potentialLeakage: 462000, // 4.62L
  transactionCount: 2190,
  dateRange: 'Past 30 Days (Oct 2026)',
  leaks: [
    {
      id: 'leak-elec-returns',
      category: 'returns',
      name: 'Open-Box & Transit Damage Return Leak',
      detectedAmount: 185000,
      severity: 'Critical',
      whatItMeans: 'Electronics returned in unsealed state undergo 40% liquidation depreciation.',
      affectedOrdersCount: 94,
      sampleEvidence: [
        'Earbuds and Bluetooth speakers suffered 14.2% return rate',
        'Open-box items can only be liquidated at 40% discount',
        'Average reverse shipping and inspection costs ₹420 per audio unit'
      ],
      topAffectedItem: 'VW-Pod Wireless ANC Earbuds',
      nemotronReasoning: {
        rootCause: 'Vague pairing instructions in manual causing "defective device" false-alarm returns by non-technical customers',
        confidence: 0.95,
        structuredEvidence: [
          'Customer service logs show 82% of returned earbuds were 100% functional upon bench testing',
          'Customers could not complete initial Bluetooth pairing without clearing factory cache',
          'Liquidation loss of ₹1,100 per returned audio unit'
        ],
        hypothesisComparison: [
          { hypothesis: 'Bluetooth chipset hardware failure', plausibility: 'Low', reason: 'Laboratory QA bench tests confirmed 0.3% chip failure rate.' },
          { hypothesis: 'Poor onboarding documentation & lack of QR pairing video', plausibility: 'Very High', reason: 'Returns dropped 60% among users who scanned the WhatsApp setup concierge.' }
        ],
        strategicRecommendation: 'Add prominent yellow "Scan for 30-sec Setup Video" card on top of earbud box and introduce WhatsApp concierge verification before approving return requests.',
        expectedMonthlyRecovery: 125000,
        implementationDifficulty: 'Easy',
        timeline: '3 days',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-elec-discount',
      category: 'discount',
      name: 'Affiliate Code Aggregator Abuse',
      detectedAmount: 142000,
      severity: 'Critical',
      whatItMeans: 'Affiliate coupons designed for niche tech reviewers are being applied site-wide without attribution.',
      affectedOrdersCount: 310,
      sampleEvidence: [
        'VOUCHER20 was applied on 410 checkout baskets without referral cookie',
        'Gross margins dropped below hardware component BOM cost on power banks'
      ],
      topAffectedItem: 'MagCharge 10000mAh Powerbank',
      nemotronReasoning: {
        rootCause: 'Affiliate tracking cookie missing server-side validation, allowing direct URL coupon hijacking',
        confidence: 0.92,
        structuredEvidence: [
          'Chrome browser coupon extensions automatically tested and injected reviewer promo codes at checkout',
          'Affiliates were paid 8% commission on organic customers who found code on coupon sites'
        ],
        hypothesisComparison: [
          { hypothesis: 'Legitimate viral YouTube reviewer referral', plausibility: 'Low', reason: 'Referrer headers showed direct and Google organic search sessions.' },
          { hypothesis: 'Browser extension auto-injecting affiliate vouchers', plausibility: 'Very High', reason: 'Checkout submission logs reveal rapid sequential coupon testing within 500ms.' }
        ],
        strategicRecommendation: 'Block headless coupon auto-injection scripts, bind affiliate codes to unique referral URLs, and exclude low-margin accessories from discounts.',
        expectedMonthlyRecovery: 105000,
        implementationDifficulty: 'Medium',
        timeline: '5 days',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-elec-delivery',
      category: 'delivery',
      name: 'Heavy Battery Logistics Surcharge Leak',
      detectedAmount: 78000,
      severity: 'High',
      whatItMeans: 'Dangerous goods (lithium-ion) delivery surcharges charged by 3PLs were not passed to buyers.',
      affectedOrdersCount: 220,
      sampleEvidence: [
        'Courier charged ₹90 dangerous goods battery compliance fee per shipment',
        'Company absorbed this fee completely even on entry-tier ₹599 orders'
      ],
      topAffectedItem: 'Lithium Battery Packs & GaN Chargers',
      nemotronReasoning: {
        rootCause: 'Courier updated hazardous materials handling fee in rate card without updating cart checkout fee matrix',
        confidence: 0.96,
        structuredEvidence: [
          '3PL invoice shows +₹90 hazardous materials surcharge on every air shipment containing batteries',
          'Checkout fee was set to flat ₹0 for orders over ₹499'
        ],
        hypothesisComparison: [
          { hypothesis: 'Unexpected air freight carrier penalty', plausibility: 'High', reason: 'Airlines mandated DG certification compliance.' },
          { hypothesis: 'Omission of hazardous materials logic in cart shipping calculator', plausibility: 'Very High', reason: 'Store shipping settings had no SKU-level fee tagging.' }
        ],
        strategicRecommendation: 'Tag battery SKUs with special surface-only shipping and add ₹49 eco/battery handling fee at checkout.',
        expectedMonthlyRecovery: 62000,
        implementationDifficulty: 'Easy',
        timeline: '2 days',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-elec-pricing',
      category: 'pricing',
      name: 'Charging Cable Negative Unit Margin',
      detectedAmount: 57000,
      severity: 'Medium',
      whatItMeans: 'Braided Type-C cables sold standalone lose ₹45 per order once packing and shipping are deducted.',
      affectedOrdersCount: 480,
      sampleEvidence: [
        'Cables sold at ₹199 retail price with ₹85 COGS + ₹95 shipping + ₹30 packing + ₹34 ad CAC',
        'Net loss of -₹45 on every single cable order'
      ],
      topAffectedItem: 'Braided Type-C 100W Cable (1.5m)',
      nemotronReasoning: {
        rootCause: 'Selling low-ticket accessories as standalone direct-to-consumer items instead of bundled add-ons',
        confidence: 0.93,
        structuredEvidence: [
          'Fixed shipping and pick-and-pack warehouse fee is ₹125 minimum regardless of item price',
          'Unit contribution margin is negative -22.6%'
        ],
        hypothesisComparison: [
          { hypothesis: 'Loss leader strategy for customer acquisition', plausibility: 'Medium', reason: 'Only 6.2% of cable buyers made a second purchase within 90 days.' },
          { hypothesis: 'Flawed unit economics without minimum order requirement', plausibility: 'Very High', reason: 'Selling sub-₹200 items with standalone shipping is fundamentally unviable.' }
        ],
        strategicRecommendation: 'Make cables available exclusively as an add-on during checkout for orders >₹499 (or in 2-packs at ₹399).',
        expectedMonthlyRecovery: 49000,
        implementationDifficulty: 'Immediate',
        timeline: '1 day',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    }
  ]
};

// Third dataset: SaaS & Subscription Platform in USD
export const SAAS_DATASET: BusinessDataset = {
  id: 'saas-cloudflow',
  name: 'CloudFlow Analytics (B2B SaaS)',
  industry: 'B2B Software & SaaS',
  description: 'Subscription platform with $180,000 Monthly Recurring Revenue suffering revenue leaks from grandfathered legacy plans and billing delays.',
  currency: 'USD',
  currencySymbol: '$',
  monthlyRevenue: 180000, // $180K
  estimatedProfit: 45000,  // $45K
  potentialLeakage: 28400, // $28.4K (63% of net profit!)
  transactionCount: 1420,
  dateRange: 'Past 30 Days (Oct 2026)',
  leaks: [
    {
      id: 'leak-saas-discount',
      category: 'discount',
      name: 'Unmonitored Grandfathered Discounts',
      detectedAmount: 12400,
      severity: 'Critical',
      whatItMeans: 'Enterprise clients remain on 50% legacy lifetime launch discounts despite 4x platform usage increase.',
      affectedOrdersCount: 42,
      sampleEvidence: [
        '42 high-volume enterprise accounts consume 38% of AWS compute but pay 2022 introductory rates',
        'Contract renewal auto-renewed without usage-tier recalculation'
      ],
      topAffectedItem: 'Enterprise Tier Tier-3 Compute',
      nemotronReasoning: {
        rootCause: 'Stripe billing subscription contracts lacked automatic discount expiration and usage meter true-ups',
        confidence: 0.96,
        structuredEvidence: [
          'Clients utilize 450,000 monthly API calls while paying flat $99/mo introductory plan',
          'Average server cost for these 42 accounts is $280/mo, generating net gross loss of -$181/account'
        ],
        hypothesisComparison: [
          { hypothesis: 'Key enterprise account relationship protection', plausibility: 'Low', reason: 'Accounts are mid-market companies who expect modern usage-based billing.' },
          { hypothesis: 'Billing system automation omission during 2023 pricing restructure', plausibility: 'Very High', reason: 'Legacy webhooks did not migrate customers to new pricing meters.' }
        ],
        strategicRecommendation: 'Send 60-day migration notice transitioning grandfathered accounts to modern usage-based tier with a grandfathered 15% VIP loyalty discount.',
        expectedMonthlyRecovery: 9800,
        implementationDifficulty: 'Medium',
        timeline: '2 weeks',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-saas-refund',
      category: 'refunds',
      name: 'Zombie Seats & Delayed De-provisioning',
      detectedAmount: 8900,
      severity: 'High',
      whatItMeans: 'Inactivated team members retain active license billing leading to disputed chargebacks and refunds.',
      affectedOrdersCount: 88,
      sampleEvidence: [
        'Enterprise IT admins request credit refunds after discovering 88 inactive accounts were billed for 6 months',
        'Stripe dispute fees incurred on 12 accounts ($15 per chargeback)'
      ],
      topAffectedItem: 'Seat Management & SSO Provisioning',
      nemotronReasoning: {
        rootCause: 'Lack of SCIM directory sync causing HR departures to remain active in CloudFlow seat tally',
        confidence: 0.91,
        structuredEvidence: [
          '88 user accounts had zero login activity in >90 days but were still included in monthly enterprise invoices',
          'Disgruntled customer IT departments forced manual retro-active credit notes totaling $8,900'
        ],
        hypothesisComparison: [
          { hypothesis: 'Customer deliberate churn attempt', plausibility: 'Low', reason: 'Active users within the same companies had 94% retention.' },
          { hypothesis: 'Missing Okta/Azure SCIM automated user de-provisioning', plausibility: 'Very High', reason: 'Disputes dropped 100% among the 3 pilot customers with SCIM integration.' }
        ],
        strategicRecommendation: 'Ship automated 60-day inactivity seat pause alerts and offer SCIM directory sync in enterprise tier.',
        expectedMonthlyRecovery: 7200,
        implementationDifficulty: 'Medium',
        timeline: '1-2 weeks',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    },
    {
      id: 'leak-saas-pricing',
      category: 'pricing',
      name: 'Unrecovered Stripe International Card Surcharges',
      detectedAmount: 7100,
      severity: 'Medium',
      whatItMeans: 'International card cross-border fee (1.5%) and currency conversion markup (1%) not reflected in checkout.',
      affectedOrdersCount: 290,
      sampleEvidence: [
        'European and APAC customer subscriptions billed in USD cost 3.9% total merchant processing fee',
        'Standard domestic fee model (2.9% + 30c) was assumed across all international subscribers'
      ],
      topAffectedItem: 'Cross-Border International Subscriptions',
      nemotronReasoning: {
        rootCause: 'Single currency USD pricing causing international card issuing banks to levy foreign exchange and cross-border penalties',
        confidence: 0.94,
        structuredEvidence: [
          'Cross-border payment volume is $58,000/mo',
          'Stripe cross-border fee drag amounts to $7,100 annually in avoidable friction'
        ],
        hypothesisComparison: [
          { hypothesis: 'Merchant bank tier misconfiguration', plausibility: 'Medium', reason: 'Stripe rates match standard international tariff.' },
          { hypothesis: 'Lack of local currency multi-currency billing (EUR/GBP/AUD)', plausibility: 'Very High', reason: 'Local acquiring eliminates international card markups entirely.' }
        ],
        strategicRecommendation: 'Enable Stripe Adaptive Pricing to charge European customers in EUR and UK customers in GBP via local SEPA/Bacs rails.',
        expectedMonthlyRecovery: 5800,
        implementationDifficulty: 'Easy',
        timeline: '3 days',
        modelUsed: 'NVIDIA Nemotron-70B Business Reasoning Engine'
      }
    }
  ]
};

export const ALL_DATASETS: BusinessDataset[] = [
  BLUEPRINT_DATASET,
  ELECTRONICS_DATASET,
  SAAS_DATASET
];
