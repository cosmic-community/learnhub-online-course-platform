'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalLessonsCompleted: number
  totalMinutesLearned: number
  completedLessons: string[]
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: '',
  totalLessonsCompleted: 0,
  totalMinutesLearned: 0,
  completedLessons: [],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisit === yesterday) {
        // Continuing streak!
        const newData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisitDate: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setShowAnimation(true)
      } else {
        // Streak broken, start fresh
        const newData = {
          ...data,
          currentStreak: 1,
          lastVisitDate: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData = {
        ...DEFAULT_STREAK_DATA,
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setShowAnimation(true)
    }
    
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-20 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary learner! You're unstoppable!"
    if (streak >= 14) return "Two weeks strong! Amazing dedication!"
    if (streak >= 7) return "One week streak! Keep it going!"
    if (streak >= 3) return "Building momentum! Great start!"
    return "Every journey begins with a single step!"
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10 transition-opacity duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}
        style={{ animation: showAnimation ? 'pulse 2s ease-in-out infinite' : 'none' }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">{getStreakEmoji(streakData.currentStreak)}</span>
            Learning Streak
          </h3>
          {streakData.currentStreak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 rounded-full">
              <span className="text-primary-400 font-bold text-lg">{streakData.currentStreak}</span>
              <span className="text-primary-400 text-sm">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <p className="text-navy-300 text-sm mb-4">{getStreakMessage(streakData.currentStreak)}</p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-400">Current</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best</div>
          </div>
          <div className="text-center p-3 bg-navy-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{streakData.totalLessonsCompleted}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
        </div>
        
        {/* Streak progress bar to next milestone */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-navy-400 mb-1">
            <span>Progress to next milestone</span>
            <span>{getNextMilestone(streakData.currentStreak)} days</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${getMilestoneProgress(streakData.currentStreak)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Confetti effect */}
      {showAnimation && <ConfettiEffect onComplete={() => setShowAnimation(false)} />}
    </div>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365]
  for (const m of milestones) {
    if (current < m) return m
  }
  return current + 30
}

function getMilestoneProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 30, 60, 90, 180, 365]
  let prevMilestone = 0
  let nextMilestone = 3
  
  for (let i = 0; i < milestones.length - 1; i++) {
    if (current >= milestones[i] && current < milestones[i + 1]) {
      prevMilestone = milestones[i]
      nextMilestone = milestones[i + 1]
      break
    }
  }
  
  if (current >= 365) {
    prevMilestone = Math.floor(current / 30) * 30
    nextMilestone = prevMilestone + 30
  }
  
  const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  return Math.min(100, Math.max(0, progress))
}

function ConfettiEffect({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

// Export a function to mark lessons as complete
export function markLessonComplete(lessonSlug: string, durationMinutes: number = 0) {
  const stored = localStorage.getItem('learnhub-streak')
  if (stored) {
    const data: StreakData = JSON.parse(stored)
    if (!data.completedLessons.includes(lessonSlug)) {
      const newData = {
        ...data,
        totalLessonsCompleted: data.totalLessonsCompleted + 1,
        totalMinutesLearned: data.totalMinutesLearned + durationMinutes,
        completedLessons: [...data.completedLessons, lessonSlug],
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      return true
    }
  }
  return false
}

// Export function to check if lesson is complete
export function isLessonComplete(lessonSlug: string): boolean {
  const stored = localStorage.getItem('learnhub-streak')
  if (stored) {
    const data: StreakData = JSON.parse(stored)
    return data.completedLessons.includes(lessonSlug)
  }
  return false
}