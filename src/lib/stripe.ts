import Stripe from 'stripe';

// Helper to trim strings safely
const trimEnv = (val?: string) => (val || '').trim();

const stripeSecretKey = trimEnv(process.env.STRIPE_SECRET_KEY);

// Stripe singleton
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-05-27.dahlia',
});

// Map planId + billing → Stripe Price ID
export const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  gym: {
    monthly: trimEnv(process.env.STRIPE_PRICE_GYM_MONTHLY) || undefined,
    annual:  trimEnv(process.env.STRIPE_PRICE_GYM_ANNUAL) || undefined,
  },
  elite: {
    monthly: trimEnv(process.env.STRIPE_PRICE_ELITE_MONTHLY) || undefined,
    annual:  trimEnv(process.env.STRIPE_PRICE_ELITE_ANNUAL) || undefined,
  },
  champion: {
    monthly: trimEnv(process.env.STRIPE_PRICE_CHAMPION_MONTHLY) || undefined,
    annual:  trimEnv(process.env.STRIPE_PRICE_CHAMPION_ANNUAL) || undefined,
  },
};

// Map Stripe Price ID → plan slug (for webhook)
export function planFromPriceId(priceId: string): string | null {
  const cleanPriceId = priceId.trim();
  for (const [plan, cycles] of Object.entries(PRICE_MAP)) {
    if (Object.values(cycles).map(v => v?.trim()).includes(cleanPriceId)) return plan;
  }
  return null;
}

