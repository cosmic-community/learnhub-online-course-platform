'use client'

interface ProgressBarProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function ProgressBar({ 
  progress, 
  size = 'md', 
  showLabel = false,
  className = ''
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const isComplete = clampedProgress >= 100
  
  return (
    <div className={`relative ${className}`}>
      <div className={`w-full bg-navy-700 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
              : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs ${isComplete ? 'text-green-400' : 'text-navy-400'}`}>
            {isComplete ? '✓ Complete!' : `${Math.round(clampedProgress)}% complete`}
          </span>
        </div>
      )}
    </div>
  )
}