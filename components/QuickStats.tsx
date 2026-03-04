'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [viewedLessons, setViewedLessons] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const viewed = localStorage.getItem('viewed-lessons')
    if (viewed) {
      try {
        const parsed = JSON.parse(viewed)
        if (Array.isArray(parsed)) {
          setViewedLessons(parsed.length)
        }
      } catch {
        setViewedLessons(0)
      }
    }
  }, [])

  // Calculate estimated total learning time (average 30 min per lesson)
  const totalHours = Math.round(totalLessons * 0.5)
  const progressPercentage = totalLessons > 0 ? Math.round((viewedLessons / totalLessons) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4 text-center group hover:border-primary-500/30 transition-colors">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
        <div className="text-2xl font-bold text-white">{totalCourses}</div>
        <div className="text-sm text-navy-400">Courses</div>
      </div>
      
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4 text-center group hover:border-primary-500/30 transition-colors">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📖</div>
        <div className="text-2xl font-bold text-white">{totalLessons}</div>
        <div className="text-sm text-navy-400">Lessons</div>
      </div>
      
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4 text-center group hover:border-primary-500/30 transition-colors">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⏱️</div>
        <div className="text-2xl font-bold text-white">{totalHours}+</div>
        <div className="text-sm text-navy-400">Hours of Content</div>
      </div>
      
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4 text-center group hover:border-primary-500/30 transition-colors">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👨‍🏫</div>
        <div className="text-2xl font-bold text-white">{totalInstructors}</div>
        <div className="text-sm text-navy-400">Expert Instructors</div>
      </div>

      {/* Progress indicator for returning users */}
      {mounted && viewedLessons > 0 && (
        <div className="col-span-2 md:col-span-4 bg-gradient-to-r from-green-500/10 to-primary-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-400">Your Learning Progress</span>
            <span className="text-sm text-navy-300">{viewedLessons} of {totalLessons} lessons viewed</span>
          </div>
          <div className="w-full bg-navy-800 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-green-500 to-primary-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {progressPercentage >= 100 && (
            <p className="text-center text-green-400 mt-2 text-sm">🎉 You've explored all lessons! Keep practicing!</p>
          )}
        </div>
      )}
    </div>
  )
}