interface Props {
  label: string
  active?: boolean
  onClick?: () => void
}

export default function CategoryChip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-nb-red text-white'
          : 'bg-nb-surface text-nb-gray-400 border border-nb-border hover:border-nb-gray-500 hover:text-nb-white'
      }`}
    >
      {label}
    </button>
  )
}
