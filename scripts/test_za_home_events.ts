import { validate } from '../src/lib/validation';
import { formatHomeEventSysbotCommand } from '../src/lib/homeEventPatch';

// 1. Test Zygarde
const zygardePayload = {
  species: 718,
  level: 60,
  shiny: true,
  ball: 'Cherish Ball',
  gender: 'Random',
  nature: 'Hardy',
  game: 'za',
  encounterId: 'home-2018-legends-shiny-zygarde-za-za-718-0',
  homeProfileId: 'home-2018-legends-shiny-zygarde'
};

const vZygarde = validate('za', zygardePayload);
console.log('--- Zygarde ZA HOME Validation ---');
console.log('Zygarde Legal:', vZygarde.legal);
if (!vZygarde.legal) {
  console.log('Zygarde errors:', vZygarde.errors);
} else {
  const zygardeCmd = formatHomeEventSysbotCommand(vZygarde.order);
  console.log('Zygarde Command:\n' + zygardeCmd);
}

// 2. Test Kyogre JPN
const kyogrePayload = {
  species: 382,
  level: 60,
  shiny: true,
  ball: 'Cherish Ball',
  gender: 'Random',
  nature: 'Modest',
  game: 'za',
  encounterId: 'home-ultra-shiny-kyogre-jpn-za-382-0',
  homeProfileId: 'home-ultra-shiny-kyogre-jpn'
};

const vKyogre = validate('za', kyogrePayload);
console.log('\n--- Kyogre ZA HOME Validation ---');
console.log('Kyogre Legal:', vKyogre.legal);
if (!vKyogre.legal) {
  console.log('Kyogre errors:', vKyogre.errors);
} else {
  const kyogreCmd = formatHomeEventSysbotCommand(vKyogre.order);
  console.log('Kyogre Command:\n' + kyogreCmd);
}

// 3. Test Rayquaza ZA
const rayquazaPayload = {
  species: 384,
  level: 70,
  shiny: true,
  ball: 'Poke Ball',
  gender: 'Random',
  nature: 'Jolly',
  game: 'za',
  encounterId: 'home-shiny-rayquaza-za-za-384-0',
  homeProfileId: 'home-shiny-rayquaza-za'
};

const vRayquaza = validate('za', rayquazaPayload);
console.log('\n--- Rayquaza ZA HOME Validation ---');
console.log('Rayquaza Legal:', vRayquaza.legal);
if (!vRayquaza.legal) {
  console.log('Rayquaza errors:', vRayquaza.errors);
} else {
  const rayquazaCmd = formatHomeEventSysbotCommand(vRayquaza.order);
  console.log('Rayquaza Command:\n' + rayquazaCmd);
}
