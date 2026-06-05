import { create } from 'zustand';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface AppState {
  user: any | null;
  profile: any | null;
  plan: string;
  isPremium: boolean;
  supabase: SupabaseClient | null;
  game: 'za' | 'sv';
  pokemonList: Record<'za' | 'sv', any[]>;
  itemsList: Record<'za' | 'sv', string[]>;
  bulk: any[];
  
  setUser: (user: any, profile: any, plan: string) => void;
  clearUser: () => void;
  initSupabase: (url: string, key: string) => void;
  setGame: (game: 'za' | 'sv') => void;
  setPokemon: (game: 'za' | 'sv', list: any[]) => void;
  setItems: (game: 'za' | 'sv', list: string[]) => void;
  addToBulk: (item: any) => string | null; // returns error message if any
  removeFromBulk: (index: number) => void;
  clearBulk: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  profile: null,
  plan: 'free',
  isPremium: false,
  supabase: null,
  game: 'za',
  pokemonList: { za: [], sv: [] },
  itemsList: { za: [], sv: [] },
  bulk: [],

  setUser: (user, profile, plan) => {
    // Plan can come from Supabase app_metadata (set by Stripe webhook)
    // or from profile table. Paid plans: gym, elite, champion
    const PAID_PLANS = ['gym', 'elite', 'champion', 'premium'];
    
    let resolvedPlan = 'free';
    if (plan && PAID_PLANS.includes(String(plan).toLowerCase())) {
      resolvedPlan = plan;
    } else if (user?.app_metadata?.plan && PAID_PLANS.includes(String(user.app_metadata.plan).toLowerCase())) {
      resolvedPlan = user.app_metadata.plan;
    } else if (user?.app_metadata?.plan && user.app_metadata.plan !== 'free') {
      resolvedPlan = user.app_metadata.plan;
    } else if (plan) {
      resolvedPlan = plan;
    }

    set({
      user,
      profile,
      plan: resolvedPlan,
      isPremium: PAID_PLANS.includes(String(resolvedPlan).toLowerCase()),
    });
  },

  clearUser: () => {
    set({
      user: null,
      profile: null,
      plan: 'free',
      isPremium: false,
      bulk: [],
    });
  },

  initSupabase: (url, key) => {
    if (get().supabase) return;
    try {
      const client = createClient(url, key);
      set({ supabase: client });
    } catch (err) {
      console.error('Error creating Supabase client:', err);
    }
  },

  setGame: (game) => set({ game }),

  setPokemon: (game, list) => {
    set((state) => ({
      pokemonList: {
        ...state.pokemonList,
        [game]: list,
      },
    }));
  },

  setItems: (game, list) => {
    set((state) => ({
      itemsList: {
        ...state.itemsList,
        [game]: list,
      },
    }));
  },

  addToBulk: (item) => {
    const { bulk, isPremium } = get();
    if (!isPremium) {
      return 'El pedido masivo es una función Premium.';
    }
    if (bulk.length >= 3) {
      return 'Máximo 3 Pokémon por pedido masivo.';
    }
    if (bulk.length > 0 && bulk[0].game !== item.game) {
      return 'El pedido masivo solo puede tener Pokémon del mismo juego.';
    }
    set({ bulk: [...bulk, item] });
    return null;
  },

  removeFromBulk: (index) => {
    set((state) => {
      const copy = [...state.bulk];
      copy.splice(index, 1);
      return { bulk: copy };
    });
  },

  clearBulk: () => set({ bulk: [] }),
}));
