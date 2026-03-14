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
    question: "What's your current experience level with programming?",
    emoji: "🎯",
    options: [
      { value: 'none', label: "I'm completely new to coding", emoji: "🌱" },
      { value: 'beginner', label: "I know the basics but want to learn more", emoji: "📚" },
      { value: 'intermediate', label: "I've built some projects on my own", emoji: "💪" },
      { value: 'advanced', label: "I'm experienced and want to level up", emoji: "🚀" },
    ]
  },
  {
    id: 2,
    question: "What type of development interests you most?",
    emoji: "💡",
    options: [
      { value: 'frontend', label: "Building beautiful user interfaces", emoji: "🎨" },
      { value: 'backend', label: "Server-side logic and databases", emoji: "⚙️" },
      { value: 'fullstack', label: "I want to do it all!", emoji: "🌐" },
      { value: 'cloud', label: "Cloud infrastructure and DevOps", emoji: "☁️" },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    emoji: "📖",
    options: [
      { value: 'practical', label: "Hands-on projects and code-alongs", emoji: "🔨" },
      { value: 'theory', label: "Understanding concepts deeply first", emoji: "🧠" },
      { value: 'mixed', label: "A balanced mix of both", emoji: "⚖️" },
      { value: 'fast', label: "Quick, focused tutorials", emoji: "⚡" },
    ]
  },
  {
    id: 4,
    question: "What's your main goal?",
    emoji: "🎯",
    options: [
      { value: 'career', label: "Land a job or switch careers", emoji: "💼" },
      { value: 'freelance', label: "Start freelancing or build my own apps", emoji: "🏠" },
      { value: 'upskill', label: "Improve skills at my current job", emoji: "📈" },
      { value: 'hobby', label: "Learn for fun and personal projects", emoji: "🎮" },
    ]
  },
]

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = (answer: string) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowConfetti(true)
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    const experienceAnswer = answers.find(a => a.questionId === 1)?.answer
    const interestAnswer = answers.find(a => a.questionId === 2)?.answer

    let filtered = [...courses]

    // Filter by difficulty based on experience
    if (experienceAnswer === 'none' || experienceAnswer === 'beginner') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        const diffValue = typeof difficulty === 'object' && difficulty !== null 
          ? (difficulty as { value?: string }).value 
          : difficulty
        return diffValue === 'beginner' || diffValue === 'Beginner'
      })
    } else if (experienceAnswer === 'intermediate') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        const diffValue = typeof difficulty === 'object' && difficulty !== null 
          ? (difficulty as { value?: string }).value 
          : difficulty
        return diffValue === 'intermediate' || diffValue === 'Intermediate' || diffValue === 'beginner' || diffValue === 'Beginner'
      })
    }

    // Sort by relevance to interest
    if (interestAnswer === 'frontend') {
      filtered.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || ''
        const bTitle = b.title?.toLowerCase() || ''
        const frontendKeywords = ['vue', 'react', 'frontend', 'css', 'ui', 'typescript']
        const aScore = frontendKeywords.some(k => aTitle.includes(k)) ? 1 : 0
        const bScore = frontendKeywords.some(k => bTitle.includes(k)) ? 1 : 0
        return bScore - aScore
      })
    } else if (interestAnswer === 'backend') {
      filtered.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || ''
        const bTitle = b.title?.toLowerCase() || ''
        const backendKeywords = ['node', 'api', 'database', 'backend', 'server', 'express']
        const aScore = backendKeywords.some(k => aTitle.includes(k)) ? 1 : 0
        const bScore = backendKeywords.some(k => bTitle.includes(k)) ? 1 : 0
        return bScore - aScore
      })
    } else if (interestAnswer === 'cloud') {
      filtered.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || ''
        const bTitle = b.title?.toLowerCase() || ''
        const cloudKeywords = ['aws', 'cloud', 'devops', 'lambda', 'deploy']
        const aScore = cloudKeywords.some(k => aTitle.includes(k)) ? 1 : 0
        const bScore = cloudKeywords.some(k => bTitle.includes(k)) ? 1 : 0
        return bScore - aScore
      })
    }

    // If no filtered results, return top courses
    if (filtered.length === 0) {
      return courses.slice(0, 3)
    }

    return filtered.slice(0, 3)
  }

  const getPersonalizedMessage = (): string => {
    const experience = answers.find(a => a.questionId === 1)?.answer
    const goal = answers.find(a => a.questionId === 4)?.answer

    if (experience === 'none' && goal === 'career') {
      return "You're at the start of an exciting journey! These beginner-friendly courses will build a solid foundation for your new career."
    }
    if (experience === 'advanced' && goal === 'upskill') {
      return "Ready to level up? These courses will help you master advanced concepts and stay ahead in your field."
    }
    if (goal === 'freelance') {
      return "Building your own path is awesome! These courses focus on practical skills you can immediately apply to client projects."
    }
    if (goal === 'hobby') {
      return "Learning for the joy of it? You'll love diving into these engaging courses at your own pace."
    }
    return "Based on your answers, we think you'll love these courses. Each one is handpicked to match your goals and experience level."
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setShowConfetti(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const recommendedCourses = getRecommendedCourses()
    
    return (
      <div className="relative">
        {showConfetti && <Confetti />}
        
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Perfect Learning Path
          </h1>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto">
            {getPersonalizedMessage()}
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {recommendedCourses.map((course, index) => {
            const difficulty = course.metadata?.difficulty
            const diffValue = typeof difficulty === 'object' && difficulty !== null 
              ? (difficulty as { value?: string }).value 
              : difficulty
            
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="card block p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {course.metadata?.title || course.title}
                      </h3>
                      {diffValue && (
                        <span className={`badge ${
                          diffValue.toLowerCase() === 'beginner' ? 'badge-beginner' :
                          diffValue.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                          'badge-advanced'
                        }`}>
                          {diffValue}
                        </span>
                      )}
                    </div>
                    <p className="text-navy-400 line-clamp-2">
                      {course.metadata?.tagline}
                    </p>
                    {course.metadata?.estimated_hours && (
                      <p className="text-sm text-navy-500 mt-2">
                        ⏱️ {course.metadata.estimated_hours} hours estimated
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-primary-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="btn-secondary"
          >
            ↻ Retake Quiz
          </button>
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Find Your Learning Path
        </h1>
        <p className="text-navy-300">
          Answer a few questions and we&apos;ll recommend the perfect courses for you
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-navy-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div 
        className={`card p-8 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{question.emoji}</span>
          <h2 className="text-2xl font-semibold text-white">
            {question.question}
          </h2>
        </div>

        <div className="grid gap-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              disabled={isAnimating}
              className="w-full p-4 text-left rounded-xl border-2 border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200 group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-white group-hover:text-primary-300 transition-colors">
                  {option.label}
                </span>
                <svg 
                  className="w-5 h-5 ml-auto text-navy-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentQuestion > 0 && (
        <button
          onClick={() => {
            setCurrentQuestion(currentQuestion - 1)
            setAnswers(answers.slice(0, -1))
          }}
          className="mt-6 text-navy-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to previous question
        </button>
      )}
    </div>
  )
}