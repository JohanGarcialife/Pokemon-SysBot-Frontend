import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildShowdownText, PokemonBuildPayload } from './showdownBuilder';
import { formatHomeEventSysbotCommand, findHomeEventProfile } from './homeEventPatch';

export interface DispatchResult {
  sent: boolean;
  method: 'selfbot' | 'webhook' | 'none';
  channelId?: string;
  webhookUrl?: string;
  reason?: string;
  commandSent?: string;
}

// Map of HOME event profile IDs → .pa9 filename in mgdb/ (ZA only)
// When a .pa9 exists, we attach it directly — SysBot reads the file instead of Showdown text.
// Groudon uses Showdown text (no .pa9 needed since it already works perfectly).
const PROFILE_PA9_MAP: Record<string, string> = {
  // Legendarios Shinys de Otras Ediciones (HOME transfer ZA)
  'home-shiny-zeraora':                'HOME Shiny Zeraora ZA.pa9',
  'home-movie-2013-shiny-genesect-jpn':'HOME Shiny Genesect ZA.pa9',
  'home-pokecen-shiny-diancie-jpn':    'HOME Shiny Diancie ZA.pa9',
  'home-xyz-shiny-xerneas':            'HOME Shiny Xerneas ZA.pa9',
  'home-xyz-shiny-yveltal':            'HOME Shiny Yveltal ZA.pa9',
  'home-2018-legends-shiny-zygarde':   'HOME Shiny Zygarde ZA.pa9',
  'home-ultra-shiny-kyogre-jpn':       'HOME Shiny Kyogre ZA.pa9',
  'home-ultra-shiny-kyogre-kor':       'HOME Shiny Kyogre ZA.pa9',
  'home-galileo-shiny-rayquaza':       'HOME Shiny Rayquaza ZA.pa9',
  // New ZA HOME profiles (added 2026-05-21)
  'home-movie-shiny-mewtwo-jpn':       'HOME Shiny Mewtwo ZA.pa9',
  'home-summit-shiny-heatran-jpn':     'HOME Shiny Heatran ZA.pa9',
  'home-movie-shiny-keldeo-jpn':       'HOME Shiny Keldeo ZA.pa9',
  'home-alerts-shiny-darkrai-jpn':     'HOME Shiny Darkrai ZA.pa9',
  'home-sinnoh-shiny-meloetta-jpn':    'HOME Shiny Meloetta ZA.pa9',
  'home-original-color-magearna':      'HOME Magearna Original Color ZA.pa9',
  'home-shiny-meltan':                 'HOME Shiny Meltan ZA.pa9',
  'home-shiny-melmetal':               'HOME Shiny Melmetal ZA.pa9',
  'home-dex-completion-shiny-volcanion-za': 'HOME Shiny Volcanion ZA.pa9',
};

/**
 * Looks up the mgdb .pa9 file for a given HOME event profile ID.
 * Returns { buffer, filename } if found and readable, or null otherwise.
 */
function loadPa9Attachment(profileId: string): { buffer: Buffer; filename: string } | null {
  const filename = PROFILE_PA9_MAP[profileId];
  if (!filename) return null;
  let pa9Path = join(process.cwd(), 'public', 'mgdb', filename);
  if (!existsSync(pa9Path)) {
    pa9Path = join(process.cwd(), 'mgdb', filename);
  }
  if (!existsSync(pa9Path)) {
    pa9Path = join(__dirname, '..', '..', 'public', 'mgdb', filename);
  }
  if (!existsSync(pa9Path)) {
    pa9Path = join(__dirname, '..', '..', 'mgdb', filename);
  }
  if (!existsSync(pa9Path)) {
    console.warn(`[DiscordDispatcher] .pa9 file not found: ${filename}`);
    return null;
  }
  try {
    const buffer = readFileSync(pa9Path);
    return { buffer, filename };
  } catch (err: any) {
    console.warn(`[DiscordDispatcher] Could not read .pa9 file ${filename}:`, err.message);
    return null;
  }
}

/**
 * Dispatches trade commands to Discord using either a Discord Selfbot Token (REST request)
 * or Webhooks, depending on the environment variables defined.
 */

