'use client';

import { useState } from 'react';
import { GameSelector } from './GameSelector';
import { SearchAndFilters } from './SearchAndFilters';
import { PokedexGrid } from './PokedexGrid';
import { BulkOrderSection } from './BulkOrderSection';

interface CreatorSectionProps {
  onSelectPokemon: (pokemon: any) => void;
  onOpenAuth: () => void;
  onOrderCreated: (order: any) => void;
}

export function CreatorSection({ onSelectPokemon, onOpenAuth, onOrderCreated }: CreatorSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [method, setMethod] = useState('');
  const [methods, setMethods] = useState<string[]>([]);

  return (
    <main id="creator" className="creator-shell">
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

      <BulkOrderSection onOpenAuth={onOpenAuth} onOrderCreated={onOrderCreated} />
    </main>
  );
}
