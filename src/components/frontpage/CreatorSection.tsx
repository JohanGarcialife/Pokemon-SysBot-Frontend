'use client';

import { useState } from 'react';
import { GameSelector } from './GameSelector';
import { SearchAndFilters } from './SearchAndFilters';
import { PokedexGrid } from './PokedexGrid';
import { BulkOrderSection } from './BulkOrderSection';
import { useAppStore } from '@/store/useAppStore';

interface CreatorSectionProps {
  onSelectPokemon: (pokemon: any) => void;
  onOpenAuth: () => void;
  onOrderCreated: (order: any) => void;
  onShowWarning?: (activeOrderId: string, message?: string) => void;
}

export function CreatorSection({ onSelectPokemon, onOpenAuth, onOrderCreated, onShowWarning }: CreatorSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [method, setMethod] = useState('');
  const [methods, setMethods] = useState<string[]>([]);
  const { isPremium } = useAppStore();

  return (
    <main id="creator" className={`creator-shell ${isPremium ? 'premium-layout' : 'standard-layout'}`}>
      <section className="creator-card">
        <GameSelector />
        
        <SearchAndFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          method={method}
          setMethod={setMethod}
          methods={methods}
        />
        
        <PokedexGrid 
          searchQuery={searchQuery}
          method={method}
          onSelectPokemon={onSelectPokemon}
          setMethodsList={setMethods}
        />
      </section>

      {isPremium && (
        <BulkOrderSection 
          onOpenAuth={onOpenAuth} 
          onOrderCreated={onOrderCreated} 
          onShowWarning={onShowWarning}
        />
      )}
    </main>
  );
}

