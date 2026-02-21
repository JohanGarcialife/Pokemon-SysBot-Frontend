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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative w-full flex flex-col items-center">
        <div className="mb-8 text-center flex flex-col items-center">
            <img src="/PKDEX.png" alt="PKDeX Logo" className="w-64 h-auto drop-shadow-md mb-4" />
            <p className="text-gray-400">Diseña y obtén tu Pokémon ideal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
