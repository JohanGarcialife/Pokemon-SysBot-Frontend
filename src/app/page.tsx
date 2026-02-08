import Link from 'next/link'
import { Zap, Shield, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Fondo Oscuro con estética Pokémon */}
      <div className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        {/* Efecto de patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-pokemon-blue rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-waves-from rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-winds-from rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Título estilo Logo Pokémon */}
          <h1 className="text-7xl md:text-9xl font-black mb-8 text-gradient-pokemon leading-tight drop-shadow-2xl">
            POKÉMON
          </h1>
          
          {/* Texto "Outlined" - Estilo Oficial */}
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stroke-glow uppercase tracking-wider">
            DESCUBRE UN NUEVO
          </h2>
          <h2 className="text-6xl md:text-7xl font-black mb-8 text-stroke-blue uppercase tracking-wider">
            MUNDO
          </h2>
          
          <p className="text-white text-lg md:text-xl mb-12 max-w-3xl mx-auto uppercase tracking-wide font-medium">
            Embárcate en una aventura de mundo abierto en la región de Paldea
          </p>

          {/* Botón CTA */}
          <Link 
            href="/login"
            className="inline-block px-10 py-4 text-lg font-bold bg-white text-gray-900 rounded-full hover:scale-105 transition-transform shadow-2xl active:scale-95 uppercase tracking-wide"
          >
            Comenzar
          </Link>
        </div>
      </div>

      {/* Sección Elige Tu Camino - Fondo Blanco */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-3 text-gray-900 uppercase tracking-tight">
            Elige Tu Camino
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Tres caminos de nuevas aventuras con tu Pokémon Inicial
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Ruta Victoria (Fuego/Naranja) */}
            <div className="border-fire bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-1.5 bg-fire" />
              <div className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-fire to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-fire">Ruta Victoria</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Desafía Gimnasios, supera pruebas, llega hasta el final y ¡conviértete en Campeón!
                </p>
                <button className="text-fire font-bold hover:underline">
                  Más Información →
                </button>
              </div>
            </div>

            {/* Card 2 - Sendero Leyendas (Agua/Cyan) */}
            <div className="border-water bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-1.5 bg-water" />
              <div className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-water to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-water">Sendero Leyendas</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Busca ingredientes raros junto a Pepper y descubre los secretos de los Titanes!
                </p>
                <button className="text-water font-bold hover:underline">
                  Más Información →
                </button>
              </div>
            </div>

            {/* Card 3 - Calle Fugaz (Planta/Verde) */}
            <div className="border-grass bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-1.5 bg-grass" />
              <div className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-grass to-green-600 rounded-lg flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-grass">Calle Fugaz</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Desafía al Equipo Estrella con Clavel, ¡un grupo que causó revuelo en la academia!
                </p>
                <button className="text-grass font-bold hover:underline">
                  Más Información →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Fenómeno Teracrystal - Fondo Azul Oscuro */}
      <div className="relative py-24 px-6 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 overflow-hidden">
        {/* Efecto de orbe brillante */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full" 
             style={{
               background: 'radial-gradient(circle, rgba(255,107,53,1) 0%, rgba(230,62,109,1) 33%, rgba(123,44,191,1) 66%, rgba(0,217,255,1) 100%)',
               filter: 'blur(40px)',
               opacity: 0.4
             }} 
        />
        
        <div className="relative z-10 max-w-4xl px-6">
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-electric uppercase tracking-tight">
            Fenómeno<br/>Teracrystal
          </h2>
          <p className="text-white text-xl mb-8 max-w-xl">
            ¡Haz brillar a tus Pokémon! Teracristalízalos y haz que sus ataques sean más poderosos!
          </p>
          <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-wide">
            Conocer Mecánicas
          </button>
        </div>
      </div>

      {/* Sección Footer - Fondo Negro */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Info del Juego</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Noticias</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Galería</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Servicio al Cliente</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Preguntas Frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-400">Comunidad</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Foros</a></li>
                <li><a href="#" className="hover:text-pokemon-yellow transition-colors">Eventos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>Desarrollado con <span className="text-red-500">❤️</span> para la Comunidad Pokémon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
