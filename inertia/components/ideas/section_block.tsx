interface Props {
  title: string
  subtitle?: string
  accent?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange'
  children: React.ReactNode
  className?: string
}

const accentColors: Record<string, string> = {
  red: 'bg-nb-red',
  green: 'bg-nb-green',
  blue: 'bg-nb-blue',
  yellow: 'bg-nb-yellow',
  purple: 'bg-nb-purple',
  orange: 'bg-nb-orange',
}

export default function SectionBlock({ title, subtitle, accent = 'red', children, className = '' }: Props) {
  return (
    <section className={className}>
      <div className="mb-5">
        <h2 className="text-lg font-black text-nb-white flex items-center gap-2.5">
          <span className={`w-1 h-5 rounded-full ${accentColors[accent]}`} />
          {title}
        </h2>
        {subtitle && <p className="text-sm text-nb-gray-500 mt-1 ml-[18px]">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}
