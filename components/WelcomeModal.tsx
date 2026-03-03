'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome message today
    const lastSeen = localStorage.getItem('learnhub-welcome-seen')
    const today = new Date().toDateString()
    
    if (lastSeen !== today) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
        setShowConfetti(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('learnhub-welcome-seen', new Date().toDateString())
  }

  if (!isOpen) return <Confetti trigger={showConfetti} />

  return (
    <>
      <Confetti trigger={showConfetti} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="relative bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
          {/* Decorative elements */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
            🎉
          </div>
          
          <div className="text-center pt-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back, Learner!
            </h2>
            <p className="text-navy-300 mb-6">
              Ready to continue your learning journey? You&apos;re doing amazing! 
            </p>
            
            {/* Motivational stats */}
            <div className="bg-navy-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-1">🔥</div>
                  <div className="text-xl font-bold text-white">5</div>
                  <div className="text-xs text-navy-400">Day Streak</div>
                </div>
                <div className="w-px h-12 bg-navy-700" />
                <div className="text-center">
                  <div className="text-3xl mb-1">📚</div>
                  <div className="text-xl font-bold text-white">12</div>
                  <div className="text-xs text-navy-400">Lessons</div>
                </div>
                <div className="w-px h-12 bg-navy-700" />
                <div className="text-center">
                  <div className="text-3xl mb-1">🏆</div>
                  <div className="text-xl font-bold text-white">3</div>
                  <div className="text-xs text-navy-400">Badges</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleClose}
                className="w-full btn-primary"
              >
                Continue Learning →
              </button>
              <button
                onClick={handleClose}
                className="w-full text-sm text-navy-400 hover:text-navy-300 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}