'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningStats {
  coursesStarted: number
  coursesCompleted: number
  lessonsCompleted: number
  currentStreak: number
  longestStreak: number
  totalMinutesLearned: number
  achievements: Achievement[]
  lastVisit?: string
}

const DEFAULT_STATS: LearningStats = {
  coursesStarted: 0,
  coursesCompleted: 0,
  lessonsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalMinutesLearned: 0,
  achievements: [
    { id: 'first_visit', title: 'Explorer', description: 'Visited LearnHub for the first time', icon: '🎯', unlocked: false },
    { id: 'first_lesson', title: 'Getting Started', description: 'Completed your first lesson', icon: '📖', unlocked: false },
    { id: 'streak_3', title: 'On Fire', description: 'Maintained a 3-day learning streak', icon: '🔥', unlocked: false },
    { id: 'streak_7', title: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '⚡', unlocked: false },
    { id: 'lessons_5', title: 'Knowledge Seeker', description: 'Completed 5 lessons', icon: '🌟', unlocked: false },
    { id: 'lessons_10', title: 'Dedicated Learner', description: 'Completed 10 lessons', icon: '🏆', unlocked: false },
    { id: 'first_course', title: 'Course Champion', description: 'Completed your first course', icon: '🎓', unlocked: false },
    { id: 'night_owl', title: 'Night Owl', description: 'Learned after 10 PM', icon: '🦉', unlocked: false },
    { id: 'early_bird', title: 'Early Bird', description: 'Learned before 7 AM', icon: '🐦', unlocked: false },
  ],
}

const STORAGE_KEY = 'learnhub_progress'

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    
    if (saved) {
      const parsed = JSON.parse(saved) as LearningStats
      
      // Check and update streak
      const today = new Date().toDateString()
      const lastVisit = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : null
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.currentStreak
      
      if (lastVisit !== today) {
        if (lastVisit === yesterday) {
          newStreak = parsed.currentStreak + 1
        } else if (lastVisit !== today) {
          newStreak = 1
        }
      }
      
      const updatedStats = {
        ...parsed,
        currentStreak: newStreak,
        longestStreak: Math.max(parsed.longestStreak, newStreak),
        lastVisit: new Date().toISOString(),
      }
      
      // Check for new achievements
      checkAndUnlockAchievements(updatedStats)
      
      setStats(updatedStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
    } else {
      // First visit - unlock explorer achievement
      const initialStats = {
        ...DEFAULT_STATS,
        currentStreak: 1,
        lastVisit: new Date().toISOString(),
        achievements: DEFAULT_STATS.achievements.map(a => 
          a.id === 'first_visit' 
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        ),
      }
      setStats(initialStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats))
      
      // Show first achievement
      setTimeout(() => {
        setNewAchievement(initialStats.achievements.find(a => a.id === 'first_visit') || null)
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          setNewAchievement(null)
        }, 4000)
      }, 2000)
    }
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      unlockAchievement('night_owl')
    }
    if (hour >= 5 && hour < 7) {
      unlockAchievement('early_bird')
    }
  }, [])

  const checkAndUnlockAchievements = (currentStats: LearningStats) => {
    const achievementsToUnlock: string[] = []
    
    if (currentStats.currentStreak >= 3) achievementsToUnlock.push('streak_3')
    if (currentStats.currentStreak >= 7) achievementsToUnlock.push('streak_7')
    if (currentStats.lessonsCompleted >= 1) achievementsToUnlock.push('first_lesson')
    if (currentStats.lessonsCompleted >= 5) achievementsToUnlock.push('lessons_5')
    if (currentStats.lessonsCompleted >= 10) achievementsToUnlock.push('lessons_10')
    if (currentStats.coursesCompleted >= 1) achievementsToUnlock.push('first_course')
    
    achievementsToUnlock.forEach(id => unlockAchievement(id, currentStats))
  }

  const unlockAchievement = (id: string, currentStats?: LearningStats) => {
    const statsToUse = currentStats || stats
    const achievement = statsToUse.achievements.find(a => a.id === id)
    
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = statsToUse.achievements.map(a =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
      )
      
      const updatedStats = { ...statsToUse, achievements: updatedAchievements }
      setStats(updatedStats)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
      
      setNewAchievement({ ...achievement, unlocked: true })
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }

  // Simulate progress for demo purposes
  const simulateLessonComplete = () => {
    const updatedStats = {
      ...stats,
      lessonsCompleted: stats.lessonsCompleted + 1,
      totalMinutesLearned: stats.totalMinutesLearned + Math.floor(Math.random() * 30) + 10,
    }
    setStats(updatedStats)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats))
    checkAndUnlockAchievements(updatedStats)
  }

  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const totalAchievements = stats.achievements.length
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100)

  if (!isClient) return null

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '✨', '🌟', '🎊', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] animate-achievement-popup">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-6 rounded-2xl shadow-2xl shadow-primary-500/30">
            <div className="flex items-center gap-4">
              <span className="text-5xl animate-bounce">{newAchievement.icon}</span>
              <div>
                <p className="text-sm font-medium opacity-80">Achievement Unlocked!</p>
                <p className="text-xl font-bold">{newAchievement.title}</p>
                <p className="text-sm opacity-90">{newAchievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
        >
          {/* Pulse animation for streak */}
          {stats.currentStreak > 0 && (
            <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20" />
          )}
          
          <div className="relative bg-navy-900 border border-navy-700 hover:border-primary-500 rounded-full p-4 shadow-xl transition-all duration-300 group-hover:scale-110">
            <div className="text-2xl">{stats.currentStreak > 0 ? '🔥' : '📚'}</div>
            {stats.currentStreak > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {stats.currentStreak}
              </div>
            )}
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
              <h3 className="text-white font-bold text-lg">Your Learning Journey</h3>
              <p className="text-white/80 text-sm">Keep learning to unlock achievements!</p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Streak Display */}
              <div className="flex items-center justify-between bg-navy-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <p className="text-white font-bold text-xl">{stats.currentStreak} day streak</p>
                    <p className="text-navy-400 text-sm">Best: {stats.longestStreak} days</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-navy-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{stats.lessonsCompleted}</p>
                  <p className="text-navy-400 text-xs">Lessons</p>
                </div>
                <div className="bg-navy-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{stats.coursesCompleted}</p>
                  <p className="text-navy-400 text-xs">Courses</p>
                </div>
                <div className="bg-navy-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalMinutesLearned}</p>
                  <p className="text-navy-400 text-xs">Minutes</p>
                </div>
              </div>

              {/* Achievement Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">Achievements</p>
                  <p className="text-navy-400 text-sm">{unlockedCount}/{totalAchievements}</p>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-2">
                {stats.achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-primary-500/20 ring-2 ring-primary-500' 
                        : 'bg-navy-800 opacity-40 grayscale'
                    }`}
                    title={achievement.unlocked ? `${achievement.title}: ${achievement.description}` : '???'}
                  >
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                ))}
              </div>

              {/* Demo Button */}
              <button
                onClick={simulateLessonComplete}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                ✨ Complete a Lesson (Demo)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}