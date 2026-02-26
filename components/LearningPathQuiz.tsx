'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuizQuestion {
  id: string
  question: string
  emoji: string
  options: {
    text: string
    value: string
    emoji: string
  }[]
}

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: "What's your coding experience level?",
    emoji: '🎯',
    options: [
      { text: "I'm just starting out", value: 'beginner', emoji: '🌱' },
      { text: 'I know the basics', value: 'intermediate', emoji: '🌿' },
      { text: "I'm pretty experienced", value: 'advanced', emoji: '🌳' },
    ],
  },
  {
    id: 'goal',
    question: 'What do you want to build?',
    emoji: '🚀',
    options: [
      { text: 'Websites & web apps', value: 'web', emoji: '🌐' },
      { text: 'Mobile apps', value: 'mobile', emoji: '📱' },
      { text: 'Backend & APIs', value: 'backend', emoji: '⚙️' },
      { text: 'Cloud infrastructure', value: 'cloud', emoji: '☁️' },
    ],
  },
  {
    id: 'style',
    question: 'How do you prefer to learn?',
    emoji: '📚',
    options: [
      { text: 'Short, focused lessons', value: 'short', emoji: '⚡' },
      { text: 'Deep, comprehensive courses', value: 'deep', emoji: '🎓' },
      { text: 'Project-based learning', value: 'project', emoji: '🛠️' },
    ],
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
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
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        calculateRecommendations()
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateRecommendations = () => {
    const experience = answers['experience'] || 'beginner'
    const goal = answers['goal'] || 'web'
    
    // Filter courses based on answers
    let filtered = courses.filter((course) => {
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
      
      // Match experience level
      if (experience === 'beginner' && difficulty === 'advanced') return false
      if (experience === 'advanced' && difficulty === 'beginner') return false
      
      return true
    })

    // Sort by relevance (free courses first for beginners)
    if (experience === 'beginner') {
      filtered = filtered.sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return 0
      })
    }

    // Prioritize courses matching goal keywords
    const goalKeywords: Record<string, string[]> = {
      web: ['web', 'react', 'vue', 'frontend', 'javascript', 'html', 'css'],
      mobile: ['mobile', 'ios', 'android', 'react native', 'flutter'],
      backend: ['backend', 'node', 'api', 'express', 'database', 'server'],
      cloud: ['cloud', 'aws', 'azure', 'serverless', 'lambda', 'docker'],
    }

    const keywords = goalKeywords[goal] || []
    filtered = filtered.sort((a, b) => {
      const aTitle = (a.metadata?.title || a.title || '').toLowerCase()
      const bTitle = (b.metadata?.title || b.title || '').toLowerCase()
      const aDesc = (a.metadata?.description || '').toLowerCase()
      const bDesc = (b.metadata?.description || '').toLowerCase()
      
      const aMatches = keywords.filter(k => aTitle.includes(k) || aDesc.includes(k)).length
      const bMatches = keywords.filter(k => bTitle.includes(k) || bDesc.includes(k)).length
      
      return bMatches - aMatches
    })

    setRecommendedCourses(filtered.slice(0, 3))
    setShowResults(true)
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

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span>Find Your Perfect Course</span>
          <span className="text-2xl animate-bounce">→</span>
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
        onClick={closeQuiz}
      />
      
      {/* Quiz Modal */}
      <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 p-6 border-b border-navy-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Learning Path Quiz
            </h3>
            <button
              onClick={closeQuiz}
              className="text-navy-400 hover:text-white transition-colors p-1"
              aria-label="Close quiz"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          {!showResults && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-navy-400 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">{quizQuestions[currentQuestion].emoji}</span>
                <h4 className="text-xl font-semibold text-white">
                  {quizQuestions[currentQuestion].question}
                </h4>
              </div>
              
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.value)}
                    className="w-full p-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-primary-500 rounded-xl text-left transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-200">{option.emoji}</span>
                      <span className="text-white font-medium">{option.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">🎉</span>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Perfect! Here are your recommendations
                </h4>
                <p className="text-navy-400">
                  Based on your answers, we think you&apos;ll love these courses
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block p-4 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 group"
                      onClick={closeQuiz}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-medium group-hover:text-primary-400 transition-colors truncate">
                            {course.metadata?.title || course.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`badge text-xs ${
                              course.metadata?.difficulty?.value?.toLowerCase() === 'beginner' 
                                ? 'badge-beginner' 
                                : course.metadata?.difficulty?.value?.toLowerCase() === 'intermediate'
                                ? 'badge-intermediate'
                                : 'badge-advanced'
                            }`}>
                              {course.metadata?.difficulty?.value || 'Beginner'}
                            </span>
                            {course.metadata?.is_free && (
                              <span className="badge badge-free text-xs">Free</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4 text-navy-400">
                    <p>Check out all our courses to find your perfect match!</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 btn-secondary text-sm"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/courses"
                  onClick={closeQuiz}
                  className="flex-1 btn-primary text-sm text-center"
                >
                  Browse All Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}