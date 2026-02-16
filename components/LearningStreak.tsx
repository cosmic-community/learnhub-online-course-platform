'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🎯', description: 'Made your first visit', threshold: 1 },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', description: '3-day streak', threshold: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7-day streak', threshold: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '🏆', description: '14-day streak', threshold: 14 },
  { id: 'streak_30', name: 'Monthly Master', icon: '👑', description: '30-day streak', threshold: 30 },
  { id: 'visits_10', name: 'Regular', icon: '📚', description: '10 total visits', threshold: 10 },
  { id: 'visits_50', name: 'Committed', icon: '💎', description: '50 total visits', threshold: 50 },
]

const DAILY_TIPS = [
  { tip: "Consistency beats intensity. Even 15 minutes of learning daily compounds into mastery.", author: "Learning Science" },
  { tip: "Take breaks! The Pomodoro Technique suggests 25 minutes of focus, then a 5-minute break.", author: "Productivity Research" },
  { tip: "Teaching others what you learn is one of the most effective ways to solidify knowledge.", author: "The Feynman Technique" },
  { tip: "Handwriting notes improves retention better than typing. Try it for key concepts!", author: "Cognitive Studies" },
  { tip: "Sleep is when your brain consolidates learning. Never skip it before an exam!", author: "Neuroscience" },
  { tip: "Connect new information to what you already know. It creates stronger memory links.", author: "Memory Experts" },
  { tip: "Struggle is part of learning. If it feels easy, you're probably not growing.", author: "Growth Mindset" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get random daily tip based on day
    const dayIndex = new Date().getDate() % DAILY_TIPS.length
    setDailyTip(DAILY_TIPS[dayIndex] ?? DAILY_TIPS[0])

    // Load and update streak data
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      achievements: []
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (lastVisitDate !== today) {
      // New day visit
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        // Continuing streak
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        // Streak broken or first visit
        data.currentStreak = 1
      }

      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      data.lastVisit = new Date().toISOString()

      // Check for new achievements
      const newAchievements: string[] = []
      ACHIEVEMENTS.forEach(achievement => {
        if (!data.achievements.includes(achievement.id)) {
          const isStreak = achievement.id.startsWith('streak_')
          const isVisits = achievement.id.startsWith('visits_')
          
          if (achievement.id === 'first_visit' && data.totalVisits >= 1) {
            newAchievements.push(achievement.id)
          } else if (isStreak && data.currentStreak >= achievement.threshold) {
            newAchievements.push(achievement.id)
          } else if (isVisits && data.totalVisits >= achievement.threshold) {
            newAchievements.push(achievement.id)
          }
        }
      })

      if (newAchievements.length > 0) {
        data.achievements = [...data.achievements, ...newAchievements]
        const latestAchievement = ACHIEVEMENTS.find(a => a.id === newAchievements[newAchievements.length - 1])
        if (latestAchievement) {
          setNewAchievement(latestAchievement)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewAchievement(null)
          }, 4000)
        }
      }

      localStorage.setItem('learnhub_streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{newAchievement.icon}</span>
            <div>
              <p className="text-sm opacity-90">New Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Card */}
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">🔥</span> Your Learning Journey
            </h3>
            <p className="text-navy-400 text-sm mt-1">Keep the momentum going!</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-navy-400 hover:text-white transition-colors"
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-primary-400 animate-pulse-slow">
              {streakData.currentStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-amber-400">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-navy-400 mt-1">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-3xl font-bold text-emerald-400">
              {streakData.totalVisits}
            </div>
            <div className="text-xs text-navy-400 mt-1">Total Visits</div>
          </div>
        </div>

        {/* Progress to Next Achievement */}
        {nextAchievement && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-navy-300">Next: {nextAchievement.name}</span>
              <span className="text-sm text-navy-400">{nextAchievement.icon}</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min(100, (nextAchievement.id.startsWith('streak_') 
                    ? (streakData.currentStreak / nextAchievement.threshold) 
                    : (streakData.totalVisits / nextAchievement.threshold)) * 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-navy-500 mt-1">{nextAchievement.description}</p>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-navy-700 animate-fade-in">
            {/* Earned Achievements */}
            {earnedAchievements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-navy-300 mb-3">Your Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {earnedAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="group relative"
                    >
                      <span className="text-2xl cursor-pointer hover:scale-125 transition-transform inline-block">
                        {achievement.icon}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <p className="text-white text-sm font-medium">{achievement.name}</p>
                        <p className="text-navy-400 text-xs">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Tip */}
            <div className="bg-navy-800/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-navy-200 text-sm italic">&ldquo;{dailyTip.tip}&rdquo;</p>
                  <p className="text-navy-500 text-xs mt-2">— {dailyTip.author}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}