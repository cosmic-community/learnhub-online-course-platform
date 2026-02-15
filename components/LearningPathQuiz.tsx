'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface Question {
  id: number
  question: string
  emoji: string
  options: {
    label: string
    value: string
    icon: string
  }[]
}

interface LearningPathQuizProps {
  courses: Course[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your current experience level with programming?",
    emoji: "🎯",
    options: [
      { label: "I'm completely new to coding", value: "beginner", icon: "🌱" },
      { label: "I know the basics and want to level up", value: "intermediate", icon: "🌿" },
      { label: "I'm experienced and looking to specialize", value: "advanced", icon: "🌳" }
    ]
  },
  {
    id: 2,
    question: "What excites you most about learning?",
    emoji: "✨",
    options: [
      { label: "Building websites and web apps", value: "web", icon: "🌐" },
      { label: "Working with data and cloud services", value: "cloud", icon: "☁️" },
      { label: "Creating mobile apps", value: "mobile", icon: "📱" },
      { label: "I want to explore everything!", value: "all", icon: "🚀" }
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate to learning each week?",
    emoji: "⏰",
    options: [
      { label: "A few hours (2-5 hours)", value: "light", icon: "🌙" },
      { label: "Half day (5-10 hours)", value: "moderate", icon: "🌤️" },
      { label: "I'm going all in! (10+ hours)", value: "intensive", icon: "☀️" }
    ]
  },
  {
    id: 4,
    question: "What's your primary goal?",
    emoji: "🎯",
    options: [
      { label: "Start a new career in tech", value: "career", icon: "💼" },
      { label: "Build my own projects or startup", value: "projects", icon: "🛠️" },
      { label: "Advance in my current role", value: "growth", icon: "📈" },
      { label: "Just curious and want to learn", value: "curiosity", icon: "🔍" }
    ]
  }
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'thinking' | 'reveal'>('idle')

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate recommendations
      calculateRecommendations(newAnswers)
    }
  }

  const calculateRecommendations = (finalAnswers: Record<number, string>) => {
    setAnimationPhase('thinking')
    
    // Score each course based on answers
    const scoredCourses = courses.map(course => {
      let score = 0
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
      const categories = course.metadata?.categories || []
      const hours = course.metadata?.estimated_hours || 0

      // Match experience level
      const experienceAnswer = finalAnswers[1]
      if (experienceAnswer === 'beginner' && difficulty === 'beginner') score += 30
      if (experienceAnswer === 'intermediate' && difficulty === 'intermediate') score += 30
      if (experienceAnswer === 'advanced' && difficulty === 'advanced') score += 30

      // Match interests
      const interestAnswer = finalAnswers[2]
      const categoryNames = categories.map(c => c.metadata?.name?.toLowerCase() || c.title.toLowerCase())
      
      if (interestAnswer === 'web' && categoryNames.some(n => n.includes('web'))) score += 25
      if (interestAnswer === 'cloud' && categoryNames.some(n => n.includes('cloud'))) score += 25
      if (interestAnswer === 'mobile' && categoryNames.some(n => n.includes('mobile'))) score += 25
      if (interestAnswer === 'all') score += 15 // Slight boost for all interests

      // Match time commitment
      const timeAnswer = finalAnswers[3]
      if (timeAnswer === 'light' && hours <= 5) score += 20
      if (timeAnswer === 'moderate' && hours > 3 && hours <= 8) score += 20
      if (timeAnswer === 'intensive' && hours >= 5) score += 20

      // Boost free courses for curiosity seekers
      const goalAnswer = finalAnswers[4]
      if (goalAnswer === 'curiosity' && course.metadata?.is_free) score += 15

      return { course, score }
    })

    // Sort by score and take top 3
    const topCourses = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(sc => sc.course)

    setTimeout(() => {
      setRecommendedCourses(topCourses)
      setAnimationPhase('reveal')
      setShowResults(true)
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setRecommendedCourses([])
    setAnimationPhase('idle')
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 group"
        aria-label="Find your perfect course"
      >
        <div className="relative">
          {/* Animated pulse ring */}
          <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-25" />
          
          {/* Main button */}
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-3 rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 group-hover:shadow-primary-500/50 group-hover:scale-105">
            <span className="text-xl animate-bounce">🎯</span>
            <span className="font-semibold whitespace-nowrap">Find My Path</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Close button */}
        <button
          onClick={() => {
            setIsOpen(false)
            resetQuiz()
          }}
          className="absolute top-4 right-4 z-10 p-2 text-navy-400 hover:text-white transition-colors"
          aria-label="Close quiz"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!showResults ? (
          <>
            {/* Progress bar */}
            <div className="h-1.5 bg-navy-800">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question content */}
            {animationPhase !== 'thinking' ? (
              <div className="p-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <span className="text-5xl mb-4 block animate-bounce">
                    {questions[currentQuestion].emoji}
                  </span>
                  <p className="text-xs text-navy-400 mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-primary-500 rounded-xl text-left transition-all duration-200 group animate-slideUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                          {option.icon}
                        </span>
                        <span className="text-navy-200 group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Thinking animation */
              <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-navy-700 border-t-primary-500 rounded-full animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">
                    🤔
                  </span>
                </div>
                <p className="mt-6 text-navy-300 animate-pulse">
                  Analyzing your learning path...
                </p>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div className="p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-5xl mb-3 block animate-bounce">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Perfect Learning Path!
              </h3>
              <p className="text-navy-400 text-sm">
                Based on your answers, here are our top recommendations
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 animate-slideUp group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-sm text-navy-400 line-clamp-1 mt-1">
                          {course.metadata?.tagline || 'Start your learning journey'}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                          <span className="capitalize">{course.metadata?.difficulty?.value || 'All Levels'}</span>
                          <span>•</span>
                          <span>{course.metadata?.estimated_hours || '?'}h</span>
                          {course.metadata?.is_free && (
                            <>
                              <span>•</span>
                              <span className="text-primary-400">Free</span>
                            </>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-navy-400">
                    Explore all our courses to find your perfect match!
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 px-4 bg-navy-800 hover:bg-navy-700 text-navy-200 rounded-xl transition-colors font-medium"
              >
                Retake Quiz
              </button>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium text-center"
              >
                View All Courses
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}