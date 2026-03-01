'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const codingTips = [
  { emoji: '🎯', tip: 'Break complex problems into smaller, manageable pieces.' },
  { emoji: '🔄', tip: 'Commit early, commit often. Your future self will thank you.' },
  { emoji: '📖', tip: 'Reading documentation is a superpower. Use it!' },
  { emoji: '🐛', tip: 'console.log is your friend, but debuggers are your best friend.' },
  { emoji: '💤', tip: 'Stuck on a bug? Take a break. Fresh eyes see solutions.' },
  { emoji: '🧪', tip: 'Write tests before you regret not writing tests.' },
  { emoji: '🎨', tip: 'Clean code reads like well-written prose.' },
  { emoji: '🤝', tip: 'Code reviews aren\'t criticism—they\'re opportunities to learn.' },
  { emoji: '📝', tip: 'Today\'s comment saves tomorrow\'s confusion.' },
  { emoji: '🚀', tip: 'Ship it! Perfect is the enemy of done.' },
  { emoji: '🧩', tip: 'Reusable components save hours of future work.' },
  { emoji: '⚡', tip: 'Premature optimization is the root of all evil.' },
  { emoji: '🎓', tip: 'The best developers never stop being students.' },
  { emoji: '🌱', tip: 'Small daily progress beats occasional big efforts.' },
]

const milestones = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyTip, setDailyTip] = useState<typeof codingTips[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMilestone, setIsMilestone] = useState(false)

  useEffect(() => {
    // Get today's tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyTip(codingTips[dayOfYear % codingTips.length])

    // Load and update streak
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Same day, just load data
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Consecutive day! Increase streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: Math.max(data.longestStreak, newStreak),
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone
        if (milestones.includes(newStreak)) {
          setIsMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [])

  if (!streakData || !dailyTip) return null

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'
  const progressToNextMilestone = milestones.find(m => m > streakData.currentStreak) || 100
  const progress = (streakData.currentStreak / progressToNextMilestone) * 100

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
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
          aria-label="Learning streak"
        >
          {/* Collapsed State - Just the streak badge */}
          <div className={`
            bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-full
            shadow-lg shadow-primary-500/10 transition-all duration-300
            ${isExpanded ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
            px-4 py-2 flex items-center gap-2 hover:border-primary-500/50
          `}>
            <span className="text-xl">{streakEmoji}</span>
            <span className="text-white font-bold">{streakData.currentStreak}</span>
            <span className="text-navy-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          </div>

          {/* Expanded State */}
          <div className={`
            absolute bottom-0 left-0 bg-navy-900/95 backdrop-blur-sm 
            border border-navy-700 rounded-2xl shadow-xl shadow-primary-500/10
            transition-all duration-300 origin-bottom-left
            ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
            w-72 p-4
          `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{streakEmoji}</span>
                <div>
                  <div className="text-white font-bold text-lg">
                    {streakData.currentStreak} Day Streak!
                  </div>
                  <div className="text-navy-400 text-xs">
                    Keep coming back to learn
                  </div>
                </div>
              </div>
              {isMilestone && (
                <span className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded-full">
                  🎉 Milestone!
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Progress to {progressToNextMilestone} days</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                <div className="text-white font-bold">{streakData.totalVisits}</div>
                <div className="text-navy-400 text-xs">Total Visits</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-2 text-center">
                <div className="text-white font-bold">{streakData.longestStreak}</div>
                <div className="text-navy-400 text-xs">Best Streak</div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <span className="text-xl shrink-0">{dailyTip.emoji}</span>
                <div>
                  <div className="text-primary-400 text-xs font-medium mb-1">Tip of the Day</div>
                  <div className="text-navy-200 text-sm leading-relaxed">{dailyTip.tip}</div>
                </div>
              </div>
            </div>

            {/* Close hint */}
            <div className="text-center mt-3 text-navy-500 text-xs">
              Click anywhere to close
            </div>
          </div>
        </button>
      </div>
    </>
  )
}