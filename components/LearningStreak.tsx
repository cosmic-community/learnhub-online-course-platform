'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'Welcome!', emoji: '👋', threshold: 1, type: 'visits' },
  { id: 'streak_3', name: '3 Day Streak', emoji: '🔥', threshold: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', threshold: 7, type: 'streak' },
  { id: 'streak_14', name: 'Dedicated Learner', emoji: '🌟', threshold: 14, type: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', emoji: '🏆', threshold: 30, type: 'streak' },
  { id: 'visits_10', name: 'Regular Visitor', emoji: '📚', threshold: 10, type: 'visits' },
  { id: 'visits_50', name: 'Knowledge Seeker', emoji: '🎯', threshold: 50, type: 'visits' },
]

function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#eab308', '#ef4444']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showWidget, setShowWidget] = useState(false)

  const checkAchievements = useCallback((data: StreakData): string[] => {
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (data.achievements.includes(achievement.id)) return
      
      let earned = false
      if (achievement.type === 'streak' && data.currentStreak >= achievement.threshold) {
        earned = true
      } else if (achievement.type === 'visits' && data.totalVisits >= achievement.threshold) {
        earned = true
      }
      
      if (earned) {
        newAchievements.push(achievement.id)
      }
    })
    
    return newAchievements
  }, [])

  useEffect(() => {
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes achievement-pop {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4); }
      }
      @keyframes streak-fire {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `
    document.head.appendChild(style)
    
    // Load and update streak data
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
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
      data.totalVisits += 1
      
      if (lastVisitDate === yesterday) {
        data.currentStreak += 1
      } else if (lastVisitDate !== today) {
        data.currentStreak = 1
      }
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = new Date().toISOString()
    }
    
    // Check for new achievements
    const newAchievementIds = checkAchievements(data)
    if (newAchievementIds.length > 0) {
      data.achievements = [...data.achievements, ...newAchievementIds]
      
      // Show the first new achievement
      const achievementToShow = ACHIEVEMENTS.find(a => a.id === newAchievementIds[0])
      if (achievementToShow) {
        setTimeout(() => {
          setNewAchievement(achievementToShow)
          createConfetti()
        }, 1500)
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Delay showing widget for smooth entrance
    setTimeout(() => setShowWidget(true), 500)
    
    return () => {
      style.remove()
    }
  }, [checkAchievements])

  const dismissAchievement = () => {
    setNewAchievement(null)
  }

  if (!streakData || !showWidget) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Achievement Popup */}
      {newAchievement && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={dismissAchievement}
        >
          <div 
            className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-center max-w-sm border border-primary-500/50 shadow-2xl"
            style={{ animation: 'achievement-pop 0.6s ease-out forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-6xl mb-4" style={{ animation: 'streak-fire 1s ease-in-out infinite' }}>
              {newAchievement.emoji}
            </div>
            <div className="text-primary-400 text-sm font-medium uppercase tracking-wider mb-2">
              Achievement Unlocked!
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {newAchievement.name}
            </h3>
            <button
              onClick={dismissAchievement}
              className="btn-primary"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className="fixed bottom-24 left-5 z-40 transition-all duration-500"
        style={{ 
          transform: showWidget ? 'translateX(0)' : 'translateX(-120%)',
          opacity: showWidget ? 1 : 0
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
          aria-label="Learning streak"
        >
          <div 
            className="flex items-center gap-2 bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-2 shadow-lg hover:border-primary-500/50 transition-all duration-300"
            style={{ animation: streakData.currentStreak >= 3 ? 'pulse-glow 2s ease-in-out infinite' : 'none' }}
          >
            <span 
              className="text-2xl"
              style={{ animation: streakData.currentStreak >= 1 ? 'streak-fire 1s ease-in-out infinite' : 'none' }}
            >
              🔥
            </span>
            <span className="font-bold text-white text-lg">{streakData.currentStreak}</span>
            <span className="text-navy-400 text-sm hidden sm:inline">day streak</span>
          </div>
          
          {/* Expand indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {earnedAchievements.length}
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div 
            className="absolute bottom-full left-0 mb-3 w-72 bg-navy-800/95 backdrop-blur-sm border border-navy-700 rounded-xl shadow-2xl overflow-hidden"
            style={{ animation: 'achievement-pop 0.3s ease-out forwards' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 p-4 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Your Learning Journey</h4>
                  <p className="text-sm text-navy-400">Keep the streak alive!</p>
                </div>
                <div className="text-3xl" style={{ animation: 'streak-fire 1s ease-in-out infinite' }}>
                  🔥
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-navy-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Longest</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                <div className="text-xs text-navy-400">Visits</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-4">
              <h5 className="text-sm font-medium text-navy-300 mb-3">Achievements</h5>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const earned = streakData.achievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`relative group/badge ${earned ? '' : 'grayscale opacity-40'}`}
                      title={achievement.name}
                    >
                      <span className="text-2xl cursor-default">{achievement.emoji}</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none">
                        {achievement.name}
                        {!earned && ` (${achievement.type === 'streak' ? `${achievement.threshold} day streak` : `${achievement.threshold} visits`})`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Achievement */}
            {nextAchievement && (
              <div className="px-4 pb-4">
                <div className="bg-navy-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl grayscale">{nextAchievement.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium">Next: {nextAchievement.name}</div>
                      <div className="text-xs text-navy-400">
                        {nextAchievement.type === 'streak' 
                          ? `${nextAchievement.threshold - streakData.currentStreak} more days needed`
                          : `${nextAchievement.threshold - streakData.totalVisits} more visits needed`
                        }
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, (nextAchievement.type === 'streak' 
                          ? (streakData.currentStreak / nextAchievement.threshold) 
                          : (streakData.totalVisits / nextAchievement.threshold)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Motivational message */}
            <div className="px-4 pb-4 text-center">
              <p className="text-xs text-navy-400 italic">
                {streakData.currentStreak === 0 && "Start your learning streak today! 🚀"}
                {streakData.currentStreak === 1 && "Great start! Come back tomorrow to keep it going! 💪"}
                {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "You're on fire! Keep the momentum! 🔥"}
                {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "Incredible dedication! You're a learning machine! ⚡"}
                {streakData.currentStreak >= 30 && "Legendary status! You're unstoppable! 👑"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}