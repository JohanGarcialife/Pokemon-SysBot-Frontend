import LoginForm from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative w-full flex flex-col items-center">
        <div className="mb-8 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">SysBot<span className="text-blue-500">.Auto</span></h1>
            <p className="text-gray-400">Professional Pokémon Automation SaaS</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
