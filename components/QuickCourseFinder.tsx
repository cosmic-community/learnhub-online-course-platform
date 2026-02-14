'use client'

import { useState } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'
import type { Course, Category } from '@/types'

interface QuickCourseFinderProps {
  courses: Course[]
  categories: Category[]
}

interface Question {
  id: string
  question: string
  options: {
    label: string
    value: string
    icon: string
  }[]
}

const questions: Question[] = [
  {
    id: 'experience',
    question: "What's your coding experience level?",
    options: [
      { label: "I'm just starting out", value: 'beginner', icon: '🌱' },
      { label: "I know the basics", value: 'intermediate', icon: '🌿' },
      { label: "I'm experienced", value: 'advanced', icon: '🌳' },
    ]
  },
  {
    id: 'goal',
    question: "What do you want to achieve?",
    options: [
      { label: 'Build websites', value: 'web', icon: '🌐' },
      { label: 'Create apps', value: 'mobile', icon: '📱' },
      { label: 'Work with data', value: 'data', icon: '📊' },
      { label: 'Cloud & DevOps', value: 'cloud', icon: '☁️' },
    ]
  },
  {
    id: 'time',
    question: "How much time can you dedicate weekly?",
    options: [
      { label: '1-3 hours', value: 'short', icon: '⚡' },
      { label: '4-8 hours', value: 'medium', icon: '🔥' },
      { label: '8+ hours', value: 'intensive', icon: '🚀' },
    ]
  }
]

export default function QuickCourseFinder({ courses, categories }: QuickCourseFinderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300)
    } else {
      setTimeout(() => {
        setShowResults(true)
        setShowConfetti(true)
      }, 300)
    }
  }

  const getRecommendedCourses = (): Course[] => {
    let filtered = [...courses]
    
    // Filter by difficulty
    if (answers.experience) {
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() ?? ''
        if (answers.experience === 'beginner') return difficulty === 'beginner'
        if (answers.experience === 'intermediate') return difficulty === 'beginner' || difficulty === 'intermediate'
        return true
      })
    }

    // Sort by relevance based on time commitment
    if (answers.time) {
      filtered = filtered.sort((a, b) => {
        const hoursA = a.metadata?.estimated_hours ?? 0
        const hoursB = b.metadata?.estimated_hours ?? 0
        if (answers.time === 'short') return hoursA - hoursB
        if (answers.time === 'intensive') return hoursB - hoursA
        return 0
      })
    }

    return filtered.slice(0, 3)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowConfetti(false)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  const progress = ((currentQuestion + (showResults ? 1 : 0)) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 rounded-2xl hover:border-primary-400/50 transition-all duration-300 hover:scale-105"
      >
        <span className="text-3xl animate-pulse">🎯</span>
        <div className="text-left">
          <div className="text-white font-semibold">Find Your Perfect Course</div>
          <div className="text-navy-400 text-sm">Take a 30-second quiz</div>
        </div>
        <svg className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  return (
    <>
      <Confetti isActive={showConfetti} duration={3000} onComplete={() => setShowConfetti(false)} />
      
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeQuiz}
      >
        <div 
          className="w-full max-w-lg bg-navy-900 border border-navy-700 rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div className="h-1 bg-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 md:p-8">
            {!showResults ? (
              <>
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-navy-400 text-sm">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <button 
                    onClick={closeQuiz}
                    className="text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Question */}
                {questions[currentQuestion] && (
                  <div key={questions[currentQuestion].id} className="animate-fadeIn">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                      {questions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                          className={`
                            w-full p-4 rounded-xl border text-left transition-all duration-200
                            flex items-center gap-4 group
                            ${answers[questions[currentQuestion].id] === option.value
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-navy-700 hover:border-navy-600 hover:bg-navy-800/50'
                            }
                          `}
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {option.icon}
                          </span>
                          <span className="text-white font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Results */
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Perfect Match Found!
                  </h3>
                  <p className="text-navy-400">
                    Based on your answers, here are your recommended courses
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {getRecommendedCourses().map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 bg-navy-800/50 transition-all duration-200 group"
                      onClick={closeQuiz}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                            {course.title}
                          </div>
                          <div className="text-navy-400 text-sm">
                            {course.metadata?.difficulty?.value} • {course.metadata?.estimated_hours ?? 0}h
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-3 rounded-xl border border-navy-700 text-navy-300 hover:text-white hover:border-navy-600 transition-colors"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    href="/courses"
                    onClick={closeQuiz}
                    className="flex-1 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium text-center transition-colors"
                  >
                    Browse All
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}