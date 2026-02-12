'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsViewed: number
  coursesStarted: string[]
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '👋', requirement: 1, type: 'visits' },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', requirement: 7, type: 'streak' },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '💪', requirement: 14, type: 'streak' },
  { id: 'streak_30', name: 'Learning Legend', icon: '🏆', requirement: 30, type: 'streak' },
  { id: 'visits_10', name: 'Regular', icon: '⭐', requirement: 10, type: 'visits' },
  { id: 'visits_50', name: 'Committed', icon: '💎', requirement: 50, type: 'visits' },
]

function createConfetti() {
  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
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
      opacity: 1;
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
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      lessonsViewed: 0,
      coursesStarted: [],
      achievements: []
    }

    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
    const todayDate = new Date(today)
    
    // Check if this is a new day visit
    if (data.lastVisit !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
          
          // Check for streak milestones
          if ([3, 7, 14, 30].includes(data.currentStreak)) {
            setShowCelebration(true)
            createConfetti()
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit
        data.currentStreak = 1
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastVisit = today
      
      // Check for new achievements
      const newAchievements: string[] = []
      ACHIEVEMENTS.forEach(achievement => {
        if (!data.achievements.includes(achievement.id)) {
          const value = achievement.type === 'streak' ? data.currentStreak : data.totalVisits
          if (value >= achievement.requirement) {
            data.achievements.push(achievement.id)
            newAchievements.push(achievement.name)
          }
        }
      })
      
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0])
        createConfetti()
        setTimeout(() => setNewAchievement(null), 4000)
      }
      
      localStorage.setItem('learnhub_streak', JSON.stringify(data))
    }
    
    setStreakData(data)
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Confetti CSS */}
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
        
        @keyframes flame-dance {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          25% { transform: scale(1.1) rotate(2deg); }
          50% { transform: scale(1.05) rotate(-1deg); }
          75% { transform: scale(1.15) rotate(1deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Achievement Toast */}
      {newAchievement && (
        <div 
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl"
          style={{ animation: 'bounce-in 0.5s ease-out' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="text-sm opacity-90">Achievement Unlocked!</p>
              <p className="font-bold text-lg">{newAchievement}</p>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Overlay */}
      {showCelebration && (
        <div 
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 text-center"
          style={{ animation: 'bounce-in 0.5s ease-out' }}
        >
          <div className="bg-navy-900/95 backdrop-blur-lg px-8 py-4 rounded-2xl border border-primary-500/50 shadow-2xl">
            <p className="text-2xl mb-1">
              {streakData.currentStreak === 1 ? '👋 Welcome!' : '🔥 Streak!'}
            </p>
            <p className="text-navy-300 text-sm">
              {streakData.currentStreak === 1 
                ? 'Start your learning journey today!' 
                : `${streakData.currentStreak} day streak! Keep it up!`}
            </p>
          </div>
        </div>
      )}

      {/* Main Streak Widget */}
      <div 
        className="card p-6"
        style={isAnimating ? { animation: 'pulse-glow 1s ease-in-out' } : {}}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Your Learning Journey</h3>
            <p className="text-navy-400 text-sm">Keep the momentum going!</p>
          </div>
          <div 
            className="text-4xl"
            style={streakData.currentStreak > 0 ? { animation: 'flame-dance 1s ease-in-out infinite' } : {}}
          >
            {streakData.currentStreak > 0 ? '🔥' : '💤'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-400">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-xl">
            <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
        </div>

        {/* Streak Progress Bar */}
        {nextAchievement && nextAchievement.type === 'streak' && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-navy-400 mb-2">
              <span>Progress to &quot;{nextAchievement.name}&quot;</span>
              <span>{streakData.currentStreak}/{nextAchievement.requirement} days</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (streakData.currentStreak / nextAchievement.requirement) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Achievements */}
        {earnedAchievements.length > 0 && (
          <div>
            <p className="text-sm text-navy-400 mb-3">Achievements Earned</p>
            <div className="flex flex-wrap gap-2">
              {earnedAchievements.map((achievement, index) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800/50 rounded-full text-sm"
                  style={{ animation: `slide-up 0.3s ease-out ${index * 0.1}s both` }}
                  title={achievement.name}
                >
                  <span>{achievement.icon}</span>
                  <span className="text-navy-300">{achievement.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="mt-6 pt-4 border-t border-navy-800">
          <p className="text-sm text-center">
            {streakData.currentStreak === 0 && (
              <span className="text-navy-400">Start learning today to begin your streak! 🚀</span>
            )}
            {streakData.currentStreak === 1 && (
              <span className="text-primary-400">Great start! Come back tomorrow to keep it going! 💪</span>
            )}
            {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && (
              <span className="text-primary-400">You&apos;re building momentum! {7 - streakData.currentStreak} days to Week Warrior! ⚡</span>
            )}
            {streakData.currentStreak >= 7 && streakData.currentStreak < 14 && (
              <span className="text-yellow-400">Amazing consistency! Keep pushing to Dedicated Learner! 🌟</span>
            )}
            {streakData.currentStreak >= 14 && (
              <span className="text-yellow-400">You&apos;re unstoppable! True Learning Legend in the making! 🏆</span>
            )}
          </p>
        </div>
      </div>
    </>
  )
}