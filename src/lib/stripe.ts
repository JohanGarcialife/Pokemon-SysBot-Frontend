import Stripe from 'stripe';

// Stripe singleton
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Map planId + billing → Stripe Price ID
export const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  gym: {
    monthly: process.env.STRIPE_PRICE_GYM_MONTHLY,
    annual:  process.env.STRIPE_PRICE_GYM_ANNUAL,
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY,
    annual:  process.env.STRIPE_PRICE_ELITE_ANNUAL,
  },
  champion: {
    monthly: process.env.STRIPE_PRICE_CHAMPION_MONTHLY,
    annual:  process.env.STRIPE_PRICE_CHAMPION_ANNUAL,
  },
};

// Map Stripe Price ID → plan slug (for webhook)
export function planFromPriceId(priceId: string): string | null {
  for (const [plan, cycles] of Object.entries(PRICE_MAP)) {
    if (Object.values(cycles).includes(priceId)) return plan;
  }
  return null;
}
