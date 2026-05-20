# PKDEX con estructura tipo Next.js sin romper la versión original

Esta entrega conserva intacta la base original del primer ZIP y añade una organización tipo proyecto profesional como la de tu captura.

## Lo que NO se ha tocado

Estos archivos siguen igual que en el ZIP original:

- `data/` → base de datos JSON de Pokémon, encuentros, reglas HOME, items, etc.
- `public/index.html` → frontpage original funcionando como antes.
- `public/styles.css` → estilos originales de la página.
- `public/app.js` → lógica original del creador, filtros, modales y pedidos.
- `src/server.js` → servidor original de Node que carga la base de datos.

## Lo nuevo

Se añadió una estructura editable para un programador:

```txt
src/
├─ app/
│  ├─ auth/
│  ├─ dashboard/
│  ├─ login/
│  ├─ teambuilder/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ frontpage/
│  │  ├─ BulkOrderSection.tsx
│  │  ├─ CreatorSection.tsx
│  │  ├─ DashboardCards.tsx
│  │  ├─ GameSelector.tsx
│  │  ├─ Hero.tsx
│  │  ├─ PokedexGrid.tsx
│  │  ├─ PokemonTemplatesAndModals.tsx
│  │  └─ SearchAndFilters.tsx
│  └─ layout/
│     └─ SiteNav.tsx
├─ hooks/
├─ lib/
└─ utils/
```

## Qué debe editar el programador

- Header: `src/components/layout/SiteNav.tsx`
- Hero principal: `src/components/frontpage/Hero.tsx`
- Tarjetas del dashboard: `src/components/frontpage/DashboardCards.tsx`
- Selector de juego: `src/components/frontpage/GameSelector.tsx`
- Buscador y filtros: `src/components/frontpage/SearchAndFilters.tsx`
- Grid de Pokémon: `src/components/frontpage/PokedexGrid.tsx`
- Pedido masivo: `src/components/frontpage/BulkOrderSection.tsx`
- Modales: `src/components/frontpage/PokemonTemplatesAndModals.tsx`
- Página principal ensamblada: `src/app/page.tsx`

## Importante

Esta estructura está preparada para migrar a Next.js, pero mantiene la app original operativa. El script actual `npm start` sigue apuntando al servidor original.

Para activar Next.js de forma real, el programador debe instalar Next/React y convertir las rutas `/api` del servidor actual a API routes o mantener el backend Node separado.
