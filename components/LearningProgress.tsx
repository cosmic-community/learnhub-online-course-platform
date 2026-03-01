'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  coursesStarted: string[]
  lessonsCompleted: string[]
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalMinutesLearned: number
  achievements: string[]
}

const DEFAULT_STATS: LearningStats = {
  coursesStarted: [],
  lessonsCompleted: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalMinutesLearned: 0,
  achievements: [],
}

const ACHIEVEMENTS = [
  { id: 'first-course', name: 'First Steps', icon: '🚀', description: 'Started your first course', requirement: (stats: LearningStats) => stats.coursesStarted.length >= 1 },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Started 3 different courses', requirement: (stats: LearningStats) => stats.coursesStarted.length >= 3 },
  { id: 'dedicated', name: 'Dedicated Learner', icon: '📚', description: 'Completed 5 lessons', requirement: (stats: LearningStats) => stats.lessonsCompleted.length >= 5 },
  { id: 'streak-3', name: 'On Fire', icon: '🔥', description: '3 day learning streak', requirement: (stats: LearningStats) => stats.currentStreak >= 3 },
  { id: 'streak-7', name: 'Week Warrior', icon: '⚔️', description: '7 day learning streak', requirement: (stats: LearningStats) => stats.currentStreak >= 7 },
  { id: 'streak-30', name: 'Monthly Master', icon: '👑', description: '30 day learning streak', requirement: (stats: LearningStats) => stats.longestStreak >= 30 },
  { id: 'hour-1', name: 'Time Invested', icon: '⏰', description: 'Spent 1 hour learning', requirement: (stats: LearningStats) => stats.totalMinutesLearned >= 60 },
  { id: 'hour-10', name: 'Knowledge Seeker', icon: '🎓', description: 'Spent 10 hours learning', requirement: (stats: LearningStats) => stats.totalMinutesLearned >= 600 },
]

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      
      // Check and update streak
      const today = new Date().toDateString()
      const lastActive = parsed.lastActiveDate
      
      if (lastActive) {
        const lastDate = new Date(lastActive)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays > 1) {
          // Streak broken
          parsed.currentStreak = 0
        }
      }
      
      setStats(parsed)
    }
  }, [])

  useEffect(() => {
    // Check for new achievements
    const newAchievements = ACHIEVEMENTS.filter(
      a => a.requirement(stats) && !stats.achievements.includes(a.id)
    )

    if (newAchievements.length > 0) {
      const updatedStats = {
        ...stats,
        achievements: [...stats.achievements, ...newAchievements.map(a => a.id)]
      }
      setStats(updatedStats)
      localStorage.setItem('learnhub-progress', JSON.stringify(updatedStats))
      
      // Show celebration
      setNewAchievement(newAchievements[0].name)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 3000)
    }
  }, [stats])

  const unlockedAchievements = ACHIEVEMENTS.filter(a => stats.achievements.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter(a => !stats.achievements.includes(a.id))
  const progressPercentage = Math.min((stats.achievements.length / ACHIEVEMENTS.length) * 100, 100)

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
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#00D4FF', '#7C3AED', '#F59E0B', '#10B981', '#EF4444'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl animate-bounce">🏆</span>
            <div>
              <p className="text-sm opacity-90">Achievement Unlocked!</p>
              <p className="font-bold">{newAchievement}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-primary-500/50 transition-all duration-300"
        >
          {/* Streak Badge */}
          {stats.currentStreak > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <span>🔥</span>
              <span>{stats.currentStreak}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg">
                {stats.achievements.length > 0 ? '🏆' : '📊'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-navy-400">Progress</p>
              <p className="text-white font-semibold">{stats.achievements.length}/{ACHIEVEMENTS.length}</p>
            </div>
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-3 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 p-4 border-b border-navy-700">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span>📈</span> Your Learning Journey
              </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{stats.currentStreak}</div>
                <div className="text-xs text-navy-400">Day Streak 🔥</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak ⭐</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.coursesStarted.length}</div>
                <div className="text-xs text-navy-400">Courses 📚</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.lessonsCompleted.length}</div>
                <div className="text-xs text-navy-400">Lessons ✅</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="px-4 pb-4">
              <p className="text-xs text-navy-400 mb-2">Achievements</p>
              <div className="flex flex-wrap gap-2">
                {unlockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="group relative"
                    title={achievement.description}
                  >
                    <span className="text-2xl cursor-help transition-transform hover:scale-125">
                      {achievement.icon}
                    </span>
                  </div>
                ))}
                {lockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="group relative"
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <span className="text-2xl grayscale opacity-30 cursor-help">
                      {achievement.icon}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 p-3 text-center border-t border-navy-700">
              <p className="text-sm text-navy-300">
                {stats.currentStreak === 0 
                  ? "Start a lesson to begin your streak! 🚀"
                  : stats.currentStreak < 7
                  ? `${7 - stats.currentStreak} more days to Week Warrior! 💪`
                  : "You're on fire! Keep going! 🔥"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Export utility functions for other components to use
export function markCourseStarted(courseSlug: string) {
  if (typeof window === 'undefined') return
  
  const savedStats = localStorage.getItem('learnhub-progress')
  const stats: LearningStats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
  
  if (!stats.coursesStarted.includes(courseSlug)) {
    stats.coursesStarted.push(courseSlug)
  }
  
  // Update streak
  const today = new Date().toDateString()
  if (stats.lastActiveDate !== today) {
    const lastDate = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null
    const todayDate = new Date(today)
    
    if (lastDate) {
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        stats.currentStreak += 1
      } else if (diffDays > 1) {
        stats.currentStreak = 1
      }
    } else {
      stats.currentStreak = 1
    }
    
    stats.lastActiveDate = today
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak)
  }
  
  localStorage.setItem('learnhub-progress', JSON.stringify(stats))
  window.dispatchEvent(new Event('learnhub-progress-update'))
}

export function markLessonCompleted(lessonSlug: string, durationMinutes: number = 0) {
  if (typeof window === 'undefined') return
  
  const savedStats = localStorage.getItem('learnhub-progress')
  const stats: LearningStats = savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
  
  if (!stats.lessonsCompleted.includes(lessonSlug)) {
    stats.lessonsCompleted.push(lessonSlug)
    stats.totalMinutesLearned += durationMinutes
  }
  
  // Update streak
  const today = new Date().toDateString()
  if (stats.lastActiveDate !== today) {
    const lastDate = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null
    const todayDate = new Date(today)
    
    if (lastDate) {
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        stats.currentStreak += 1
      } else if (diffDays > 1) {
        stats.currentStreak = 1
      }
    } else {
      stats.currentStreak = 1
    }
    
    stats.lastActiveDate = today
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak)
  }
  
  localStorage.setItem('learnhub-progress', JSON.stringify(stats))
  window.dispatchEvent(new Event('learnhub-progress-update'))
}