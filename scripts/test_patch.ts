import { getShowdownSpeciesName } from '../src/lib/showdownBuilder';
import { canUseHomeTransfer, formatSysbotCommand } from '../src/lib/validation';
import { dispatchTradeCommand } from '../src/lib/discordDispatcher';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

async function runTests() {
  console.log('--- RUNNING TESTS ---');

  // Test 1: getShowdownSpeciesName Form Mapping
  const tests1 = [
    { dexId: 676, form: 1, species: 'Furfrou', expected: 'Furfrou-Heart' },
    { dexId: 676, form: 2, species: 'Furfrou', expected: 'Furfrou-Star' },
    { dexId: 718, form: 2, species: 'Zygarde', expected: 'Zygarde-Complete' },
    { dexId: 670, form: 5, species: 'Floette', expected: 'Floette-Eternal' },
    { dexId: 710, form: 3, species: 'Pumpkaboo', expected: 'Pumpkaboo-Super' },
    { dexId: 711, form: 3, species: 'Gourgeist', expected: 'Gourgeist-Super' },
  ];

  for (const t of tests1) {
    const res = getShowdownSpeciesName({
      species: t.species,
      dexId: t.dexId,
      form: t.form,
      level: 50,
      nature: 'Hardy',
      ability: 'Overgrow',
      shiny: false,
      alpha: false,
      gender: 'Random',
      heldItem: 'None',
      teraType: 'Normal',
      pokeball: 'Poke Ball',
      origin: 'Paldea',
      moves: [],
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
    });
    console.log(`getShowdownSpeciesName(${t.species} Form ${t.form}) => ${res} (Expected: ${t.expected})`);
    if (res !== t.expected) {
      console.error('❌ Test 1 Failed!');
      process.exit(1);
    }
  }
  console.log('✅ Test 1 Passed!');

  // Test 2: canUseHomeTransfer Restrictions
  // Venusaur is dexId 3. SV has it in sv_pokemon.json, but there is no active profile for it.
  const canVenusaurSV = canUseHomeTransfer('sv', 3, false);
  console.log(`canUseHomeTransfer('sv', 3, false) [Venusaur] => ${canVenusaurSV} (Expected: false)`);
  if (canVenusaurSV !== false) {
    console.error('❌ Test 2 (Venusaur SV) Failed!');
    process.exit(1);
  }

  // Groudon is dexId 383 (Legendary). Should return true even with false for native encounters.
  const canGroudonSV = canUseHomeTransfer('sv', 383, false);
  console.log(`canUseHomeTransfer('sv', 383, false) [Groudon] => ${canGroudonSV} (Expected: true)`);
  if (canGroudonSV !== true) {
    console.error('❌ Test 2 (Groudon SV) Failed!');
    process.exit(1);
  }

  // Test custom dummy case where hasNoNativeEncounters is true (should return true)
  const canVenusaurNoNative = canUseHomeTransfer('sv', 3, true);
  console.log(`canUseHomeTransfer('sv', 3, true) [Venusaur transfer-only mock] => ${canVenusaurNoNative} (Expected: true)`);
  if (canVenusaurNoNative !== true) {
    console.error('❌ Test 2 (Venusaur transfer-only mock) Failed!');
    process.exit(1);
  }
  console.log('✅ Test 2 Passed!');

  // Test 3: formatSysbotCommand Held Item Join Format
  const commandRes = formatSysbotCommand({
    species: 'Pikachu',
    displayName: 'Pikachu',
    heldItem: 'Light Ball',
    ability: 'Static',
    level: 50,
    shiny: false,
    nature: 'Jolly',
    evMode: 'none',
    game: 'sv',
    ball: 'Poke Ball'
  }, '12345678');
  console.log('Formatted command preview:\n' + commandRes);
  if (!commandRes.includes('Pikachu @ Light Ball') || commandRes.includes('\n@')) {
    console.error('❌ Test 3 Failed! Held item not joined properly on species line.');
    process.exit(1);
  }
  console.log('✅ Test 3 Passed!');

  // Test 4: dispatchTradeCommand event Showdown text without Wonder Card attachment
  console.log('Running Test 4 (Showdown text without Wonder Card attachment)...');
  // We'll set a mock webhook URL env var to capture the fetch payload
  const mockWebhookUrl = 'http://localhost:9999/webhook-mock';
  process.env.DISCORD_WEBHOOK_SV = mockWebhookUrl;

  const originalFetch = globalThis.fetch;
  let lastFetchUrl = '';
  let lastFetchOptions: any = null;

  globalThis.fetch = async (url: any, options: any) => {
    lastFetchUrl = String(url);
    lastFetchOptions = options;
    return {
      ok: true,
      status: 200,
      text: async () => 'OK'
    } as any;
  };

  try {
    const res = await dispatchTradeCommand('sv', [
      {
        species: 'Groudon',
        dexId: 383,
        form: 0,
        level: 60,
        nature: 'Hardy',
        ability: 'Drought',
        shiny: true,
        alpha: false,
        gender: 'Random',
        heldItem: 'None',
        teraType: 'Normal',
        pokeball: 'Cherish Ball',
        origin: 'Paldea',
        moves: [],
        ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
        evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        homeProfileId: 'home-ultra-shiny-groudon-jpn'
      }
    ], '87654321', 'free');

    console.log('Dispatch result:', res);
    console.log('Fetch URL:', lastFetchUrl);
    console.log('Has body FormData?', lastFetchOptions?.body instanceof FormData);

    if (lastFetchOptions?.body instanceof FormData) {
      console.error('❌ Test 4 Failed! Fetch body should NOT be FormData');
      process.exit(1);
    } else {
      const payload = JSON.parse(lastFetchOptions.body);
      console.log('Command Content:', payload.content);

      if (!payload.content.startsWith('%trade 87654321')) {
        console.error('❌ Test 4 Failed! Message content does not start with %trade 87654321');
        process.exit(1);
      }

      if (!payload.content.includes('Groudon')) {
        console.error('❌ Test 4 Failed! Message content does not contain Groudon Showdown body');
        process.exit(1);
      }
    }
    console.log('✅ Test 4 Passed!');

    // Test 5: dispatchTradeCommand .pa9 file attachment (ZA Premium)
    console.log('Running Test 5 (.pa9 file attachments for ZA Premium)...');
    process.env.DISCORD_WEBHOOK_ZA = mockWebhookUrl;

    const res5 = await dispatchTradeCommand('za', [
      {
        species: 'Meltan',
        dexId: 808,
        form: 0,
        level: 1,
        nature: 'Hardy',
        ability: 'Magnet Pull',
        shiny: true,
        alpha: false,
        gender: 'Random',
        heldItem: 'None',
        teraType: 'Normal',
        pokeball: 'Poke Ball',
        origin: 'Paldea',
        moves: [],
        ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
        evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        homeProfileId: 'home-shiny-meltan'
      }
    ], '87654321', 'premium');

    console.log('Dispatch result Test 5:', res5);
    console.log('Fetch URL Test 5:', lastFetchUrl);
    console.log('Has body FormData Test 5?', lastFetchOptions?.body instanceof FormData);

    if (lastFetchOptions?.body instanceof FormData) {
      const payloadJsonStr = lastFetchOptions.body.get('payload_json');
      console.log('payload_json Test 5:', payloadJsonStr);
      const payload = JSON.parse(payloadJsonStr);
      console.log('Command Content Test 5:', payload.content);

      if (payload.content !== '$trade 87654321') {
        console.error('❌ Test 5 Failed! Message content is not exactly prefix + trade + code');
        process.exit(1);
      }

      // Check if file is attached
      const attachedFile = lastFetchOptions.body.get('files[0]');
      console.log('files[0] present Test 5?', attachedFile !== null);
      if (!attachedFile) {
        console.error('❌ Test 5 Failed! .pa9 file not attached in files[0]');
        process.exit(1);
      }
    } else {
      console.error('❌ Test 5 Failed! Fetch body is not FormData');
      process.exit(1);
    }
    console.log('✅ Test 5 Passed!');

    // Test 6: dispatchTradeCommand no .pa9 file attachment for ZA Free
    console.log('Running Test 6 (no .pa9 file attachments for ZA Free)...');

    const res6 = await dispatchTradeCommand('za', [
      {
        species: 'Meltan',
        dexId: 808,
        form: 0,
        level: 1,
        nature: 'Hardy',
        ability: 'Magnet Pull',
        shiny: true,
        alpha: false,
        gender: 'Random',
        heldItem: 'None',
        teraType: 'Normal',
        pokeball: 'Poke Ball',
        origin: 'Paldea',
        moves: [],
        ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
        evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
        homeProfileId: 'home-shiny-meltan'
      }
    ], '87654321', 'free');

    console.log('Dispatch result Test 6:', res6);
    console.log('Fetch URL Test 6:', lastFetchUrl);
    console.log('Has body FormData Test 6?', lastFetchOptions?.body instanceof FormData);

    if (lastFetchOptions?.body instanceof FormData) {
      console.error('❌ Test 6 Failed! Fetch body should NOT be FormData for ZA Free');
      process.exit(1);
    } else {
      const payload = JSON.parse(lastFetchOptions.body);
      console.log('Command Content Test 6:', payload.content);

      if (!payload.content.startsWith('%trade 87654321')) {
        console.error('❌ Test 6 Failed! Message content does not start with %trade 87654321');
        process.exit(1);
      }

      if (!payload.content.includes('Meltan')) {
        console.error('❌ Test 6 Failed! Message content does not contain Meltan Showdown body');
        process.exit(1);
      }
    }
    console.log('✅ Test 6 Passed!');

  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
