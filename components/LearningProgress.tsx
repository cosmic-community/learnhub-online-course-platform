'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
}

const MOTIVATIONAL_QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
]

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-visit', title: 'Explorer', description: 'Visited LearnHub for the first time', icon: '🚀', unlocked: false },
  { id: 'early-bird', title: 'Early Bird', description: 'Learning before 9 AM', icon: '🌅', unlocked: false },
  { id: 'night-owl', title: 'Night Owl', description: 'Learning after 10 PM', icon: '🦉', unlocked: false },
  { id: 'streak-3', title: 'Consistent', description: '3-day learning streak', icon: '🔥', unlocked: false },
  { id: 'streak-7', title: 'Dedicated', description: '7-day learning streak', icon: '⭐', unlocked: false },
  { id: 'curious', title: 'Curious Mind', description: 'Explored 5 different courses', icon: '🧠', unlocked: false },
]

export default function LearningProgress({ totalCourses, totalLessons }: LearningProgressProps) {
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Load saved data
    const savedStreak = localStorage.getItem('learnhub-streak')
    const savedAchievements = localStorage.getItem('learnhub-achievements')
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    
    // Calculate streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    let newStreak = 1
    if (lastVisit === today) {
      newStreak = savedStreak ? parseInt(savedStreak) : 1
    } else if (lastVisit === yesterday) {
      newStreak = savedStreak ? parseInt(savedStreak) + 1 : 1
    }
    
    setStreak(newStreak)
    localStorage.setItem('learnhub-streak', newStreak.toString())
    localStorage.setItem('learnhub-last-visit', today)
    
    // Load achievements
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
    
    // Set random quote
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])
    
    // Check for new achievements
    checkAchievements(newStreak, savedAchievements ? JSON.parse(savedAchievements) : DEFAULT_ACHIEVEMENTS)
  }, [])

  const checkAchievements = (currentStreak: number, currentAchievements: Achievement[]) => {
    const hour = new Date().getHours()
    const updatedAchievements = [...currentAchievements]
    let achievementUnlocked: Achievement | null = null

    // First visit
    const firstVisitAch = updatedAchievements.find(a => a.id === 'first-visit')
    if (firstVisitAch && !firstVisitAch.unlocked) {
      firstVisitAch.unlocked = true
      firstVisitAch.unlockedAt = new Date().toISOString()
      achievementUnlocked = firstVisitAch
    }

    // Early bird (before 9 AM)
    if (hour < 9) {
      const earlyBirdAch = updatedAchievements.find(a => a.id === 'early-bird')
      if (earlyBirdAch && !earlyBirdAch.unlocked) {
        earlyBirdAch.unlocked = true
        earlyBirdAch.unlockedAt = new Date().toISOString()
        achievementUnlocked = earlyBirdAch
      }
    }

    // Night owl (after 10 PM)
    if (hour >= 22) {
      const nightOwlAch = updatedAchievements.find(a => a.id === 'night-owl')
      if (nightOwlAch && !nightOwlAch.unlocked) {
        nightOwlAch.unlocked = true
        nightOwlAch.unlockedAt = new Date().toISOString()
        achievementUnlocked = nightOwlAch
      }
    }

    // Streak achievements
    if (currentStreak >= 3) {
      const streak3Ach = updatedAchievements.find(a => a.id === 'streak-3')
      if (streak3Ach && !streak3Ach.unlocked) {
        streak3Ach.unlocked = true
        streak3Ach.unlockedAt = new Date().toISOString()
        achievementUnlocked = streak3Ach
      }
    }

    if (currentStreak >= 7) {
      const streak7Ach = updatedAchievements.find(a => a.id === 'streak-7')
      if (streak7Ach && !streak7Ach.unlocked) {
        streak7Ach.unlocked = true
        streak7Ach.unlockedAt = new Date().toISOString()
        achievementUnlocked = streak7Ach
      }
    }

    setAchievements(updatedAchievements)
    localStorage.setItem('learnhub-achievements', JSON.stringify(updatedAchievements))

    if (achievementUnlocked) {
      setNewAchievement(achievementUnlocked)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (!isClient) {
    return null
  }

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
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-4xl">{newAchievement.icon}</span>
            <div>
              <div className="text-sm opacity-90">Achievement Unlocked!</div>
              <div className="font-bold text-lg">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6">
        {/* Header with Streak */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Your Learning Journey
          </h3>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-white font-bold">{streak} Day{streak !== 1 ? 's' : ''}</div>
              <div className="text-xs text-orange-300">Streak</div>
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-navy-700"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(unlockedCount / achievements.length) * 251.2} 251.2`}
                className="text-primary-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{unlockedCount}</div>
                <div className="text-xs text-navy-400">/{achievements.length}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-white font-semibold mb-1">Achievements Unlocked</div>
            <div className="text-navy-400 text-sm">Keep learning to earn more badges!</div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative group cursor-pointer ${
                achievement.unlocked ? '' : 'opacity-40 grayscale'
              }`}
              title={achievement.title}
            >
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-2xl ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                  : 'bg-navy-800 border border-navy-700'
              }`}>
                {achievement.icon}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <div className="text-white text-sm font-medium">{achievement.title}</div>
                <div className="text-navy-400 text-xs">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-navy-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalCourses}</div>
            <div className="text-navy-400 text-sm">Courses Available</div>
          </div>
          <div className="bg-navy-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{totalLessons}</div>
            <div className="text-navy-400 text-sm">Lessons to Learn</div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-primary-500/10 to-transparent border-l-4 border-primary-500 pl-4 py-3">
          <p className="text-navy-200 italic">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-navy-400 text-sm mt-1">— {quote.author}</p>
        </div>
      </div>
    </>
  )
}