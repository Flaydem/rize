import { useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nb-black">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-nb-white">Ri</span><span className="bg-nb-red px-1.5 text-white">ze</span>
          </h1>
          <p className="text-nb-gray-500 mt-3">Connectez-vous a votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-nb-surface rounded-xl border border-nb-border p-8 space-y-5">
          {(errors as any)?.login && (
            <div className="p-3 bg-nb-red-muted border border-nb-red/20 text-nb-red rounded-lg text-sm">
              {(errors as any).login}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-2.5 bg-nb-dark border border-nb-border rounded-lg outline-none text-sm text-nb-white placeholder:text-nb-gray-600 focus:border-nb-red transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 bg-nb-red text-white rounded-lg font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
          >
            {processing ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-center text-sm text-nb-gray-500">
            Pas encore de compte ?{' '}
            <a href="/register" className="text-nb-red hover:text-nb-red-hover transition-colors">Creer un compte</a>
          </p>
        </form>
      </div>
    </div>
  )
}
