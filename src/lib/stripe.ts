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

