'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  lessonsViewed: number
  achievements: string[]
}

const LEARNING_TIPS = [
  "💡 Try teaching what you learn to someone else - it's the best way to solidify knowledge!",
  "🎯 Set a specific goal for each study session to stay focused.",
  "⏰ The Pomodoro Technique (25 min work, 5 min break) boosts retention.",
  "📝 Taking handwritten notes activates different parts of your brain.",
  "🔄 Spaced repetition: review material at increasing intervals.",
  "💪 Consistency beats intensity - 30 minutes daily trumps 4-hour cramming.",
  "🧠 Your brain consolidates learning during sleep - rest well!",
  "🎮 Practice coding in a sandbox while learning - muscle memory matters.",
  "📚 Read documentation like a story, not a reference manual.",
  "🤝 Join communities - explaining concepts to others accelerates learning.",
  "☕ Stay hydrated and take breaks - your brain needs fuel!",
  "🌟 Celebrate small wins - every concept mastered is progress.",
]

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', emoji: '👶', description: 'Started your learning journey', threshold: 1 },
  { id: 'streak_3', name: 'Getting Started', emoji: '🔥', description: '3-day learning streak', threshold: 3 },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', description: '7-day learning streak', threshold: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', emoji: '🌟', description: '14-day learning streak', threshold: 14 },
  { id: 'streak_30', name: 'Monthly Master', emoji: '🏆', description: '30-day learning streak', threshold: 30 },
  { id: 'lessons_5', name: 'Explorer', emoji: '🗺️', description: 'Viewed 5 lessons', threshold: 5 },
  { id: 'lessons_20', name: 'Knowledge Seeker', emoji: '📖', description: 'Viewed 20 lessons', threshold: 20 },
  { id: 'lessons_50', name: 'Scholar', emoji: '🎓', description: 'Viewed 50 lessons', threshold: 50 },
]

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: '',
  totalDaysLearned: 0,
  lessonsViewed: 0,
  achievements: [],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [dailyTip, setDailyTip] = useState('')

  const checkAchievements = useCallback((data: StreakData): string[] => {
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (data.achievements.includes(achievement.id)) return
      
      if (achievement.id === 'first_visit' && data.totalDaysLearned >= 1) {
        newAchievements.push(achievement.id)
      } else if (achievement.id.startsWith('streak_')) {
        const threshold = parseInt(achievement.id.split('_')[1] ?? '0', 10)
        if (data.currentStreak >= threshold) {
          newAchievements.push(achievement.id)
        }
      } else if (achievement.id.startsWith('lessons_')) {
        const threshold = parseInt(achievement.id.split('_')[1] ?? '0', 10)
        if (data.lessonsViewed >= threshold) {
          newAchievements.push(achievement.id)
        }
      }
    })
    
    return newAchievements
  }, [])

  useEffect(() => {
    // Get daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(LEARNING_TIPS[dayOfYear % LEARNING_TIPS.length] ?? LEARNING_TIPS[0] ?? '')
    
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const data: StreakData = stored ? JSON.parse(stored) : DEFAULT_STREAK_DATA
    
    const today = new Date().toISOString().split('T')[0] ?? ''
    const lastVisit = data.lastVisitDate
    
    // Calculate if streak continues
    if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day - no update needed
        setStreakData(data)
        return
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        data.currentStreak += 1
        data.totalDaysLearned += 1
        data.lastVisitDate = today
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for streak milestones
        if ([3, 7, 14, 30].includes(data.currentStreak)) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken
        data.currentStreak = 1
        data.totalDaysLearned += 1
        data.lastVisitDate = today
      }
    } else {
      // First visit
      data.currentStreak = 1
      data.totalDaysLearned = 1
      data.lastVisitDate = today
    }
    
    // Check for new achievements
    const newAchievements = checkAchievements(data)
    if (newAchievements.length > 0) {
      data.achievements = [...data.achievements, ...newAchievements]
      const firstNew = newAchievements[0]
      if (firstNew) {
        setNewAchievement(firstNew)
        setTimeout(() => setNewAchievement(null), 4000)
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [checkAchievements])

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '🌟'
    if (streakData.currentStreak >= 7) return '⚡'
    if (streakData.currentStreak >= 3) return '🔥'
    return '✨'
  }

  const achievementDetails = newAchievement 
    ? ACHIEVEMENTS.find(a => a.id === newAchievement) 
    : null

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
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && achievementDetails && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{achievementDetails.emoji}</span>
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-primary-100">{achievementDetails.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-20 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-2 bg-navy-900/90 backdrop-blur-sm border border-navy-700 hover:border-primary-500/50 rounded-full px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-primary-500/20"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            {getStreakEmoji()}
          </span>
          <span className="text-white font-bold">{streakData.currentStreak}</span>
          <span className="text-navy-400 text-sm">day streak</span>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-14 left-0 w-80 bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl p-5 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Your Progress</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{streakData.totalDaysLearned}</div>
                <div className="text-xs text-navy-400">Total Days</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{streakData.lessonsViewed}</div>
                <div className="text-xs text-navy-400">Lessons Viewed</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-4">
              <div className="text-sm text-navy-300 mb-2">Achievements</div>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const earned = streakData.achievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`text-xl p-1.5 rounded-lg transition-all ${
                        earned 
                          ? 'bg-primary-500/20 cursor-default' 
                          : 'bg-navy-800/50 grayscale opacity-40'
                      }`}
                      title={earned ? `${achievement.name}: ${achievement.description}` : 'Locked'}
                    >
                      {achievement.emoji}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-primary-500/10 to-transparent rounded-xl p-3 border border-primary-500/20">
              <div className="text-xs text-primary-400 mb-1">💡 Today&apos;s Tip</div>
              <div className="text-sm text-navy-200">{dailyTip}</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Export a function to track lesson views (can be called from lesson pages)
export function trackLessonView() {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem('learnhub-streak')
  if (!stored) return
  
  const data: StreakData = JSON.parse(stored)
  data.lessonsViewed += 1
  localStorage.setItem('learnhub-streak', JSON.stringify(data))
}