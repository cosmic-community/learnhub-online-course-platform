'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
}

interface Question {
  id: number
  question: string
  emoji: string
  options: {
    label: string
    value: string
    emoji: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your primary goal?",
    emoji: "🎯",
    options: [
      { label: "Build websites & apps", value: "web", emoji: "💻" },
      { label: "Work with data & AI", value: "data", emoji: "📊" },
      { label: "Create mobile apps", value: "mobile", emoji: "📱" },
      { label: "Master cloud infrastructure", value: "cloud", emoji: "☁️" },
    ]
  },
  {
    id: 2,
    question: "How much experience do you have?",
    emoji: "📈",
    options: [
      { label: "Just starting out", value: "beginner", emoji: "🌱" },
      { label: "Some basics down", value: "intermediate", emoji: "🌿" },
      { label: "Ready for advanced topics", value: "advanced", emoji: "🌳" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    emoji: "📚",
    options: [
      { label: "Hands-on projects", value: "practical", emoji: "🔨" },
      { label: "Deep theory first", value: "theory", emoji: "🧠" },
      { label: "Mix of both", value: "mixed", emoji: "⚖️" },
    ]
  },
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [matchedCourses, setMatchedCourses] = useState<Course[]>([])
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number }[]>([])

  const handleAnswer = (value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        calculateResults()
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateResults = () => {
    const goal = answers[0]
    const level = answers[1]
    
    // Generate confetti
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5
    }))
    setConfetti(newConfetti)
    
    // Filter courses based on answers
    let filtered = [...courses]
    
    // Filter by category/goal
    if (goal === 'web') {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: { slug?: string }) => 
          cat.slug === 'web-development' || cat.slug === 'frontend' || cat.slug === 'backend'
        ) ||
        c.title?.toLowerCase().includes('web') ||
        c.title?.toLowerCase().includes('react') ||
        c.title?.toLowerCase().includes('vue') ||
        c.title?.toLowerCase().includes('node')
      )
    } else if (goal === 'cloud') {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: { slug?: string }) => cat.slug === 'cloud-computing') ||
        c.title?.toLowerCase().includes('aws') ||
        c.title?.toLowerCase().includes('cloud')
      )
    } else if (goal === 'mobile') {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: { slug?: string }) => cat.slug === 'mobile-development') ||
        c.title?.toLowerCase().includes('mobile') ||
        c.title?.toLowerCase().includes('ios') ||
        c.title?.toLowerCase().includes('android')
      )
    } else if (goal === 'data') {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: { slug?: string }) => cat.slug === 'data-science') ||
        c.title?.toLowerCase().includes('data') ||
        c.title?.toLowerCase().includes('python') ||
        c.title?.toLowerCase().includes('machine learning')
      )
    }
    
    // Filter by difficulty level
    if (level && filtered.length > 0) {
      const levelFiltered = filtered.filter(c => {
        const difficulty = typeof c.metadata?.difficulty === 'object' 
          ? c.metadata.difficulty.value?.toLowerCase() 
          : c.metadata?.difficulty?.toLowerCase()
        return difficulty === level
      })
      if (levelFiltered.length > 0) {
        filtered = levelFiltered
      }
    }
    
    // If no matches, show top courses
    if (filtered.length === 0) {
      filtered = courses.slice(0, 3)
    }
    
    setMatchedCourses(filtered.slice(0, 3))
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setMatchedCourses([])
    setConfetti([])
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">✨</span>
          Find Your Perfect Course
          <span className="text-2xl">🎯</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        {/* Confetti */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${c.left}%`,
              top: '-12px',
              background: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][c.id % 5],
              animation: `confettiFall 1.5s ease-out ${c.delay}s forwards`
            }}
          />
        ))}
        
        {/* Close button */}
        <button
          onClick={() => { setIsOpen(false); resetQuiz(); }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-navy-400 hover:text-white rounded-full hover:bg-navy-800 transition-colors z-10"
        >
          ✕
        </button>

        {!showResults ? (
          <>
            {/* Progress bar */}
            <div className="h-1 bg-navy-800">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block" style={{ animation: 'bounce 1s infinite' }}>
                  {questions[currentQuestion]?.emoji}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {questions[currentQuestion]?.question}
                </h3>
                <p className="text-navy-400 mt-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              {/* Options */}
              <div className={`space-y-3 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 group hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {option.emoji}
                      </span>
                      <span className="text-white font-medium">{option.label}</span>
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
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Perfect Matches Found!
              </h3>
              <p className="text-navy-400">
                Based on your answers, we recommend these courses:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {matchedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 group"
                  style={{ animation: `slideUp 0.3s ease-out ${index * 0.1}s both` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📚</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {course.metadata?.title || course.title}
                      </h4>
                      <p className="text-sm text-navy-400 truncate">
                        {course.metadata?.tagline || 'Start learning today'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {course.metadata?.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            (typeof course.metadata.difficulty === 'object' 
                              ? course.metadata.difficulty.value 
                              : course.metadata.difficulty)?.toLowerCase() === 'beginner'
                              ? 'bg-green-500/20 text-green-400'
                              : (typeof course.metadata.difficulty === 'object' 
                                  ? course.metadata.difficulty.value 
                                  : course.metadata.difficulty)?.toLowerCase() === 'intermediate'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}>
                            {typeof course.metadata.difficulty === 'object' 
                              ? course.metadata.difficulty.value 
                              : course.metadata.difficulty}
                          </span>
                        )}
                        {course.metadata?.is_free && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-navy-500 group-hover:text-primary-400 transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 px-4 bg-navy-800 hover:bg-navy-700 text-white font-medium rounded-xl transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors text-center"
              >
                Browse All
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}