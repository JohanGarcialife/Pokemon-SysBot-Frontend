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

const PROFILE_WONDER_CARD_MAP: Record<string, string> = {
  'home-ultra-shiny-groudon-jpn': 'Ultra Shiny Groudon JPN.wc7full',
  'home-ultra-shiny-groudon-kor': 'Ultra Shiny Groudon KOR.wc7full',
  'home-ultra-shiny-kyogre-jpn': 'Ultra Shiny Kyogre JPN.wc7full',
  'home-ultra-shiny-kyogre-kor': 'Ultra Shiny Kyogre KOR.wc7full',
  'home-galileo-shiny-rayquaza': 'Galileo Shiny Rayquaza.wc6full',
  'home-movie-2013-shiny-genesect-jpn': 'Movie 2013 Shiny Genesect JPN.pgf',
  'home-pokecen-shiny-diancie-jpn': 'Pokecen Shiny Diancie JPN.wc6',
  'home-xyz-shiny-xerneas': 'XYZ Shiny Xerneas.wc6full',
  'home-xyz-shiny-yveltal': 'XYZ Shiny Yveltal.wc6full',
  'home-2018-legends-shiny-zygarde': '2018 Legends Shiny Zygarde.wc7full',
  'home-shiny-zeraora': 'HOME Shiny Zeraora.wc8',
  'home-eclipse-shiny-solgaleo': 'Eclipse Shiny Solgaleo.wc7full',
  'home-eclipse-shiny-lunala': 'Eclipse Shiny Lunala.wc7full',
  'home-secret-club-shiny-necrozma-jpn': 'Secret Club Shiny Necrozma JPN.wc7full',
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
  let commandPrefix = '!';

  if (game === 'sv') {
    targetChannelId = process.env.DISCORD_CHANNEL_ID_SV || process.env.DISCORD_CHANNEL_ID || '';
    commandPrefix = '!'; // SV Prefix
  } else if (game === 'za') {
    if (userPlan === 'free') {
      targetChannelId = process.env.DISCORD_CHANNEL_ID_ZA_FREE || process.env.DISCORD_CHANNEL_ID_ZA || process.env.DISCORD_CHANNEL_ID || '';
      commandPrefix = '%'; // ZA Free Prefix
    } else {
      targetChannelId = process.env.DISCORD_CHANNEL_ID_ZA_PREMIUM || process.env.DISCORD_CHANNEL_ID_ZA || process.env.DISCORD_CHANNEL_ID || '';
      commandPrefix = '$'; // ZA Premium Prefix
    }
  }

  targetChannelId = targetChannelId.replace(/[^0-9]/g, '');

  // 2. Event data injection (Gift / Mystery Gift OT/TID/Language mapping from OrderWorker.ts)
  const EVENT_DATA: Record<string, { ot: string; tid: number; language: string }> = {
    genesect:  { ot: 'Plasma', tid: 10072, language: 'Japanese' },
    groudon:   { ot: 'HOME',   tid: 240001, language: 'Spanish'  },
    kyogre:    { ot: 'HOME',   tid: 240001, language: 'Spanish'  },
    rayquaza:  { ot: 'HOME',   tid: 240001, language: 'Spanish'  },
  };

  const processedPokemonList = pokemonList.map(p => {
    const copy = { ...p };
    copy.game = game;
    const speciesKey = String(p.species).toLowerCase();
    const eventData = p.shiny ? EVENT_DATA[speciesKey] : undefined;
    if (eventData) {
      (copy as any).eventOT = eventData.ot;
      (copy as any).eventTID = eventData.tid;
      (copy as any).eventLanguage = eventData.language;
    }
    return copy;
  });

  // 3. Build Showdown text and gather physical attachments
  const attachments: { buffer: Buffer; filename: string }[] = [];

  const commandLines = processedPokemonList.map(p => {
    const profile = findHomeEventProfile(p);
    if (profile) {
      const cardFilename = PROFILE_WONDER_CARD_MAP[profile.id];
      if (cardFilename) {
        const filePath = join(process.cwd(), '..', 'mgdb', cardFilename);
        if (existsSync(filePath)) {
          console.log(`[DiscordDispatcher] Found Wonder Card file for profile ${profile.id}: ${cardFilename}`);
          attachments.push({
            buffer: readFileSync(filePath),
            filename: cardFilename
          });
          // Exactly prefix + trade + tradeCode, no Showdown body
          return `${commandPrefix}trade ${formattedCode}`;
        }
      }
    }

    // Fallback: standard command with Showdown body
    const eventBody = formatHomeEventSysbotCommand(p);
    const showdownText = eventBody || buildShowdownText(p, game);
    return `${commandPrefix}trade ${formattedCode}\n${showdownText}`;
  });

  const combinedMessage = commandLines.join('\n\n---\n\n');

  // 4. Dispatch via Selfbot Token if available
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
        console.error(`[DiscordDispatcher] Selfbot REST failed with status: ${response.status}. Body: ${text}`);
        // Fall back to Webhooks if REST fails
      }
    } catch (error: any) {
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
    reason: 'Neither DISCORD_TOKEN + Channel ID nor Webhook URL is configured.'
  };
}
