'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProgressState {
  coursesViewed: number
  lessonsViewed: number
  categoriesExplored: number
  totalActions: number
  streak: number
  lastVisit: string | null
}

const MILESTONES = [1, 3, 5, 10, 15, 25, 50]

const ENCOURAGEMENTS = [
  { threshold: 0, message: "Welcome! Start exploring 🌟" },
  { threshold: 1, message: "Great start! Keep going 🚀" },
  { threshold: 3, message: "You're on fire! 🔥" },
  { threshold: 5, message: "Learning machine! 💪" },
  { threshold: 10, message: "Unstoppable learner! 🏆" },
  { threshold: 15, message: "Knowledge seeker! 📚" },
  { threshold: 25, message: "Education champion! 👑" },
  { threshold: 50, message: "Legendary learner! ⭐" },
]

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#22c55e', '#14b8a6', '#0ea5e9']

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
}

export default function LearningProgressTracker() {
  const [progress, setProgress] = useState<ProgressState>({
    coursesViewed: 0,
    lessonsViewed: 0,
    categoriesExplored: 0,
    totalActions: 0,
    streak: 1,
    lastVisit: null,
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([])
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Generate confetti pieces
  const triggerConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }))
    setConfettiPieces(pieces)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 4000)
  }, [])

  // Load progress from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('learnhub-progress')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProgressState
        
        // Check streak
        const today = new Date().toDateString()
        const lastVisit = parsed.lastVisit
        
        if (lastVisit) {
          const lastDate = new Date(lastVisit)
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          
          if (lastDate.toDateString() === yesterday.toDateString()) {
            // Visited yesterday, increase streak
            parsed.streak = (parsed.streak || 1) + 1
          } else if (lastDate.toDateString() !== today) {
            // Missed a day, reset streak
            parsed.streak = 1
          }
        }
        
        parsed.lastVisit = today
        setProgress(parsed)
        localStorage.setItem('learnhub-progress', JSON.stringify(parsed))
      } catch {
        // Invalid JSON, start fresh
      }
    } else {
      const initial = { ...progress, lastVisit: new Date().toDateString() }
      localStorage.setItem('learnhub-progress', JSON.stringify(initial))
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (!isClient) return

    const trackPageView = () => {
      const path = window.location.pathname
      
      setProgress(prev => {
        const newProgress = { ...prev }
        let shouldCelebrate = false
        
        if (path.includes('/courses/') && path.includes('/lessons/')) {
          newProgress.lessonsViewed += 1
          newProgress.totalActions += 1
        } else if (path.includes('/courses/') && !path.endsWith('/courses')) {
          newProgress.coursesViewed += 1
          newProgress.totalActions += 1
        } else if (path.includes('/categories/') && !path.endsWith('/categories')) {
          newProgress.categoriesExplored += 1
          newProgress.totalActions += 1
        }
        
        // Check for milestone
        if (MILESTONES.includes(newProgress.totalActions) && newProgress.totalActions > prev.totalActions) {
          shouldCelebrate = true
        }
        
        localStorage.setItem('learnhub-progress', JSON.stringify(newProgress))
        
        if (shouldCelebrate) {
          triggerConfetti()
          setCelebrationMessage(`🎉 ${newProgress.totalActions} pages explored!`)
          setTimeout(() => setCelebrationMessage(null), 3000)
        }
        
        return newProgress
      })
    }

    // Track initial page
    trackPageView()

    // Listen for route changes (Next.js)
    const handleRouteChange = () => {
      setTimeout(trackPageView, 100)
    }

    window.addEventListener('popstate', handleRouteChange)
    
    // Observer for SPA navigation
    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname
      if (currentPath !== (observer as MutationObserver & { lastPath?: string }).lastPath) {
        (observer as MutationObserver & { lastPath?: string }).lastPath = currentPath
        trackPageView()
      }
    })
    
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      observer.disconnect()
    }
  }, [isClient, triggerConfetti])

  // Get current encouragement message
  const getEncouragement = () => {
    const applicable = ENCOURAGEMENTS.filter(e => e.threshold <= progress.totalActions)
    return applicable[applicable.length - 1]?.message || ENCOURAGEMENTS[0].message
  }

  // Calculate progress to next milestone
  const getNextMilestone = () => {
    const next = MILESTONES.find(m => m > progress.totalActions)
    return next || MILESTONES[MILESTONES.length - 1]
  }

  const progressToNext = () => {
    const next = getNextMilestone()
    const prev = MILESTONES[MILESTONES.indexOf(next) - 1] || 0
    return ((progress.totalActions - prev) / (next - prev)) * 100
  }

  if (!isClient) return null

  return (
    <>
      {/* Confetti Layer */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${piece.x}%`,
                top: '-20px',
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotation}deg)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Toast */}
      {celebrationMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl font-semibold text-lg">
            {celebrationMessage}
          </div>
        </div>
      )}

      {/* Progress Widget */}
      <div className="fixed bottom-24 left-5 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group relative flex items-center gap-2 px-4 py-3 rounded-full
            bg-gradient-to-r from-primary-600 to-purple-600 text-white
            shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
            transition-all duration-300 hover:scale-105
            ${isExpanded ? 'rounded-b-none rounded-t-2xl' : ''}
          `}
        >
          <span className="text-xl">🎯</span>
          <span className="font-semibold">{progress.totalActions}</span>
          {progress.streak > 1 && (
            <span className="flex items-center gap-1 text-yellow-300 text-sm">
              🔥 {progress.streak}
            </span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 w-72 mb-0 animate-slide-up">
            <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl rounded-bl-none p-5 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-white">{getEncouragement()}</p>
                <p className="text-sm text-navy-400 mt-1">Your learning journey</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-navy-400 mb-1">
                  <span>Progress to next milestone</span>
                  <span>{getNextMilestone()} pages</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNext(), 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-primary-400">{progress.coursesViewed}</div>
                  <div className="text-xs text-navy-400">Courses</div>
                </div>
                <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">{progress.lessonsViewed}</div>
                  <div className="text-xs text-navy-400">Lessons</div>
                </div>
                <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-400">{progress.categoriesExplored}</div>
                  <div className="text-xs text-navy-400">Categories</div>
                </div>
              </div>

              {/* Streak Badge */}
              {progress.streak > 1 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl text-center">
                  <span className="text-2xl">🔥</span>
                  <span className="ml-2 font-semibold text-orange-300">{progress.streak} Day Streak!</span>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={() => {
                  const reset: ProgressState = {
                    coursesViewed: 0,
                    lessonsViewed: 0,
                    categoriesExplored: 0,
                    totalActions: 0,
                    streak: 1,
                    lastVisit: new Date().toDateString(),
                  }
                  setProgress(reset)
                  localStorage.setItem('learnhub-progress', JSON.stringify(reset))
                }}
                className="mt-4 w-full text-xs text-navy-500 hover:text-navy-400 transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}