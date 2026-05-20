# PKDEX Trade Final Dark ZA/SV

Versión final oscura y responsive del creador de Pokémon legales para intercambio.

## Incluye

- Selector de juego con logos PNG: Legends: Z-A y Scarlet/Violet.
- Bases separadas para ZA y SV.
- Buscador y filtro por método.
- Modal compacto de configuración legal por Pokémon.
- Teratipo solo en Scarlet/Violet.
- Held items separados por juego.
- Pedido individual con código aleatorio de intercambio.
- Pedido masivo preparado, máximo 3 y solo dentro del mismo juego.
- Dashboard mock preparado para login/suscripción.
- Endpoints preparados para que el programador conecte Discord/SysBot.

## Ejecutar local

```bash
npm install
npm start
```

## Deploy

Render/Railway:

- Build Command: `npm install`
- Start Command: `npm start`

## Integración Discord/SysBot

Editar en `src/server.js`:

- `formatSysbotCommand(order, tradeCode)` para adaptar el comando.
- variables de entorno:
  - `DISCORD_WEBHOOK_ZA`
  - `DISCORD_WEBHOOK_SV`
  - o `DISCORD_WEBHOOK_URL` común.

## Activar pedido masivo premium

Editar `public/app.js`:

```js
CONFIG.enableBulkOrders = true
```

Actualmente está bloqueado como función Premium.

## Actualización v2.1 - Formas, deduplicación y HOME

- Añadidas formas/cortes de Furfrou en Legends: Z-A como variantes seleccionables.
- Dedupe automático de encuentros antes de enviarlos al frontend para reducir opciones repetidas en el selector.
- Añadida capa práctica de `Pokémon HOME` para Scarlet/Violet en especies de generaciones anteriores disponibles en SV. Esto permite casos como Charizard shiny por transferencia HOME aunque el 7-Star Raid directo esté shiny locked.
- La validación final del archivo concreto debe seguir haciéndola SysBot/PKHeX cuando se conecte el bot real.

## Capa HOME / Transferencia legal

Esta versión añade `Pokémon HOME / Transferencia` como **origen separado** para ZA y SV.

- No desbloquea shiny en eventos o encuentros nativos shiny locked.
- Si el usuario elige un origen nativo shiny locked, el botón Shiny sigue bloqueado.
- Si el usuario elige `Pokémon HOME / Transferencia`, el shiny se permite solo cuando la especie no está en la lista `HOME_SHINY_NEVER_SPECIES`.
- Casos como Groudon en Z-A o Charizard en SV quedan cubiertos: el encuentro nativo puede estar locked, pero HOME permite shiny si el Pokémon procede de una ruta legal anterior.
- La validación final del archivo concreto debe hacerla SysBot/PKHeX cuando se conecte el bot real.

Archivos relevantes:

- `src/server.js`: funciones `canUseHomeTransfer`, `canBeShinyViaHome` y `makeHomeTransferEncounter`.
- `data/transfer_rules.json`: documentación editable de reglas HOME.
- `GET /api/transfer-rules`: endpoint de diagnóstico de reglas.


## v4 HOME Origin Profiles

Esta versión corrige la capa HOME: ya no se muestra como una transferencia genérica de nivel 1 a 100 para todos los casos. El backend añade perfiles HOME separados por origen:

- Perfiles específicos cuando hay un evento claro, por ejemplo **HOME - Evento Ultra Shiny Groudon**, Nv. 60, Cherish Ball, shiny obligatorio.
- Perfil de **HOME - Origen legal anterior validable por PKHeX** para el resto, con mínimo de nivel seguro para evoluciones y legendarios.
- Los encuentros nativos shiny locked siguen bloqueados. HOME no desbloquea un raid/evento shiny locked; aparece como origen diferente.

Archivos relevantes:

- `data/home_origin_profiles.json`
- `data/transfer_rules.json`
- `src/server.js` → `HOME_SPECIFIC_PROFILES`, `HOME_MIN_LEVEL_BY_SPECIES`, `formatSysbotCommand()`

Para producción, el SysBot/PKHeX debe validar el archivo final con met data/origin game/PID/ball/moves. La web prepara opciones seguras y evita combinaciones obvias ilegales como Groudon shiny HOME Nv. 1.
