'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PokemonImage } from './PokemonImage';

interface PokedexGridProps {
  searchQuery: string;
  method: string;
  onSelectPokemon: (pokemon: any) => void;
  setMethodsList: (methods: string[]) => void;
}

const gameLabels: Record<string, string> = {
  za: 'Legends: Z-A',
  sv: 'Scarlet / Violet',
};

export function PokedexGrid({
  searchQuery,
  method,
  onSelectPokemon,
  setMethodsList,
}: PokedexGridProps) {
  const { game, pokemonList, setPokemon } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [encounterCount, setEncounterCount] = useState(0);

  const pokemon = pokemonList[game] || [];

  useEffect(() => {
    async function loadPokemon() {
      // If we already loaded them, skip API fetch
      if (pokemonList[game].length > 0) {
        // Still load meta for counts
        try {
          const res = await fetch(`/api/${game}/meta`);
          if (res.ok) {
            const meta = await res.json();
            setEncounterCount(meta.summary?.encounterCount || 0);
          }
        } catch {}
        return;
      }

      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`/api/${game}/pokemon`);
        if (!res.ok) {
          throw new Error('Error al cargar Pokémon');
        }
        const data = await res.json();
        setPokemon(game, data.results || []);
        
        const metaRes = await fetch(`/api/${game}/meta`);
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setEncounterCount(meta.summary?.encounterCount || 0);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    loadPokemon();
  }, [game, setPokemon, pokemonList]);

  // Extract unique methods when the pokemon list changes
  useEffect(() => {
    const methods = Array.from(new Set(pokemon.flatMap((p: any) => p.methods || []))).sort() as string[];
    setMethodsList(methods);
  }, [pokemon, setMethodsList]);

  const dex = (n: number) => `#${String(n).padStart(4, '0')}`;

  const filtered = pokemon.filter((p: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return !method || (p.methods || []).includes(method);
    }

    const formMatch = q.match(/\bform(?:a)?\s*(\d+)\b/i);
    const matchesMethod = !method || (p.methods || []).includes(method);

    if (formMatch) {
      const targetForm = parseInt(formMatch[1], 10);
      const pForm = p.form ?? 0;
      if (pForm !== targetForm) {
        return false;
      }
      const cleanQ = q.replace(/\bform(?:a)?\s*\d+\b/gi, '').replace(/\s+/g, ' ').trim();
      if (!cleanQ) {
        return matchesMethod;
      }
      const hay = [
        p.displayName, p.displayNameEn, p.name, p.nameEn, String(p.species),
        ...(p.searchAliases || [])
      ].join(' ').toLowerCase();
      return hay.includes(cleanQ) && matchesMethod;
    }

    const hay = [
      p.displayName, p.displayNameEn, p.name, p.nameEn, p.formLabel, String(p.species),
      ...(p.searchAliases || [])
    ].join(' ').toLowerCase();
    
    return hay.includes(q) && matchesMethod;
  });

  return (
    <>
      <div className="game-summary" id="gameSummary">
        {loading 
          ? `Cargando ${gameLabels[game]}...`
          : errorMsg 
            ? `Error: ${errorMsg}`
            : `${gameLabels[game]} Pokédex · ${pokemon.length} Pokémon · ${encounterCount} encuentros legales`
        }
      </div>

      <div id="grid" className="pokedex-grid">
        {!loading && filtered.map((p: any, i: number) => (
          <button 
            key={`${p.species}-${p.form || 0}-${i}`}
            className="poke-card" 
            onClick={() => onSelectPokemon(p)}
            type="button"
          >
            <span className="dex">{dex(p.species)}{p.form ? ` · F${p.form}` : ''}</span>
            {p.badge && <span className="badge">{p.badge}</span>}
            <PokemonImage 
              species={p.species} 
              form={p.form} 
              alt={p.displayName || p.name}
              className="sprite"
            />
            <strong className="name">{p.displayName || p.name}</strong>
            <small className="meta">
              {p.encounterCount || 0} encuentros · {(p.methods || []).slice(0, 2).join(', ')}
              {(p.methods || []).length > 2 ? '...' : ''}
            </small>
          </button>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="notice" style={{ gridColumn: '1 / -1' }}>No hay resultados con ese filtro.</div>
        )}
      </div>
    </>
  );
}
