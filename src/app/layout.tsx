import type { Metadata } from 'next';
import './globals.css';
import { AppInitializer } from '@/components/layout/AppInitializer';

export const metadata: Metadata = {
  title: 'PKDEX · Crea tu Pokémon',
  description:
    'Crea, configura y solicita Pokémon legales para intercambio usando bases separadas de Legends: Z-A y Scarlet/Violet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppInitializer />
        {children}
      </body>
    </html>
  );
}
