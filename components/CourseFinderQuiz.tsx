'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface CourseFinderQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizQuestion {
  id: number
  question: string
  icon: string
  options: { label: string; value: string; emoji: string }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your current experience level?",
    icon: "🎯",
    options: [
      { label: "Complete beginner", value: "beginner", emoji: "🌱" },
      { label: "Some experience", value: "intermediate", emoji: "🌿" },
      { label: "Looking to advance", value: "advanced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "How much time can you dedicate weekly?",
    icon: "⏰",
    options: [
      { label: "1-2 hours", value: "minimal", emoji: "☕" },
      { label: "3-5 hours", value: "moderate", emoji: "💪" },
      { label: "5+ hours", value: "intensive", emoji: "🚀" },
    ]
  },
  {
    id: 3,
    question: "What's your learning goal?",
    icon: "🎓",
    options: [
      { label: "Career change", value: "career", emoji: "💼" },
      { label: "Skill enhancement", value: "skill", emoji: "📈" },
      { label: "Personal project", value: "project", emoji: "🛠️" },
      { label: "Just curious", value: "curious", emoji: "🔍" },
    ]
  }
]

export default function CourseFinderQuiz({ courses, categories }: CourseFinderQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user has completed the quiz before
    const hasCompletedQuiz = localStorage.getItem('quiz-completed')
    if (!hasCompletedQuiz) {
      // Show quiz prompt after 3 seconds
      const timer = setTimeout(() => {
        setHasInteracted(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    if (currentStep < quizQuestions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300)
    } else {
      // Calculate recommendations
      setTimeout(() => {
        calculateRecommendations(value)
        setShowResults(true)
        localStorage.setItem('quiz-completed', 'true')
      }, 300)
    }
  }

  const calculateRecommendations = (lastAnswer: string) => {
    const level = answers[1] || 'beginner'
    
    // Filter courses based on answers
    let filtered = courses.filter(course => {
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
      if (level === 'beginner') return difficulty === 'beginner'
      if (level === 'intermediate') return difficulty === 'beginner' || difficulty === 'intermediate'
      return true
    })

    // Sort by relevance (free courses first for beginners)
    if (level === 'beginner') {
      filtered = filtered.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 1 : 0
        const bFree = b.metadata?.is_free ? 1 : 0
        return bFree - aFree
      })
    }

    setRecommendedCourses(filtered.slice(0, 3))
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  return (
    <>
      {/* Quiz Trigger Banner */}
      <div className={`bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500 ${hasInteracted && !isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-white font-semibold">Not sure where to start?</p>
                <p className="text-white/80 text-sm">Take our 30-second quiz to find your perfect course!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-primary-600 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              Find My Course
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm"
            onClick={closeQuiz}
          />
          
          {/* Modal Content */}
          <div className="relative bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closeQuiz}
              className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!showResults ? (
              <>
                {/* Progress Bar */}
                <div className="h-1 bg-navy-800">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block animate-bounce-slow">
                      {quizQuestions[currentStep]?.icon}
                    </span>
                    <p className="text-sm text-navy-400 mb-2">
                      Question {currentStep + 1} of {quizQuestions.length}
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {quizQuestions[currentStep]?.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {quizQuestions[currentStep]?.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(quizQuestions[currentStep]?.id ?? 0, option.value)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 group hover:border-primary-500 hover:bg-primary-500/10 ${
                          answers[quizQuestions[currentStep]?.id ?? 0] === option.value
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-navy-700 bg-navy-800/50'
                        }`}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {option.emoji}
                        </span>
                        <span className="text-white font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="p-8">
                <div className="text-center mb-8">
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Perfect Match Found!
                  </h3>
                  <p className="text-navy-300">
                    Based on your answers, we recommend these courses:
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={closeQuiz}
                      className="block p-4 bg-navy-800/50 border border-navy-700 rounded-xl hover:border-primary-500 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-sm text-navy-400 truncate">
                            {course.metadata?.tagline}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`badge text-xs ${
                              course.metadata?.difficulty?.value === 'beginner' ? 'badge-beginner' :
                              course.metadata?.difficulty?.value === 'intermediate' ? 'badge-intermediate' :
                              'badge-advanced'
                            }`}>
                              {course.metadata?.difficulty?.value || 'Beginner'}
                            </span>
                            {course.metadata?.is_free && (
                              <span className="badge badge-free text-xs">Free</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetQuiz}
                    className="btn-secondary flex-1"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    href="/courses"
                    onClick={closeQuiz}
                    className="btn-primary flex-1 text-center"
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