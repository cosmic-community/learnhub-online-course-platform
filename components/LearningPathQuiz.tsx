'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuizQuestion {
  id: number
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
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your experience level with programming?",
    emoji: "🎯",
    options: [
      { text: "Brand new - teach me everything!", value: "beginner", emoji: "🌱" },
      { text: "I know the basics, ready for more", value: "intermediate", emoji: "🌿" },
      { text: "Experienced - show me advanced topics", value: "advanced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "What excites you most about learning?",
    emoji: "✨",
    options: [
      { text: "Building beautiful websites", value: "web-development", emoji: "💻" },
      { text: "Working with data & cloud", value: "cloud-computing", emoji: "☁️" },
      { text: "Creating mobile apps", value: "mobile-development", emoji: "📱" },
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { text: "Just a few hours", value: "short", emoji: "🏃" },
      { text: "Around 5-10 hours", value: "medium", emoji: "🚴" },
      { text: "I'm going all in!", value: "long", emoji: "🚀" },
    ]
  }
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [animatingOut, setAnimatingOut] = useState(false)

  const handleAnswer = (questionId: number, value: string) => {
    setAnimatingOut(true)
    
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [questionId]: value }))
      
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        // Calculate recommendations
        const recommendations = calculateRecommendations({ ...answers, [questionId]: value })
        setRecommendedCourses(recommendations)
        setShowResults(true)
      }
      setAnimatingOut(false)
    }, 300)
  }

  const calculateRecommendations = (userAnswers: Record<number, string>): Course[] => {
    const experienceLevel = userAnswers[1] || 'beginner'
    const interest = userAnswers[2] || 'web-development'
    const timeCommitment = userAnswers[3] || 'medium'
    
    // Score each course based on user preferences
    const scoredCourses = courses.map(course => {
      let score = 0
      
      // Match difficulty level
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
      if (difficulty.includes(experienceLevel)) {
        score += 30
      } else if (
        (experienceLevel === 'beginner' && difficulty.includes('intermediate')) ||
        (experienceLevel === 'intermediate' && (difficulty.includes('beginner') || difficulty.includes('advanced')))
      ) {
        score += 15
      }
      
      // Match category interests
      const categories = course.metadata?.categories || []
      categories.forEach(cat => {
        const catSlug = cat.slug || ''
        if (catSlug.includes(interest.replace('-', ''))) {
          score += 25
        }
      })
      
      // Match time commitment
      const hours = course.metadata?.estimated_hours || 5
      if (timeCommitment === 'short' && hours <= 4) score += 20
      else if (timeCommitment === 'medium' && hours > 4 && hours <= 8) score += 20
      else if (timeCommitment === 'long' && hours > 8) score += 20
      
      // Bonus for having content
      if (course.metadata?.lessons && course.metadata.lessons.length > 0) {
        score += 10
      }
      
      return { course, score }
    })
    
    // Sort by score and return top 3
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.course)
  }

  const resetQuiz = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setCurrentStep(0)
      setAnswers({})
      setShowResults(false)
      setRecommendedCourses([])
      setAnimatingOut(false)
    }, 300)
  }

  const currentQuestion = questions[currentStep]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500/20 to-primary-600/20 hover:from-primary-500/30 hover:to-primary-600/30 border border-primary-500/30 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-3xl animate-bounce">
            🎯
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white mb-1">
              Not sure where to start?
            </h3>
            <p className="text-navy-300 text-sm">
              Take our 30-second quiz to find your perfect course →
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="relative overflow-hidden bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/10 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-bold text-white">Learning Path Quiz</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-navy-400 hover:text-white transition-colors p-2 hover:bg-navy-800 rounded-lg"
            aria-label="Close quiz"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {!showResults && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-navy-400 mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quiz content */}
        <div className={`transition-all duration-300 ${animatingOut ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          {!showResults ? (
            <div>
              {/* Question */}
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">{currentQuestion.emoji}</span>
                <h4 className="text-xl md:text-2xl font-semibold text-white">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className="group relative overflow-hidden bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] text-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300" />
                    <div className="relative flex items-center gap-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {option.emoji}
                      </span>
                      <span className="text-white font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Results */}
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block animate-bounce">🎉</span>
                <h4 className="text-2xl font-bold text-white mb-2">
                  Perfect matches found!
                </h4>
                <p className="text-navy-300">
                  Based on your answers, here are your recommended courses:
                </p>
              </div>

              {/* Recommended courses */}
              <div className="grid gap-4 mb-6">
                {recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group relative overflow-hidden bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank badge */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : index === 1 
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      
                      {/* Course info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-white font-semibold truncate group-hover:text-primary-400 transition-colors">
                          {course.title}
                        </h5>
                        <div className="flex items-center gap-3 text-sm text-navy-400">
                          {course.metadata?.difficulty && (
                            <span className="capitalize">{course.metadata.difficulty.value}</span>
                          )}
                          {course.metadata?.lessons && (
                            <span>{course.metadata.lessons.length} lessons</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <svg 
                        className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 btn-secondary text-sm"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/courses"
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