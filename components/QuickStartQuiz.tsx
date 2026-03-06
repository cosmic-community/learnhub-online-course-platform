'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickStartQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'start' | 'experience' | 'goal' | 'time' | 'results'

interface QuizAnswers {
  experience: 'beginner' | 'intermediate' | 'advanced' | null
  goal: string | null
  time: 'minimal' | 'moderate' | 'intensive' | null
}

export default function QuickStartQuiz({ courses, categories }: QuickStartQuizProps) {
  const [step, setStep] = useState<QuizStep>('start')
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: null,
    goal: null,
    time: null,
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (key: keyof QuizAnswers, value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [key]: value }))
    
    setTimeout(() => {
      setIsAnimating(false)
      if (key === 'experience') setStep('goal')
      else if (key === 'goal') setStep('time')
      else if (key === 'time') setStep('results')
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    let filtered = [...courses]
    
    // Filter by difficulty based on experience
    if (answers.experience) {
      const difficultyMap = {
        beginner: ['beginner', 'Beginner'],
        intermediate: ['intermediate', 'Intermediate'],
        advanced: ['advanced', 'Advanced'],
      }
      const targetDifficulties = difficultyMap[answers.experience]
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty
        if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
          return targetDifficulties.includes(difficulty.value as string)
        }
        if (typeof difficulty === 'string') {
          return targetDifficulties.includes(difficulty)
        }
        return true
      })
    }

    // Filter by category/goal
    if (answers.goal) {
      filtered = filtered.filter(course => {
        const courseCategories = course.metadata?.categories || []
        return courseCategories.some((cat: Category | string) => {
          if (typeof cat === 'object' && cat !== null) {
            return cat.slug === answers.goal || cat.id === answers.goal
          }
          return false
        })
      })
    }

    // Filter by time commitment
    if (answers.time) {
      const hourRanges = {
        minimal: { min: 0, max: 4 },
        moderate: { min: 4, max: 8 },
        intensive: { min: 8, max: 100 },
      }
      const range = hourRanges[answers.time]
      filtered = filtered.filter(course => {
        const hours = course.metadata?.estimated_hours || 0
        return hours >= range.min && hours <= range.max
      })
    }

    // If no results, return top courses regardless of filters
    if (filtered.length === 0) {
      return courses.slice(0, 3)
    }

    return filtered.slice(0, 3)
  }

  const resetQuiz = () => {
    setStep('start')
    setAnswers({ experience: null, goal: null, time: null })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {step === 'start' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mb-6 shadow-lg shadow-primary-500/25">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Find Your Perfect Course</h2>
            <p className="text-navy-400 mb-6">Answer 3 quick questions and we&apos;ll recommend the best courses for you</p>
            <button
              onClick={() => setStep('experience')}
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Start Quick Quiz
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

        {step === 'experience' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-4">
              Question 1 of 3
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">What&apos;s your experience level?</h2>
            <div className="grid gap-4">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'Just starting out', icon: '🌱' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience', icon: '📈' },
                { value: 'advanced', label: 'Advanced', desc: 'Looking to master', icon: '🚀' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('experience', option.value)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all duration-200 text-left group"
                >
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">{option.label}</div>
                    <div className="text-sm text-navy-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'goal' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-4">
              Question 2 of 3
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">What do you want to learn?</h2>
            <div className="grid gap-3">
              {categories.slice(0, 5).map(category => (
                <button
                  key={category.id}
                  onClick={() => handleAnswer('goal', category.slug)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all duration-200 text-left group"
                >
                  <span className="text-2xl">{category.metadata?.icon || '📚'}</span>
                  <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {category.metadata?.name || category.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'time' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-4">
              Question 3 of 3
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">How much time can you commit?</h2>
            <div className="grid gap-4">
              {[
                { value: 'minimal', label: '1-4 hours/week', desc: 'Light learning', icon: '☕' },
                { value: 'moderate', label: '4-8 hours/week', desc: 'Balanced pace', icon: '📖' },
                { value: 'intensive', label: '8+ hours/week', desc: 'Deep dive', icon: '🔥' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer('time', option.value)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all duration-200 text-left group"
                >
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">{option.label}</div>
                    <div className="text-sm text-navy-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Here are your recommended courses!</h2>
              <p className="text-navy-400">Based on your preferences, we think you&apos;ll love these</p>
            </div>
            
            <div className="space-y-4 mb-6">
              {getRecommendedCourses().map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy-900/50 border border-navy-800 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                      {course.metadata?.title || course.title}
                    </div>
                    <div className="text-sm text-navy-400 truncate">
                      {course.metadata?.tagline || 'Start learning today'}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="btn-secondary text-sm"
              >
                Retake Quiz
              </button>
              <Link href="/courses" className="btn-primary text-sm">
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}