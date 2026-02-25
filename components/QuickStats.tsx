'use client'

import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

interface UserProgress {
  coursesStarted: number
  lessonsCompleted: number
  hoursLearned: number
  lastCourse?: string
}

const defaultProgress: UserProgress = {
  coursesStarted: 0,
  lessonsCompleted: 0,
  hoursLearned: 0
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress'>('overview')

  useEffect(() => {
    const saved = localStorage.getItem('learnhub-progress')
    if (saved) {
      setProgress(JSON.parse(saved) as UserProgress)
    }
    
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const simulateProgress = () => {
    const newProgress: UserProgress = {
      coursesStarted: Math.min(progress.coursesStarted + 1, totalCourses),
      lessonsCompleted: progress.lessonsCompleted + Math.floor(Math.random() * 3) + 1,
      hoursLearned: progress.hoursLearned + Math.random() * 2,
      lastCourse: ['React Fundamentals', 'Node.js Backend', 'Vue.js Basics', 'TypeScript Pro'][Math.floor(Math.random() * 4)]
    }
    setProgress(newProgress)
    localStorage.setItem('learnhub-progress', JSON.stringify(newProgress))
  }

  const courseProgress = totalCourses > 0 ? (progress.coursesStarted / totalCourses) * 100 : 0
  const lessonProgress = totalLessons > 0 ? Math.min((progress.lessonsCompleted / totalLessons) * 100, 100) : 0

  return (
    <div
      className={`card overflow-hidden transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-navy-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-500/5'
              : 'text-navy-400 hover:text-navy-200'
          }`}
        >
          📊 Platform Overview
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === 'progress'
              ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-500/5'
              : 'text-navy-400 hover:text-navy-200'
          }`}
        >
          🎯 My Progress
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center group">
                <div className="relative inline-block">
                  <div className="text-4xl font-bold text-white tabular-nums group-hover:scale-110 transition-transform">
                    {totalCourses}
                  </div>
                  <div className="absolute -top-1 -right-2 text-lg animate-bounce">📚</div>
                </div>
                <div className="text-sm text-navy-400 mt-1">Courses</div>
              </div>
              <div className="text-center group">
                <div className="relative inline-block">
                  <div className="text-4xl font-bold text-white tabular-nums group-hover:scale-110 transition-transform">
                    {totalLessons}
                  </div>
                  <div className="absolute -top-1 -right-2 text-lg animate-bounce" style={{ animationDelay: '0.1s' }}>📖</div>
                </div>
                <div className="text-sm text-navy-400 mt-1">Lessons</div>
              </div>
              <div className="text-center group">
                <div className="relative inline-block">
                  <div className="text-4xl font-bold text-white tabular-nums group-hover:scale-110 transition-transform">
                    {totalInstructors}
                  </div>
                  <div className="absolute -top-1 -right-2 text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>👨‍🏫</div>
                </div>
                <div className="text-sm text-navy-400 mt-1">Instructors</div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-500/10 via-primary-500/10 to-purple-500/10 rounded-xl border border-navy-700">
              <p className="text-navy-200 text-sm text-center">
                🌟 Join thousands of learners mastering new skills every day!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center gap-8">
              <ProgressRing
                progress={courseProgress}
                size={100}
                color="#22c55e"
                label="Courses"
                sublabel={`${progress.coursesStarted}/${totalCourses}`}
              />
              <ProgressRing
                progress={lessonProgress}
                size={100}
                color="#3b82f6"
                label="Lessons"
                sublabel={`${progress.lessonsCompleted} done`}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg">
                <span className="text-navy-300 text-sm">⏱️ Hours Learned</span>
                <span className="text-white font-medium tabular-nums">{progress.hoursLearned.toFixed(1)}h</span>
              </div>
              {progress.lastCourse && (
                <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg">
                  <span className="text-navy-300 text-sm">📝 Last Course</span>
                  <span className="text-primary-400 font-medium text-sm">{progress.lastCourse}</span>
                </div>
              )}
            </div>

            <button
              onClick={simulateProgress}
              className="w-full btn-secondary text-sm hover:bg-primary-500/20 hover:border-primary-500/50 transition-all"
            >
              🎮 Simulate Learning Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}