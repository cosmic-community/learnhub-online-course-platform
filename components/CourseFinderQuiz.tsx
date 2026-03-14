'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface CourseFinderQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizQuestion {
  id: number
  question: string
  emoji: string
  options: {
    label: string
    value: string
    emoji: string
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your experience level with programming?",
    emoji: "🎯",
    options: [
      { label: "Complete beginner", value: "beginner", emoji: "🌱" },
      { label: "Some experience", value: "intermediate", emoji: "🌿" },
      { label: "Experienced developer", value: "advanced", emoji: "🌳" }
    ]
  },
  {
    id: 2,
    question: "What excites you most about learning?",
    emoji: "✨",
    options: [
      { label: "Building websites & apps", value: "web", emoji: "💻" },
      { label: "Cloud & infrastructure", value: "cloud", emoji: "☁️" },
      { label: "Mobile apps", value: "mobile", emoji: "📱" },
      { label: "Data & analytics", value: "data", emoji: "📊" }
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { label: "A few hours", value: "short", emoji: "🕐" },
      { label: "5-10 hours", value: "medium", emoji: "🕑" },
      { label: "10+ hours", value: "long", emoji: "🕒" }
    ]
  },
  {
    id: 4,
    question: "What's your learning goal?",
    emoji: "🎯",
    options: [
      { label: "Start a new career", value: "career", emoji: "🚀" },
      { label: "Level up current skills", value: "skills", emoji: "📈" },
      { label: "Build a side project", value: "project", emoji: "🛠️" },
      { label: "Just exploring", value: "explore", emoji: "🔍" }
    ]
  }
]

export default function CourseFinderQuiz({ courses, categories }: CourseFinderQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value }
    setAnswers(newAnswers)

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 300)
    } else {
      // Calculate recommendations
      calculateRecommendations(newAnswers)
    }
  }

  const calculateRecommendations = (finalAnswers: Record<number, string>) => {
    const level = finalAnswers[0]
    const interest = finalAnswers[1]
    
    // Filter and score courses
    let filtered = [...courses]
    
    // Filter by difficulty level
    if (level === 'beginner') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
          return difficulty.value === 'Beginner' || difficulty.value === 'beginner'
        }
        return difficulty === 'Beginner' || difficulty === 'beginner'
      })
    } else if (level === 'advanced') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
          return difficulty.value !== 'Beginner' && difficulty.value !== 'beginner'
        }
        return difficulty !== 'Beginner' && difficulty !== 'beginner'
      })
    }

    // Score by interest area
    const scored = filtered.map(course => {
      let score = 0
      const title = (course.metadata?.title || course.title || '').toLowerCase()
      const tagline = (course.metadata?.tagline || '').toLowerCase()
      const description = (course.metadata?.description || '').toLowerCase()
      const combined = `${title} ${tagline} ${description}`
      
      // Interest matching
      if (interest === 'web' && (combined.includes('web') || combined.includes('react') || combined.includes('vue') || combined.includes('node') || combined.includes('frontend') || combined.includes('backend'))) {
        score += 10
      }
      if (interest === 'cloud' && (combined.includes('aws') || combined.includes('cloud') || combined.includes('serverless') || combined.includes('lambda'))) {
        score += 10
      }
      if (interest === 'mobile' && (combined.includes('mobile') || combined.includes('ios') || combined.includes('android') || combined.includes('react native'))) {
        score += 10
      }
      if (interest === 'data' && (combined.includes('data') || combined.includes('python') || combined.includes('machine learning') || combined.includes('analytics'))) {
        score += 10
      }
      
      // Bonus for free courses if exploring
      if (finalAnswers[3] === 'explore' && course.metadata?.is_free) {
        score += 5
      }
      
      return { course, score }
    })
    
    // Sort by score and take top 3
    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.course)
    
    // If no scored results, just show first 3 courses matching level
    if (recommendations.length === 0) {
      setRecommendedCourses(filtered.slice(0, 3))
    } else {
      setRecommendedCourses(recommendations)
    }
    
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <>
      {/* Quiz Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
      >
        <span className="text-2xl">🧭</span>
        <span>Find Your Perfect Course</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {/* Quiz Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-navy-950/80 modal-backdrop"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!showResults ? (
              <>
                {/* Progress bar */}
                <div className="h-1 bg-navy-800">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Question */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block animate-bounce-in">
                      {quizQuestions[currentQuestion].emoji}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {quizQuestions[currentQuestion].question}
                    </h3>
                    <p className="text-navy-400 text-sm">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-300 group animate-slide-up"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <span className="text-2xl group-hover:scale-125 transition-transform">
                          {option.emoji}
                        </span>
                        <span className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Results */
              <div className="p-8">
                <div className="text-center mb-6">
                  <span className="text-5xl mb-4 block animate-bounce-in">🎉</span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Perfect Matches Found!
                  </h3>
                  <p className="text-navy-400">
                    Based on your answers, we recommend these courses:
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {recommendedCourses.map((course, idx) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500/50 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${idx * 0.15}s` }}
                    >
                      <div className="flex items-start gap-4">
                        {course.metadata?.thumbnail && (
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                            alt={course.metadata?.title || course.title}
                            className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-sm text-navy-400 truncate">
                            {course.metadata?.tagline}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {course.metadata?.is_free ? (
                              <span className="badge badge-free text-xs">Free</span>
                            ) : (
                              <span className="text-primary-400 text-sm font-medium">
                                ${course.metadata?.price}
                              </span>
                            )}
                          </div>
                        </div>
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
                    onClick={() => setIsOpen(false)}
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