// --- SV HOME EXPANSION PATCH START ---
const dataDir = join(process.cwd(), 'data');
let SV_HOME_EXPANSION_FILE_MAP_PATH = join(dataDir, 'sv_home_expansion_file_map.json');
if (!existsSync(SV_HOME_EXPANSION_FILE_MAP_PATH)) {
  SV_HOME_EXPANSION_FILE_MAP_PATH = join(__dirname, '..', '..', 'data', 'sv_home_expansion_file_map.json');
}
let SV_HOME_EXPANSION_FILE_MAP: Record<string, any> = {};
if (existsSync(SV_HOME_EXPANSION_FILE_MAP_PATH)) {
  try {
    SV_HOME_EXPANSION_FILE_MAP = JSON.parse(readFileSync(SV_HOME_EXPANSION_FILE_MAP_PATH, 'utf8'));
  } catch (err: any) {
    console.error('[DiscordDispatcher] Error loading sv_home_expansion_file_map.json:', err.message);
  }
}
// --- SV HOME EXPANSION PATCH END ---

// Map of SV HOME shiny species ID → pk file name in pk9/ (SV only)
const SV_HOME_SHINY_FILES: Record<number, string> = {
  144: '0144-01 ★ - Articuno - F2270DF1E9CC.pk8',
  145: '0145-01 ★ - Zapdos - B5F817E8AFE3.pk8',
  146: '0146-01 ★ - Moltres - B6184A160BBA.pk8',
  150: '0150 ★ - Mewtwo - 97B4B79FA948.pk6',
  243: '0243 ★ - RAIKOU - 346836D46750.pk4',
  244: '0244 ★ - ENTEI - 32627D5BB510.pk4',
  245: '0245 ★ - SUICUNE - 891442FCBC7E.pk4',
  250: '0250 ★ - Ho-Oh - FB3B64A582E9.pk6',
  382: '0382 ★ - Kyogre - 41F13FAB7818.pk7',
  383: '0383 ★ - Groudon - 470D05B9D0DB.pk7',
  384: '0384 ★ - Rayquaza - 4426B679369F.pk6',
  483: '0483 ★ - Dialga - BEE9204C004C.pk5',
  484: '0484 ★ - Palkia - 5BD5236C00E9.pk5',
  791: '0791 ★ - Solgaleo - AF9DB8E828BA.pk7',
  792: '0792 ★ - Lunala - 8B8332462948.pk7',
  800: '0800 ★ - Necrozma - 091B3E0E66BA.pk7',
};

/**
 * Dispatches trade commands to Discord using either a Discord Selfbot Token (REST request)
 * or Webhooks, depending on the environment variables defined.
 */
