'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuizQuestion {
  id: number
  question: string
  options: {
    label: string
    value: string
    emoji: string
  }[]
}

interface CourseRecommendation {
  slug: string
  title: string
  tagline: string
  match: number
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your experience level with coding?",
    options: [
      { label: "Complete beginner", value: "beginner", emoji: "🌱" },
      { label: "I know the basics", value: "intermediate", emoji: "🌿" },
      { label: "I'm experienced", value: "advanced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "What excites you most?",
    options: [
      { label: "Building beautiful websites", value: "frontend", emoji: "🎨" },
      { label: "Creating powerful servers & APIs", value: "backend", emoji: "⚙️" },
      { label: "Working with cloud & infrastructure", value: "cloud", emoji: "☁️" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    options: [
      { label: "Step-by-step tutorials", value: "structured", emoji: "📚" },
      { label: "Building real projects", value: "practical", emoji: "🔨" },
      { label: "Deep diving into concepts", value: "theoretical", emoji: "🧠" },
    ]
  }
]

const courseRecommendations: Record<string, CourseRecommendation[]> = {
  'beginner-frontend': [
    { slug: 'vue-fundamentals', title: 'Vue.js Fundamentals', tagline: 'Build reactive web applications', match: 95 }
  ],
  'beginner-backend': [
    { slug: 'nodejs-backend-development', title: 'Node.js Backend Development', tagline: 'Build scalable server-side apps', match: 88 }
  ],
  'beginner-cloud': [
    { slug: 'aws-fundamentals', title: 'AWS Fundamentals', tagline: 'Master cloud infrastructure', match: 92 }
  ],
  'intermediate-frontend': [
    { slug: 'vue-fundamentals', title: 'Vue.js Fundamentals', tagline: 'Build reactive web applications', match: 90 }
  ],
  'intermediate-backend': [
    { slug: 'nodejs-backend-development', title: 'Node.js Backend Development', tagline: 'Build scalable server-side apps', match: 94 }
  ],
  'intermediate-cloud': [
    { slug: 'aws-fundamentals', title: 'AWS Fundamentals', tagline: 'Master cloud infrastructure', match: 96 }
  ],
  'advanced-frontend': [
    { slug: 'vue-fundamentals', title: 'Vue.js Fundamentals', tagline: 'Build reactive web applications', match: 85 }
  ],
  'advanced-backend': [
    { slug: 'nodejs-backend-development', title: 'Node.js Backend Development', tagline: 'Build scalable server-side apps', match: 91 }
  ],
  'advanced-cloud': [
    { slug: 'aws-fundamentals', title: 'AWS Fundamentals', tagline: 'Master cloud infrastructure', match: 89 }
  ]
}

export default function LearningPathQuiz() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [recommendation, setRecommendation] = useState<CourseRecommendation | null>(null)
  const [animatingOption, setAnimatingOption] = useState<number | null>(null)

  const handleAnswer = (value: string) => {
    setAnimatingOption(questions[currentQuestion].options.findIndex(o => o.value === value))
    
    setTimeout(() => {
      const newAnswers = [...answers, value]
      setAnswers(newAnswers)
      setAnimatingOption(null)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Calculate recommendation
        const key = `${newAnswers[0]}-${newAnswers[1]}`
        const recs = courseRecommendations[key] || courseRecommendations['beginner-frontend']
        if (recs && recs.length > 0) {
          setRecommendation(recs[0])
        }
        setShowResult(true)
      }
    }, 300)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setRecommendation(null)
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  // Progress percentage
  const progress = ((currentQuestion) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="text-2xl animate-bounce">🎯</span>
        <span>Find Your Perfect Course</span>
        <span className="absolute -top-2 -right-2 flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-yellow-400 items-center justify-center text-xs">✨</span>
        </span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Close button */}
        <button
          onClick={closeQuiz}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white transition-colors z-10"
        >
          ✕
        </button>

        {/* Progress bar */}
        {!showResult && (
          <div className="h-1 bg-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-8">
          {!showResult ? (
            <>
              {/* Question header */}
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block animate-bounce">
                  {currentQuestion === 0 ? '👋' : currentQuestion === 1 ? '💡' : '📖'}
                </span>
                <p className="text-navy-400 text-sm mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <h3 className="text-xl font-semibold text-white">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left flex items-center gap-4 group
                      ${animatingOption === index 
                        ? 'bg-primary-500 border-primary-400 scale-98' 
                        : 'bg-navy-800/50 border-navy-700 hover:border-primary-500/50 hover:bg-navy-800'
                      }`}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className={`font-medium ${animatingOption === index ? 'text-white' : 'text-navy-200'}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Result */
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <span className="text-6xl">🎉</span>
                <span className="absolute -bottom-1 -right-1 text-2xl animate-bounce">✨</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Perfect Match Found!
              </h3>
              <p className="text-navy-400 mb-6">
                Based on your answers, we recommend:
              </p>

              {recommendation && (
                <div className="bg-gradient-to-br from-navy-800 to-navy-800/50 border border-primary-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-3xl">📚</span>
                    <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
                      {recommendation.match}% match
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {recommendation.title}
                  </h4>
                  <p className="text-navy-400 text-sm mb-4">
                    {recommendation.tagline}
                  </p>
                  <Link
                    href={`/courses/${recommendation.slug}`}
                    className="btn-primary inline-flex items-center gap-2"
                    onClick={closeQuiz}
                  >
                    Start Learning
                    <span>→</span>
                  </Link>
                </div>
              )}

              <button
                onClick={resetQuiz}
                className="text-navy-400 hover:text-white text-sm transition-colors"
              >
                Take the quiz again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}