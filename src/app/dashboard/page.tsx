import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-3xl font-bold">Panel de Control</h1>
                <p className="text-gray-400">Bienvenido de nuevo, {user.email}</p>
            </div>
            <form action="/auth/signout" method="post">
                <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg transition-colors border border-red-500/20">
                    Cerrar Sesión
                </button>
            </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">Total de Inyecciones</h3>
                <p className="text-4xl font-bold mt-2 text-white">0</p>
            </div>
             <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">Suscripción Activa</h3>
                <p className="text-4xl font-bold mt-2 text-green-400">Plan Gratuito</p>
            </div>
             <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">Posición en Cola</h3>
                <p className="text-4xl font-bold mt-2 text-blue-400">-</p>
            </div>
        </div>
      </div>
    </div>
  )
}
