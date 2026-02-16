'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  currentStreak: number
  longestStreak: number
  coursesStarted: number
  lessonsCompleted: number
  totalMinutesLearned: number
  lastActiveDate: string | null
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-visit', title: 'Welcome!', description: 'Visit LearnHub for the first time', icon: '👋', unlocked: false },
  { id: 'streak-3', title: 'Getting Started', description: 'Maintain a 3-day learning streak', icon: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '⚡', unlocked: false },
  { id: 'streak-30', title: 'Dedicated Learner', description: 'Maintain a 30-day learning streak', icon: '🏆', unlocked: false },
  { id: 'explorer', title: 'Explorer', description: 'Browse 5 different courses', icon: '🧭', unlocked: false },
  { id: 'night-owl', title: 'Night Owl', description: 'Learn after midnight', icon: '🦉', unlocked: false },
  { id: 'early-bird', title: 'Early Bird', description: 'Learn before 7 AM', icon: '🐦', unlocked: false },
]

const MOTIVATIONAL_QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>({
    currentStreak: 0,
    longestStreak: 0,
    coursesStarted: 0,
    lessonsCompleted: 0,
    totalMinutesLearned: 0,
    lastActiveDate: null,
  })
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animatedStreak, setAnimatedStreak] = useState(0)
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    const savedAchievements = localStorage.getItem('learnhub-achievements')
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      setStats(parsed)
      
      // Check if it's a new day
      const today = new Date().toDateString()
      const lastActive = parsed.lastActiveDate
      
      if (lastActive !== today) {
        // Calculate streak
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const wasYesterday = lastActive === yesterday.toDateString()
        
        const newStreak = wasYesterday ? parsed.currentStreak + 1 : 1
        const newStats = {
          ...parsed,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, parsed.longestStreak),
          lastActiveDate: today,
        }
        setStats(newStats)
        localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
        
        // Check streak achievements
        if (newStreak >= 3) unlockAchievement('streak-3')
        if (newStreak >= 7) unlockAchievement('streak-7')
        if (newStreak >= 30) unlockAchievement('streak-30')
        
        // Celebrate streak milestones
        if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    } else {
      // First visit - initialize stats
      const initialStats: LearningStats = {
        currentStreak: 1,
        longestStreak: 1,
        coursesStarted: 0,
        lessonsCompleted: 0,
        totalMinutesLearned: 0,
        lastActiveDate: new Date().toDateString(),
      }
      setStats(initialStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(initialStats))
      unlockAchievement('first-visit')
    }
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
    
    // Set daily quote based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length])
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      unlockAchievement('night-owl')
    } else if (hour >= 5 && hour < 7) {
      unlockAchievement('early-bird')
    }
  }, [])

  // Animate streak counter
  useEffect(() => {
    if (stats.currentStreak > 0) {
      const duration = 1000
      const steps = 30
      const increment = stats.currentStreak / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= stats.currentStreak) {
          setAnimatedStreak(stats.currentStreak)
          clearInterval(timer)
        } else {
          setAnimatedStreak(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [stats.currentStreak])

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlocked) {
          const unlocked = { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          setNewAchievement(unlocked)
          setTimeout(() => setNewAchievement(null), 4000)
          return unlocked
        }
        return a
      })
      localStorage.setItem('learnhub-achievements', JSON.stringify(updated))
      return updated
    })
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl animate-bounce">{newAchievement.icon}</span>
            <div>
              <p className="text-sm text-primary-100">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Progress Card */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 lg:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Learning Journey</h2>
                    <p className="text-navy-400 text-sm">Keep the momentum going!</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-navy-400 hover:text-white transition-colors p-2"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Streak */}
                <div className="bg-navy-800/50 rounded-xl p-4 text-center relative group hover:bg-navy-800/70 transition-colors">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm animate-pulse group-hover:animate-bounce">
                    🔥
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">
                    {animatedStreak}
                  </p>
                  <p className="text-navy-400 text-sm">Day Streak</p>
                  {stats.currentStreak >= 7 && (
                    <div className="mt-2 text-xs text-orange-400">
                      On fire! 🎉
                    </div>
                  )}
                </div>

                {/* Best Streak */}
                <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800/70 transition-colors">
                  <p className="text-4xl font-bold text-white mb-1">{stats.longestStreak}</p>
                  <p className="text-navy-400 text-sm">Best Streak</p>
                </div>

                {/* Achievements */}
                <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800/70 transition-colors">
                  <p className="text-4xl font-bold text-white mb-1">
                    {unlockedCount}/{achievements.length}
                  </p>
                  <p className="text-navy-400 text-sm">Achievements</p>
                </div>

                {/* Time Active */}
                <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800/70 transition-colors">
                  <p className="text-4xl font-bold text-white mb-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-navy-400 text-sm">Today</p>
                </div>
              </div>

              {/* Expanded Section */}
              {isExpanded && (
                <div className="border-t border-navy-700 pt-6 mt-2 animate-fadeIn">
                  {/* Achievements */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span>🏆</span> Achievements
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`relative group ${
                            achievement.unlocked 
                              ? 'bg-navy-800/70' 
                              : 'bg-navy-900/50 opacity-50'
                          } rounded-xl p-3 text-center transition-all hover:scale-105`}
                          title={`${achievement.title}: ${achievement.description}`}
                        >
                          <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                            {achievement.icon}
                          </span>
                          <p className="text-xs text-navy-300 mt-1 truncate">{achievement.title}</p>
                          {achievement.unlocked && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Quote */}
                  <div className="bg-gradient-to-r from-navy-800/50 to-navy-700/30 rounded-xl p-4 border-l-4 border-primary-500">
                    <p className="text-navy-200 italic text-lg mb-2">"{dailyQuote.text}"</p>
                    <p className="text-navy-400 text-sm">— {dailyQuote.author}</p>
                  </div>

                  {/* Streak Calendar Preview */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span>📅</span> This Week
                    </h3>
                    <div className="flex justify-between gap-2">
                      {[...Array(7)].map((_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() - (6 - i))
                        const isToday = i === 6
                        const isPast = i < 6
                        const isActive = i >= 7 - stats.currentStreak
                        
                        return (
                          <div
                            key={i}
                            className={`flex-1 py-3 rounded-lg text-center transition-all ${
                              isActive
                                ? 'bg-primary-500/20 border border-primary-500/50'
                                : isPast
                                  ? 'bg-navy-800/30'
                                  : 'bg-navy-800/50'
                            } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
                          >
                            <p className="text-xs text-navy-400 mb-1">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className={`text-lg font-bold ${isActive ? 'text-primary-400' : 'text-navy-500'}`}>
                              {date.getDate()}
                            </p>
                            {isActive && (
                              <span className="text-xs">🔥</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}