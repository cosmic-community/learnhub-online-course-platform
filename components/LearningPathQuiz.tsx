'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface Question {
  id: number
  question: string
  options: {
    label: string
    value: string
    icon: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your primary learning goal?",
    options: [
      { label: 'Build websites & web apps', value: 'web', icon: '🌐' },
      { label: 'Work with cloud & servers', value: 'cloud', icon: '☁️' },
      { label: 'Create mobile apps', value: 'mobile', icon: '📱' },
      { label: 'Analyze data', value: 'data', icon: '📊' },
    ],
  },
  {
    id: 2,
    question: "What's your current experience level?",
    options: [
      { label: "I'm completely new to coding", value: 'beginner', icon: '🌱' },
      { label: 'I know the basics', value: 'intermediate', icon: '🌿' },
      { label: "I'm experienced and want to level up", value: 'advanced', icon: '🌳' },
    ],
  },
  {
    id: 3,
    question: 'How do you prefer to learn?',
    options: [
      { label: 'Hands-on projects', value: 'practical', icon: '🛠️' },
      { label: 'In-depth theory first', value: 'theory', icon: '📚' },
      { label: 'Quick, focused lessons', value: 'quick', icon: '⚡' },
    ],
  },
]

interface LearningPathQuizProps {
  courses: Course[]
}

// Confetti particle component
function Confetti() {
  const [particles, setParticles] = useState<Array<{
    id: number
    left: number
    animationDelay: number
    color: string
  }>>([])

  useEffect(() => {
    const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            backgroundColor: particle.color,
            animationDelay: `${particle.animationDelay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (value: string) => {
    setIsAnimating(true)
    setAnswers({ ...answers, [currentQuestion]: value })
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      } else {
        calculateResults({ ...answers, [currentQuestion]: value })
      }
    }, 300)
  }

  const calculateResults = (finalAnswers: Record<number, string>) => {
    // Filter courses based on answers
    let filtered = [...courses]
    
    // Filter by difficulty based on experience level
    const experienceLevel = finalAnswers[1]
    if (experienceLevel) {
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
        if (experienceLevel === 'beginner') return difficulty === 'beginner'
        if (experienceLevel === 'intermediate') return difficulty === 'beginner' || difficulty === 'intermediate'
        return true // Advanced users can see all
      })
    }

    // Score courses based on relevance
    const scoredCourses = filtered.map(course => {
      let score = 0
      const title = course.title.toLowerCase()
      const tagline = course.metadata?.tagline?.toLowerCase() || ''
      const description = course.metadata?.description?.toLowerCase() || ''
      const content = `${title} ${tagline} ${description}`
      
      // Goal matching
      const goal = finalAnswers[0]
      if (goal === 'web' && (content.includes('web') || content.includes('react') || content.includes('vue') || content.includes('javascript') || content.includes('node'))) {
        score += 10
      }
      if (goal === 'cloud' && (content.includes('aws') || content.includes('cloud') || content.includes('server') || content.includes('deploy'))) {
        score += 10
      }
      if (goal === 'mobile' && (content.includes('mobile') || content.includes('ios') || content.includes('android') || content.includes('react native'))) {
        score += 10
      }
      if (goal === 'data' && (content.includes('data') || content.includes('python') || content.includes('machine learning') || content.includes('analytics'))) {
        score += 10
      }

      // Learning style matching
      const style = finalAnswers[2]
      const lessonCount = course.metadata?.lessons?.length || 0
      const hours = course.metadata?.estimated_hours || 0
      
      if (style === 'practical' && lessonCount >= 3) score += 5
      if (style === 'theory' && hours >= 5) score += 5
      if (style === 'quick' && hours <= 5) score += 5

      return { course, score }
    })

    // Sort by score and take top 3
    const topCourses = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.course)

    setRecommendedCourses(topCourses.length > 0 ? topCourses : courses.slice(0, 3))
    setShowResults(true)
    setShowConfetti(true)
    setIsAnimating(false)

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 4000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
    setIsAnimating(false)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span>Find Your Perfect Course</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={closeQuiz}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
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
              {/* Progress bar */}
              <div className="h-1 bg-navy-800 rounded-t-2xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="p-8">
                {/* Question counter */}
                <div className="text-sm text-navy-400 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </div>

                {/* Question */}
                <h3 className={`text-2xl font-bold text-white mb-8 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  {questions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div className={`space-y-3 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl text-left transition-all duration-200 group hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl transition-transform group-hover:scale-110">{option.icon}</span>
                        <span className="text-white font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8">
              {/* Results */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your Personalized Recommendations!
                </h3>
                <p className="text-navy-400">
                  Based on your answers, we think you&apos;ll love these courses
                </p>
              </div>

              {/* Recommended courses */}
              <div className="space-y-4 mb-6">
                {recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={closeQuiz}
                    className="block p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 hover:scale-[1.02] group animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {course.metadata?.thumbnail ? (
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                          alt={course.title}
                          className="w-20 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-navy-700 flex items-center justify-center text-2xl">
                          📚
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">
                            #{index + 1} Match
                          </span>
                          {course.metadata?.difficulty && (
                            <span className="text-xs text-navy-400">
                              {course.metadata.difficulty.value}
                            </span>
                          )}
                        </div>
                        <h4 className="text-white font-semibold group-hover:text-primary-400 transition-colors truncate">
                          {course.title}
                        </h4>
                        {course.metadata?.tagline && (
                          <p className="text-sm text-navy-400 truncate">
                            {course.metadata.tagline}
                          </p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 px-4 bg-navy-800 hover:bg-navy-700 text-white font-medium rounded-xl transition-colors"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/courses"
                  onClick={closeQuiz}
                  className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors text-center"
                >
                  Browse All
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}