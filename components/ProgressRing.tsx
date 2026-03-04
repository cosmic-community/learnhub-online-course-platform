'use client'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  className?: string
}

export default function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  showPercentage = true,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-500 ease-out ${
            progress === 100 ? 'text-green-500' : 'text-primary-500'
          }`}
        />
      </svg>
      {showPercentage && (
        <span
          className={`absolute text-xs font-bold ${
            progress === 100 ? 'text-green-400' : 'text-white'
          }`}
        >
          {progress}%
        </span>
      )}
    </div>
  )
}