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
  { id: 'first_visit', name: 'First Steps', icon: '🌱', description: 'Visited LearnHub for the first time', threshold: 1 },
  { id: 'three_days', name: 'Getting Started', icon: '🔥', description: '3 day learning streak', threshold: 3 },
  { id: 'week_warrior', name: 'Week Warrior', icon: '⚡', description: '7 day learning streak', threshold: 7 },
  { id: 'dedicated', name: 'Dedicated Learner', icon: '💎', description: '14 day learning streak', threshold: 14 },
  { id: 'unstoppable', name: 'Unstoppable', icon: '🏆', description: '30 day learning streak', threshold: 30 },
  { id: 'explorer', name: 'Explorer', icon: '🧭', description: 'Visited 10 times', threshold: 10 },
  { id: 'regular', name: 'Regular', icon: '⭐', description: 'Visited 25 times', threshold: 25 },
  { id: 'devoted', name: 'Devoted', icon: '👑', description: 'Visited 50 times', threshold: 50 },
]

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Gandhi" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
]

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])
  
  useEffect(() => {
    const colors = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#fb7185']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            width: '10px',
            height: '10px',
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0])

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length])

    // Load or initialize streak data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        data.totalVisits += 1
        
        if (lastVisitDate === yesterday) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
          }
        } else {
          // Streak broken - reset to 1
          data.currentStreak = 1
        }
        
        data.lastVisit = today
        
        // Check for new achievements
        checkAndGrantAchievements(data)
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        achievements: []
      }
      
      // Grant first achievement
      const firstAchievement = ACHIEVEMENTS.find(a => a.id === 'first_visit')
      if (firstAchievement) {
        data.achievements.push('first_visit')
        setNewAchievement(firstAchievement)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  const checkAndGrantAchievements = (data: StreakData) => {
    // Check streak-based achievements
    const streakAchievements = ACHIEVEMENTS.filter(a => 
      ['three_days', 'week_warrior', 'dedicated', 'unstoppable'].includes(a.id)
    )
    
    for (const achievement of streakAchievements) {
      if (!data.achievements.includes(achievement.id) && data.currentStreak >= achievement.threshold) {
        data.achievements.push(achievement.id)
        setNewAchievement(achievement)
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          setNewAchievement(null)
        }, 4000)
        break // Only show one achievement at a time
      }
    }
    
    // Check visit-based achievements
    const visitAchievements = ACHIEVEMENTS.filter(a => 
      ['explorer', 'regular', 'devoted'].includes(a.id)
    )
    
    for (const achievement of visitAchievements) {
      if (!data.achievements.includes(achievement.id) && data.totalVisits >= achievement.threshold) {
        data.achievements.push(achievement.id)
        if (!newAchievement) {
          setNewAchievement(achievement)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewAchievement(null)
          }, 4000)
        }
        break
      }
    }
  }

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const unearnedAchievements = ACHIEVEMENTS.filter(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 shadow-2xl shadow-primary-500/30 text-center max-w-sm">
            <div className="text-5xl mb-3 animate-pulse">{newAchievement.icon}</div>
            <h3 className="text-xl font-bold text-white mb-1">Achievement Unlocked!</h3>
            <p className="text-primary-100 font-semibold">{newAchievement.name}</p>
            <p className="text-primary-200 text-sm mt-1">{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Floating Streak Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-20 left-5 z-40 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-3 shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 group"
        aria-label="View learning streak"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg">{streakData.currentStreak}</span>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="fixed bottom-36 left-5 z-40 w-80 animate-slide-up">
          <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🎯</span> Your Learning Journey
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-navy-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-4">
              {/* Current Streak */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-navy-400 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold text-white flex items-center gap-2">
                      {streakData.currentStreak}
                      <span className="text-2xl">🔥</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-navy-400 text-sm">Best Streak</p>
                    <p className="text-xl font-semibold text-primary-400">{streakData.longestStreak} days</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((streakData.currentStreak / 30) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-navy-400 text-xs mt-1">{30 - streakData.currentStreak} days until 🏆 Unstoppable</p>
              </div>

              {/* Total Visits */}
              <div className="flex items-center justify-between bg-navy-800/50 rounded-lg p-3">
                <span className="text-navy-300">Total Visits</span>
                <span className="text-white font-semibold">{streakData.totalVisits}</span>
              </div>

              {/* Daily Quote */}
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
                <p className="text-primary-200 text-sm italic">"{dailyQuote.quote}"</p>
                <p className="text-primary-400 text-xs mt-2">— {dailyQuote.author}</p>
              </div>

              {/* Achievements */}
              <div>
                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🏅</span> Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.length})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {earnedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="aspect-square bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-help"
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                  {unearnedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="aspect-square bg-navy-800/50 rounded-lg flex items-center justify-center text-2xl grayscale opacity-30 cursor-help"
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}