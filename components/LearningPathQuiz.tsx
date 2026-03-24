'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizAnswer {
  questionId: number
  answer: string
}

const questions = [
  {
    id: 1,
    question: "What's your experience level with programming?",
    emoji: "🎯",
    options: [
      { value: 'beginner', label: "I'm just starting out", emoji: "🌱" },
      { value: 'intermediate', label: "I know the basics", emoji: "🌿" },
      { value: 'advanced', label: "I'm experienced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "What excites you the most?",
    emoji: "✨",
    options: [
      { value: 'web', label: "Building websites & apps", emoji: "💻" },
      { value: 'cloud', label: "Cloud & infrastructure", emoji: "☁️" },
      { value: 'mobile', label: "Mobile development", emoji: "📱" },
      { value: 'data', label: "Data & analytics", emoji: "📊" },
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { value: 'light', label: "1-3 hours", emoji: "🐢" },
      { value: 'moderate', label: "4-8 hours", emoji: "🚀" },
      { value: 'intensive', label: "8+ hours", emoji: "⚡" },
    ]
  },
  {
    id: 4,
    question: "What's your learning style?",
    emoji: "📚",
    options: [
      { value: 'practical', label: "Hands-on projects", emoji: "🔨" },
      { value: 'theory', label: "Theory first, then practice", emoji: "📖" },
      { value: 'mixed', label: "Mix of both", emoji: "🎨" },
    ]
  }
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [animatingOut, setAnimatingOut] = useState(false)

  // Show quiz prompt after 5 seconds on first visit
  useEffect(() => {
    const hasSeenQuiz = localStorage.getItem('learnhub-quiz-seen')
    if (!hasSeenQuiz) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem('learnhub-quiz-seen', 'true')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answer }]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setAnimatingOut(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setAnimatingOut(false)
      }, 300)
    } else {
      // Calculate recommendations
      calculateRecommendations(newAnswers)
    }
  }

  const calculateRecommendations = (quizAnswers: QuizAnswer[]) => {
    const experienceAnswer = quizAnswers.find(a => a.questionId === 1)?.answer || 'beginner'
    const interestAnswer = quizAnswers.find(a => a.questionId === 2)?.answer || 'web'
    
    // Filter courses based on answers
    let filtered = [...courses]
    
    // Filter by difficulty
    if (experienceAnswer === 'beginner') {
      filtered = filtered.filter(c => {
        const difficulty = typeof c.metadata?.difficulty === 'object' 
          ? c.metadata.difficulty.value 
          : c.metadata?.difficulty
        return difficulty?.toLowerCase() === 'beginner'
      })
    } else if (experienceAnswer === 'intermediate') {
      filtered = filtered.filter(c => {
        const difficulty = typeof c.metadata?.difficulty === 'object' 
          ? c.metadata.difficulty.value 
          : c.metadata?.difficulty
        return ['beginner', 'intermediate'].includes(difficulty?.toLowerCase() || '')
      })
    }

    // Sort by relevance (free courses first for beginners, then by estimated hours)
    filtered.sort((a, b) => {
      if (experienceAnswer === 'beginner') {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
      }
      return (a.metadata?.estimated_hours || 0) - (b.metadata?.estimated_hours || 0)
    })

    setRecommendedCourses(filtered.slice(0, 3))
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setRecommendedCourses([])
    setAnimatingOut(false)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-105 hover:shadow-primary-500/50"
      >
        <span className="text-xl">🎯</span>
        <span className="font-medium hidden sm:inline">Find My Path</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-navy-900 to-navy-950 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-800 rounded-full transition-colors z-10"
        >
          ✕
        </button>

        {/* Progress bar */}
        {!showResults && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        <div className="p-8">
          {!showResults ? (
            // Question View
            <div className={`transition-all duration-300 ${animatingOut ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">{questions[currentQuestion].emoji}</span>
                <p className="text-sm text-primary-400 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <h3 className="text-xl font-semibold text-white">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-white font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Results View
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">🎉</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your Learning Path
                </h3>
                <p className="text-navy-300">
                  Based on your answers, here are your perfect courses:
                </p>
              </div>

              {recommendedCourses.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={closeModal}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-500/20 text-primary-400 rounded-full font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {course.metadata?.title || course.title}
                        </h4>
                        <p className="text-sm text-navy-400 truncate">
                          {course.metadata?.tagline || 'Start learning today'}
                        </p>
                      </div>
                      {course.metadata?.is_free && (
                        <span className="badge badge-free text-xs">Free</span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 mb-6">
                  <p className="text-navy-400">
                    Explore all our courses to find the perfect fit!
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 btn-secondary text-sm"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/courses"
                  onClick={closeModal}
                  className="flex-1 btn-primary text-sm text-center"
                >
                  Browse All
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}