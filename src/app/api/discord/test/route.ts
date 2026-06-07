import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeader } from '@/lib/supabaseServer';

/**
 * GET /api/discord/test
 * Diagnostic endpoint — verifies Discord channel connectivity without placing a real order.
 * Only accessible by authenticated users (admin check optional).
 *
 * Returns a summary of configured channels, whether the bot token is present,
 * and a live reachability test for each configured channel ID.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const user = await getUserFromHeader(authHeader);
  if (!user) {
    return NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 });
  }

  const token = process.env.DISCORD_TOKEN?.trim();
  const isBot = process.env.DISCORD_IS_BOT === 'true';

  const channels: Record<string, string | undefined> = {
    sv_premium: process.env.DISCORD_CHANNEL_ID_SV_PREMIUM?.replace(/[^0-9]/g, ''),
    sv_free:    process.env.DISCORD_CHANNEL_ID_SV_FREE?.replace(/[^0-9]/g, ''),
    za_premium: process.env.DISCORD_CHANNEL_ID_ZA_PREMIUM?.replace(/[^0-9]/g, ''),
    za_free:    process.env.DISCORD_CHANNEL_ID_ZA_FREE?.replace(/[^0-9]/g, ''),
  };

  const webhooks: Record<string, string | undefined> = {
    sv:       process.env.DISCORD_WEBHOOK_SV,
    sv_free:  process.env.DISCORD_WEBHOOK_SV_FREE,
    za:       process.env.DISCORD_WEBHOOK_ZA,
    sv_bulk:  process.env.DISCORD_WEBHOOK_SV_BULK,
    za_bulk:  process.env.DISCORD_WEBHOOK_ZA_BULK,
  };

  const results: Record<string, any> = {};

  // Test each channel via Discord REST API (GET channel info, not sending a message)
  if (token) {
    const authHeader = isBot ? `Bot ${token}` : token;
    for (const [key, channelId] of Object.entries(channels)) {
      if (!channelId) {
        results[`channel_${key}`] = { configured: false, reachable: false, reason: 'No configurado' };
        continue;
      }
      try {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}`, {
          headers: { Authorization: authHeader },
        });
        if (res.ok) {
          const data = await res.json();
          results[`channel_${key}`] = {
            configured: true,
            reachable: true,
            channelId,
            channelName: data.name || '(desconocido)',
            type: data.type,
          };
        } else {
          const text = await res.text();
          results[`channel_${key}`] = {
            configured: true,
            reachable: false,
            channelId,
            reason: `HTTP ${res.status}: ${text.slice(0, 120)}`,
          };
        }
      } catch (err: any) {
        results[`channel_${key}`] = {
          configured: true,
          reachable: false,
          channelId,
          reason: err.message || String(err),
        };
      }
    }
  } else {
    for (const key of Object.keys(channels)) {
      results[`channel_${key}`] = {
        configured: Boolean(channels[key]),
        reachable: false,
        reason: 'DISCORD_TOKEN no configurado — usando webhooks como fallback',
      };
    }
  }

  // Check webhook URLs (just verify they're set, don't ping them)
  for (const [key, url] of Object.entries(webhooks)) {
    results[`webhook_${key}`] = {
      configured: Boolean(url),
      url: url ? `${url.slice(0, 40)}…` : null,
    };
  }

  return NextResponse.json({
    ok: true,
    tokenPresent: Boolean(token),
    isBot,
    channels: Object.fromEntries(
      Object.entries(channels).map(([k, v]) => [k, v || null])
    ),
    diagnostics: results,
    configuredAt: new Date().toISOString(),
  });
}
