import { useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    email: '',
    password: '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    post('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nb-black">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-nb-white">Ri</span><span className="bg-nb-red px-1.5 text-white">ze</span>
          </h1>
          <p className="text-nb-gray-500 mt-3">Creez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-nb-surface rounded-xl border border-nb-border p-8 space-y-5">
          {(errors as any)?.email && (
            <div className="p-3 bg-nb-red-muted border border-nb-red/20 text-nb-red rounded-lg text-sm">
              {(errors as any).email}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => setData('fullName', e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nb-gray-300 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg outline-none text-sm"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 bg-nb-red text-white rounded-lg font-bold hover:bg-nb-red-hover disabled:opacity-50 transition-colors"
          >
            {processing ? 'Creation...' : 'Creer mon compte'}
          </button>

          <p className="text-center text-sm text-nb-gray-500">
            Deja un compte ?{' '}
            <a href="/login" className="text-nb-red hover:text-nb-red-hover transition-colors">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  )
}