export async function dispatchTradeCommand(
  game: 'za' | 'sv',
  pokemonList: PokemonBuildPayload[],
  tradeCode: string,
  userPlan: 'free' | 'premium' = 'free'
): Promise<DispatchResult> {
  const discordToken = process.env.DISCORD_TOKEN?.trim();
  const formattedCode = tradeCode.replace(/\s/g, ''); // "1234 5678" -> "12345678"

  // 1. Determine target channel and prefix (Matching OrderWorker.ts logic)
  let targetChannelId = '';
  let commandPrefix = '%';

  if (game === 'sv') {
    targetChannelId = process.env.DISCORD_CHANNEL_ID_SV || process.env.DISCORD_CHANNEL_ID || '';
    commandPrefix = '%'; // SV Prefix
  } else if (game === 'za') {
    if (userPlan === 'free') {
      targetChannelId = process.env.DISCORD_CHANNEL_ID_ZA_FREE || process.env.DISCORD_CHANNEL_ID_ZA || process.env.DISCORD_CHANNEL_ID || '';
      commandPrefix = '!'; // ZA Free Prefix (uses !trade)
    } else {
      targetChannelId = process.env.DISCORD_CHANNEL_ID_ZA_PREMIUM || process.env.DISCORD_CHANNEL_ID_ZA || process.env.DISCORD_CHANNEL_ID || '';
      commandPrefix = '!'; // ZA Premium Prefix (uses !trade)
    }
  }

  targetChannelId = targetChannelId.replace(/[^0-9]/g, '');

  // 2. Set the game property on each Pokemon copy
  const processedPokemonList = pokemonList.map(p => {
    const copy = { ...p };
    copy.game = game;
    return copy;
  });

  // 3. Build command for each Pokémon.
  //    Strategy:
  //      a) If the game is ZA AND there is a .pa9 file for this HOME profile → attach the .pa9
  //         and send only the trade code as message content (SysBot reads the file).
  //      b) If the game is SV AND the Pokemon is HOME shiny and has a fixed .pk file → attach the .pk
  //         and send only the trade code as message content.
  //      c) Otherwise → Showdown text command (works for Groudon, SV, etc.)
  const attachments: { buffer: Buffer; filename: string }[] = [];

  const commandLines = processedPokemonList.map(p => {
    // Try to find a HOME event profile with a pa9 attachment (ZA only, premium only)
    if (game === 'za' && userPlan === 'premium') {
      const eventProfile = findHomeEventProfile(p);
      if (eventProfile?.id) {
        const pa9 = loadPa9Attachment(eventProfile.id);
        if (pa9) {
          attachments.push(pa9);
          console.log(`[DiscordDispatcher] Using .pa9 attachment: ${pa9.filename} for profile ${eventProfile.id}`);
          // When sending a .pa9, the message content is just the trade command line.
          // SysBot ZA reads the attached file directly.
          return `${commandPrefix}trade ${formattedCode}`;
        }
      }
    }

    // SV HOME Expansion Fixed File Attachments
    const expansionKey = `${Number(p.dexId ?? p.species)}-${Number(p.form || 0)}`;
    const expansion = game === 'sv' ? SV_HOME_EXPANSION_FILE_MAP[expansionKey] : null;
    if (expansion) {
      const filename = expansion.fileName;
      let pkPath = join(process.cwd(), 'public', 'sv_home_expansion_files', filename);
      if (!existsSync(pkPath)) {
        pkPath = join(process.cwd(), 'data', 'sv_home_expansion_files', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', 'public', 'sv_home_expansion_files', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', 'data', 'sv_home_expansion_files', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', '..', 'public', 'sv_home_expansion_files', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', '..', 'data', 'sv_home_expansion_files', filename);
      }
      if (existsSync(pkPath)) {
        try {
          const buffer = readFileSync(pkPath);
          attachments.push({ buffer, filename });
          console.log(`[DiscordDispatcher] ✅ Loaded expansion fixed .pk/.pb8 file: ${filename} for species ${expansionKey}`);
          return `${commandPrefix}trade ${formattedCode}`;
        } catch (err: any) {
          console.warn(`[DiscordDispatcher] ⚠️ Could not read expansion fixed file ${filename}:`, err.message);
        }
      } else {
        console.warn(`[DiscordDispatcher] ⚠️ Expansion fixed file not found for species ${expansionKey} (${filename})`);
      }
    }

    // SV HOME Shiny Attachments
    const isHome = p.homeProfileId || p.encounterId?.startsWith('home-') || p.origin?.toLowerCase().includes('home');
    const dexId = Number(p.dexId ?? p.species);
    if (game === 'sv' && p.shiny && isHome && dexId && SV_HOME_SHINY_FILES[dexId]) {
      const filename = SV_HOME_SHINY_FILES[dexId];
      let pkPath = join(process.cwd(), 'public', 'pk9', filename);
      if (!existsSync(pkPath)) {
        pkPath = join(process.cwd(), 'pk9', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', 'public', 'pk9', filename);
      }
      if (!existsSync(pkPath)) {
        pkPath = join(__dirname, '..', '..', 'pk9', filename);
      }
      if (existsSync(pkPath)) {
        try {
          const buffer = readFileSync(pkPath);
          attachments.push({ buffer, filename });
          console.log(`[DiscordDispatcher] ✅ Loaded fixed .pk file: ${filename} for species ${dexId}`);
          return `${commandPrefix}trade ${formattedCode}`;
        } catch (err: any) {
          console.warn(`[DiscordDispatcher] ⚠️ Could not read .pk file ${filename}:`, err.message);
        }
      } else {
        console.warn(`[DiscordDispatcher] ⚠️ Fixed pk file not found for species ${dexId} (${filename})`);
      }
    }

    // Fallback: Showdown text (Groudon, SV Pokémon, anything without a .pa9 or .pk file)
    const eventBody = formatHomeEventSysbotCommand(p);
    const showdownText = eventBody || buildShowdownText(p, game);
    return `${commandPrefix}trade ${formattedCode}\n${showdownText}`;
  });

  const combinedMessage = commandLines.join('\n\n---\n\n');

  // 4. Dispatch via Selfbot Token if available
  let selfbotError = '';
  if (discordToken && targetChannelId) {
    try {
      console.log(`[DiscordDispatcher] Dispatching to channel ${targetChannelId} via Selfbot HTTP REST...`);
      
      let response;
      if (attachments.length > 0) {
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify({
          content: combinedMessage
        }));
        attachments.forEach((att, idx) => {
          formData.append(`files[${idx}]`, new Blob([new Uint8Array(att.buffer)]), att.filename);
        });

        response = await fetch(`https://discord.com/api/v9/channels/${targetChannelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': discordToken
          },
          body: formData
        });
      } else {
        response = await fetch(`https://discord.com/api/v9/channels/${targetChannelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': discordToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: combinedMessage
          })
        });
      }

      if (response.ok) {
        console.log('[DiscordDispatcher] ✅ Command sent via Selfbot REST!');
        return {
          sent: true,
          method: 'selfbot',
          channelId: targetChannelId,
          commandSent: combinedMessage
        };
      } else {
        const text = await response.text();
        selfbotError = `Discord REST failed (Status: ${response.status}): ${text}`;
        console.error(`[DiscordDispatcher] ${selfbotError}`);
        // Fall back to Webhooks if REST fails
      }
    } catch (error: any) {
      selfbotError = `Discord REST error: ${error.message || String(error)}`;
      console.error('[DiscordDispatcher] Selfbot REST send error:', error);
      // Fall back to Webhooks
    }
  }

  // 5. Fallback/Default: Webhook
  const isBulk = pokemonList.length > 1;
  const webhookKey = isBulk ? `${game}_bulk` : game;
  
  // Webhook URLs Map
  const SYSBOT_DISCORD_WEBHOOKS: Record<string, string> = {
    za: process.env.DISCORD_WEBHOOK_ZA || process.env.DISCORD_WEBHOOK_URL || '',
    sv: process.env.DISCORD_WEBHOOK_SV || process.env.DISCORD_WEBHOOK_URL || '',
    za_bulk: process.env.DISCORD_WEBHOOK_ZA_BULK || process.env.DISCORD_WEBHOOK_ZA || process.env.DISCORD_WEBHOOK_URL || '',
    sv_bulk: process.env.DISCORD_WEBHOOK_SV_BULK || process.env.DISCORD_WEBHOOK_SV || process.env.DISCORD_WEBHOOK_URL || '',
  };

  const webhookUrl = SYSBOT_DISCORD_WEBHOOKS[webhookKey];

  if (webhookUrl) {
    try {
      console.log(`[DiscordDispatcher] Dispatching to Webhook (${webhookKey})...`);
      
      let response;
      if (attachments.length > 0) {
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify({
          content: combinedMessage,
          username: isBulk
            ? (game === 'sv' ? 'PKDEX SV Bulk Orders' : 'PKDEX ZA Bulk Orders')
            : (game === 'sv' ? 'PKDEX SV Orders' : 'PKDEX ZA Orders'),
          allowed_mentions: { parse: [] }
        }));
        attachments.forEach((att, idx) => {
          formData.append(`files[${idx}]`, new Blob([new Uint8Array(att.buffer)]), att.filename);
        });

        response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: combinedMessage,
            username: isBulk
              ? (game === 'sv' ? 'PKDEX SV Bulk Orders' : 'PKDEX ZA Bulk Orders')
              : (game === 'sv' ? 'PKDEX SV Orders' : 'PKDEX ZA Orders'),
            allowed_mentions: { parse: [] }
          })
        });
      }

      if (response.ok) {
        console.log('[DiscordDispatcher] ✅ Command sent via Webhook!');
        return {
          sent: true,
          method: 'webhook',
          webhookUrl,
          commandSent: combinedMessage
        };
      } else {
        const text = await response.text();
        return {
          sent: false,
          method: 'webhook',
          webhookUrl,
          reason: `Webhook error status: ${response.status} ${text}`
        };
      }
    } catch (error: any) {
      return {
        sent: false,
        method: 'webhook',
        webhookUrl,
        reason: error.message || String(error)
      };
    }
  }

  return {
    sent: false,
    method: 'none',
    reason: selfbotError || 'Neither DISCORD_TOKEN + Channel ID nor Webhook URL is configured.'
  };
}
