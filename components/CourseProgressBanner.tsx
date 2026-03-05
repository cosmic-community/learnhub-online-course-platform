'use client'

import { useState, useEffect } from 'react'

interface CourseProgressBannerProps {
  courseId: string
  totalLessons: number
  lessonIds: string[]
}

export default function CourseProgressBanner({ courseId, totalLessons, lessonIds }: CourseProgressBannerProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const completedInCourse = lessonIds.filter((id: string) => completedLessons.includes(id))
    setCompletedCount(completedInCourse.length)
    setIsComplete(completedInCourse.length === totalLessons && totalLessons > 0)
  }, [lessonIds, totalLessons])

  if (completedCount === 0) return null

  const progressPercent = Math.round((completedCount / totalLessons) * 100)

  return (
    <div className={`border-b ${
      isComplete 
        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
        : 'bg-navy-900/30 border-navy-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-lg
              ${isComplete ? 'bg-green-500 text-white' : 'bg-navy-800 text-navy-400'}
            `}>
              {isComplete ? '🏆' : '📈'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${isComplete ? 'text-green-400' : 'text-white'}`}>
                  {isComplete ? 'Course Completed! 🎉' : 'Your Progress'}
                </span>
                <span className="text-sm text-navy-400">
                  {completedCount}/{totalLessons} lessons ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isComplete 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-primary-500 to-primary-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}