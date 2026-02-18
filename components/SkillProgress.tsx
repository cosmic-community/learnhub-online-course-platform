'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface SkillProgressProps {
  categories: Category[]
}

interface ProgressData {
  [categorySlug: string]: number
}

const PROGRESS_KEY = 'learnhub_skill_progress'

function getStoredProgress(): ProgressData {
  if (typeof window === 'undefined') return {}
  
  const stored = localStorage.getItem(PROGRESS_KEY)
  if (!stored) return {}
  
  try {
    return JSON.parse(stored) as ProgressData
  } catch {
    return {}
  }
}

// Simulate some progress for demo purposes
function simulateProgress(categories: Category[]): ProgressData {
  const stored = getStoredProgress()
  let hasNew = false
  
  categories.forEach(cat => {
    if (stored[cat.slug] === undefined) {
      // Generate random progress between 10-85% for demo
      stored[cat.slug] = Math.floor(Math.random() * 75) + 10
      hasNew = true
    }
  })
  
  if (hasNew && typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored))
  }
  
  return stored
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  icon?: string
  label?: string
  color?: string
}

function ProgressRing({ progress, size = 80, strokeWidth = 6, icon, label, color = '#14b8a6' }: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 300)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="flex flex-col items-center group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-navy-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`
            }}
          />
        </svg>
        
        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl group-hover:scale-110 transition-transform">
            {icon}
          </span>
        </div>
      </div>
      
      {label && (
        <div className="mt-2 text-center">
          <div className="text-xs text-navy-400 truncate max-w-[80px]">{label}</div>
          <div className="text-sm font-semibold text-white">{animatedProgress}%</div>
        </div>
      )}
    </div>
  )
}

export default function SkillProgress({ categories }: SkillProgressProps) {
  const [progress, setProgress] = useState<ProgressData>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(simulateProgress(categories))
  }, [categories])

  if (!mounted) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Skill Progress</h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-navy-500">Loading...</div>
        </div>
      </div>
    )
  }

  // Get top 4 categories with highest progress
  const topCategories = [...categories]
    .sort((a, b) => (progress[b.slug] || 0) - (progress[a.slug] || 0))
    .slice(0, 4)

  const totalProgress = categories.length > 0
    ? Math.round(categories.reduce((sum, cat) => sum + (progress[cat.slug] || 0), 0) / categories.length)
    : 0

  const colors = ['#14b8a6', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Skill Progress</h3>
        <div className="text-sm">
          <span className="text-navy-400">Overall: </span>
          <span className="text-primary-400 font-semibold">{totalProgress}%</span>
        </div>
      </div>

      <div className="flex justify-around items-start">
        {topCategories.map((category, index) => (
          <ProgressRing
            key={category.id}
            progress={progress[category.slug] || 0}
            icon={category.metadata?.icon || '📚'}
            label={category.metadata?.name || category.title}
            color={colors[index % colors.length]}
          />
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-6 pt-4 border-t border-navy-800">
        <div className="flex justify-between text-xs text-navy-400 mb-2">
          <span>Overall Mastery</span>
          <span>{totalProgress}%</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}