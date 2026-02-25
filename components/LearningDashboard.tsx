'use client'

import { useState, useEffect } from 'react'

interface LearningDashboardProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
}

export default function LearningDashboard({ totalCourses, totalLessons, totalHours }: LearningDashboardProps) {
  const [streak, setStreak] = useState(0)
  const [weeklyProgress, setWeeklyProgress] = useState<boolean[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Load learning data from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const savedLastVisit = localStorage.getItem('last-learning-visit')
    const savedWeeklyProgress = localStorage.getItem('weekly-progress')
    
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    let currentStreak = savedStreak ? parseInt(savedStreak) : 0
    
    if (savedLastVisit === today) {
      // Already visited today, keep streak
      setStreak(currentStreak)
    } else if (savedLastVisit === yesterday) {
      // Visited yesterday, increment streak
      currentStreak += 1
      setStreak(currentStreak)
      localStorage.setItem('learning-streak', currentStreak.toString())
      localStorage.setItem('last-learning-visit', today)
      
      // Show celebration for milestones
      if (currentStreak % 7 === 0 || currentStreak === 1) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    } else if (!savedLastVisit) {
      // First visit
      currentStreak = 1
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-learning-visit', today)
    } else {
      // Streak broken
      currentStreak = 1
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
      localStorage.setItem('last-learning-visit', today)
    }

    // Generate weekly progress
    const savedProgress = savedWeeklyProgress ? JSON.parse(savedWeeklyProgress) : []
    const newProgress = [...savedProgress]
    
    // Ensure we have 7 days of data
    while (newProgress.length < 7) {
      newProgress.unshift(false)
    }
    
    // Mark today as active
    newProgress[6] = true
    
    // Keep only last 7 days
    const trimmedProgress = newProgress.slice(-7)
    setWeeklyProgress(trimmedProgress)
    localStorage.setItem('weekly-progress', JSON.stringify(trimmedProgress))

    // Calculate achievements
    const userAchievements: Achievement[] = [
      {
        id: 'first-visit',
        title: 'First Steps',
        description: 'Started your learning journey',
        icon: '🎯',
        unlocked: true,
        progress: 1,
        target: 1
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: '7 day learning streak',
        icon: '🔥',
        unlocked: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7
      },
      {
        id: 'streak-30',
        title: 'Learning Master',
        description: '30 day learning streak',
        icon: '🏆',
        unlocked: currentStreak >= 30,
        progress: Math.min(currentStreak, 30),
        target: 30
      },
      {
        id: 'explorer',
        title: 'Course Explorer',
        description: 'Explored 5 different courses',
        icon: '🧭',
        unlocked: false,
        progress: 2,
        target: 5
      }
    ]
    setAchievements(userAchievements)

    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent pointer-events-none" />
      
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Learning Journey</h2>
          <p className="text-navy-400">Track your progress and unlock achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Streak Card */}
          <div className={`card p-6 relative overflow-hidden transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-navy-400 text-sm font-medium">Learning Streak</span>
                <div className={`text-3xl ${streak > 0 ? 'animate-flame' : ''}`}>
                  🔥
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">{streak}</span>
                <span className="text-navy-400">days</span>
              </div>

              {/* Weekly calendar */}
              <div className="flex justify-between gap-1">
                {weeklyProgress.map((active, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-navy-500">{dayNames[index]}</span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-navy-800 text-navy-500'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {active ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Stats Card */}
          <div className={`card p-6 relative overflow-hidden transition-all duration-500 delay-100 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-navy-400 text-sm font-medium">Available Content</span>
                <span className="text-2xl">📚</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-navy-300">Courses to explore</span>
                    <span className="text-primary-400 font-medium">{totalCourses}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (totalCourses / 20) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-navy-300">Lessons available</span>
                    <span className="text-green-400 font-medium">{totalLessons}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (totalLessons / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-navy-300">Hours of content</span>
                    <span className="text-purple-400 font-medium">{totalHours}+</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (totalHours / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className={`card p-6 relative overflow-hidden transition-all duration-500 delay-200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-navy-400 text-sm font-medium">Achievements</span>
                <span className="text-2xl">🏅</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`relative p-3 rounded-xl transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30'
                        : 'bg-navy-800/50 border border-navy-700'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`text-2xl mb-1 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className={`text-xs font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
                      {achievement.title}
                    </div>
                    {!achievement.unlocked && (
                      <div className="mt-1">
                        <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-navy-500 mt-0.5">
                          {achievement.progress}/{achievement.target}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}