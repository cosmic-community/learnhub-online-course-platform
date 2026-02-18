'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

interface UserProgress {
  streak: number
  lastVisit: string
  lessonsViewed: number
  coursesStarted: number
  totalTimeMinutes: number
  badges: string[]
}

const INITIAL_PROGRESS: UserProgress = {
  streak: 0,
  lastVisit: '',
  lessonsViewed: 0,
  coursesStarted: 0,
  totalTimeMinutes: 0,
  badges: []
}

const BADGES = [
  { id: 'first_visit', name: 'First Steps', icon: '🚀', description: 'Visited LearnHub for the first time', requirement: () => true },
  { id: 'explorer', name: 'Explorer', icon: '🔍', description: 'Explored the platform', requirement: (p: UserProgress) => p.lessonsViewed >= 1 },
  { id: 'dedicated', name: 'Dedicated Learner', icon: '📚', description: '3 day learning streak', requirement: (p: UserProgress) => p.streak >= 3 },
  { id: 'committed', name: 'Committed', icon: '🔥', description: '7 day learning streak', requirement: (p: UserProgress) => p.streak >= 7 },
  { id: 'master', name: 'Knowledge Master', icon: '🎓', description: '30 day learning streak', requirement: (p: UserProgress) => p.streak >= 30 },
]

function ProgressRing({ progress, size = 80, strokeWidth = 6, color = '#14b8a6' }: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const [offset, setOffset] = useState(circumference)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const progressOffset = circumference - (progress / 100) * circumference
      setOffset(progressOffset)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress, circumference])

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-navy-800"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  )
}

export default function LearningStats({ totalCourses, totalLessons, totalInstructors }: LearningStatsProps) {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS)
  const [mounted, setMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newBadge, setNewBadge] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Load progress from localStorage
    const stored = localStorage.getItem('learnhub_progress')
    let currentProgress: UserProgress = stored ? JSON.parse(stored) : { ...INITIAL_PROGRESS }
    
    // Check and update streak
    const today = new Date().toDateString()
    const lastVisit = currentProgress.lastVisit
    
    if (lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak!
        currentProgress.streak += 1
        if (currentProgress.streak === 3 || currentProgress.streak === 7 || currentProgress.streak === 30) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else if (lastVisit && lastVisit !== today) {
        // Streak broken
        currentProgress.streak = 1
      } else if (!lastVisit) {
        // First visit
        currentProgress.streak = 1
      }
      
      currentProgress.lastVisit = today
      currentProgress.lessonsViewed += 1 // Simulate viewing
      
      // Check for new badges
      const oldBadges = new Set(currentProgress.badges)
      BADGES.forEach(badge => {
        if (!oldBadges.has(badge.id) && badge.requirement(currentProgress)) {
          currentProgress.badges.push(badge.id)
          setNewBadge(badge.name)
          setTimeout(() => setNewBadge(null), 4000)
        }
      })
      
      localStorage.setItem('learnhub_progress', JSON.stringify(currentProgress))
    }
    
    setProgress(currentProgress)
  }, [])

  if (!mounted) {
    return null
  }

  const streakProgress = Math.min((progress.streak / 30) * 100, 100)
  const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id))
  const lockedBadges = BADGES.filter(b => !progress.badges.includes(b.id))

  return (
    <div className="relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* New Badge Notification */}
      {newBadge && (
        <div className="fixed top-20 right-4 z-50 animate-pulse">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-bold">New Badge Unlocked!</p>
                <p className="text-primary-100">{newBadge}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Your Learning Journey</h3>
          <p className="text-navy-400">Keep the momentum going! 🚀</p>
        </div>

        {/* Streak Counter */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <ProgressRing progress={streakProgress} size={120} strokeWidth={8} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{progress.streak}</span>
              <span className="text-xs text-navy-400">day streak</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl">{progress.streak >= 7 ? '🔥' : progress.streak >= 3 ? '⚡' : '✨'}</span>
            <span className="text-navy-300">
              {progress.streak === 0 && "Start your streak today!"}
              {progress.streak === 1 && "Great start! Come back tomorrow!"}
              {progress.streak >= 2 && progress.streak < 7 && `${7 - progress.streak} days until weekly badge!`}
              {progress.streak >= 7 && progress.streak < 30 && "You're on fire! Keep it up!"}
              {progress.streak >= 30 && "Legendary learner! 🎓"}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-navy-800/50 rounded-lg">
            <div className="relative inline-flex items-center justify-center">
              <ProgressRing progress={Math.min((progress.lessonsViewed / totalLessons) * 100, 100)} size={60} strokeWidth={4} color="#2dd4bf" />
              <span className="absolute text-lg font-bold text-white">{progress.lessonsViewed}</span>
            </div>
            <p className="text-navy-400 text-sm mt-2">Lessons Viewed</p>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-lg">
            <div className="text-3xl mb-1">📚</div>
            <p className="text-xl font-bold text-white">{totalCourses}</p>
            <p className="text-navy-400 text-sm">Available Courses</p>
          </div>
          <div className="text-center p-4 bg-navy-800/50 rounded-lg">
            <div className="text-3xl mb-1">👨‍🏫</div>
            <p className="text-xl font-bold text-white">{totalInstructors}</p>
            <p className="text-navy-400 text-sm">Expert Instructors</p>
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏆</span> Your Badges
          </h4>
          
          {/* Earned Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                className="group relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/25 hover:scale-110 transition-transform cursor-pointer">
                  {badge.icon}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-navy-400 text-xs">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {lockedBadges.map(badge => (
                <div
                  key={badge.id}
                  className="group relative"
                >
                  <div className="w-14 h-14 rounded-full bg-navy-800 border-2 border-navy-700 border-dashed flex items-center justify-center text-2xl grayscale opacity-40 hover:opacity-60 transition-opacity cursor-pointer">
                    {badge.icon}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <p className="font-semibold text-navy-400">🔒 {badge.name}</p>
                    <p className="text-navy-500 text-xs">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}