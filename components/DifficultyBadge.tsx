import type { DifficultyOption } from '@/types'

interface DifficultyBadgeProps {
  difficulty: DifficultyOption
  size?: 'small' | 'default'
}

export default function DifficultyBadge({ difficulty, size = 'default' }: DifficultyBadgeProps) {
  const baseClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  
  const difficultyClasses: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
  }

  const className = difficultyClasses[difficulty.key] || 'bg-navy-700 text-navy-200'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${baseClasses} ${className}`}>
      {difficulty.value}
    </span>
  )
}