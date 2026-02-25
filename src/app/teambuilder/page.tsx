import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import HomeTeambuilder from '@/components/home/HomeTeambuilder'

export default async function TeambuilderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/teambuilder')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="py-8 px-6 relative"
        style={{
          backgroundImage: "url('/FONDOLOGIN.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Crea tu <span className="text-pokemon-yellow">Pokémon</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Diseña, configura y solicita tu intercambio en segundos.
          </p>
        </div>
      </div>

      {/* Teambuilder */}
      <HomeTeambuilder user={user} />
    </div>
  )
}
