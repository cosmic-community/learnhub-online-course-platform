'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)

  const learningTips = [
    "💡 Tip: Start with the fundamentals before diving into advanced topics.",
    "🎯 Goal: Try to complete at least one lesson every day.",
    "📚 Did you know? Consistent learners retain 40% more information.",
    "⏰ Best practice: Take a 5-minute break every 25 minutes of learning.",
    "🧠 Memory hack: Review what you learned before sleeping.",
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [learningTips.length])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-24 right-5 z-40 transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2 bg-navy-900/90 backdrop-blur-sm border border-navy-700 rounded-full px-4 py-3 shadow-xl hover:border-primary-500/50 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center animate-pulse-slow">
            <span className="text-lg">📊</span>
          </div>
          <span className="text-white font-medium text-sm">Quick Stats</span>
          <svg className="w-4 h-4 text-navy-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Expanded Card */}
      {isExpanded && (
        <div className="w-72 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500/20 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h4 className="font-bold text-white">Platform Stats</h4>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl group hover:bg-navy-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{totalCourses}</div>
                  <div className="text-navy-400 text-xs">Courses Available</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl group hover:bg-navy-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-xl">📖</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{totalLessons}</div>
                  <div className="text-navy-400 text-xs">Total Lessons</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl group hover:bg-navy-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xl">👨‍🏫</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{totalInstructors}</div>
                  <div className="text-navy-400 text-xs">Expert Instructors</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </div>
          </div>

          {/* Learning Tip */}
          <div className="p-4 pt-0">
            <div className="p-3 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl border border-primary-500/20">
              <p className="text-sm text-navy-300 transition-opacity duration-500">
                {learningTips[currentTip]}
              </p>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1 pb-4">
            {learningTips.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentTip ? 'bg-primary-500 w-3' : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}