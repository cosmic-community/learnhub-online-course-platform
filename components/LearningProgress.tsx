'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalCategories: number
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

interface ProgressData {
  streak: number
  lastVisit: string
  lessonsCompleted: number
  coursesStarted: number
  totalTimeMinutes: number
  achievements: string[]
}

export default function LearningProgress({ 
  totalCourses, 
  totalLessons,
  totalCategories 
}: LearningProgressProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [progressData, setProgressData] = useState<ProgressData>({
    streak: 0,
    lastVisit: '',
    lessonsCompleted: 0,
    coursesStarted: 0,
    totalTimeMinutes: 0,
    achievements: []
  })

  const achievements: Achievement[] = [
    {
      id: 'first_visit',
      title: 'First Steps',
      description: 'Welcome to LearnHub!',
      icon: '🎉',
      unlocked: progressData.achievements.includes('first_visit'),
      progress: 1,
      target: 1
    },
    {
      id: 'streak_3',
      title: 'On Fire',
      description: '3 day learning streak',
      icon: '🔥',
      unlocked: progressData.streak >= 3,
      progress: Math.min(progressData.streak, 3),
      target: 3
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: '7 day learning streak',
      icon: '⚡',
      unlocked: progressData.streak >= 7,
      progress: Math.min(progressData.streak, 7),
      target: 7
    },
    {
      id: 'lessons_5',
      title: 'Quick Learner',
      description: 'Complete 5 lessons',
      icon: '📚',
      unlocked: progressData.lessonsCompleted >= 5,
      progress: Math.min(progressData.lessonsCompleted, 5),
      target: 5
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Start 3 different courses',
      icon: '🧭',
      unlocked: progressData.coursesStarted >= 3,
      progress: Math.min(progressData.coursesStarted, 3),
      target: 3
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Spend 60 minutes learning',
      icon: '⏰',
      unlocked: progressData.totalTimeMinutes >= 60,
      progress: Math.min(progressData.totalTimeMinutes, 60),
      target: 60
    }
  ]

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  const checkNewAchievements = useCallback((oldData: ProgressData, newData: ProgressData) => {
    const achievementChecks = [
      { id: 'first_visit', condition: !oldData.achievements.includes('first_visit') && newData.achievements.includes('first_visit') },
      { id: 'streak_3', condition: oldData.streak < 3 && newData.streak >= 3 },
      { id: 'streak_7', condition: oldData.streak < 7 && newData.streak >= 7 },
      { id: 'lessons_5', condition: oldData.lessonsCompleted < 5 && newData.lessonsCompleted >= 5 },
      { id: 'explorer', condition: oldData.coursesStarted < 3 && newData.coursesStarted >= 3 },
      { id: 'dedicated', condition: oldData.totalTimeMinutes < 60 && newData.totalTimeMinutes >= 60 }
    ]

    for (const check of achievementChecks) {
      if (check.condition) {
        const achievement = achievements.find(a => a.id === check.id)
        if (achievement) {
          setNewAchievement(achievement)
          triggerConfetti()
          setTimeout(() => setNewAchievement(null), 4000)
          break
        }
      }
    }
  }, [achievements, triggerConfetti])

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    if (saved) {
      const parsed = JSON.parse(saved) as ProgressData
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.streak
      
      if (lastVisitDate === today) {
        // Same day, keep streak
        newStreak = parsed.streak
      } else if (lastVisitDate === yesterday) {
        // Continue streak
        newStreak = parsed.streak + 1
      } else {
        // Streak broken
        newStreak = 1
      }

      const newData: ProgressData = {
        ...parsed,
        streak: newStreak,
        lastVisit: today
      }

      checkNewAchievements(parsed, newData)
      setProgressData(newData)
      localStorage.setItem('learnhub-progress', JSON.stringify(newData))
    } else {
      // First visit
      const newData: ProgressData = {
        streak: 1,
        lastVisit: today,
        lessonsCompleted: 0,
        coursesStarted: 0,
        totalTimeMinutes: 0,
        achievements: ['first_visit']
      }
      setProgressData(newData)
      localStorage.setItem('learnhub-progress', JSON.stringify(newData))
      
      // Show first visit achievement
      setTimeout(() => {
        const achievement = achievements.find(a => a.id === 'first_visit')
        if (achievement) {
          setNewAchievement({ ...achievement, unlocked: true })
          triggerConfetti()
          setTimeout(() => setNewAchievement(null), 4000)
        }
      }, 1000)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate progress for demo purposes
  const simulateProgress = () => {
    const newData: ProgressData = {
      ...progressData,
      lessonsCompleted: progressData.lessonsCompleted + 1,
      totalTimeMinutes: progressData.totalTimeMinutes + 15,
      coursesStarted: Math.min(progressData.coursesStarted + (Math.random() > 0.7 ? 1 : 0), totalCourses)
    }
    checkNewAchievements(progressData, newData)
    setProgressData(newData)
    localStorage.setItem('learnhub-progress', JSON.stringify(newData))
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const progressPercentage = (unlockedCount / achievements.length) * 100

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-achievement-popup">
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 p-1 rounded-2xl shadow-2xl">
            <div className="bg-navy-900 rounded-xl px-8 py-6 text-center">
              <div className="text-5xl mb-3 animate-bounce">{newAchievement.icon}</div>
              <div className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-1">
                Achievement Unlocked!
              </div>
              <div className="text-white text-xl font-bold mb-1">{newAchievement.title}</div>
              <div className="text-navy-400 text-sm">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="card overflow-hidden">
        <div 
          className="p-6 cursor-pointer hover:bg-navy-800/30 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Streak Display */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <div className="text-center">
                    <div className="text-2xl">🔥</div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-navy-800 border-2 border-navy-700 rounded-full px-2 py-0.5 text-xs font-bold text-white">
                  {progressData.streak}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Your Learning Journey
                  <span className="text-sm font-normal text-navy-400">
                    {progressData.streak} day streak
                  </span>
                </h3>
                <p className="text-navy-400">
                  {unlockedCount} of {achievements.length} achievements unlocked
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{progressData.lessonsCompleted}</div>
                  <div className="text-xs text-navy-400">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{progressData.coursesStarted}</div>
                  <div className="text-xs text-navy-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{progressData.totalTimeMinutes}m</div>
                  <div className="text-xs text-navy-400">Time</div>
                </div>
              </div>

              {/* Expand Arrow */}
              <svg 
                className={`w-6 h-6 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Expanded Section */}
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[800px]' : 'max-h-0'}`}>
          <div className="px-6 pb-6 pt-2 border-t border-navy-800">
            <h4 className="text-lg font-semibold text-white mb-4">Achievements</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30' 
                      : 'bg-navy-800/50 border border-navy-700 grayscale opacity-60'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${achievement.unlocked ? 'animate-pulse-subtle' : ''}`}>
                    {achievement.icon}
                  </div>
                  <div className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-400'}`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-navy-500 mt-1">
                    {achievement.description}
                  </div>
                  
                  {/* Progress indicator for locked achievements */}
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-navy-500 rounded-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-navy-500 mt-1">
                        {achievement.progress}/{achievement.target}
                      </div>
                    </div>
                  )}

                  {/* Unlocked badge */}
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Demo button for testing */}
            <div className="mt-6 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  simulateProgress()
                }}
                className="btn-secondary text-sm"
              >
                ✨ Simulate Learning Progress (Demo)
              </button>
              <p className="text-xs text-navy-500 mt-2">
                Click to simulate completing a lesson and see achievements unlock!
              </p>
            </div>

            {/* Platform Stats */}
            <div className="mt-6 pt-6 border-t border-navy-800">
              <h4 className="text-sm font-medium text-navy-400 mb-3">Platform Stats</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-400">{totalCourses}</div>
                  <div className="text-xs text-navy-500">Available Courses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{totalLessons}</div>
                  <div className="text-xs text-navy-500">Total Lessons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{totalCategories}</div>
                  <div className="text-xs text-navy-500">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}