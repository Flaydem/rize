export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-nb-green'
  if (score >= 60) return 'text-nb-yellow'
  if (score >= 40) return 'text-nb-orange'
  return 'text-nb-red'
}

export function scoreBgColor(score: number): string {
  if (score >= 80) return 'bg-nb-green-muted text-nb-green'
  if (score >= 60) return 'bg-nb-yellow-muted text-nb-yellow'
  if (score >= 40) return 'bg-nb-orange-muted text-nb-orange'
  return 'bg-nb-red-muted text-nb-red'
}

export function difficultyColor(level: string): string {
  switch (level) {
    case 'easy': return 'bg-nb-green-muted text-nb-green'
    case 'medium': return 'bg-nb-yellow-muted text-nb-yellow'
    case 'hard': return 'bg-nb-red-muted text-nb-red'
    default: return 'bg-nb-surface text-nb-gray-400'
  }
}

export function budgetColor(level: string): string {
  switch (level) {
    case 'low': return 'bg-nb-green-muted text-nb-green'
    case 'medium': return 'bg-nb-yellow-muted text-nb-yellow'
    case 'high': return 'bg-nb-red-muted text-nb-red'
    default: return 'bg-nb-surface text-nb-gray-400'
  }
}

export function difficultyLabel(level: string): string {
  switch (level) {
    case 'easy': return 'Facile'
    case 'medium': return 'Moyen'
    case 'hard': return 'Difficile'
    default: return level
  }
}

export function budgetLabel(level: string): string {
  switch (level) {
    case 'low': return 'Petit budget'
    case 'medium': return 'Budget moyen'
    case 'high': return 'Gros budget'
    default: return level
  }
}
