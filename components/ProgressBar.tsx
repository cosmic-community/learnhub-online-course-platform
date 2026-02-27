'use client'

interface ProgressBarProps {
  percent: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export default function ProgressBar({ 
  percent, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const clampedPercent = Math.min(100, Math.max(0, percent))
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-navy-400">Progress</span>
          <span className="text-xs font-medium text-primary-400">{clampedPercent}%</span>
        </div>
      )}
      <div className={`w-full bg-navy-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} bg-gradient-to-r from-primary-500 to-primary-400 rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  )
}