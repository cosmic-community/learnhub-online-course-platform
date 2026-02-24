'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStreakProps {
  totalLessons: number
  totalCourses: number
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  lessonsCompleted: number
}

export default function LearningStreak({ totalLessons, totalCourses }: LearningStreakProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalVisits: 0,
    lessonsCompleted: 0,
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [mounted, setMounted] = useState(false)

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const parsed: StreakData = JSON.parse(savedData)
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(parsed)
      } else if (lastVisitDate === yesterdayString) {
        // Continuing streak!
        const newStreak = parsed.currentStreak + 1
        const newLongest = Math.max(newStreak, parsed.longestStreak)
        const newData: StreakData = {
          ...parsed,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Celebrate milestones!
        if (newStreak % 7 === 0 || newStreak === 3 || newStreak === 30) {
          setIsNewStreak(true)
          triggerConfetti()
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: parsed.longestStreak,
          lastVisit: today,
          totalVisits: parsed.totalVisits + 1,
          lessonsCompleted: parsed.lessonsCompleted,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        lessonsCompleted: 0,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setIsNewStreak(true)
      triggerConfetti()
    }
  }, [triggerConfetti])

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded-lg" />
      </div>
    )
  }

  const motivationalMessages = [
    "You're on fire! 🔥",
    "Keep it up, champion! 🏆",
    "Learning is your superpower! 💪",
    "Consistency is key! 🔑",
    "You're doing amazing! ⭐",
  ]
  
  const getMessage = () => {
    if (streakData.currentStreak >= 30) return "Legendary learner! 🌟"
    if (streakData.currentStreak >= 14) return "Unstoppable! 🚀"
    if (streakData.currentStreak >= 7) return "One week strong! 💪"
    if (streakData.currentStreak >= 3) return "Building momentum! 🎯"
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🔥 Learning Streak
            {isNewStreak && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-pulse">
                NEW!
              </span>
            )}
          </h3>
          <p className="text-navy-400 text-sm mt-1">{getMessage()}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary-400">{streakData.currentStreak}</div>
          <div className="text-navy-400 text-xs">day{streakData.currentStreak !== 1 ? 's' : ''}</div>
        </div>
      </div>
      
      {/* Streak Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-navy-400 mb-1">
          <span>Next milestone</span>
          <span>{getNextMilestone(streakData.currentStreak)} days</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(100, (streakData.currentStreak / getNextMilestone(streakData.currentStreak)) * 100)}%` 
            }}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-800">
        <div className="text-center">
          <div className="text-xl font-semibold text-white">{streakData.longestStreak}</div>
          <div className="text-navy-400 text-xs">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-white">{streakData.totalVisits}</div>
          <div className="text-navy-400 text-xs">Total Visits</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-white">{totalLessons}</div>
          <div className="text-navy-400 text-xs">Lessons</div>
        </div>
      </div>
      
      {/* Weekly Calendar */}
      <div className="mt-4 pt-4 border-t border-navy-800">
        <div className="text-xs text-navy-400 mb-2">This week</div>
        <div className="flex gap-1">
          {getWeekDays().map((day, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                day.isToday
                  ? 'bg-primary-500 text-white'
                  : day.isActive
                  ? 'bg-primary-500/30 text-primary-300'
                  : 'bg-navy-800 text-navy-500'
              }`}
              title={day.date}
            >
              {day.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 21, 30, 60, 90, 180, 365]
  return milestones.find(m => m > current) ?? current + 30
}

function getWeekDays(): Array<{ label: string; date: string; isToday: boolean; isActive: boolean }> {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  return days.map((label, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - dayOfWeek + i)
    return {
      label,
      date: date.toDateString(),
      isToday: i === dayOfWeek,
      isActive: i <= dayOfWeek, // Assume active for days up to today in the week
    }
  })
}