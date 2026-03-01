'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  {
    emoji: '🎯',
    title: 'Set Clear Goals',
    tip: 'Define what you want to achieve before starting a course. Clear goals help you stay focused and motivated throughout your learning journey.',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    emoji: '⏰',
    title: 'Consistency is Key',
    tip: 'Learning for 30 minutes daily is more effective than cramming for hours once a week. Build a routine that works for you.',
    color: 'from-green-400 to-emerald-400'
  },
  {
    emoji: '✍️',
    title: 'Take Notes',
    tip: 'Writing notes by hand helps with retention. Summarize key concepts in your own words to deepen understanding.',
    color: 'from-purple-400 to-pink-400'
  },
  {
    emoji: '🔄',
    title: 'Practice Makes Perfect',
    tip: 'Apply what you learn immediately. Build projects, solve problems, and experiment to solidify your knowledge.',
    color: 'from-orange-400 to-red-400'
  },
  {
    emoji: '🤝',
    title: 'Learn with Others',
    tip: 'Join study groups or communities. Teaching others and discussing concepts accelerates your own learning.',
    color: 'from-indigo-400 to-purple-400'
  },
  {
    emoji: '😴',
    title: 'Rest is Productive',
    tip: 'Your brain consolidates learning during sleep. Get enough rest and take breaks to maximize retention.',
    color: 'from-teal-400 to-cyan-400'
  },
  {
    emoji: '❓',
    title: 'Ask Questions',
    tip: 'Don\'t be afraid to ask questions. Curiosity and seeking clarification are signs of an active learner.',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    tip: 'Celebrate small wins and track your progress. Seeing how far you\'ve come keeps you motivated.',
    color: 'from-pink-400 to-rose-400'
  }
]

export default function LearningTip() {
  const [currentTip, setCurrentTip] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a random tip based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setCurrentTip(dayOfYear % learningTips.length)
  }, [])

  const nextTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevTip = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentTip((prev) => (prev - 1 + learningTips.length) % learningTips.length)
      setIsAnimating(false)
    }, 300)
  }

  const tip = learningTips[currentTip]

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900/80 to-navy-800/80 backdrop-blur-sm border border-navy-700">
          {/* Background decoration */}
          <div className={`absolute inset-0 bg-gradient-to-r ${tip.color} opacity-5`} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">
                💡 Learning Tip of the Day
              </span>
            </div>

            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-start gap-6">
                <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 text-4xl flex-shrink-0">
                  {tip.emoji}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${tip.color} mb-3`}>
                    {tip.title}
                  </h3>
                  <p className="text-navy-300 text-base md:text-lg leading-relaxed">
                    {tip.tip}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-navy-700">
              <div className="flex items-center gap-2">
                {learningTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAnimating(true)
                      setTimeout(() => {
                        setCurrentTip(index)
                        setIsAnimating(false)
                      }, 300)
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTip 
                        ? 'bg-primary-400 w-6' 
                        : 'bg-navy-600 hover:bg-navy-500'
                    }`}
                    aria-label={`Go to tip ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTip}
                  className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
                  aria-label="Previous tip"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextTip}
                  className="p-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
                  aria-label="Next tip"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}