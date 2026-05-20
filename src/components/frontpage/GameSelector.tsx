'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function GameSelector() {
  const { game, setGame } = useAppStore();
  const [zaStats, setZaStats] = useState({ pokemonCount: 0, encounterCount: 0 });
  const [svStats, setSvStats] = useState({ pokemonCount: 0, encounterCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/games');
        if (res.ok) {
          const data = await res.json();
          for (const g of data.results || []) {
            if (g.id === 'za') {
              setZaStats({
                pokemonCount: g.summary?.pokemonCount || 0,
                encounterCount: g.summary?.encounterCount || 0,
              });
            } else if (g.id === 'sv') {
              setSvStats({
                pokemonCount: g.summary?.pokemonCount || 0,
                encounterCount: g.summary?.encounterCount || 0,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching game selector stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <div className="step-title"><span>1</span><strong>VERSIÓN DEL JUEGO</strong></div>
      <div className="game-strip" id="gameSelect">
        <button 
          className={`game-tile ${game === 'za' ? 'active' : ''}`}
          onClick={() => setGame('za')}
          type="button"
        >
          <span className="check" style={{ opacity: game === 'za' ? 1 : 0 }}>✓</span>
          <img src="/assets/za-logo.png" alt="Pokémon Legends Z-A" />
          <div>
            <strong>Legends: Z-A</strong>
            <small id="zaCount">
              {loading ? 'Cargando...' : `${zaStats.pokemonCount} Pokémon · ${zaStats.encounterCount} encuentros`}
            </small>
          </div>
        </button>

        <button 
          className={`game-tile ${game === 'sv' ? 'active' : ''}`}
          onClick={() => setGame('sv')}
          type="button"
        >
          <span className="check" style={{ opacity: game === 'sv' ? 1 : 0 }}>✓</span>
          <img src="/assets/sv-logo.png" alt="Pokémon Scarlet Violet" />
          <div>
            <strong>Scarlet / Violet</strong>
            <small id="svCount">
              {loading ? 'Cargando...' : `${svStats.pokemonCount} Pokémon · ${svStats.encounterCount} encuentros`}
            </small>
          </div>
        </button>
      </div>
    </>
  );
}
