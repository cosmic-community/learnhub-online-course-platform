'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const motivationalMessages = [
  { minStreak: 0, messages: ["Welcome! Start your learning journey today 🚀", "Every expert was once a beginner ✨", "Your future self will thank you 🙌"] },
  { minStreak: 1, messages: ["You're back! Keep the momentum going 💪", "Consistency is key 🔑", "One day at a time 📚"] },
  { minStreak: 3, messages: ["3 days strong! You're building a habit 🌱", "You're on fire! 🔥", "Amazing dedication! 🌟"] },
  { minStreak: 7, messages: ["A full week! You're unstoppable! 🏆", "7-day warrior! 💪", "Habit formed! Keep going! 🎯"] },
  { minStreak: 14, messages: ["Two weeks! You're a learning machine! 🤖", "Incredible commitment! 🌟", "You inspire us! ✨"] },
  { minStreak: 30, messages: ["30 days! You're a legend! 👑", "One month of growth! 🌳", "Nothing can stop you! 🚀"] },
]

function getMotivationalMessage(streak: number): string {
  const applicableMessages = motivationalMessages
    .filter(m => streak >= m.minStreak)
    .sort((a, b) => b.minStreak - a.minStreak)[0]
  
  const messages = applicableMessages?.messages || motivationalMessages[0].messages
  return messages[Math.floor(Math.random() * messages.length)]
}

function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '👑'
  if (streak >= 14) return '🏆'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '⚡'
  if (streak >= 1) return '✨'
  return '🌱'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [message, setMessage] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    
    let data: StreakData = stored 
      ? JSON.parse(stored)
      : { currentStreak: 0, lastVisit: '', longestStreak: 0, totalVisits: 0 }
    
    const lastVisitDate = data.lastVisit ? new Date(data.lastVisit) : null
    const todayDate = new Date(today)
    
    if (data.lastVisit !== today) {
      data.totalVisits += 1
      
      if (lastVisitDate) {
        const diffTime = todayDate.getTime() - lastVisitDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak
            // Celebrate new record!
            if (data.currentStreak > 1) {
              setShowCelebration(true)
              setTimeout(() => setShowCelebration(false), 3000)
            }
          }
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
        // Same day - no change needed
      } else {
        // First visit ever
        data.currentStreak = 1
      }
      
      data.lastVisit = today
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
    setMessage(getMotivationalMessage(data.currentStreak))
  }, [])

  if (!isClient || !streakData) {
    return null
  }

  const emoji = getStreakEmoji(streakData.currentStreak)

  return (
    <div className="relative">
      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`
              }}
            >
              {['🎉', '🎊', '⭐', '✨', '🔥'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border-primary-500/20">
        <div className="flex items-center gap-6">
          {/* Streak Counter */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-subtle">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                <div className="text-xs text-primary-100">
                  {streakData.currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 text-2xl animate-bounce-subtle">
              {emoji}
            </div>
          </div>
          
          {/* Message & Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
              {streakData.currentStreak >= 7 && (
                <span className="badge badge-free text-xs">On Fire!</span>
              )}
            </div>
            <p className="text-navy-300 text-sm mb-3">{message}</p>
            <div className="flex gap-4 text-xs text-navy-400">
              <span>
                🏆 Best: <span className="text-primary-400 font-medium">{streakData.longestStreak} days</span>
              </span>
              <span>
                📚 Total visits: <span className="text-navy-200 font-medium">{streakData.totalVisits}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress to next milestone */}
        {streakData.currentStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <StreakMilestone currentStreak={streakData.currentStreak} />
          </div>
        )}
      </div>
    </div>
  )
}

function StreakMilestone({ currentStreak }: { currentStreak: number }) {
  const milestones = [3, 7, 14, 30, 60, 100]
  const nextMilestone = milestones.find(m => m > currentStreak) || milestones[milestones.length - 1]
  const prevMilestone = milestones.filter(m => m <= currentStreak).pop() || 0
  
  const progress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  
  const milestoneRewards: Record<number, string> = {
    3: '🌟 Habit Builder',
    7: '🔥 Week Warrior', 
    14: '💪 Dedicated Learner',
    30: '🏆 Monthly Master',
    60: '👑 Knowledge King',
    100: '🎓 Century Legend'
  }

  if (currentStreak >= 100) {
    return (
      <div className="text-center text-sm">
        <span className="text-primary-400 font-medium">🎓 Century Legend achieved!</span>
        <span className="text-navy-400 ml-2">You&apos;re an inspiration!</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-navy-400">Progress to {milestoneRewards[nextMilestone]}</span>
        <span className="text-primary-400 font-medium">{nextMilestone - currentStreak} days to go</span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}