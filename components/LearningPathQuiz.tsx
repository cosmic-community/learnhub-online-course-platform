'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

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

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your main goal?",
    emoji: "🎯",
    options: [
      { label: "Start a new career in tech", value: "career", emoji: "🚀" },
      { label: "Level up my current skills", value: "upgrade", emoji: "📈" },
      { label: "Build a personal project", value: "project", emoji: "🛠️" },
      { label: "Just exploring & learning", value: "explore", emoji: "🔍" },
    ]
  },
  {
    id: 2,
    question: "What's your current experience level?",
    emoji: "📊",
    options: [
      { label: "Complete beginner", value: "beginner", emoji: "🌱" },
      { label: "Some basic knowledge", value: "basic", emoji: "🌿" },
      { label: "Intermediate - I've built some projects", value: "intermediate", emoji: "🌳" },
      { label: "Advanced - Looking to specialize", value: "advanced", emoji: "🏔️" },
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { label: "1-3 hours (casual learner)", value: "casual", emoji: "☕" },
      { label: "4-7 hours (committed learner)", value: "committed", emoji: "📚" },
      { label: "8-15 hours (intensive learner)", value: "intensive", emoji: "🔥" },
      { label: "15+ hours (full-time focus)", value: "fulltime", emoji: "💪" },
    ]
  },
  {
    id: 4,
    question: "What interests you most?",
    emoji: "💡",
    options: [
      { label: "Building websites & web apps", value: "web", emoji: "🌐" },
      { label: "Mobile app development", value: "mobile", emoji: "📱" },
      { label: "Cloud & backend systems", value: "cloud", emoji: "☁️" },
      { label: "Data & machine learning", value: "data", emoji: "📊" },
    ]
  }
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])

  const handleAnswer = (value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        calculateRecommendations({ ...answers, [currentQuestion]: value })
        setIsComplete(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateRecommendations = (finalAnswers: Record<number, string>) => {
    // Simple recommendation logic based on answers
    const level = finalAnswers[1] // experience level
    const interest = finalAnswers[3] // area of interest
    
    let filtered = [...courses]
    
    // Filter by difficulty based on experience
    if (level === 'beginner' || level === 'basic') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'beginner' ||
        c.metadata?.difficulty?.value?.toLowerCase() === 'intermediate'
      )
    } else if (level === 'advanced') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'intermediate' ||
        c.metadata?.difficulty?.value?.toLowerCase() === 'advanced'
      )
    }
    
    // Sort by relevance (free courses first for beginners, then by match)
    if (level === 'beginner') {
      filtered.sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return 0
      })
    }
    
    // Take top 3 recommendations
    setRecommendedCourses(filtered.slice(0, 3))
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setRecommendedCourses([])
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (!showQuiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="text-6xl mb-4 animate-bounce">🧭</div>
            <h3 className="text-2xl font-bold text-white mb-3">Discover Your Learning Path</h3>
            <p className="text-navy-300 mb-6">
              Answer 4 quick questions and we'll recommend the perfect courses for you.
              Takes less than a minute!
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="btn-primary group"
            >
              <span>Start Quiz</span>
              <svg 
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 relative overflow-hidden">
          {/* Celebration background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary-500/5" />
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Your Personalized Recommendations!</h3>
              <p className="text-navy-300">
                Based on your answers, here are the courses we think you'll love:
              </p>
            </div>

            {recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group block"
                  >
                    <div 
                      className="card p-4 h-full hover:border-primary-500/50 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Match Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary-500/20 text-primary-400 text-xs font-medium px-2 py-1 rounded-full">
                          #{index + 1} Match
                        </span>
                        {course.metadata?.is_free && (
                          <span className="badge badge-free text-xs">Free</span>
                        )}
                      </div>
                      
                      {/* Course Image */}
                      {course.metadata?.thumbnail?.imgix_url && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                            alt={course.metadata?.title || course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors mb-2 line-clamp-2">
                        {course.metadata?.title || course.title}
                      </h4>
                      
                      {course.metadata?.tagline && (
                        <p className="text-navy-400 text-sm line-clamp-2">
                          {course.metadata.tagline}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-navy-500">
                        {course.metadata?.difficulty?.value && (
                          <span className={`badge badge-${course.metadata.difficulty.value.toLowerCase()}`}>
                            {course.metadata.difficulty.value}
                          </span>
                        )}
                        {course.metadata?.estimated_hours && (
                          <span>{course.metadata.estimated_hours}h</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-8">
                <p className="text-navy-400">
                  We're still adding courses. Check back soon for personalized recommendations!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="btn-secondary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Quiz
              </button>
              <Link href="/courses" className="btn-primary">
                Browse All Courses
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5" />
        
        <div className="relative">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-navy-400 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">{question.emoji}</span>
              <h3 className="text-2xl font-bold text-white">{question.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 p-4 bg-navy-800/50 border border-navy-700 rounded-xl hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-200 group-hover:scale-[1.02]">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-white font-medium text-left flex-1">
                      {option.label}
                    </span>
                    <svg 
                      className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
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
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              className="mt-6 text-navy-400 hover:text-white flex items-center gap-2 transition-colors mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous question
            </button>
          )}
        </div>
      </div>
    </div>
  )
}