'use client';

import { useState, useEffect } from 'react';

const formArtwork: Record<string, number | string> = {
  '670-5': 10061,
  '19-1': 10091, '20-1': 10092, '26-1': 10100, '27-1': 10101, '28-1': 10102,
  '37-1': 10103, '38-1': 10104, '50-1': 10105, '51-1': 10106, '52-1': 10107,
  '52-2': 10161, '53-1': 10108, '58-1': 10229, '59-1': 10230, '79-1': 10164,
  '80-2': 10165, '83-1': 10166, '88-1': 10112, '89-1': 10113, '100-1': 10231,
  '101-1': 10232, '103-1': 10114, '105-1': 10115, '110-1': 10167, '122-1': 10168,
  '199-1': 10172, '211-1': 10234, '215-1': 10235, '222-1': 10173, '263-1': 10174,
  '264-1': 10175, '479-1': 10008, '479-2': 10009, '479-3': 10010, '479-4': 10011,
  '479-5': 10012, '503-1': 10236, '549-1': 10237, '550-1': 10016, '550-2': 10247,
  '562-1': 10179, '570-1': 10238, '571-1': 10239, '618-1': 10180, '628-1': 10240,
  '705-1': 10241, '706-1': 10242, '713-1': 10243, '724-1': 10244, '849-1': 10184,
  '876-1': 10186, '877-1': 10187, '901-1': 10272, '902-1': 10248, '916-1': 10254,
  '931-1': 10261, '931-2': 10262, '931-3': 10263, '978-1': 10258, '978-2': 10259,
  '999-1': 10264,
  // Alolan forms
  '74-1': 10109, '75-1': 10110, '76-1': 10111,
  // Galarian forms
  '77-1': 10162, '78-1': 10163, '144-1': 10169, '145-1': 10170, '146-1': 10171,
  '554-1': 10176, '555-1': 10177,
  // Hisuian forms
  '157-1': 10233,
  // Paldean forms
  '128-1': 10250, '128-2': 10251, '128-3': 10252, '194-1': 10253,
  // Shellos / Gastrodon East Sea
  '422-1': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/422-east.png',
  '423-1': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/423-east.png',
  // Meowstic Female
  '678-1': 10026,
  // Oricorio styles
  '741-1': 10121, '741-2': 10122, '741-3': 10123,
  // Lycanroc / Rockruff
  '744-1': 10148, '745-1': 10137, '745-2': 10152,
  // Sinistea Antique
  '854-1': 10196,
  // Urshifu Rapid Strike
  '892-1': 10191,
  // Maushold / Dudunsparce / Poltchageist / Sinistcha segments & masterpieces
  '925-1': 10260, '982-1': 10255, '1012-1': 10276, '1013-1': 10277,
  // Minior cores
  '774-7': 10256, '774-9': 10257, '774-11': 10258, '774-12': 10259, '774-13': 10260, '774-31': 10261
};

function officialArtworkById(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

interface PokemonImageProps {
  species: number;
  form?: number;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function PokemonImage({ species, form = 0, alt, className, style, id }: PokemonImageProps) {
  const idStr = String(species).padStart(4, '0');
  const exactPath = form > 0 ? `/sprites/${idStr}-${form}.png` : `/sprites/${idStr}.png`;
  
  const specialId = formArtwork[`${species}-${form}`];
  const fallbacks: string[] = [exactPath];
  if (specialId) {
    if (typeof specialId === 'string') {
      fallbacks.push(specialId);
    } else {
      fallbacks.push(officialArtworkById(specialId));
    }
  }
  fallbacks.push(officialArtworkById(species));

  const [srcIndex, setSrcIndex] = useState(0);

  // Reset srcIndex if species/form changes
  useEffect(() => {
    setSrcIndex(0);
  }, [species, form]);

  const handleError = () => {
    if (srcIndex < fallbacks.length - 1) {
      setSrcIndex(srcIndex + 1);
    }
  };

  return (
    <img 
      id={id}
      src={fallbacks[srcIndex]} 
      alt={alt} 
      onError={handleError}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}
