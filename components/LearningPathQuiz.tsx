'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuizQuestion {
  id: number
  question: string
  options: {
    text: string
    icon: string
    value: string
  }[]
}

interface LearningPathQuizProps {
  courses: Course[]
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your current experience level?",
    options: [
      { text: "I'm just getting started", icon: "🌱", value: "beginner" },
      { text: "I know the basics", icon: "🌿", value: "intermediate" },
      { text: "I'm fairly experienced", icon: "🌳", value: "advanced" },
    ]
  },
  {
    id: 2,
    question: "What area interests you most?",
    options: [
      { text: "Building websites & apps", icon: "💻", value: "web-development" },
      { text: "Cloud & infrastructure", icon: "☁️", value: "cloud-computing" },
      { text: "Mobile app development", icon: "📱", value: "mobile-development" },
      { text: "Data & analytics", icon: "📊", value: "data-science" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    options: [
      { text: "Hands-on coding projects", icon: "⌨️", value: "practical" },
      { text: "Conceptual understanding first", icon: "📚", value: "theoretical" },
      { text: "Mix of both", icon: "🎯", value: "balanced" },
    ]
  },
  {
    id: 4,
    question: "What's your main goal?",
    options: [
      { text: "Career change or advancement", icon: "🚀", value: "career" },
      { text: "Build personal projects", icon: "🛠️", value: "projects" },
      { text: "Stay current with tech", icon: "📈", value: "upskill" },
      { text: "Just exploring", icon: "🔍", value: "explore" },
    ]
  }
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [animatingOut, setAnimatingOut] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
    
    if (currentQuestion < questions.length - 1) {
      setAnimatingOut(true)
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
        setAnimatingOut(false)
      }, 300)
    } else {
      // Calculate results
      calculateRecommendations({ ...answers, [currentQuestion]: value })
    }
  }

  const calculateRecommendations = (finalAnswers: Record<number, string>) => {
    const experienceLevel = finalAnswers[0] || 'beginner'
    const interestArea = finalAnswers[1] || 'web-development'
    
    // Score each course based on answers
    const scoredCourses = courses.map(course => {
      let score = 0
      
      // Match difficulty level
      const courseDifficulty = typeof course.metadata?.difficulty === 'object' 
        ? course.metadata.difficulty.value?.toLowerCase() 
        : String(course.metadata?.difficulty || '').toLowerCase()
      
      if (experienceLevel === 'beginner' && courseDifficulty === 'beginner') score += 3
      if (experienceLevel === 'intermediate' && courseDifficulty === 'intermediate') score += 3
      if (experienceLevel === 'advanced' && courseDifficulty === 'advanced') score += 3
      
      // Match category
      const categories = course.metadata?.categories || []
      const categoryMatch = categories.some((cat: { slug?: string }) => 
        cat.slug?.includes(interestArea.split('-')[0])
      )
      if (categoryMatch) score += 5
      
      // Boost free courses for beginners
      if (experienceLevel === 'beginner' && course.metadata?.is_free) score += 2
      
      // Boost based on title keywords
      const title = course.title?.toLowerCase() || ''
      if (interestArea === 'web-development' && (title.includes('react') || title.includes('vue') || title.includes('node'))) score += 2
      if (interestArea === 'cloud-computing' && (title.includes('aws') || title.includes('cloud'))) score += 2
      
      return { course, score }
    })
    
    // Sort by score and take top 3
    const recommended = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.course)
    
    setRecommendedCourses(recommended)
    setAnimatingOut(true)
    setTimeout(() => {
      setShowResults(true)
      setAnimatingOut(false)
    }, 300)
  }

  const resetQuiz = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setCurrentQuestion(0)
      setAnswers({})
      setShowResults(false)
      setRecommendedCourses([])
      setAnimatingOut(false)
    }, 300)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(() => {
      resetQuiz()
    }, 500)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">✨</span>
          Find Your Perfect Course
          <span className="text-2xl">→</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm animate-fadeIn"
        onClick={closeQuiz}
      />
      
      {/* Quiz Modal */}
      <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-navy-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Learning Path Quiz
            </h2>
            <button
              onClick={closeQuiz}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          {!showResults && (
            <div className="mt-4">
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-navy-400 text-sm mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResults ? (
            <div className={`transition-all duration-300 ${animatingOut ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <h3 className="text-2xl font-semibold text-white mb-6">
                {questions[currentQuestion]?.question}
              </h3>
              
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full group flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-left"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {option.icon}
                    </span>
                    <span className="text-lg text-navy-200 group-hover:text-white transition-colors">
                      {option.text}
                    </span>
                    <span className="ml-auto text-navy-600 group-hover:text-primary-400 transition-colors">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`transition-all duration-300 ${animatingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Perfect Match Found!
                </h3>
                <p className="text-navy-400">
                  Based on your answers, here are your recommended courses:
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={closeQuiz}
                    className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {course.metadata?.title || course.title}
                      </h4>
                      <p className="text-sm text-navy-400 truncate">
                        {course.metadata?.tagline}
                      </p>
                    </div>
                    {course.metadata?.is_free && (
                      <span className="badge badge-free text-sm">Free</span>
                    )}
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
                  Browse All Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}