'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
}

const MOTIVATIONAL_TIPS = [
  { emoji: '🎯', tip: 'Focus on one concept at a time for deeper understanding' },
  { emoji: '⏰', tip: 'Even 15 minutes of daily learning adds up to big results' },
  { emoji: '📝', tip: 'Take notes while watching - it boosts retention by 65%' },
  { emoji: '🔄', tip: 'Review yesterday\'s lesson before starting a new one' },
  { emoji: '💡', tip: 'Try teaching what you learned to solidify your knowledge' },
  { emoji: '🎮', tip: 'Practice coding along with video tutorials' },
  { emoji: '☕', tip: 'Take breaks every 25 minutes to stay sharp' },
  { emoji: '🌟', tip: 'Celebrate small wins - every lesson completed matters!' },
  { emoji: '🤝', tip: 'Join coding communities to learn from others' },
  { emoji: '📚', tip: 'Mix theory with hands-on projects for best results' },
]

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyTip, setDailyTip] = useState(MOTIVATIONAL_TIPS[0])
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get today's date string
    const today = new Date().toDateString()
    
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, no change
      } else if (diffDays === 1) {
        // Consecutive day - increase streak
        data.currentStreak += 1
        data.totalDaysLearned += 1
        data.lastVisitDate = today
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        // Check for milestone celebration
        if (STREAK_MILESTONES.includes(data.currentStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken
        data.currentStreak = 1
        data.totalDaysLearned += 1
        data.lastVisitDate = today
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Set daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyTip(MOTIVATIONAL_TIPS[dayOfYear % MOTIVATIONAL_TIPS.length])
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  if (!streakData) return null

  const nextMilestone = STREAK_MILESTONES.find(m => m > streakData.currentStreak) || 365
  const progressToMilestone = (streakData.currentStreak / nextMilestone) * 100

  return (
    <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Celebration confetti overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      <section className="py-12 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-yellow-500/5 to-orange-500/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Streak Card */}
            <div className="card p-8 relative overflow-hidden group">
              {/* Animated fire background for streaks */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl animate-bounce-slow">🔥</div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-300">Learning Streak</h3>
                    <p className="text-navy-500 text-sm">Keep it going!</p>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-2xl text-navy-400">days</span>
                </div>
                
                {/* Progress to next milestone */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-navy-400">Next milestone</span>
                    <span className="text-primary-400 font-medium">{nextMilestone} days 🏆</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Stats row */}
                <div className="flex gap-6 pt-4 border-t border-navy-800">
                  <div>
                    <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
                    <div className="text-navy-500 text-sm">Best Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{streakData.totalDaysLearned}</div>
                    <div className="text-navy-500 text-sm">Total Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Tip Card */}
            <div className="card p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{dailyTip.emoji}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-300">Daily Learning Tip</h3>
                    <p className="text-navy-500 text-sm">Fresh advice every day</p>
                  </div>
                </div>
                
                <p className="text-xl text-white leading-relaxed mb-6">
                  "{dailyTip.tip}"
                </p>
                
                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      const next = (MOTIVATIONAL_TIPS.indexOf(dailyTip) + 1) % MOTIVATIONAL_TIPS.length
                      setDailyTip(MOTIVATIONAL_TIPS[next])
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    New Tip
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(dailyTip.tip)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}