import { NextResponse } from 'next/server';

const HOME_SHINY_NEVER_SPECIES = [494, 647, 648, 720, 721, 801, 802, 893, 905];
const HOME_SHINY_FORCE_ALLOW = [6, 150, 249, 250, 382, 383, 384, 380, 381, 638, 639, 640];

export async function GET() {
  return NextResponse.json({
    note: 'HOME se trata como un origen legal separado. No elimina shiny locks de encuentros nativos.',
    supportedGames: ['za', 'sv'],
    shinyNeverSpecies: HOME_SHINY_NEVER_SPECIES,
    shinyForceAllow: HOME_SHINY_FORCE_ALLOW
  });
}
