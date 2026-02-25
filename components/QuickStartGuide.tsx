'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Step {
  id: string
  title: string
  description: string
  action: string
  link: string
  icon: string
}

const STEPS: Step[] = [
  {
    id: 'browse_courses',
    title: 'Explore Courses',
    description: 'Find courses that match your interests',
    action: 'Browse Courses',
    link: '/courses',
    icon: '📚'
  },
  {
    id: 'check_categories',
    title: 'Discover Categories',
    description: 'See courses organized by topic',
    action: 'View Categories',
    link: '/categories',
    icon: '🏷️'
  },
  {
    id: 'meet_instructors',
    title: 'Meet Instructors',
    description: 'Learn from industry experts',
    action: 'See Instructors',
    link: '/instructors',
    icon: '👨‍🏫'
  },
  {
    id: 'contact_us',
    title: 'Get in Touch',
    description: 'Have questions? Reach out!',
    action: 'Contact Us',
    link: '/contact',
    icon: '💬'
  }
]

export default function QuickStartGuide() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isDismissed, setIsDismissed] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('learnhub-quickstart-dismissed')
    const completed = localStorage.getItem('learnhub-quickstart-completed')
    
    if (dismissed !== 'true') {
      setIsDismissed(false)
    }
    
    if (completed) {
      setCompletedSteps(JSON.parse(completed))
    }
  }, [])

  const markComplete = (stepId: string) => {
    const newCompleted = [...completedSteps, stepId]
    setCompletedSteps(newCompleted)
    localStorage.setItem('learnhub-quickstart-completed', JSON.stringify(newCompleted))
  }

  const dismissGuide = () => {
    setIsDismissed(true)
    localStorage.setItem('learnhub-quickstart-dismissed', 'true')
  }

  if (isDismissed) return null

  const progress = (completedSteps.length / STEPS.length) * 100
  const allComplete = completedSteps.length === STEPS.length

  return (
    <div className={`fixed ${isMinimized ? 'bottom-5 right-24' : 'bottom-5 right-24'} z-40 transition-all duration-300`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
        >
          <span className="text-xl">🎯</span>
        </button>
      ) : (
        <div className="w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 p-4 border-b border-navy-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>🎯</span> Quick Start Guide
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-navy-400 hover:text-white p-1"
                  title="Minimize"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={dismissGuide}
                  className="text-navy-400 hover:text-white p-1"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-navy-400 mt-1">
              {completedSteps.length}/{STEPS.length} steps completed
            </p>
          </div>

          {/* Steps */}
          <div className="p-3 max-h-72 overflow-y-auto">
            {allComplete ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-2">🎉</div>
                <p className="text-white font-semibold">You&apos;re all set!</p>
                <p className="text-navy-400 text-sm mb-4">Ready to start learning</p>
                <button
                  onClick={dismissGuide}
                  className="btn-primary text-sm"
                >
                  Start Learning
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {STEPS.map((step, index) => {
                  const isComplete = completedSteps.includes(step.id)
                  return (
                    <div
                      key={step.id}
                      className={`p-3 rounded-xl transition-all ${
                        isComplete 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-navy-800/50 border border-transparent hover:border-navy-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${isComplete ? 'opacity-50' : ''}`}>
                          {isComplete ? '✅' : step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm ${isComplete ? 'text-navy-400 line-through' : 'text-white'}`}>
                            {index + 1}. {step.title}
                          </h4>
                          <p className="text-xs text-navy-400 mb-2">{step.description}</p>
                          {!isComplete && (
                            <Link
                              href={step.link}
                              onClick={() => markComplete(step.id)}
                              className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 font-medium"
                            >
                              {step.action}
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}