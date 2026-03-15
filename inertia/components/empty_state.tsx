interface Props {
  title: string
  message: string
  action?: { label: string; href: string }
}

export default function EmptyState({ title, message, action }: Props) {
  return (
    <div className="text-center py-16">
      <div className="text-4xl mb-4 text-nb-gray-600">◇</div>
      <h3 className="text-lg font-bold text-nb-white">{title}</h3>
      <p className="text-sm text-nb-gray-500 mt-1">{message}</p>
      {action && (
        <a href={action.href} className="mt-4 inline-flex items-center px-5 py-2.5 bg-nb-red text-white text-sm font-medium rounded-lg hover:bg-nb-red-hover transition-colors">
          {action.label}
        </a>
      )}
    </div>
  )
}
