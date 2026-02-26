'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  streak: number
  lastVisit: string
  lessonsCompleted: number
  coursesStarted: number
  totalMinutes: number
  achievements: string[]
}

interface LearningProgressProps {
  totalCourses: number
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '👣', description: 'Welcome to LearnHub!' },
  { id: 'streak_3', name: 'Getting Warmed Up', icon: '🔥', description: '3 day streak' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7 day streak' },
  { id: 'streak_30', name: 'Dedicated Learner', icon: '🏆', description: '30 day streak' },
  { id: 'lessons_5', name: 'Knowledge Seeker', icon: '📚', description: '5 lessons completed' },
  { id: 'lessons_25', name: 'Learning Machine', icon: '🤖', description: '25 lessons completed' },
  { id: 'courses_3', name: 'Course Explorer', icon: '🧭', description: '3 courses started' },
  { id: 'time_60', name: 'Hour of Power', icon: '⏰', description: '60 minutes of learning' },
  { id: 'time_300', name: 'Time Traveler', icon: '🚀', description: '5 hours of learning' },
]

export default function LearningProgress({ totalCourses }: LearningProgressProps) {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      const stored = localStorage.getItem('learnhub_stats')
      const today = new Date().toDateString()
      
      if (stored) {
        const parsed: LearningStats = JSON.parse(stored)
        const lastVisitDate = new Date(parsed.lastVisit).toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        let newStreak = parsed.streak
        let shouldCelebrate = false
        
        if (lastVisitDate !== today) {
          if (lastVisitDate === yesterday) {
            // Continue streak
            newStreak = parsed.streak + 1
            shouldCelebrate = true
          } else if (lastVisitDate !== today) {
            // Streak broken - reset
            newStreak = 1
          }
        }
        
        const updatedStats: LearningStats = {
          ...parsed,
          streak: newStreak,
          lastVisit: today,
        }
        
        // Check for new achievements
        const newAchievements = checkAchievements(updatedStats)
        if (newAchievements.length > parsed.achievements.length) {
          const latestAchievement = newAchievements[newAchievements.length - 1]
          if (latestAchievement) {
            setNewAchievement(latestAchievement)
            setTimeout(() => setNewAchievement(null), 4000)
          }
        }
        
        updatedStats.achievements = newAchievements
        
        localStorage.setItem('learnhub_stats', JSON.stringify(updatedStats))
        setStats(updatedStats)
        
        if (shouldCelebrate && newStreak > 1) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // First time visitor
        const newStats: LearningStats = {
          streak: 1,
          lastVisit: today,
          lessonsCompleted: 0,
          coursesStarted: 0,
          totalMinutes: 0,
          achievements: ['first_visit'],
        }
        localStorage.setItem('learnhub_stats', JSON.stringify(newStats))
        setStats(newStats)
        setNewAchievement('first_visit')
        setTimeout(() => setNewAchievement(null), 4000)
      }
      
      setIsLoaded(true)
    }

    loadStats()
  }, [])

  const checkAchievements = (currentStats: LearningStats): string[] => {
    const achievements: string[] = ['first_visit']
    
    if (currentStats.streak >= 3) achievements.push('streak_3')
    if (currentStats.streak >= 7) achievements.push('streak_7')
    if (currentStats.streak >= 30) achievements.push('streak_30')
    if (currentStats.lessonsCompleted >= 5) achievements.push('lessons_5')
    if (currentStats.lessonsCompleted >= 25) achievements.push('lessons_25')
    if (currentStats.coursesStarted >= 3) achievements.push('courses_3')
    if (currentStats.totalMinutes >= 60) achievements.push('time_60')
    if (currentStats.totalMinutes >= 300) achievements.push('time_300')
    
    return achievements
  }

  // Demo function to simulate progress (for demonstration purposes)
  const simulateProgress = () => {
    if (!stats) return
    
    const updatedStats: LearningStats = {
      ...stats,
      lessonsCompleted: stats.lessonsCompleted + 1,
      totalMinutes: stats.totalMinutes + Math.floor(Math.random() * 15) + 5,
      coursesStarted: stats.lessonsCompleted % 3 === 0 ? stats.coursesStarted + 1 : stats.coursesStarted,
    }
    
    const newAchievements = checkAchievements(updatedStats)
    if (newAchievements.length > stats.achievements.length) {
      const latestAchievement = newAchievements[newAchievements.length - 1]
      if (latestAchievement) {
        setNewAchievement(latestAchievement)
        setTimeout(() => setNewAchievement(null), 4000)
      }
    }
    
    updatedStats.achievements = newAchievements
    localStorage.setItem('learnhub_stats', JSON.stringify(updatedStats))
    setStats(updatedStats)
  }

  if (!isLoaded || !stats) {
    return (
      <section className="py-12 bg-gradient-to-r from-navy-900/50 to-navy-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex items-center justify-center h-32">
            <div className="text-navy-500">Loading your progress...</div>
          </div>
        </div>
      </section>
    )
  }

  const achievementData = ACHIEVEMENTS.find(a => a.id === newAchievement)
  const unlockedAchievements = ACHIEVEMENTS.filter(a => stats.achievements.includes(a.id))

  return (
    <>
      {/* Achievement Popup */}
      {newAchievement && achievementData && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-2xl shadow-primary-500/30 p-6 flex items-center gap-4">
            <div className="text-5xl">{achievementData.icon}</div>
            <div>
              <div className="text-sm text-primary-100 font-medium">Achievement Unlocked!</div>
              <div className="text-xl font-bold text-white">{achievementData.name}</div>
              <div className="text-sm text-primary-200">{achievementData.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="text-center animate-scale-up">
            <div className="text-8xl mb-4">🔥</div>
            <div className="text-4xl font-bold text-white">{stats.streak} Day Streak!</div>
            <div className="text-xl text-primary-400 mt-2">Keep it going! You&apos;re on fire!</div>
          </div>
          {/* Confetti effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: '2rem',
                }}
              >
                {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Section */}
      <section className="py-12 bg-gradient-to-r from-navy-900/80 via-navy-800/50 to-navy-900/80 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Streak Display */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${
                  stats.streak >= 7 ? 'from-orange-500 to-red-600' : 
                  stats.streak >= 3 ? 'from-yellow-500 to-orange-500' : 
                  'from-primary-500 to-primary-600'
                } flex items-center justify-center shadow-lg ${
                  stats.streak >= 3 ? 'shadow-orange-500/30' : 'shadow-primary-500/30'
                } ${stats.streak >= 7 ? 'animate-pulse-glow' : ''}`}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{stats.streak}</div>
                    <div className="text-sm text-white/80 font-medium">
                      {stats.streak === 1 ? 'Day' : 'Days'}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 text-3xl animate-bounce">🔥</div>
              </div>
              <div className="text-center mt-3">
                <div className="text-sm text-navy-400">Learning Streak</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="bg-navy-800/50 rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/30 transition-colors">
                <div className="text-3xl mb-1">📖</div>
                <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
                <div className="text-sm text-navy-400">Lessons Done</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/30 transition-colors">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-2xl font-bold text-white">{stats.coursesStarted}</div>
                <div className="text-sm text-navy-400">Courses Started</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/30 transition-colors">
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-2xl font-bold text-white">{stats.totalMinutes}</div>
                <div className="text-sm text-navy-400">Minutes Learned</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/30 transition-colors">
                <div className="text-3xl mb-1">🏆</div>
                <div className="text-2xl font-bold text-white">{stats.achievements.length}</div>
                <div className="text-sm text-navy-400">Achievements</div>
              </div>
            </div>
          </div>

          {/* Achievements Row */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Your Achievements</h3>
              <button 
                onClick={simulateProgress}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Demo: Complete a lesson →
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = stats.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`group relative px-4 py-2 rounded-full border transition-all duration-300 ${
                      isUnlocked 
                        ? 'bg-primary-500/20 border-primary-500/50 text-white' 
                        : 'bg-navy-800/50 border-navy-700 text-navy-500'
                    }`}
                    title={achievement.description}
                  >
                    <span className={`text-xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </span>
                    <span className="ml-2 text-sm font-medium">
                      {achievement.name}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-navy-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {achievement.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-6 text-center">
            <p className="text-navy-400 text-sm">
              {stats.streak >= 7 
                ? "🌟 You're absolutely crushing it! Keep this amazing momentum going!" 
                : stats.streak >= 3 
                ? "💪 Great consistency! You're building a powerful learning habit!"
                : "🚀 Welcome back! Every day of learning brings you closer to your goals."}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}