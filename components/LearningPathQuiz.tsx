'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  icon: string
  options: {
    text: string
    icon: string
    value: string
  }[]
}

interface Recommendation {
  category: string
  difficulty: string
  reason: string
  courseSlug?: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your main goal?",
    icon: "🎯",
    options: [
      { text: "Build websites & apps", icon: "💻", value: "web" },
      { text: "Manage cloud infrastructure", icon: "☁️", value: "cloud" },
      { text: "Analyze data & insights", icon: "📊", value: "data" },
      { text: "Create mobile apps", icon: "📱", value: "mobile" },
    ]
  },
  {
    id: 2,
    question: "How much coding experience do you have?",
    icon: "📚",
    options: [
      { text: "Complete beginner", icon: "🌱", value: "beginner" },
      { text: "Some basics", icon: "🌿", value: "beginner" },
      { text: "Comfortable with code", icon: "🌳", value: "intermediate" },
      { text: "Experienced developer", icon: "🏔️", value: "advanced" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    icon: "🧠",
    options: [
      { text: "Step-by-step tutorials", icon: "📝", value: "structured" },
      { text: "Project-based learning", icon: "🔨", value: "project" },
      { text: "Deep theory first", icon: "📖", value: "theory" },
      { text: "Quick practical tips", icon: "⚡", value: "practical" },
    ]
  },
  {
    id: 4,
    question: "How much time can you dedicate weekly?",
    icon: "⏰",
    options: [
      { text: "1-2 hours", icon: "🐢", value: "light" },
      { text: "3-5 hours", icon: "🐇", value: "moderate" },
      { text: "5-10 hours", icon: "🦅", value: "intensive" },
      { text: "10+ hours", icon: "🚀", value: "fulltime" },
    ]
  }
]

const courseRecommendations: Record<string, { slug: string; name: string; reason: string }> = {
  'web-beginner': { slug: 'vue-fundamentals', name: 'Vue.js Fundamentals', reason: 'Perfect for beginners wanting to build interactive web apps' },
  'web-intermediate': { slug: 'nodejs-backend-development', name: 'Node.js Backend Development', reason: 'Level up your skills with server-side JavaScript' },
  'web-advanced': { slug: 'nodejs-backend-development', name: 'Node.js Backend Development', reason: 'Master production-ready backend systems' },
  'cloud-beginner': { slug: 'aws-fundamentals', name: 'AWS Fundamentals', reason: 'Start your cloud journey with the industry leader' },
  'cloud-intermediate': { slug: 'aws-fundamentals', name: 'AWS Fundamentals', reason: 'Deepen your cloud architecture knowledge' },
  'cloud-advanced': { slug: 'aws-fundamentals', name: 'AWS Fundamentals', reason: 'Master advanced AWS services and patterns' },
  'data-beginner': { slug: 'vue-fundamentals', name: 'Vue.js Fundamentals', reason: 'Build data visualization dashboards' },
  'data-intermediate': { slug: 'nodejs-backend-development', name: 'Node.js Backend', reason: 'Create APIs for data processing' },
  'mobile-beginner': { slug: 'vue-fundamentals', name: 'Vue.js Fundamentals', reason: 'Start with web fundamentals before mobile' },
  'mobile-intermediate': { slug: 'nodejs-backend-development', name: 'Node.js Backend', reason: 'Build APIs for your mobile apps' },
}

export default function LearningPathQuiz() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [recommendation, setRecommendation] = useState<typeof courseRecommendations[string] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (value: string) => {
    setIsAnimating(true)
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      } else {
        // Calculate recommendation
        const goal = newAnswers[0] || 'web'
        const experience = newAnswers[1] || 'beginner'
        const key = `${goal}-${experience}`
        const rec = courseRecommendations[key] || courseRecommendations['web-beginner']
        setRecommendation(rec)
        setShowResult(true)
        setIsAnimating(false)
      }
    }, 300)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setRecommendation(null)
    setIsAnimating(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl animate-bounce">✨</span>
          Find Your Perfect Course
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { setIsOpen(false); resetQuiz(); }}
          className="absolute top-4 right-4 z-10 p-2 text-navy-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative p-8">
          {!showResult ? (
            <>
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-navy-400 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                <div className="text-center mb-8">
                  <span className="text-5xl mb-4 block">{questions[currentQuestion].icon}</span>
                  <h3 className="text-2xl font-bold text-white">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.value)}
                      className="group relative p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-left hover:scale-[1.02]"
                    >
                      <span className="text-2xl block mb-2">{option.icon}</span>
                      <span className="text-white font-medium text-sm">{option.text}</span>
                      <div className="absolute inset-0 rounded-xl bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Result */
            <div className="text-center animate-fadeIn">
              <div className="mb-6">
                <span className="text-6xl block mb-4 animate-bounce">🎉</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  We Found Your Perfect Match!
                </h3>
                <p className="text-navy-400">
                  Based on your goals and experience level
                </p>
              </div>

              {recommendation && (
                <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 rounded-2xl p-6 mb-6">
                  <div className="text-lg font-bold text-white mb-2">
                    {recommendation.name}
                  </div>
                  <p className="text-navy-300 text-sm mb-4">
                    {recommendation.reason}
                  </p>
                  <Link
                    href={`/courses/${recommendation.slug}`}
                    onClick={() => { setIsOpen(false); resetQuiz(); }}
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Start Learning
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 text-navy-400 hover:text-white transition-colors text-sm"
                >
                  Take Quiz Again
                </button>
                <Link
                  href="/courses"
                  onClick={() => { setIsOpen(false); resetQuiz(); }}
                  className="px-4 py-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
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