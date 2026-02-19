'use client'

import { useState } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalHours: number
  totalLessons: number
}

export default function LearningStats({
  coursesCount,
  instructorsCount,
  categoriesCount,
  totalHours,
  totalLessons,
}: LearningStatsProps) {
  const [hoursPerWeek, setHoursPerWeek] = useState(5)
  const [showCalculator, setShowCalculator] = useState(false)

  // Calculate weeks to complete all courses
  const weeksToComplete = Math.ceil(totalHours / hoursPerWeek)
  const monthsToComplete = Math.round(weeksToComplete / 4.33)

  return (
    <div className="mt-16">
      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto mb-8">
        <div className="text-center group cursor-default">
          <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {coursesCount}+
          </div>
          <div className="text-navy-400 text-sm">Courses</div>
        </div>
        <div className="text-center group cursor-default">
          <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {totalLessons}+
          </div>
          <div className="text-navy-400 text-sm">Lessons</div>
        </div>
        <div className="text-center group cursor-default">
          <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {instructorsCount}+
          </div>
          <div className="text-navy-400 text-sm">Instructors</div>
        </div>
        <div className="text-center group cursor-default">
          <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
            {totalHours}h
          </div>
          <div className="text-navy-400 text-sm">Content</div>
        </div>
      </div>

      {/* Learning Journey Calculator */}
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full flex items-center justify-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
        >
          <span>✨ Plan Your Learning Journey</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showCalculator ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showCalculator && (
          <div className="mt-4 p-6 rounded-xl bg-navy-900/80 border border-navy-700 backdrop-blur-sm animate-fade-in">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🎯</span>
              Learning Time Calculator
            </h3>
            
            <div className="mb-4">
              <label className="text-navy-300 text-sm block mb-2">
                How many hours per week can you dedicate to learning?
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value, 10))}
                  className="flex-1 accent-primary-500"
                />
                <span className="text-white font-bold min-w-[3rem] text-right">
                  {hoursPerWeek}h
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-navy-700">
                <span className="text-navy-300">Total content available:</span>
                <span className="text-white font-semibold">{totalHours} hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-navy-700">
                <span className="text-navy-300">At {hoursPerWeek}h/week:</span>
                <span className="text-white font-semibold">{weeksToComplete} weeks</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-navy-300">That's approximately:</span>
                <span className="text-primary-400 font-bold text-lg">
                  {monthsToComplete} month{monthsToComplete !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <p className="text-primary-300 text-xs">
                💡 <strong>Pro tip:</strong> Consistency beats intensity! Even 30 minutes daily 
                is more effective than long weekend sessions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}