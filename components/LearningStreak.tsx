'use client'

import { useState, useEffect, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningData {
  streak: number
  lastVisit: string
  totalVisits: number
  coursesViewed: string[]
  achievements: Achievement[]
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-visit', title: 'Welcome!', description: 'Started your learning journey', icon: '👋' },
  { id: 'streak-3', title: 'Getting Started', description: '3 day learning streak', icon: '🔥' },
  { id: 'streak-7', title: 'Week Warrior', description: '7 day learning streak', icon: '⚡' },
  { id: 'streak-30', title: 'Dedicated Learner', description: '30 day learning streak', icon: '🏆' },
  { id: 'courses-3', title: 'Explorer', description: 'Explored 3 different courses', icon: '🧭' },
  { id: 'courses-5', title: 'Knowledge Seeker', description: 'Explored 5 different courses', icon: '📚' },
  { id: 'visits-10', title: 'Regular', description: 'Visited 10 times', icon: '⭐' },
  { id: 'visits-50', title: 'Power User', description: 'Visited 50 times', icon: '💎' },
]

function createConfetti() {
  const colors = ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECB71', '#A855F7']
  const confettiCount = 50
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 4000)
  }
}

// Add confetti animation styles
if (typeof document !== 'undefined') {
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
    @keyframes streak-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(41, 171, 226, 0.5); }
      50% { box-shadow: 0 0 20px rgba(41, 171, 226, 0.8), 0 0 30px rgba(41, 171, 226, 0.4); }
    }
  `
  document.head.appendChild(style)
}

export default function LearningStreak() {
  const [data, setData] = useState<LearningData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const checkAchievements = useCallback((currentData: LearningData): Achievement[] => {
    const newlyUnlocked: Achievement[] = []
    
    const updatedAchievements = ACHIEVEMENTS.map(achievement => {
      const existing = currentData.achievements.find(a => a.id === achievement.id)
      if (existing?.unlocked) return existing

      let shouldUnlock = false
      
      switch (achievement.id) {
        case 'first-visit':
          shouldUnlock = true
          break
        case 'streak-3':
          shouldUnlock = currentData.streak >= 3
          break
        case 'streak-7':
          shouldUnlock = currentData.streak >= 7
          break
        case 'streak-30':
          shouldUnlock = currentData.streak >= 30
          break
        case 'courses-3':
          shouldUnlock = currentData.coursesViewed.length >= 3
          break
        case 'courses-5':
          shouldUnlock = currentData.coursesViewed.length >= 5
          break
        case 'visits-10':
          shouldUnlock = currentData.totalVisits >= 10
          break
        case 'visits-50':
          shouldUnlock = currentData.totalVisits >= 50
          break
      }

      if (shouldUnlock && !existing?.unlocked) {
        const unlockedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
        newlyUnlocked.push(unlockedAchievement)
        return unlockedAchievement
      }

      return { ...achievement, unlocked: false }
    })

    return updatedAchievements
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-progress')
    const today = new Date().toDateString()
    
    let currentData: LearningData
    
    if (stored) {
      currentData = JSON.parse(stored)
      const lastVisitDate = new Date(currentData.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate !== today) {
        if (lastVisitDate === yesterday) {
          // Continue streak
          currentData.streak += 1
        } else if (lastVisitDate !== today) {
          // Streak broken
          currentData.streak = 1
        }
        currentData.lastVisit = today
        currentData.totalVisits += 1
      }
    } else {
      currentData = {
        streak: 1,
        lastVisit: today,
        totalVisits: 1,
        coursesViewed: [],
        achievements: []
      }
    }

    // Check for new achievements
    const previousAchievements = currentData.achievements.filter(a => a.unlocked).length
    currentData.achievements = checkAchievements(currentData)
    const newAchievements = currentData.achievements.filter(a => a.unlocked).length

    // Save updated data
    localStorage.setItem('learnhub-progress', JSON.stringify(currentData))
    setData(currentData)

    // Show celebration for new achievements
    if (newAchievements > previousAchievements) {
      const latestAchievement = currentData.achievements
        .filter(a => a.unlocked)
        .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())[0]
      
      if (latestAchievement) {
        setTimeout(() => {
          setNewAchievement(latestAchievement)
          createConfetti()
        }, 500)
      }
    }

    // Track course views from URL
    const path = window.location.pathname
    if (path.includes('/courses/') && !path.includes('/lessons/')) {
      const courseSlug = path.split('/courses/')[1]?.split('/')[0]
      if (courseSlug && !currentData.coursesViewed.includes(courseSlug)) {
        currentData.coursesViewed.push(courseSlug)
        currentData.achievements = checkAchievements(currentData)
        localStorage.setItem('learnhub-progress', JSON.stringify(currentData))
        setData({ ...currentData })
      }
    }
  }, [checkAchievements])

  if (!data) return null

  const unlockedCount = data.achievements.filter(a => a.unlocked).length
  const progressPercent = (unlockedCount / ACHIEVEMENTS.length) * 100

  return (
    <>
      {/* Achievement Notification */}
      {newAchievement && (
        <div 
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          style={{ animation: 'achievement-pop 0.5s ease-out' }}
        >
          <span className="text-4xl">{newAchievement.icon}</span>
          <div>
            <div className="font-bold text-lg">Achievement Unlocked!</div>
            <div className="text-primary-100">{newAchievement.title}</div>
          </div>
          <button 
            onClick={() => setNewAchievement(null)}
            className="ml-4 text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Streak Button */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-110 transition-transform"
          style={{ animation: data.streak >= 3 ? 'streak-pulse 2s infinite, glow 2s infinite' : undefined }}
        >
          <span className="text-2xl">🔥</span>
          <span className="absolute -top-1 -right-1 bg-white text-orange-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {data.streak}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 bg-navy-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {data.streak} day streak! Click to see progress
          </div>
        )}

        {/* Expanded Panel */}
        {isExpanded && (
          <div 
            className="absolute bottom-full right-0 mb-4 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: 'achievement-pop 0.3s ease-out' }}
          >
            <div className="bg-gradient-to-r from-primary-500/20 to-orange-500/20 p-4 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Your Progress</h3>
                <button onClick={() => setIsExpanded(false)} className="text-navy-400 hover:text-white">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-navy-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-orange-400">{data.streak}</div>
                  <div className="text-xs text-navy-400">Day Streak</div>
                </div>
                <div className="bg-navy-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-primary-400">{data.totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
                <div className="bg-navy-800 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-400">{data.coursesViewed.length}</div>
                  <div className="text-xs text-navy-400">Courses</div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-navy-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${progressPercent * 1.76} 176`}
                      className="text-primary-400 transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                    {unlockedCount}/{ACHIEVEMENTS.length}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold">Achievements</div>
                  <div className="text-sm text-navy-400">
                    {ACHIEVEMENTS.length - unlockedCount} more to unlock
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-4 gap-2">
                {data.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-primary-500/30 to-orange-500/30 border border-primary-500/50' 
                        : 'bg-navy-800 opacity-40 grayscale'
                    }`}
                    title={`${achievement.title}: ${achievement.description}`}
                  >
                    {achievement.icon}
                  </div>
                ))}
              </div>

              {/* Motivational Message */}
              <div className="text-center text-sm text-navy-300 pt-2 border-t border-navy-700">
                {data.streak >= 7 
                  ? "🌟 Amazing dedication! Keep it up!"
                  : data.streak >= 3
                  ? "🔥 You're on fire! Don't break the streak!"
                  : "💪 Start building your learning streak!"}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}