import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">Pokémon SysBot Automation (SaaS)</h1>
      <p className="mt-4 text-xl">Listo para el desarrollo</p>
      
      <Link 
        href="/login"
        className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
      >
        Iniciar Sesión
      </Link>
    </div>
  )
}
