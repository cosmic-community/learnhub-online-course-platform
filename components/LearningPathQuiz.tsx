'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
}

interface QuizQuestion {
  id: string
  question: string
  emoji: string
  options: {
    label: string
    value: string
    icon: string
  }[]
}

const questions: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'What\'s your main learning goal?',
    emoji: '🎯',
    options: [
      { label: 'Build websites & apps', value: 'web', icon: '🌐' },
      { label: 'Work with data & AI', value: 'data', icon: '🤖' },
      { label: 'Deploy to the cloud', value: 'cloud', icon: '☁️' },
      { label: 'Create mobile apps', value: 'mobile', icon: '📱' },
    ],
  },
  {
    id: 'experience',
    question: 'What\'s your experience level?',
    emoji: '📊',
    options: [
      { label: 'Complete beginner', value: 'beginner', icon: '🌱' },
      { label: 'Some experience', value: 'intermediate', icon: '🌿' },
      { label: 'Experienced developer', value: 'advanced', icon: '🌳' },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you dedicate weekly?',
    emoji: '⏰',
    options: [
      { label: '1-3 hours', value: 'low', icon: '🐢' },
      { label: '4-8 hours', value: 'medium', icon: '🐇' },
      { label: '8+ hours', value: 'high', icon: '🚀' },
    ],
  },
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    setIsAnimating(true)
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        calculateRecommendations({ ...answers, [questionId]: value })
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateRecommendations = (finalAnswers: Record<string, string>) => {
    let filtered = [...courses]

    // Filter by experience level
    if (finalAnswers.experience) {
      const difficultyMap: Record<string, string[]> = {
        beginner: ['beginner', 'Beginner'],
        intermediate: ['intermediate', 'Intermediate', 'beginner', 'Beginner'],
        advanced: ['advanced', 'Advanced', 'intermediate', 'Intermediate'],
      }
      const allowedDifficulties = difficultyMap[finalAnswers.experience] || []
      
      filtered = filtered.filter((course) => {
        const difficulty = course.metadata?.difficulty?.value || course.metadata?.difficulty
        return allowedDifficulties.some(d => 
          String(difficulty).toLowerCase() === d.toLowerCase()
        )
      })
    }

    // Filter by goal (based on category or title keywords)
    if (finalAnswers.goal) {
      const goalKeywords: Record<string, string[]> = {
        web: ['web', 'react', 'vue', 'javascript', 'typescript', 'node', 'frontend', 'backend', 'html', 'css'],
        data: ['data', 'python', 'machine learning', 'ai', 'analytics', 'science'],
        cloud: ['aws', 'cloud', 'azure', 'serverless', 'docker', 'kubernetes', 'devops'],
        mobile: ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
      }
      const keywords = goalKeywords[finalAnswers.goal] || []
      
      const goalFiltered = filtered.filter((course) => {
        const searchText = `${course.title} ${course.metadata?.tagline || ''} ${course.metadata?.description || ''}`.toLowerCase()
        const categoryNames = course.metadata?.categories?.map((c: { metadata?: { name?: string }, title?: string }) => 
          (c.metadata?.name || c.title || '').toLowerCase()
        ) || []
        
        return keywords.some((keyword) => 
          searchText.includes(keyword) || categoryNames.some((cat: string) => cat.includes(keyword))
        )
      })
      
      if (goalFiltered.length > 0) {
        filtered = goalFiltered
      }
    }

    // Sort by estimated hours based on time availability
    if (finalAnswers.time) {
      const timePreference: Record<string, number> = {
        low: 3,
        medium: 6,
        high: 10,
      }
      const maxHours = timePreference[finalAnswers.time] || 6
      
      filtered.sort((a, b) => {
        const hoursA = a.metadata?.estimated_hours || 5
        const hoursB = b.metadata?.estimated_hours || 5
        const diffA = Math.abs(hoursA - maxHours)
        const diffB = Math.abs(hoursB - maxHours)
        return diffA - diffB
      })
    }

    // Return top 3 recommendations
    setRecommendedCourses(filtered.slice(0, 3))
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">✨</span>
          Find Your Perfect Course
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-800 rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        {!showResults && (
          <div className="h-1 bg-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-8">
          {showResults ? (
            // Results view
            <div className={`space-y-6 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Learning Path</h3>
                <p className="text-navy-300">Based on your answers, here are your perfect matches:</p>
              </div>

              {recommendedCourses.length > 0 ? (
                <div className="space-y-4">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-400">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-sm text-navy-400 line-clamp-1 mt-1">
                            {course.metadata?.tagline || 'Expand your skills'}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className={`badge ${
                              (course.metadata?.difficulty?.value || '').toLowerCase() === 'beginner' 
                                ? 'badge-beginner' 
                                : (course.metadata?.difficulty?.value || '').toLowerCase() === 'intermediate'
                                ? 'badge-intermediate'
                                : 'badge-advanced'
                            }`}>
                              {course.metadata?.difficulty?.value || 'All Levels'}
                            </span>
                            {course.metadata?.estimated_hours && (
                              <span className="text-navy-500">
                                {course.metadata.estimated_hours}h
                              </span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-navy-300">
                    We&apos;re still adding courses in this area. Check out all our courses!
                  </p>
                  <Link
                    href="/courses"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary mt-4 inline-flex"
                  >
                    Browse All Courses
                  </Link>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-navy-800">
                <button
                  onClick={resetQuiz}
                  className="flex-1 btn-secondary"
                >
                  Start Over
                </button>
                <Link
                  href="/courses"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 btn-primary text-center"
                >
                  View All
                </Link>
              </div>
            </div>
          ) : (
            // Question view
            <div className={`${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'} transition-all duration-300`}>
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">{currentQuestion.emoji}</div>
                <h3 className="text-xl font-bold text-white">
                  {currentQuestion.question}
                </h3>
                <p className="text-sm text-navy-400 mt-2">
                  Question {currentStep + 1} of {questions.length}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className="w-full p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 group text-left flex items-center gap-4"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {option.icon}
                    </span>
                    <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {option.label}
                    </span>
                    <svg className="w-5 h-5 ml-auto text-navy-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="mt-6 w-full py-2 text-navy-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
              )}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}