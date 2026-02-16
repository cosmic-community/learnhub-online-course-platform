'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStats {
  coursesViewed: string[]
  lessonsViewed: string[]
  streak: number
  lastVisit: string | null
  totalMinutes: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_course: { icon: '🎯', title: 'First Steps', description: 'Viewed your first course' },
  five_courses: { icon: '📚', title: 'Explorer', description: 'Viewed 5 different courses' },
  first_lesson: { icon: '▶️', title: 'Learner', description: 'Started your first lesson' },
  ten_lessons: { icon: '🏆', title: 'Dedicated', description: 'Completed 10 lessons' },
  week_streak: { icon: '🔥', title: 'On Fire', description: '7-day learning streak' },
  night_owl: { icon: '🦉', title: 'Night Owl', description: 'Learning after 10 PM' },
  early_bird: { icon: '🐦', title: 'Early Bird', description: 'Learning before 7 AM' },
}

const MOTIVATIONAL_QUOTES = [
  { quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

const DEFAULT_STATS: LearningStats = {
  coursesViewed: [],
  lessonsViewed: [],
  streak: 0,
  lastVisit: null,
  totalMinutes: 0,
  achievements: [],
}

export default function LearningTracker() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [showConfetti, setShowConfetti] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learnhub_progress')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as LearningStats
        setStats(parsed)
      } catch {
        // Invalid data, use defaults
      }
    }

    // Set random quote
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])
  }, [])

  // Track page views and update streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const currentPath = window.location.pathname
    
    setStats(prev => {
      const newStats = { ...prev }
      
      // Update streak
      if (prev.lastVisit !== today) {
        const lastDate = prev.lastVisit ? new Date(prev.lastVisit) : null
        const todayDate = new Date(today)
        
        if (lastDate) {
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays === 1) {
            newStats.streak = prev.streak + 1
          } else if (diffDays > 1) {
            newStats.streak = 1
          }
        } else {
          newStats.streak = 1
        }
        newStats.lastVisit = today
      }
      
      // Track course views
      if (currentPath.startsWith('/courses/') && !currentPath.includes('/lessons/')) {
        const courseSlug = currentPath.split('/courses/')[1]?.split('/')[0]
        if (courseSlug && !prev.coursesViewed.includes(courseSlug)) {
          newStats.coursesViewed = [...prev.coursesViewed, courseSlug]
        }
      }
      
      // Track lesson views
      if (currentPath.includes('/lessons/')) {
        const lessonSlug = currentPath.split('/lessons/')[1]?.split('/')[0]
        if (lessonSlug && !prev.lessonsViewed.includes(lessonSlug)) {
          newStats.lessonsViewed = [...prev.lessonsViewed, lessonSlug]
          newStats.totalMinutes = prev.totalMinutes + 15 // Estimate 15 min per lesson
        }
      }
      
      return newStats
    })
  }, [])

  // Check for new achievements
  const checkAchievements = useCallback((currentStats: LearningStats) => {
    const newAchievements: string[] = []
    const hour = new Date().getHours()
    
    if (currentStats.coursesViewed.length >= 1 && !currentStats.achievements.includes('first_course')) {
      newAchievements.push('first_course')
    }
    if (currentStats.coursesViewed.length >= 5 && !currentStats.achievements.includes('five_courses')) {
      newAchievements.push('five_courses')
    }
    if (currentStats.lessonsViewed.length >= 1 && !currentStats.achievements.includes('first_lesson')) {
      newAchievements.push('first_lesson')
    }
    if (currentStats.lessonsViewed.length >= 10 && !currentStats.achievements.includes('ten_lessons')) {
      newAchievements.push('ten_lessons')
    }
    if (currentStats.streak >= 7 && !currentStats.achievements.includes('week_streak')) {
      newAchievements.push('week_streak')
    }
    if (hour >= 22 && !currentStats.achievements.includes('night_owl')) {
      newAchievements.push('night_owl')
    }
    if (hour < 7 && !currentStats.achievements.includes('early_bird')) {
      newAchievements.push('early_bird')
    }
    
    return newAchievements
  }, [])

  // Save stats and check achievements
  useEffect(() => {
    localStorage.setItem('learnhub_progress', JSON.stringify(stats))
    
    const newAchievements = checkAchievements(stats)
    if (newAchievements.length > 0) {
      const updatedStats = {
        ...stats,
        achievements: [...stats.achievements, ...newAchievements]
      }
      setStats(updatedStats)
      localStorage.setItem('learnhub_progress', JSON.stringify(updatedStats))
      
      // Show achievement notification
      setNewAchievement(newAchievements[0])
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }, [stats.coursesViewed.length, stats.lessonsViewed.length, stats.streak, checkAchievements, stats])

  const getStreakEmoji = () => {
    if (stats.streak >= 30) return '🌟'
    if (stats.streak >= 14) return '💎'
    if (stats.streak >= 7) return '🔥'
    if (stats.streak >= 3) return '⚡'
    return '✨'
  }

  const getLevel = () => {
    const xp = stats.coursesViewed.length * 10 + stats.lessonsViewed.length * 25 + stats.streak * 5
    if (xp >= 500) return { level: 5, title: 'Master Learner', color: 'from-purple-500 to-pink-500' }
    if (xp >= 200) return { level: 4, title: 'Advanced', color: 'from-yellow-500 to-orange-500' }
    if (xp >= 100) return { level: 3, title: 'Intermediate', color: 'from-blue-500 to-cyan-500' }
    if (xp >= 50) return { level: 2, title: 'Beginner', color: 'from-green-500 to-teal-500' }
    return { level: 1, title: 'Newcomer', color: 'from-gray-500 to-slate-500' }
  }

  const level = getLevel()
  const xp = stats.coursesViewed.length * 10 + stats.lessonsViewed.length * 25 + stats.streak * 5
  const nextLevelXp = level.level === 1 ? 50 : level.level === 2 ? 100 : level.level === 3 ? 200 : level.level === 4 ? 500 : 1000
  const progress = Math.min((xp / nextLevelXp) * 100, 100)

  if (!isOpen && isMinimized) {
    return (
      <>
        {/* Achievement Popup */}
        {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
          <div className="fixed bottom-24 right-4 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="text-3xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}</div>
              </div>
            </div>
          </div>
        )}

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              >
                {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {/* Minimized Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 group"
          aria-label="Open learning tracker"
        >
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-110">
              <span className="text-2xl">📊</span>
            </div>
            {stats.streak > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                {stats.streak}
              </div>
            )}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-navy-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {getStreakEmoji()} {stats.streak} day streak!
            </div>
          </div>
        </button>
      </>
    )
  }

  return (
    <>
      {/* Achievement Popup */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed bottom-24 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="fixed bottom-4 left-4 z-50 w-80 bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${level.color} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <div className="text-white/80 text-xs">Level {level.level}</div>
                <div className="text-white font-bold">{level.title}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Close tracker"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>{xp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/80 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4">
          {/* Streak */}
          <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getStreakEmoji()}</span>
              <div>
                <div className="text-white font-semibold">{stats.streak} Day Streak</div>
                <div className="text-navy-400 text-xs">Keep it going!</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-primary-400">{stats.coursesViewed.length}</div>
              <div className="text-navy-400 text-xs">Courses</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-primary-400">{stats.lessonsViewed.length}</div>
              <div className="text-navy-400 text-xs">Lessons</div>
            </div>
            <div className="bg-navy-800/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-primary-400">{stats.totalMinutes}</div>
              <div className="text-navy-400 text-xs">Minutes</div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="text-sm font-medium text-white mb-2">Achievements</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
                const unlocked = stats.achievements.includes(key)
                return (
                  <div
                    key={key}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      unlocked 
                        ? 'bg-primary-500/20 border-2 border-primary-500' 
                        : 'bg-navy-800/50 opacity-30 grayscale'
                    }`}
                    title={`${achievement.title}: ${achievement.description}`}
                  >
                    {achievement.icon}
                  </div>
                )
              })}
            </div>
            <div className="text-xs text-navy-500 mt-2">
              {stats.achievements.length} / {Object.keys(ACHIEVEMENTS).length} unlocked
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-primary-500/10 to-transparent p-3 rounded-xl border-l-2 border-primary-500">
            <p className="text-sm text-navy-200 italic">&ldquo;{quote.quote}&rdquo;</p>
            <p className="text-xs text-navy-400 mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>
    </>
  )
}