'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

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

interface LearningPathQuizProps {
  courses: Course[]
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your experience level with programming?",
    emoji: "🎯",
    options: [
      { label: "Complete beginner", value: "beginner", emoji: "🌱" },
      { label: "Some experience", value: "intermediate", emoji: "🌿" },
      { label: "Experienced developer", value: "advanced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "What area interests you most?",
    emoji: "💡",
    options: [
      { label: "Building websites & apps", value: "web", emoji: "🌐" },
      { label: "Working with data & AI", value: "data", emoji: "📊" },
      { label: "Cloud & infrastructure", value: "cloud", emoji: "☁️" },
      { label: "Mobile app development", value: "mobile", emoji: "📱" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    emoji: "📚",
    options: [
      { label: "Step-by-step tutorials", value: "structured", emoji: "📋" },
      { label: "Building real projects", value: "hands-on", emoji: "🛠️" },
      { label: "Deep dive into concepts", value: "theory", emoji: "🧠" },
    ]
  },
  {
    id: 4,
    question: "What's your main goal?",
    emoji: "🚀",
    options: [
      { label: "Start a new career", value: "career", emoji: "💼" },
      { label: "Upgrade my skills", value: "upgrade", emoji: "⬆️" },
      { label: "Build a personal project", value: "project", emoji: "🎨" },
      { label: "Just curious to learn", value: "curious", emoji: "🔍" },
    ]
  }
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    const experienceLevel = answers[0] || 'beginner'
    const interest = answers[1] || 'web'
    
    // Smart filtering based on answers
    let recommended = courses.filter(course => {
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
      const categories = course.metadata?.categories || []
      const categoryNames = categories.map((c: { metadata?: { name?: string } }) => 
        c.metadata?.name?.toLowerCase() || ''
      )
      
      // Match experience level
      let levelMatch = false
      if (experienceLevel === 'beginner') {
        levelMatch = difficulty === 'beginner' || difficulty === ''
      } else if (experienceLevel === 'intermediate') {
        levelMatch = difficulty === 'beginner' || difficulty === 'intermediate'
      } else {
        levelMatch = true // Advanced users can take any course
      }
      
      // Match interest area
      let interestMatch = false
      if (interest === 'web') {
        interestMatch = categoryNames.some(n => n.includes('web') || n.includes('javascript') || n.includes('frontend') || n.includes('backend'))
      } else if (interest === 'data') {
        interestMatch = categoryNames.some(n => n.includes('data') || n.includes('ai') || n.includes('machine'))
      } else if (interest === 'cloud') {
        interestMatch = categoryNames.some(n => n.includes('cloud') || n.includes('aws') || n.includes('devops'))
      } else if (interest === 'mobile') {
        interestMatch = categoryNames.some(n => n.includes('mobile') || n.includes('ios') || n.includes('android'))
      }
      
      return levelMatch && (interestMatch || categoryNames.length === 0)
    })
    
    // If no specific matches, return top courses based on difficulty
    if (recommended.length === 0) {
      recommended = courses.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
        if (experienceLevel === 'beginner') return difficulty === 'beginner'
        if (experienceLevel === 'intermediate') return difficulty !== 'advanced'
        return true
      })
    }
    
    // Sort: free courses first for beginners, then by relevance
    if (experienceLevel === 'beginner') {
      recommended.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 1 : 0
        const bFree = b.metadata?.is_free ? 1 : 0
        return bFree - aFree
      })
    }
    
    return recommended.slice(0, 3)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setIsAnimating(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span>Find Your Perfect Course</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-navy-900 rounded-3xl shadow-2xl border border-navy-700 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { setIsOpen(false); resetQuiz(); }}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!showResults ? (
          <>
            {/* Progress bar */}
            <div className="h-1 bg-navy-800">
              <div 
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question content */}
            <div className={`p-8 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block animate-bounce">
                  {questions[currentQuestion].emoji}
                </span>
                <p className="text-navy-400 text-sm mb-2">
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
                    className="w-full flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-200 group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-white font-medium">{option.label}</span>
                    <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 ml-auto opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span className="text-6xl mb-4 block animate-bounce">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Personalized Path
              </h3>
              <p className="text-navy-400">
                Based on your answers, we recommend these courses:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {getRecommendedCourses().map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  onClick={() => { setIsOpen(false); resetQuiz(); }}
                  className="flex items-start gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors truncate">
                      {course.metadata?.title || course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {course.metadata?.difficulty?.value && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          course.metadata.difficulty.value === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          course.metadata.difficulty.value === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {course.metadata.difficulty.value}
                        </span>
                      )}
                      {course.metadata?.is_free && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 flex-shrink-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 px-4 bg-navy-800 hover:bg-navy-700 text-white font-medium rounded-xl transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                href="/courses"
                onClick={() => { setIsOpen(false); resetQuiz(); }}
                className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors text-center"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}