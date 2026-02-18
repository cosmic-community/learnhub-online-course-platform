'use client'

interface ProgressBarProps {
  percentage: number
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function ProgressBar({ 
  percentage, 
  showLabel = false, 
  size = 'medium',
  className = ''
}: ProgressBarProps) {
  const heights = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-navy-400">Progress</span>
          <span className="text-xs font-medium text-primary-400">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-navy-800 rounded-full ${heights[size]} overflow-hidden`}>
        <div 
          className={`${heights[size]} bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}