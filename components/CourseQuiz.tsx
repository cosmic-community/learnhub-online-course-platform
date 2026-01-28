'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuizQuestion {
  id: string
  question: string
  options: { value: string; label: string; icon: string }[]
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What\'s your coding experience level?',
    options: [
      { value: 'beginner', label: 'Just getting started', icon: '🌱' },
      { value: 'intermediate', label: 'Some experience', icon: '🌿' },
      { value: 'advanced', label: 'Very experienced', icon: '🌳' },
    ],
  },
  {
    id: 'interest',
    question: 'What area interests you most?',
    options: [
      { value: 'frontend', label: 'Frontend & UI', icon: '🎨' },
      { value: 'backend', label: 'Backend & APIs', icon: '⚙️' },
      { value: 'fullstack', label: 'Full Stack', icon: '🚀' },
      { value: 'cloud', label: 'Cloud & DevOps', icon: '☁️' },
    ],
  },
  {
    id: 'goal',
    question: 'What\'s your main learning goal?',
    options: [
      { value: 'career', label: 'Career change', icon: '💼' },
      { value: 'skills', label: 'Upskill at work', icon: '📈' },
      { value: 'project', label: 'Build a project', icon: '🛠️' },
      { value: 'curiosity', label: 'Just curious', icon: '🔍' },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you dedicate weekly?',
    options: [
      { value: 'light', label: '1-2 hours', icon: '⏰' },
      { value: 'moderate', label: '3-5 hours', icon: '📅' },
      { value: 'intensive', label: '5+ hours', icon: '🔥' },
    ],
  },
]

interface CourseQuizProps {
  courses: Course[]
}

export default function CourseQuiz({ courses }: CourseQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    setIsAnimating(true)
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        calculateRecommendations({ ...answers, [questionId]: value })
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateRecommendations = (userAnswers: Record<string, string>) => {
    // Score each course based on user answers
    const scoredCourses = courses.map((course) => {
      let score = 0
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
      const categories = course.metadata?.categories || []
      const estimatedHours = course.metadata?.estimated_hours || 0

      // Match difficulty with experience level
      if (userAnswers.experience === 'beginner' && difficulty === 'beginner') score += 3
      if (userAnswers.experience === 'intermediate' && difficulty === 'intermediate') score += 3
      if (userAnswers.experience === 'advanced' && difficulty === 'advanced') score += 3
      // Give some points for adjacent levels
      if (userAnswers.experience === 'intermediate' && difficulty === 'beginner') score += 1
      if (userAnswers.experience === 'intermediate' && difficulty === 'advanced') score += 1

      // Match interests with categories
      const categoryNames = categories.map((c) => 
        (c.metadata?.name || c.title || '').toLowerCase()
      )
      const courseTitle = course.title.toLowerCase()
      const tagline = (course.metadata?.tagline || '').toLowerCase()

      if (userAnswers.interest === 'frontend') {
        if (categoryNames.some((n) => n.includes('web') || n.includes('frontend'))) score += 2
        if (courseTitle.includes('vue') || courseTitle.includes('react') || courseTitle.includes('css')) score += 2
      }
      if (userAnswers.interest === 'backend') {
        if (courseTitle.includes('node') || courseTitle.includes('api') || courseTitle.includes('backend')) score += 3
        if (tagline.includes('server') || tagline.includes('api')) score += 1
      }
      if (userAnswers.interest === 'fullstack') {
        // Full stack learners benefit from both frontend and backend
        score += 1
      }
      if (userAnswers.interest === 'cloud') {
        if (categoryNames.some((n) => n.includes('cloud'))) score += 3
        if (courseTitle.includes('aws') || courseTitle.includes('cloud') || courseTitle.includes('devops')) score += 2
      }

      // Match time commitment
      if (userAnswers.time === 'light' && estimatedHours <= 4) score += 2
      if (userAnswers.time === 'moderate' && estimatedHours > 3 && estimatedHours <= 6) score += 2
      if (userAnswers.time === 'intensive' && estimatedHours > 5) score += 2

      // Bonus for free courses if user is just curious
      if (userAnswers.goal === 'curiosity' && course.metadata?.is_free) score += 1

      return { course, score }
    })

    // Sort by score and take top 3
    const recommended = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.course)

    setRecommendedCourses(recommended)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuiz()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <>
      {/* Quiz Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="text-2xl group-hover:animate-bounce">🎯</span>
        <span>Find My Perfect Course</span>
        <svg 
          className="w-5 h-5 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {/* Quiz Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeQuiz}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeQuiz}
              className="absolute top-4 right-4 p-2 text-navy-400 hover:text-white transition-colors z-10"
              aria-label="Close quiz"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!showResults ? (
              <>
                {/* Progress bar */}
                <div className="h-1 bg-navy-800">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Question content */}
                <div className="p-8">
                  {/* Question number */}
                  <div className="text-center mb-2">
                    <span className="text-sm text-navy-400">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 
                    className={`text-2xl font-bold text-white text-center mb-8 transition-all duration-300 ${
                      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {questions[currentQuestion]?.question}
                  </h3>

                  {/* Options */}
                  <div 
                    className={`space-y-3 transition-all duration-300 ${
                      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                  >
                    {questions[currentQuestion]?.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(questions[currentQuestion]?.id || '', option.value)}
                        className="w-full flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl text-left transition-all duration-200 group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {option.icon}
                        </span>
                        <span className="text-white font-medium">{option.label}</span>
                        <svg 
                          className="w-5 h-5 text-navy-600 group-hover:text-primary-400 ml-auto transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Your Perfect Courses!
                  </h3>
                  <p className="text-navy-400">
                    Based on your answers, we recommend:
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={closeQuiz}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold truncate group-hover:text-primary-400 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-sm text-navy-400 truncate">
                          {course.metadata?.tagline || 'Start learning today'}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {course.metadata?.is_free ? (
                          <span className="badge badge-free text-xs">Free</span>
                        ) : (
                          <span className="text-sm text-navy-400">${course.metadata?.price || 0}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 btn-secondary"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    href="/courses"
                    onClick={closeQuiz}
                    className="flex-1 btn-primary text-center"
                  >
                    Browse All
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}