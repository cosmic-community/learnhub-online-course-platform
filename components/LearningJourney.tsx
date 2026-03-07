'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewedItem {
  slug: string
  title: string
  type: 'course' | 'lesson' | 'category'
  timestamp: number
}

interface LearningJourneyProps {
  currentSlug?: string
  currentTitle?: string
  currentType?: 'course' | 'lesson' | 'category'
}

export default function LearningJourney({ currentSlug, currentTitle, currentType }: LearningJourneyProps) {
  const [viewedItems, setViewedItems] = useState<ViewedItem[]>([])
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load viewed items from localStorage
    const stored = localStorage.getItem('learnhub-journey')
    const items: ViewedItem[] = stored ? JSON.parse(stored) : []
    setViewedItems(items)

    // Track current page if provided
    if (currentSlug && currentTitle && currentType) {
      const exists = items.find(item => item.slug === currentSlug && item.type === currentType)
      if (!exists) {
        const newItem: ViewedItem = {
          slug: currentSlug,
          title: currentTitle,
          type: currentType,
          timestamp: Date.now()
        }
        const updatedItems = [newItem, ...items].slice(0, 20) // Keep last 20
        setViewedItems(updatedItems)
        localStorage.setItem('learnhub-journey', JSON.stringify(updatedItems))

        // Check for milestones
        checkMilestones(updatedItems.length)
      }
    }
  }, [currentSlug, currentTitle, currentType])

  const checkMilestones = (count: number) => {
    const milestones: Record<number, string> = {
      1: '🎉 Welcome to your learning journey!',
      3: '🔥 You\'re on fire! 3 items explored!',
      5: '⭐ Amazing! 5 items down - you\'re a curious learner!',
      10: '🚀 10 items! You\'re becoming a pro explorer!',
      15: '💎 15 items! You\'re a learning champion!',
      20: '🏆 20 items! You\'ve mastered exploration!'
    }

    if (milestones[count]) {
      setMilestoneMessage(milestones[count])
      setShowMilestone(true)
      triggerConfetti()
      setTimeout(() => setShowMilestone(false), 4000)
    }
  }

  const triggerConfetti = () => {
    const colors = ['#29ABE2', '#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7']
    const confettiCount = 50

    for (let i = 0; i < confettiCount; i++) {
      createConfettiPiece(colors[Math.floor(Math.random() * colors.length)])
    }
  }

  const createConfettiPiece = (color: string) => {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${color};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `
    document.body.appendChild(confetti)
    setTimeout(() => confetti.remove(), 5000)
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'course': return '📚'
      case 'lesson': return '📖'
      case 'category': return '🏷️'
      default: return '📄'
    }
  }

  const getTypePath = (type: string, slug: string) => {
    switch (type) {
      case 'course': return `/courses/${slug}`
      case 'category': return `/categories/${slug}`
      default: return '#'
    }
  }

  const coursesViewed = viewedItems.filter(i => i.type === 'course').length
  const lessonsViewed = viewedItems.filter(i => i.type === 'lesson').length
  const categoriesViewed = viewedItems.filter(i => i.type === 'category').length

  if (viewedItems.length === 0) return null

  return (
    <>
      {/* Confetti keyframes */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes milestone-pop {
          0% { transform: scale(0) translateX(-50%); opacity: 0; }
          50% { transform: scale(1.1) translateX(-50%); }
          100% { transform: scale(1) translateX(-50%); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(41, 171, 226, 0.3); }
          50% { box-shadow: 0 0 30px rgba(41, 171, 226, 0.6); }
        }
      `}</style>

      {/* Milestone Celebration */}
      {showMilestone && (
        <div 
          className="fixed top-24 left-1/2 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl"
          style={{ 
            animation: 'milestone-pop 0.5s ease-out forwards',
            transform: 'translateX(-50%)'
          }}
        >
          <p className="text-lg font-bold text-center whitespace-nowrap">{milestoneMessage}</p>
        </div>
      )}

      {/* Floating Progress Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}
        style={{ animation: 'pulse-glow 2s infinite' }}
      >
        <div className="bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-xl">
          {/* Header - Always visible */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-3 p-4 hover:bg-navy-800 transition-colors"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {viewedItems.length}
              </div>
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-semibold text-sm">Learning Journey</p>
              <p className="text-navy-400 text-xs">{viewedItems.length} items explored</p>
            </div>
            <svg 
              className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-navy-700">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-navy-800/50">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-400">{coursesViewed}</div>
                  <div className="text-xs text-navy-400">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{lessonsViewed}</div>
                  <div className="text-xs text-navy-400">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{categoriesViewed}</div>
                  <div className="text-xs text-navy-400">Categories</div>
                </div>
              </div>

              {/* Recent Items */}
              <div className="max-h-48 overflow-y-auto">
                <p className="px-4 py-2 text-xs text-navy-500 uppercase tracking-wider">Recently Viewed</p>
                {viewedItems.slice(0, 5).map((item, index) => (
                  <Link
                    key={`${item.type}-${item.slug}-${index}`}
                    href={getTypePath(item.type, item.slug)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-navy-800 transition-colors"
                  >
                    <span>{getTypeEmoji(item.type)}</span>
                    <span className="text-sm text-navy-200 truncate flex-1">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="p-4 border-t border-navy-700">
                <div className="flex justify-between text-xs text-navy-400 mb-2">
                  <span>Progress to next milestone</span>
                  <span>{viewedItems.length % 5}/5</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                    style={{ width: `${(viewedItems.length % 5) * 20}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}