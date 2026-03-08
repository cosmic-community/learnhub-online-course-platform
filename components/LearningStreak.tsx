'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
  totalVisits: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day
    const today = new Date().toDateString()
    const quoteIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % motivationalQuotes.length
    setQuote(motivationalQuotes[quoteIndex])

    // Load and update streak data
    const savedData = localStorage.getItem('learnhub-streak')
    const todayDate = new Date().toISOString().split('T')[0]
    
    let data: StreakData = savedData 
      ? JSON.parse(savedData) 
      : { currentStreak: 0, lastVisitDate: '', longestStreak: 0, totalVisits: 0 }

    const lastVisit = data.lastVisitDate
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (lastVisit !== todayDate) {
      // New day visit
      data.totalVisits += 1
      
      if (lastVisit === yesterday) {
        // Continuing streak
        data.currentStreak += 1
      } else if (lastVisit !== todayDate) {
        // Streak broken or first visit
        data.currentStreak = 1
      }
      
      data.lastVisitDate = todayDate
      
      // Check for new milestone
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
        if (data.currentStreak > 1 && [3, 7, 14, 30, 50, 100].includes(data.currentStreak)) {
          setIsNewMilestone(true)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🏆'
    if (streak >= 50) return '💎'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return 'Legendary learner!'
    if (streak >= 50) return 'Learning master!'
    if (streak >= 30) return 'Incredible dedication!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'One week streak!'
    if (streak >= 3) return 'Building momentum!'
    if (streak >= 1) return 'Great start!'
    return 'Start your streak!'
  }

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '💫', '✨', '🎊'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-primary-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce-in text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-2xl font-bold">{streakData.currentStreak} Day Streak!</div>
              <div className="text-sm opacity-90">New personal milestone!</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating streak widget */}
      <div 
        className={`fixed bottom-24 left-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
            isNewMilestone ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-navy-950' : ''
          }`}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl">{getStreakEmoji(streakData.currentStreak)}</span>
                {streakData.currentStreak >= 7 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                  <span className="text-sm text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-primary-400 font-medium">
                  {getStreakMessage(streakData.currentStreak)}
                </div>
              </div>
              <svg 
                className={`w-5 h-5 text-navy-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-navy-700 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{streakData.longestStreak}</div>
                    <div className="text-xs text-navy-400">Best Streak</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{streakData.totalVisits}</div>
                    <div className="text-xs text-navy-400">Total Visits</div>
                  </div>
                </div>

                {/* Progress to next milestone */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-navy-400">Next milestone</span>
                    <span className="text-primary-400">
                      {getNextMilestone(streakData.currentStreak)} days
                    </span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressToMilestone(streakData.currentStreak)}%` }}
                    />
                  </div>
                </div>

                {/* Quote of the day */}
                <div className="bg-gradient-to-br from-primary-500/10 to-transparent rounded-lg p-3">
                  <div className="text-xs text-navy-400 mb-1">💡 Quote of the Day</div>
                  <p className="text-sm text-navy-200 italic">&ldquo;{quote.text}&rdquo;</p>
                  <p className="text-xs text-primary-400 mt-1">— {quote.author}</p>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100]
  return milestones.find(m => m > current) || current + 10
}

function getProgressToMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 50, 100]
  const nextMilestone = milestones.find(m => m > current) || current + 10
  const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0
  const range = nextMilestone - prevMilestone
  const progress = current - prevMilestone
  return Math.min((progress / range) * 100, 100)
}