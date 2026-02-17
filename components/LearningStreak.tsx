'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalLearningDays: number
  lastVisit: string
}

const motivationalQuotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const getRandomQuote = () => {
  const index = Math.floor(Math.random() * motivationalQuotes.length)
  return motivationalQuotes[index]
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(getRandomQuote())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Continuing the streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          totalLearningDays: data.totalLearningDays + 1,
          lastVisit: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Celebrate milestones!
        if (newStreak % 7 === 0 || newStreak === 1 || newStreak === 3 || newStreak === 30) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          totalLearningDays: data.totalLearningDays + 1,
          lastVisit: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First time visitor!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        totalLearningDays: 1,
        lastVisit: today,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    // Animate in
    setTimeout(() => setIsVisible(true), 100)
    
    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setQuote(getRandomQuote())
    }, 30000)
    
    return () => clearInterval(quoteInterval)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '🏆'
    if (streakData.currentStreak >= 14) return '💎'
    if (streakData.currentStreak >= 7) return '🔥'
    if (streakData.currentStreak >= 3) return '⭐'
    return '✨'
  }

  const getStreakMessage = () => {
    if (streakData.currentStreak >= 30) return "Legendary learner!"
    if (streakData.currentStreak >= 14) return "Two weeks strong!"
    if (streakData.currentStreak >= 7) return "On fire! Keep it up!"
    if (streakData.currentStreak >= 3) return "You're building momentum!"
    if (streakData.currentStreak === 1) return "Great start! Come back tomorrow!"
    return "Keep learning!"
  }

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`w-full transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/30 border-primary-500/20">
          {/* Greeting & Quote */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {getGreeting()}, learner! {getStreakEmoji()}
            </h3>
            <p className="text-navy-300 text-sm italic">
              &ldquo;{quote?.quote}&rdquo;
              <span className="text-navy-400 ml-2">— {quote?.author}</span>
            </p>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-3 gap-4">
            {/* Current Streak */}
            <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 group hover:border-primary-500/30 transition-colors">
              <div className="text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-navy-400 mt-1">Day Streak</div>
              <div className="text-xs text-primary-400 mt-2 font-medium">
                {getStreakMessage()}
              </div>
            </div>

            {/* Longest Streak */}
            <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 group hover:border-yellow-500/30 transition-colors">
              <div className="text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">
                {streakData.longestStreak}
              </div>
              <div className="text-xs text-navy-400 mt-1">Best Streak</div>
              <div className="text-xs text-yellow-400 mt-2 font-medium">
                {streakData.currentStreak >= streakData.longestStreak ? 'Personal best! 🎉' : 'Keep going!'}
              </div>
            </div>

            {/* Total Days */}
            <div className="text-center p-4 rounded-xl bg-navy-800/50 border border-navy-700/50 group hover:border-purple-500/30 transition-colors">
              <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                {streakData.totalLearningDays}
              </div>
              <div className="text-xs text-navy-400 mt-1">Total Days</div>
              <div className="text-xs text-purple-400 mt-2 font-medium">
                Learning journey
              </div>
            </div>
          </div>

          {/* Progress Bar to Next Milestone */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-navy-400 mb-2">
              <span>Next milestone</span>
              <span>{getNextMilestone(streakData.currentStreak)} day streak</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                style={{
                  width: `${getMilestoneProgress(streakData.currentStreak)}%`,
                }}
              />
            </div>
          </div>

          {/* Encouragement */}
          <div className="mt-4 text-center">
            <span className="text-xs text-navy-500">
              🎯 Complete a lesson today to maintain your streak!
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365]
  for (const m of milestones) {
    if (current < m) return m
  }
  return current + 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 21, 30, 60, 90, 180, 365]
  let prevMilestone = 0
  let nextMilestone = 3
  
  for (let i = 0; i < milestones.length - 1; i++) {
    if (current >= milestones[i] && current < milestones[i + 1]) {
      prevMilestone = milestones[i]
      nextMilestone = milestones[i + 1]
      break
    }
  }
  
  if (current >= milestones[milestones.length - 1]) {
    return 100
  }
  
  return ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
}