'use client';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  method: string;
  setMethod: (method: string) => void;
  methods: string[];
}

export function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  method,
  setMethod,
  methods,
}: SearchAndFiltersProps) {
  return (
    <>
      <div className="step-title second"><span>2</span><strong>BUSCAR Y FILTRAR POKÉMON</strong></div>
      <div className="tools-row">
        <label className="search-box">
          <span>⌕</span>
          <input 
            id="search" 
            type="search" 
            placeholder="Ejemplo: Charizard, Arceus, Donphan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <select 
          id="methodFilter" 
          aria-label="Filtrar por método"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">Todos los métodos</option>
          {methods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
