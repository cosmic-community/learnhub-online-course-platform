'use client'

import { useState, useEffect } from 'react'
import { getProgressData, type ProgressData } from './LearningProgress'
import ProgressRing from './ProgressRing'

interface CourseInfo {
  slug: string
  title: string
  totalLessons: number
}

interface ProgressStatsProps {
  courses: CourseInfo[]
}

export default function ProgressStats({ courses }: ProgressStatsProps) {
  const [progressData, setProgressData] = useState<ProgressData>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgressData(getProgressData())

    // Listen for progress updates
    const handleUpdate = () => {
      setProgressData(getProgressData())
    }
    window.addEventListener('progress-updated', handleUpdate)
    return () => window.removeEventListener('progress-updated', handleUpdate)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate overall stats
  const totalLessonsCompleted = Object.values(progressData).reduce(
    (sum, course) => sum + course.completedLessons.length,
    0
  )
  
  const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0)
  
  const coursesStarted = Object.keys(progressData).filter(
    slug => progressData[slug].completedLessons.length > 0
  ).length
  
  const coursesCompleted = courses.filter(course => {
    const courseProgress = progressData[course.slug]
    return courseProgress && courseProgress.completedLessons.length >= course.totalLessons
  }).length

  // Get streak (days of activity)
  const getStreak = (): number => {
    const dates = Object.values(progressData)
      .map(p => new Date(p.lastUpdated).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    if (dates.length === 0) return 0
    
    let streak = 1
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (dates[0] !== today && dates[0] !== yesterday) return 0
    
    for (let i = 1; i < dates.length; i++) {
      const current = new Date(dates[i])
      const prev = new Date(dates[i - 1])
      const diff = (prev.getTime() - current.getTime()) / 86400000
      if (diff <= 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const streak = getStreak()

  if (totalLessonsCompleted === 0) {
    return null
  }

  const overallProgress = totalLessons > 0 ? Math.round((totalLessonsCompleted / totalLessons) * 100) : 0

  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Your Learning Journey</h3>
          <p className="text-sm text-navy-400">Keep up the great work!</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <ProgressRing progress={overallProgress} size={56} strokeWidth={4} />
          <p className="text-navy-400 text-xs mt-2">Overall</p>
        </div>
        
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-2xl font-bold text-white">{totalLessonsCompleted}</div>
          <p className="text-navy-400 text-xs mt-1">Lessons Done</p>
        </div>
        
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-2xl font-bold text-white">{coursesStarted}</div>
          <p className="text-navy-400 text-xs mt-1">Courses Started</p>
        </div>
        
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-2xl font-bold text-primary-400 flex items-center justify-center gap-1">
            {streak > 0 && <span className="text-lg">🔥</span>}
            {streak}
          </div>
          <p className="text-navy-400 text-xs mt-1">Day Streak</p>
        </div>
      </div>
      
      {coursesCompleted > 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="text-green-400 text-sm font-medium">
            You've completed {coursesCompleted} course{coursesCompleted > 1 ? 's' : ''}! Amazing progress!
          </span>
        </div>
      )}
    </div>
  )
}