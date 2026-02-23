import LoginForm from '@/components/login-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dual fire/water background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Subtle vignette edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-8 text-center flex flex-col items-center">
            <img src="/PKDEX.png" alt="PKDeX Logo" className="w-64 h-auto drop-shadow-2xl mb-4" />
            <p className="text-gray-300 font-medium drop-shadow">Diseña y obtén tu Pokémon ideal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
