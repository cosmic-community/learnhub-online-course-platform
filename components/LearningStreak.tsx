'use client'

import { useState, useEffect, useCallback } from 'react'

// Motivational quotes for learners
const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
]

// Streak milestones for celebrations
const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365]

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

function getStoredStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastVisitDate: '', totalVisits: 0 }
  }
  
  try {
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { currentStreak: 0, longestStreak: 0, lastVisitDate: '', totalVisits: 0 }
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateString === yesterday.toISOString().split('T')[0]
}

function getDailyQuote(): typeof motivationalQuotes[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return motivationalQuotes[dayOfYear % motivationalQuotes.length]
}

// Confetti animation component
function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)],
          }}
        />
      ))}
    </div>
  )
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastVisitDate: '', totalVisits: 0 })
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const quote = getDailyQuote()

  const updateStreak = useCallback(() => {
    const stored = getStoredStreakData()
    const today = getTodayDateString()
    
    let newStreakData: StreakData
    
    if (stored.lastVisitDate === today) {
      // Already visited today
      newStreakData = stored
    } else if (isYesterday(stored.lastVisitDate)) {
      // Continuing streak
      const newStreak = stored.currentStreak + 1
      newStreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, stored.longestStreak),
        lastVisitDate: today,
        totalVisits: stored.totalVisits + 1,
      }
      
      // Check for milestone celebration
      if (milestones.includes(newStreak)) {
        setCelebrationMessage(`🎉 Amazing! ${newStreak} day streak!`)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 5000)
      }
    } else if (stored.lastVisitDate === '') {
      // First visit ever
      newStreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
      }
      setCelebrationMessage('🚀 Welcome! Your learning journey begins!')
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 4000)
    } else {
      // Streak broken
      newStreakData = {
        currentStreak: 1,
        longestStreak: stored.longestStreak,
        lastVisitDate: today,
        totalVisits: stored.totalVisits + 1,
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(newStreakData))
    setStreakData(newStreakData)
  }, [])

  useEffect(() => {
    setMounted(true)
    updateStreak()
  }, [updateStreak])

  if (!mounted) {
    return null
  }

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 365) return '👑'
    if (streakData.currentStreak >= 90) return '🏆'
    if (streakData.currentStreak >= 30) return '⭐'
    if (streakData.currentStreak >= 14) return '🌟'
    if (streakData.currentStreak >= 7) return '✨'
    if (streakData.currentStreak >= 3) return '🔥'
    return '💪'
  }

  const getStreakColor = () => {
    if (streakData.currentStreak >= 30) return 'from-yellow-500 to-orange-500'
    if (streakData.currentStreak >= 7) return 'from-primary-500 to-purple-500'
    return 'from-primary-500 to-primary-600'
  }

  const nextMilestone = milestones.find(m => m > streakData.currentStreak) || milestones[milestones.length - 1]
  const progressToNextMilestone = ((streakData.currentStreak % nextMilestone) / nextMilestone) * 100

  return (
    <>
      <Confetti show={showCelebration} />
      
      {/* Celebration Toast */}
      {showCelebration && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg shadow-primary-500/30 font-semibold text-lg">
            {celebrationMessage}
          </div>
        </div>
      )}
      
      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="py-3 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Streak Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getStreakColor()} text-white font-semibold shadow-lg`}>
                  <span className="text-xl">{getStreakEmoji()}</span>
                  <span>{streakData.currentStreak} day streak</span>
                </div>
                
                {/* Progress to next milestone */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-24 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500"
                      style={{ width: `${progressToNextMilestone}%` }}
                    />
                  </div>
                  <span className="text-navy-400 text-sm">{nextMilestone - streakData.currentStreak} days to {nextMilestone} 🎯</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="text-navy-300">
                    <span className="text-white font-semibold">{streakData.totalVisits}</span> total visits
                  </div>
                  <div className="text-navy-300">
                    Best: <span className="text-primary-400 font-semibold">{streakData.longestStreak}</span> days
                  </div>
                </div>
                
                {/* Expand Button */}
                <button className="text-navy-400 hover:text-white transition-colors">
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 mt-4' : 'max-h-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                {/* Daily Quote */}
                <div className="bg-navy-800/50 rounded-xl p-4 border border-navy-700">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="text-white italic mb-2">&ldquo;{quote.quote}&rdquo;</p>
                      <p className="text-primary-400 text-sm">— {quote.author}</p>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Stats */}
                <div className="bg-navy-800/50 rounded-xl p-4 border border-navy-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>📊</span> Your Learning Stats
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                      <div className="text-navy-400 text-xs">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
                      <div className="text-navy-400 text-xs">Best Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{streakData.totalVisits}</div>
                      <div className="text-navy-400 text-xs">Total Visits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}