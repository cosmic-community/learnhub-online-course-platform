'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  categories: Category[]
}

export default function LearningProgress({ totalCourses, totalLessons, categories }: LearningProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  // Simulate learning progress for demo purposes
  // In a real app, this would come from user authentication/database
  useEffect(() => {
    const savedProgress = localStorage.getItem('learning-progress')
    if (savedProgress) {
      setProgress(parseInt(savedProgress, 10))
    } else {
      // Default demo progress
      setProgress(Math.floor(Math.random() * 30) + 10)
    }
    setIsVisible(true)
  }, [])

  const handleStartLearning = () => {
    // Increment progress slightly for demo
    const newProgress = Math.min(progress + 5, 100)
    setProgress(newProgress)
    localStorage.setItem('learning-progress', newProgress.toString())
  }

  // Calculate recommended categories based on "progress"
  const recommendedCategories = categories.slice(0, 3)

  return (
    <section className="py-12 bg-gradient-to-b from-navy-950 to-navy-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Progress Circle */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-navy-800"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - (isVisible ? progress : 0) / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{progress}%</span>
                  <span className="text-xs text-navy-400">Progress</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-navy-400 text-center">Your Learning Journey</p>
            </div>

            {/* Stats and Recommendations */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Your Learning Dashboard
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-navy-800/50 rounded-lg p-4 text-center hover:bg-navy-800 transition-colors">
                  <div className="text-2xl font-bold text-primary-400">{totalCourses}</div>
                  <div className="text-xs text-navy-400">Available Courses</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-4 text-center hover:bg-navy-800 transition-colors">
                  <div className="text-2xl font-bold text-green-400">{totalLessons}</div>
                  <div className="text-xs text-navy-400">Total Lessons</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-4 text-center hover:bg-navy-800 transition-colors col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-yellow-400">🔥 {Math.floor(progress / 10) + 1}</div>
                  <div className="text-xs text-navy-400">Day Streak</div>
                </div>
              </div>

              {/* Recommended for you */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-navy-300 mb-3">Recommended for You</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendedCategories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm hover:bg-primary-500/20 transition-colors cursor-pointer"
                    >
                      <span>{category.metadata?.icon || '📚'}</span>
                      {category.metadata?.name || category.title}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartLearning}
                className="btn-primary text-sm"
              >
                Continue Learning
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}