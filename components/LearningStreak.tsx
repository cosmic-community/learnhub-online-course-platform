'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearning: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🌱', requirement: 1, description: 'Started your learning journey' },
  { id: 'streak_3', name: 'Getting Warm', icon: '🔥', requirement: 3, description: '3-day learning streak' },
  { id: 'streak_7', name: 'On Fire!', icon: '⚡', requirement: 7, description: '7-day learning streak' },
  { id: 'streak_14', name: 'Unstoppable', icon: '🚀', requirement: 14, description: '2-week learning streak' },
  { id: 'streak_30', name: 'Legend', icon: '👑', requirement: 30, description: '30-day learning streak' },
]

function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti-piece'
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
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      confetti.remove()
    }, 5000)
  }
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalDaysLearning: 0,
      achievements: []
    }
    
    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit).toDateString() : ''
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()
    
    if (lastVisitDate !== today) {
      // New day visit
      data.totalDaysLearning++
      
      if (lastVisitDate === yesterdayString) {
        // Continuing streak
        data.currentStreak++
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        // Check for new achievements
        const streakAchievements = ACHIEVEMENTS.filter(
          a => a.requirement <= data.currentStreak && !data.achievements.includes(a.id)
        )
        
        if (streakAchievements.length > 0) {
          const newest = streakAchievements[streakAchievements.length - 1]
          if (newest) {
            data.achievements.push(...streakAchievements.map(a => a.id))
            setNewAchievement(newest)
            setShowCelebration(true)
            createConfetti()
          }
        }
      } else if (lastVisitDate !== '' && lastVisitDate !== today) {
        // Streak broken
        data.currentStreak = 1
      } else {
        // First visit ever
        data.currentStreak = 1
        if (!data.achievements.includes('first_visit')) {
          data.achievements.push('first_visit')
          setNewAchievement(ACHIEVEMENTS[0] ?? null)
          setShowCelebration(true)
          createConfetti()
        }
      }
      
      data.lastVisit = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
        setNewAchievement(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti Animation Styles */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(99, 102, 241, 0.8);
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>

      {/* Achievement Celebration Modal */}
      {showCelebration && newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br from-navy-800 to-navy-900 border border-primary-500/50 rounded-3xl p-8 text-center max-w-sm mx-4"
            style={{ animation: 'bounce-in 0.5s ease-out' }}
          >
            <div className="text-7xl mb-4" style={{ animation: 'bounce-in 0.5s ease-out 0.2s both' }}>
              {newAchievement.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-primary-400 text-xl font-semibold mb-2">{newAchievement.name}</p>
            <p className="text-navy-300 mb-6">{newAchievement.description}</p>
            <button
              onClick={() => setShowCelebration(false)}
              className="btn-primary"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div className="fixed bottom-24 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 hover:border-primary-500/50 rounded-2xl p-4 shadow-xl transition-all duration-300 hover:scale-105"
          style={streakData.currentStreak >= 3 ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '🌱'}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
              <div className="text-xs text-navy-400">day streak</div>
            </div>
          </div>
          
          {/* Streak Progress Ring */}
          <svg className="absolute -top-1 -right-1 w-8 h-8" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray={`${Math.min((streakData.currentStreak / 7) * 100, 100)}, 100`}
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-3 w-72 bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📊</span> Your Learning Stats
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best Streak</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center col-span-2">
                <div className="text-2xl font-bold text-green-400">{streakData.totalDaysLearning}</div>
                <div className="text-xs text-navy-400">Total Days Learning</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h5 className="text-sm font-semibold text-navy-300 mb-2">Achievements</h5>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENTS.map((achievement) => {
                  const earned = earnedAchievements.some(a => a.id === achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        earned 
                          ? 'bg-primary-500/20 scale-100' 
                          : 'bg-navy-800/50 grayscale opacity-30 scale-90'
                      }`}
                      title={earned ? `${achievement.name}: ${achievement.description}` : 'Keep learning to unlock!'}
                    >
                      {achievement.icon}
                    </div>
                  )
                })}
              </div>
            </div>
            
            <p className="text-xs text-navy-500 mt-4 text-center">
              Visit daily to maintain your streak! 🎯
            </p>
          </div>
        )}
      </div>
    </>
  )
}