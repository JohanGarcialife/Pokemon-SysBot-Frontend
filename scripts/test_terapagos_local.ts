import { validate } from '../src/lib/validation';

const payload = {
  species: 1024,
  level: 85,
  shiny: false,
  ball: 'Poké Ball',
  gender: 'Random',
  nature: 'Random',
  teraType: 'Normal',
  game: 'sv',
  gameVersion: 'Scarlet',
  encounterId: 'static-encounter_sv-70'
};

const result = validate('sv', payload);
console.log(JSON.stringify(result, null, 2));
