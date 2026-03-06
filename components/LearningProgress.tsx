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
  lessonsCompleted: number
  coursesStarted: number
  totalTimeSpent: number // in minutes
  currentStreak: number
  longestStreak: number
  lastVisit: string
  achievements: Achievement[]
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: false },
  { id: 'three_lessons', title: 'Getting Warmed Up', description: 'Complete 3 lessons', icon: '🔥', unlocked: false },
  { id: 'ten_lessons', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚', unlocked: false },
  { id: 'first_course', title: 'Course Conqueror', description: 'Start your first course', icon: '🏆', unlocked: false },
  { id: 'three_day_streak', title: 'Consistent Learner', description: 'Maintain a 3-day streak', icon: '⚡', unlocked: false },
  { id: 'seven_day_streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🌟', unlocked: false },
  { id: 'night_owl', title: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', unlocked: false },
  { id: 'early_bird', title: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', unlocked: false },
]

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
]

function getDefaultStats(): LearningStats {
  return {
    lessonsCompleted: 0,
    coursesStarted: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    achievements: DEFAULT_ACHIEVEMENTS,
  }
}

function getDailyQuote(): { quote: string; author: string } {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    let currentStats: LearningStats

    if (savedStats) {
      currentStats = JSON.parse(savedStats)
      // Ensure achievements array exists and has all achievements
      if (!currentStats.achievements) {
        currentStats.achievements = DEFAULT_ACHIEVEMENTS
      }
    } else {
      currentStats = getDefaultStats()
    }

    // Check and update streak
    const today = new Date().toDateString()
    const lastVisit = currentStats.lastVisit

    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        currentStats.currentStreak += 1
        if (currentStats.currentStreak > currentStats.longestStreak) {
          currentStats.longestStreak = currentStats.currentStreak
        }
        // Check streak achievements
        checkStreakAchievements(currentStats)
      } else if (lastVisit && lastVisit !== today) {
        // Streak broken
        currentStats.currentStreak = 1
      } else if (!lastVisit) {
        currentStats.currentStreak = 1
      }
      
      currentStats.lastVisit = today
    }

    // Check time-based achievements
    checkTimeAchievements(currentStats)

    // Save updated stats
    localStorage.setItem('learnhub-progress', JSON.stringify(currentStats))
    setStats(currentStats)
  }, [])

  const checkStreakAchievements = (currentStats: LearningStats) => {
    if (currentStats.currentStreak >= 3) {
      unlockAchievement(currentStats, 'three_day_streak')
    }
    if (currentStats.currentStreak >= 7) {
      unlockAchievement(currentStats, 'seven_day_streak')
    }
  }

  const checkTimeAchievements = (currentStats: LearningStats) => {
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      unlockAchievement(currentStats, 'night_owl')
    }
    if (hour >= 5 && hour < 7) {
      unlockAchievement(currentStats, 'early_bird')
    }
  }

  const unlockAchievement = (currentStats: LearningStats, achievementId: string) => {
    const achievement = currentStats.achievements.find(a => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date().toISOString()
      setShowAchievement(achievement)
      setTimeout(() => setShowAchievement(null), 3000)
    }
  }

  // Simulated function to mark lesson complete (would be called from lesson pages)
  const markLessonComplete = () => {
    if (!stats) return
    
    const newStats = { ...stats }
    newStats.lessonsCompleted += 1
    newStats.totalTimeSpent += 15 // Assume 15 min per lesson

    // Check lesson achievements
    if (newStats.lessonsCompleted >= 1) {
      unlockAchievement(newStats, 'first_lesson')
    }
    if (newStats.lessonsCompleted >= 3) {
      unlockAchievement(newStats, 'three_lessons')
    }
    if (newStats.lessonsCompleted >= 10) {
      unlockAchievement(newStats, 'ten_lessons')
    }

    localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
    setStats(newStats)
  }

  const startCourse = () => {
    if (!stats) return
    
    const newStats = { ...stats }
    newStats.coursesStarted += 1

    if (newStats.coursesStarted >= 1) {
      unlockAchievement(newStats, 'first_course')
    }

    localStorage.setItem('learnhub-progress', JSON.stringify(newStats))
    setStats(newStats)
  }

  if (!stats) return null

  const quote = getDailyQuote()
  const unlockedCount = stats.achievements.filter(a => a.unlocked).length
  const progressPercentage = (unlockedCount / stats.achievements.length) * 100

  return (
    <>
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm">
            <div className="text-4xl animate-bounce">{showAchievement.icon}</div>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{showAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Widget */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110"
          title="Your Learning Progress"
        >
          {isExpanded ? '✕' : '🎓'}
        </button>

        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-4 border-b border-navy-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎯</span> Your Learning Journey
              </h3>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{stats.currentStreak}</div>
                <div className="text-xs text-navy-400">Day Streak 🔥</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.coursesStarted}</div>
                <div className="text-xs text-navy-400">Courses Started</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.floor(stats.totalTimeSpent / 60)}h</div>
                <div className="text-xs text-navy-400">Time Invested</div>
              </div>
            </div>

            {/* Achievements Progress */}
            <div className="px-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-navy-300">Achievements</span>
                <span className="text-sm text-primary-400">{unlockedCount}/{stats.achievements.length}</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {stats.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`text-xl cursor-default transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'opacity-100 hover:scale-125' 
                      : 'opacity-30 grayscale'
                  }`}
                  title={achievement.unlocked 
                    ? `${achievement.title}: ${achievement.description}` 
                    : `??? - ${achievement.description}`
                  }
                >
                  {achievement.icon}
                </div>
              ))}
            </div>

            {/* Daily Quote */}
            <div className="p-4 bg-navy-800/30 border-t border-navy-700">
              <div className="text-xs text-navy-400 mb-1">💡 Daily Inspiration</div>
              <p className="text-sm text-navy-200 italic">&ldquo;{quote.quote}&rdquo;</p>
              <p className="text-xs text-navy-400 mt-1">— {quote.author}</p>
            </div>

            {/* Quick Actions (for demo) */}
            <div className="p-3 border-t border-navy-700 flex gap-2">
              <button
                onClick={markLessonComplete}
                className="flex-1 py-2 px-3 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-xs font-medium rounded-lg transition-colors"
              >
                + Complete Lesson
              </button>
              <button
                onClick={startCourse}
                className="flex-1 py-2 px-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-medium rounded-lg transition-colors"
              >
                + Start Course
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}