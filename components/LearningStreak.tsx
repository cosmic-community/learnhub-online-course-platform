'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  emoji: string
  description: string
  unlocked: boolean
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_visit', name: 'First Steps', emoji: '👣', description: 'Visited LearnHub for the first time', unlocked: true },
  { id: 'streak_3', name: 'On Fire', emoji: '🔥', description: 'Maintained a 3-day streak', unlocked: false },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚔️', description: 'Maintained a 7-day streak', unlocked: false },
  { id: 'explorer', name: 'Explorer', emoji: '🧭', description: 'Viewed 5 different courses', unlocked: false },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Learning after midnight', unlocked: false },
  { id: 'early_bird', name: 'Early Bird', emoji: '🐦', description: 'Learning before 7 AM', unlocked: false },
]

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showAchievements, setShowAchievements] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    // Load streak from localStorage
    const storedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()
    const storedAchievements = localStorage.getItem('achievements')

    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements))
    }

    if (lastVisit === today) {
      // Already visited today
      setStreak(storedStreak ? parseInt(storedStreak) : 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = (storedStreak ? parseInt(storedStreak) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
        
        // Check for streak achievements
        checkStreakAchievements(newStreak)
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }

    localStorage.setItem('last-visit-date', today)
    
    // Check time-based achievements
    checkTimeAchievements()
  }, [])

  const checkStreakAchievements = (currentStreak: number) => {
    const newAchievements = [...achievements]
    let unlocked = false
    let unlockedAchievement: Achievement | null = null

    if (currentStreak >= 3) {
      const achievement = newAchievements.find(a => a.id === 'streak_3')
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        unlocked = true
        unlockedAchievement = achievement
      }
    }
    if (currentStreak >= 7) {
      const achievement = newAchievements.find(a => a.id === 'streak_7')
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        unlocked = true
        unlockedAchievement = achievement
      }
    }

    if (unlocked) {
      setAchievements(newAchievements)
      localStorage.setItem('achievements', JSON.stringify(newAchievements))
      setNewAchievement(unlockedAchievement)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      setTimeout(() => setNewAchievement(null), 4000)
    }
  }

  const checkTimeAchievements = () => {
    const hour = new Date().getHours()
    const newAchievements = [...achievements]
    let unlocked = false
    let unlockedAchievement: Achievement | null = null

    if (hour >= 0 && hour < 5) {
      const achievement = newAchievements.find(a => a.id === 'night_owl')
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        unlocked = true
        unlockedAchievement = achievement
      }
    }
    if (hour >= 5 && hour < 7) {
      const achievement = newAchievements.find(a => a.id === 'early_bird')
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        unlocked = true
        unlockedAchievement = achievement
      }
    }

    if (unlocked) {
      setAchievements(newAchievements)
      localStorage.setItem('achievements', JSON.stringify(newAchievements))
      setNewAchievement(unlockedAchievement)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      setTimeout(() => setNewAchievement(null), 4000)
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Unlock Notification */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl p-4 shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <div className="text-4xl animate-bounce">{newAchievement.emoji}</div>
            <div>
              <div className="text-white/80 text-xs uppercase tracking-wider">Achievement Unlocked!</div>
              <div className="text-white font-bold">{newAchievement.name}</div>
              <div className="text-white/70 text-sm">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak & Achievements Widget */}
      <div className="relative">
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="group flex items-center gap-3 bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-2 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
        >
          {/* Streak Counter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className={`text-2xl ${streak > 0 ? 'animate-pulse-glow' : ''}`}>
                {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨'}
              </span>
              {streak >= 3 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs text-navy-400">Streak</div>
              <div className="text-white font-bold leading-none">{streak} day{streak !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-navy-700" />

          {/* Achievements Preview */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {achievements.filter(a => a.unlocked).slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-sm border-2 border-navy-800"
                  title={a.name}
                >
                  {a.emoji}
                </div>
              ))}
              {unlockedCount > 3 && (
                <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-xs text-navy-400 border-2 border-navy-800">
                  +{unlockedCount - 3}
                </div>
              )}
            </div>
            <svg
              className={`w-4 h-4 text-navy-400 transition-transform ${showAchievements ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Achievements Dropdown */}
        {showAchievements && (
          <div className="absolute top-full mt-2 right-0 w-80 bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl shadow-black/50 p-4 z-50 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">🏆 Achievements</h3>
              <span className="text-sm text-navy-400">{unlockedCount}/{achievements.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-navy-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>

            {/* Achievement List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    achievement.unlocked
                      ? 'bg-navy-800/50'
                      : 'bg-navy-800/20 opacity-50'
                  }`}
                >
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.unlocked ? achievement.emoji : '🔒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-navy-500'}`}>
                      {achievement.name}
                    </div>
                    <div className="text-xs text-navy-400 truncate">{achievement.description}</div>
                  </div>
                  {achievement.unlocked && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {/* Motivational Message */}
            <div className="mt-4 pt-4 border-t border-navy-700 text-center">
              <p className="text-sm text-navy-400">
                {streak < 3 
                  ? "Keep learning daily to build your streak! 🌟"
                  : streak < 7 
                  ? "You're on fire! Keep it up! 🔥"
                  : "Amazing dedication! You're unstoppable! 🏆"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}