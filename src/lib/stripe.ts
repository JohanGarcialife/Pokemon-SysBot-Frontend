import Stripe from 'stripe';

// Helper to trim strings safely
const trimEnv = (val?: string) => (val || '').trim();

let _stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!_stripeInstance) {
    const stripeSecretKey = trimEnv(process.env.STRIPE_SECRET_KEY);
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
    }
    _stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2026-05-27.dahlia',
    });
  }
  return _stripeInstance;
}

// Export a proxy that acts as the stripe instance
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripeInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

// Map planId + billing → Stripe Price ID
export const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  gym: {
    monthly: trimEnv(process.env.STRIPE_PRICE_GYM_MONTHLY) || 'price_1U3ijzJgg2ncXX1ghbV2W95k',
    annual:  trimEnv(process.env.STRIPE_PRICE_GYM_ANNUAL) || 'price_1U3imgJgg2ncXX1gcJvtanbh',
  },
  elite: {
    monthly: trimEnv(process.env.STRIPE_PRICE_ELITE_MONTHLY) || 'price_1U3jmuJgg2ncXX1gSAlDKUWs',
    annual:  trimEnv(process.env.STRIPE_PRICE_ELITE_ANNUAL) || 'price_1U3jnJJgg2ncXX1g8g9fDidS',
  },
  champion: {
    monthly: trimEnv(process.env.STRIPE_PRICE_CHAMPION_MONTHLY) || 'price_1U3joLJgg2ncXX1gR9bvczjL',
    annual:  trimEnv(process.env.STRIPE_PRICE_CHAMPION_ANNUAL) || 'price_1U3jodJgg2ncXX1ghU9shG38',
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

