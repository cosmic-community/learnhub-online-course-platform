'use client'

import { useState, useEffect } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
}

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  progress: number
  target: number
}

export default function LearningProgress({ totalCourses, totalLessons }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first-visit', icon: '👋', title: 'Welcome!', description: 'First visit to LearnHub', unlocked: true, progress: 1, target: 1 },
    { id: 'explorer', icon: '🔍', title: 'Explorer', description: 'Browse 3 courses', unlocked: false, progress: 0, target: 3 },
    { id: 'dedicated', icon: '🔥', title: 'Dedicated', description: '7-day learning streak', unlocked: false, progress: 0, target: 7 },
    { id: 'bookworm', icon: '📚', title: 'Bookworm', description: 'View 10 lessons', unlocked: false, progress: 0, target: 10 },
    { id: 'champion', icon: '🏆', title: 'Champion', description: 'Complete first course', unlocked: false, progress: 0, target: 1 },
  ])

  useEffect(() => {
    // Load progress from localStorage
    const savedStreak = localStorage.getItem('learnhub-streak')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const savedProgress = localStorage.getItem('learnhub-progress')
    
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    let newStreak = 1
    if (savedStreak && lastVisit) {
      if (lastVisit === today) {
        newStreak = parseInt(savedStreak)
      } else if (lastVisit === yesterday) {
        newStreak = parseInt(savedStreak) + 1
        // Show confetti for milestone streaks
        if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    }
    
    setStreak(newStreak)
    localStorage.setItem('learnhub-streak', newStreak.toString())
    localStorage.setItem('learnhub-last-visit', today)

    // Update achievements based on saved progress
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setAchievements(prev => prev.map(achievement => {
          const saved = progress[achievement.id]
          if (saved) {
            return {
              ...achievement,
              progress: saved.progress,
              unlocked: saved.progress >= achievement.target
            }
          }
          return achievement
        }))
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Update streak achievement
    setAchievements(prev => prev.map(a => 
      a.id === 'dedicated' ? { ...a, progress: newStreak, unlocked: newStreak >= 7 } : a
    ))
  }, [])

  // Save progress when achievements change
  useEffect(() => {
    const progress: Record<string, { progress: number }> = {}
    achievements.forEach(a => {
      progress[a.id] = { progress: a.progress }
    })
    localStorage.setItem('learnhub-progress', JSON.stringify(progress))
  }, [achievements])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Streak Counter */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse-slow">
              <span className="text-3xl font-bold text-white">{streak}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center border-2 border-amber-400">
              <span className="text-lg">🔥</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Day Streak!</h3>
            <p className="text-navy-400 text-sm">Keep learning daily</p>
            {streak >= 7 && (
              <span className="inline-flex items-center gap-1 text-amber-400 text-xs mt-1">
                <span>🎉</span> You&apos;re on fire!
              </span>
            )}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-navy-300">Achievements</h3>
            <span className="text-xs text-navy-500">{unlockedCount}/{achievements.length} unlocked</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'hover:scale-110 hover:-translate-y-1' 
                    : 'opacity-40 grayscale hover:opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 shadow-lg shadow-primary-500/10' 
                    : 'bg-navy-800/50 border border-navy-700'
                }`}>
                  {achievement.icon}
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 shadow-xl min-w-[140px]">
                    <p className="text-white text-sm font-medium text-center">{achievement.title}</p>
                    <p className="text-navy-400 text-xs text-center mt-0.5">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                        <p className="text-navy-500 text-xs text-center mt-1">{achievement.progress}/{achievement.target}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden xl:flex items-center gap-4 pl-6 border-l border-navy-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{totalCourses}</div>
            <div className="text-xs text-navy-500">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{totalLessons}</div>
            <div className="text-xs text-navy-500">Lessons</div>
          </div>
        </div>
      </div>
    </div>
  )
}