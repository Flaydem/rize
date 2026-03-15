import AppLayout from '~/layouts/app_layout'

interface Props {
  user: any
}

export default function Settings({ user }: Props) {
  return (
    <AppLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-black text-nb-white mb-8">Parametres</h1>

        <div className="bg-nb-surface rounded-xl border border-nb-border p-6">
          <h2 className="font-bold text-nb-white mb-4">Profil</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-3 border-b border-nb-border">
              <span className="text-nb-gray-500">Nom</span>
              <span className="text-nb-white font-medium">{user.fullName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-nb-border">
              <span className="text-nb-gray-500">Email</span>
              <span className="text-nb-white font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-nb-gray-500">Role</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-nb-red-muted text-nb-red uppercase">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
