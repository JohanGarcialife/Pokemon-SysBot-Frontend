'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PokemonImage } from './PokemonImage';

interface PokemonModalProps {
  pokemon: any;
  onClose: () => void;
  onOpenAuth: () => void;
  onOrderCreated: (order: any) => void;
  onToast: (msg: string) => void;
  onShowWarning?: (activeOrderId: string, message?: string) => void;
}

const statLabels: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const natures = [
  'Random', 'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish',
  'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful',
  'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
];

const teraTypes = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying',
  'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

const typeMap: Record<string, string> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass',
  ice: 'Ice', fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying',
  psychic: 'Psychic', bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon',
  dark: 'Dark', steel: 'Steel', fairy: 'Fairy'
};

const statsCache = new Map<number, { types: string[]; abilities: string[]; stats: Record<string, number> }>();

export function PokemonModal({
  pokemon,
  onClose,
  onOpenAuth,
  onOrderCreated,
  onToast,
  onShowWarning,
}: PokemonModalProps) {
  const { game, itemsList, setItems, addToBulk, isPremium, user, supabase, plan, remainingFreeTradesZA, remainingFreeTradesSV } = useAppStore();
  const isFreePlan = plan === 'free';
  const remainingTrades = game === 'za' ? remainingFreeTradesZA : remainingFreeTradesSV;
  const isLimitReached = isFreePlan && remainingTrades <= 0;
  
  // Local states
  const [encounters, setEncounters] = useState<any[]>([]);
  const [selectedEncounter, setSelectedEncounter] = useState<any>(null);
  const [stats, setStats] = useState<{ types: string[]; abilities: string[]; stats: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; text: string } | null>(null);

  // Form values
  const [gameVersion, setGameVersion] = useState('Scarlet');
  const [ball, setBall] = useState('Poké Ball');
  const [heldItem, setHeldItem] = useState('');
  const [gender, setGender] = useState('Random');
  const [level, setLevel] = useState(1);
  const [nature, setNature] = useState('Random');
  const [evMode, setEvMode] = useState<'none' | 'max'>('none');
  const [shiny, setShiny] = useState(false);
  const [teraType, setTeraType] = useState('Normal');

  // Load stats and encounters
  useEffect(() => {
    let active = true;
    setLoading(true);
    setSelectedEncounter(null);
    setValidationResult(null);

    async function loadData() {
      // 1. Get stats (cached or fetch from PokeAPI)
      let pokeStats = statsCache.get(pokemon.species);
      if (!pokeStats) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.species}`);
          if (res.ok) {
            const data = await res.json();
            pokeStats = {
              types: data.types.map((t: any) => t.type.name),
              abilities: data.abilities.map((a: any) => a.ability.name.replace(/-/g, ' ')),
              stats: Object.fromEntries(data.stats.map((s: any) => [s.stat.name, s.base_stat])),
            };
            statsCache.set(pokemon.species, pokeStats);
          }
        } catch (err) {
          console.warn('PokeAPI failed:', err);
        }
      }

      if (!pokeStats) {
        pokeStats = { types: [], abilities: [], stats: {} };
      }

      // 2. Fetch encounters
      let pokeEncounters = [];
      try {
        const res = await fetch(`/api/${game}/pokemon/${pokemon.species}/encounters?form=${pokemon.form || 0}`);
        if (res.ok) {
          const data = await res.json();
          pokeEncounters = data.results || [];
        }
      } catch (err) {
        console.warn('Encounters fetch failed:', err);
      }

      if (active) {
        setStats(pokeStats);
        setEncounters(pokeEncounters);
        
        // Auto select first type as default tera type
        const firstType = pokeStats.types[0];
        setTeraType(typeMap[firstType] || 'Normal');
        
        setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [pokemon, game]);

  // Load items if not already loaded
  useEffect(() => {
    async function loadItems() {
      if (itemsList[game] && itemsList[game].length > 0) return;
      try {
        const res = await fetch(`/api/${game}/items`);
        if (res.ok) {
          const data = await res.json();
          setItems(game, data.items || ['Sin objeto']);
        } else {
          setItems(game, ['Sin objeto']);
        }
      } catch {
        setItems(game, ['Sin objeto']);
      }
    }
    loadItems();
  }, [game, itemsList, setItems]);

  // When encounter is selected, update defaults
  const handleEncounterChange = (indexStr: string) => {
    if (indexStr === '') {
      setSelectedEncounter(null);
      return;
    }
    const enc = encounters[Number(indexStr)];
    setSelectedEncounter(enc);
    setValidationResult(null);

    // Set level default to min
    const minLvl = enc.selectable?.levelMin || enc.levelMin || 1;
    setLevel(minLvl);

    // Set ball default
    const balls = enc.selectable?.balls || enc.allowedBalls || ['Poké Ball'];
    setBall(enc.fixed?.ball || balls[0]);

    // Shiny
    const forceShiny = enc.fixed?.shiny === true || enc.forceShiny === true;
    setShiny(forceShiny);
  };

  const currentPayload = () => {
    if (!selectedEncounter) return null;
    // species must be a string name for showdownBuilder / discordDispatcher
    // (the JSON data stores it as a numeric Pokédex ID, so we use the English name instead)
    const speciesName = pokemon.displayNameEn || pokemon.nameEn || pokemon.displayName || pokemon.name || String(pokemon.species);
    return {
      game,
      gameVersion: game === 'sv' ? gameVersion : undefined,
      species: speciesName,
      dexId: pokemon.species,
      form: pokemon.form || 0,
      displayName: pokemon.displayName || pokemon.name,
      encounterId: selectedEncounter.id,
      location: selectedEncounter.location,
      locationName: selectedEncounter.locationName || selectedEncounter.location,
      locationNameEn: selectedEncounter.locationNameEn || selectedEncounter.locationName || selectedEncounter.location,
      homeProfileId: selectedEncounter.homeProfileId || null,
      originType: selectedEncounter.originType || selectedEncounter.method || null,
      method: selectedEncounter.method,
      ball,
      heldItem: heldItem || null,
      gender,
      level,
      nature,
      evMode,
      shiny,
      alpha: Boolean(selectedEncounter.isAlpha),
      teraType: game === 'sv' ? teraType : undefined,
    };
  };

  const validatePayload = async (payload: any) => {
    const res = await fetch(`/api/${payload.game}/validate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let msg = 'Error en la validación';
      try {
        const err = await res.json();
        if (err.error) msg = err.error;
      } catch {}
      throw new Error(msg);
    }
    return res.json();
  };

  const handleSingleOrder = async () => {
    const payload = currentPayload();
    if (!payload) return;

    setValidating(true);
    setValidationResult({ success: true, text: 'Validando encuentro contra la base legal...' });

    try {
      const validation = await validatePayload(payload);
      if (!validation.legal) {
        setValidationResult({
          success: false,
          text: `Pedido no legal.\n${(validation.errors || []).join('\n')}`,
        });
        return;
      }

      setValidationResult({ success: true, text: 'Generando código de intercambio...' });

      const headers: Record<string, string> = { 'content-type': 'application/json' };
      if (supabase) {
        // Refresh session so the token always reflects the current plan from Supabase
        // (prevents stale JWT from bypassing membership restrictions)
        try {
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed?.session) {
            headers['Authorization'] = `Bearer ${refreshed.session.access_token}`;
          } else {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) headers['Authorization'] = `Bearer ${session.access_token}`;
          }
        } catch {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const res = await fetch('/api/orders/single', {
        method: 'POST',
        headers,
        body: JSON.stringify({ order: payload }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        if (orderData.error === 'active_order_exists' && orderData.activeOrderId && onShowWarning) {
          onShowWarning(orderData.activeOrderId, orderData.message);
          onClose();
          return;
        }
        throw new Error(orderData.error || 'Error al generar la orden');
      }

      onOrderCreated(orderData);
    } catch (err: any) {
      setValidationResult({
        success: false,
        text: `Error al registrar la orden: ${err.message || String(err)}`,
      });
    } finally {
      setValidating(false);
    }
  };

  const handleAddToBulk = async () => {
    const payload = currentPayload();
    if (!payload) return;

    if (!isPremium) {
      onToast('El pedido masivo es una función Premium.');
      return;
    }

    setValidating(true);
    setValidationResult({ success: true, text: 'Validando encuentro contra la base legal...' });

    try {
      const validation = await validatePayload(payload);
      if (!validation.legal) {
        setValidationResult({
          success: false,
          text: `Pedido no legal.\n${(validation.errors || []).join('\n')}`,
        });
        return;
      }

      const error = addToBulk(payload);
      if (error) {
        onToast(error);
      } else {
        onToast(`${payload.displayName} añadido al pedido masivo.`);
        onClose();
      }
    } catch (err: any) {
      setValidationResult({
        success: false,
        text: `Error de validación: ${err.message || String(err)}`,
      });
    } finally {
      setValidating(false);
    }
  };

  const dexStr = `#${String(pokemon.species).padStart(4, '0')}`;
  const items = itemsList[game] || ['Sin objeto'];

  // Stats calculation
  const totalStats = stats ? Object.values(stats.stats).reduce((a, b) => a + Number(b || 0), 0) : 0;

  const encounterLabel = (e: any) => {
    const a = [];
    if (e.locationName) a.push(e.locationName);
    if (e.method) a.push(`(${e.method})`);
    if (e.isAlpha) a.push('Alpha');
    if (e.version && game === 'sv') a.push(`· ${e.version}`);
    return a.join(' ');
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-panel pokemon-panel">
        <button className="close" onClick={onClose} type="button" aria-label="Cerrar">×</button>
        
        {loading ? (
          <div className="notice" style={{ padding: '40px' }}>Cargando datos legales...</div>
        ) : stats ? (
          <div id="modalContent">
            <div className="summary">
              <PokemonImage 
                species={pokemon.species} 
                form={pokemon.form} 
                alt={pokemon.displayName || pokemon.name}
                id="modalSprite"
              />
              <div>
                <h2 id="modalTitle">{pokemon.displayName || pokemon.name}</h2>
                <p>
                  {game === 'za' ? 'Legends: Z-A' : 'Scarlet / Violet'} · {dexStr}
                  {pokemon.form ? ` · Forma ${pokemon.form}` : ''}
                </p>
                <div className="type-row">
                  {stats.types.map((t) => (
                    <span key={t} className="type">
                      {typeMap[t] || t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-box">
              <h3>⭐ Habilidades</h3>
              <div className="tag-row">
                {stats.abilities.map((a) => (
                  <span key={a} className="tag">
                    {a}
                  </span>
                )) || <span className="small">Sin datos</span>}
              </div>
            </div>

            <div className="stats">
              <h3>📊 Stats & Habilidades</h3>
              {Object.entries(stats.stats).map(([k, v]) => (
                <div key={k} className="stat">
                  <span>{statLabels[k] || k}</span>
                  <div className="bar">
                    <span style={{ width: `${Math.min(100, Math.round((v / 180) * 100))}%` }} />
                  </div>
                  <b>{v}</b>
                </div>
              ))}
              <div className="stat">
                <span>Total</span>
                <div className="bar">
                  <span style={{ width: `${Math.min(100, (totalStats / 720) * 100)}%` }} />
                </div>
                <b>{totalStats}</b>
              </div>
            </div>

            <div className="build-form">
              <h3>🎮 Configura tu intercambio legal</h3>
              <div className="form-grid">
                {game === 'sv' && (
                  <div className="field">
                    <label>Versión del juego</label>
                    <select value={gameVersion} onChange={(e) => setGameVersion(e.target.value)}>
                      <option value="Scarlet">Scarlet</option>
                      <option value="Violet">Violet</option>
                    </select>
                  </div>
                )}
                <div className="field" style={{ gridColumn: game === 'za' ? '1 / -1' : 'auto' }}>
                  <label>Encuentro / localización legal</label>
                  <select 
                    id="encounterSelect" 
                    onChange={(e) => handleEncounterChange(e.target.value)}
                    value={encounters.indexOf(selectedEncounter) !== -1 ? encounters.indexOf(selectedEncounter) : ''}
                  >
                    <option value="">Selecciona un encuentro...</option>
                    {encounters.map((e, idx) => (
                      <option key={idx} value={idx}>
                        {encounterLabel(e)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!selectedEncounter ? (
                <div id="buildArea" className="notice">
                  Primero elige el encuentro legal de la base.
                </div>
              ) : (
                <div id="buildArea">
                  <div className="form-grid" style={{ marginTop: '16px' }}>
                    <div className="field">
                      <label>
                        Ball {selectedEncounter.fixed?.ball ? <span className="locked">· fija</span> : ''}
                      </label>
                      <select 
                        id="ball" 
                        value={ball} 
                        onChange={(e) => setBall(e.target.value)}
                        disabled={!!selectedEncounter.fixed?.ball}
                      >
                        {(selectedEncounter.selectable?.balls || selectedEncounter.allowedBalls || ['Poké Ball']).map((b: string) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label>Held Item</label>
                      <select id="item" value={heldItem} onChange={(e) => setHeldItem(e.target.value)}>
                        <option value="">Sin objeto</option>
                        {items.filter(it => it !== 'Sin objeto').map((it: string) => (
                          <option key={it} value={it}>
                            {it}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label>Género</label>
                      <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="Random">Random</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Genderless">Genderless</option>
                      </select>
                    </div>

                    <div className="field">
                      <label>
                        Nivel <span className="small">Min: {selectedEncounter.selectable?.levelMin || selectedEncounter.levelMin || 1} · Max: {selectedEncounter.selectable?.levelMax || selectedEncounter.levelMax || 100}</span>
                      </label>
                      <input 
                        id="level" 
                        className="input" 
                        type="number" 
                        min={selectedEncounter.selectable?.levelMin || selectedEncounter.levelMin || 1}
                        max={selectedEncounter.selectable?.levelMax || selectedEncounter.levelMax || 100}
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                      />
                    </div>

                    <div className="field">
                      <label>Naturaleza</label>
                      <select id="nature" value={nature} onChange={(e) => setNature(e.target.value)}>
                        {natures.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    {game === 'sv' && (
                      <div className="field">
                        <label>Teratipo</label>
                        <select id="teraType" value={teraType} onChange={(e) => setTeraType(e.target.value)}>
                          {teraTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="field">
                      <label>EVs</label>
                      <div className="btnrow">
                        <button 
                          className={`toggle ${evMode === 'none' ? 'active' : ''}`}
                          type="button" 
                          onClick={() => setEvMode('none')}
                        >
                          No EVs
                        </button>
                        <button 
                          className={`toggle ${evMode === 'max' ? 'active' : ''}`}
                          type="button" 
                          onClick={() => setEvMode('max')}
                        >
                          Max EVs
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedEncounter.note && (
                    <div className="notice" style={{ marginTop: '14px' }}>
                      {selectedEncounter.note}
                    </div>
                  )}

                  <div className="field" style={{ marginTop: '14px' }}>
                    <label>
                      Shiny{' '}
                      {selectedEncounter.fixed?.shiny === true || selectedEncounter.forceShiny === true ? (
                        <span className="locked">· Shiny obligatorio</span>
                      ) : selectedEncounter.selectable?.shiny === false ? (
                        <span className="locked">· Shiny Locked</span>
                      ) : ''}
                    </label>
                    <div className="btnrow">
                      <button 
                        className={`toggle ${!shiny ? 'active' : ''}`}
                        type="button" 
                        onClick={() => setShiny(false)}
                        disabled={selectedEncounter.fixed?.shiny === true || selectedEncounter.forceShiny === true}
                      >
                        Regular
                      </button>
                      <button 
                        className={`toggle ${shiny ? 'active' : ''}`}
                        type="button" 
                        onClick={() => setShiny(true)}
                        disabled={selectedEncounter.selectable?.shiny === false && selectedEncounter.fixed?.shiny !== true && selectedEncounter.forceShiny !== true}
                      >
                        Shiny
                      </button>
                    </div>
                  </div>

                  <div className="action-stack" style={{ marginTop: '16px' }}>
                    <button 
                      id="orderBtn" 
                      className="main-action" 
                      type="button" 
                      onClick={handleSingleOrder}
                      disabled={validating || isLimitReached}
                    >
                      📨 Realizar intercambio
                    </button>
                    
                    <button 
                      id="addBulkBtn" 
                      className={`secondary-action ${isPremium ? '' : 'locked-btn'}`}
                      type="button"
                      onClick={handleAddToBulk}
                      disabled={validating}
                    >
                      {isPremium ? '➕ Añadir a pedido masivo' : '🔒 Añadir a pedido masivo · Premium'}
                    </button>
                  </div>

                  {isLimitReached && (
                    <div id="result" className="notice error" style={{ marginTop: '12px' }}>
                      🔒 Has alcanzado el límite de 3 intercambios diarios para {game === 'za' ? 'Legends: Z-A' : 'Scarlet / Violet'} hoy. Actualiza tu plan en Membresías para obtener intercambios ilimitados.
                    </div>
                  )}

                  {!isLimitReached && validationResult && (
                    <div 
                      id="result" 
                      className={`notice ${validationResult.success ? '' : 'error'}`}
                      style={{ marginTop: '12px', whiteSpace: 'pre-line' }}
                    >
                      {validationResult.text}
                    </div>
                  )}

                  {!isLimitReached && !validationResult && (
                    <div id="result" className="notice" style={{ marginTop: '12px' }}>
                      El pedido se validará contra la base legal antes de generar el código.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="notice" style={{ padding: '40px' }}>Error al cargar los datos del Pokémon.</div>
        )}
      </div>
    </div>
  );
}
