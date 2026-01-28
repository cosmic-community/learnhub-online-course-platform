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
  answerId: string
}

const questions = [
  {
    id: 1,
    question: "What's your current experience level with coding?",
    emoji: "🎯",
    answers: [
      { id: 'beginner', text: "I'm just getting started", emoji: "🌱" },
      { id: 'intermediate', text: "I know the basics", emoji: "🌿" },
      { id: 'advanced', text: "I'm pretty experienced", emoji: "🌳" },
    ]
  },
  {
    id: 2,
    question: "What interests you most?",
    emoji: "💡",
    answers: [
      { id: 'web', text: "Building websites & apps", emoji: "💻" },
      { id: 'cloud', text: "Cloud & infrastructure", emoji: "☁️" },
      { id: 'mobile', text: "Mobile development", emoji: "📱" },
      { id: 'data', text: "Data & analytics", emoji: "📊" },
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    answers: [
      { id: 'light', text: "1-3 hours", emoji: "🐢" },
      { id: 'moderate', text: "4-7 hours", emoji: "🦊" },
      { id: 'intensive', text: "8+ hours", emoji: "🚀" },
    ]
  },
  {
    id: 4,
    question: "What's your main goal?",
    emoji: "🎯",
    answers: [
      { id: 'career', text: "Land a new job", emoji: "💼" },
      { id: 'skills', text: "Level up my skills", emoji: "📈" },
      { id: 'project', text: "Build a specific project", emoji: "🛠️" },
      { id: 'curiosity', text: "Learn for fun", emoji: "🎨" },
    ]
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (answerId: string) => {
    setIsAnimating(true)
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answerId }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      } else {
        // Calculate recommendations
        calculateRecommendations(newAnswers)
        setShowResults(true)
        setIsAnimating(false)
      }
    }, 300)
  }

  const calculateRecommendations = (userAnswers: QuizAnswer[]) => {
    const experienceAnswer = userAnswers.find(a => a.questionId === 1)?.answerId
    const interestAnswer = userAnswers.find(a => a.questionId === 2)?.answerId
    const timeAnswer = userAnswers.find(a => a.questionId === 3)?.answerId

    let scored = courses.map(course => {
      let score = 0
      const difficulty = course.metadata?.difficulty?.key || course.metadata?.difficulty?.value?.toLowerCase()
      const hours = course.metadata?.estimated_hours || 0
      const courseCategories = course.metadata?.categories || []

      // Match experience level
      if (experienceAnswer === 'beginner' && difficulty === 'beginner') score += 3
      if (experienceAnswer === 'intermediate' && difficulty === 'intermediate') score += 3
      if (experienceAnswer === 'advanced' && difficulty === 'advanced') score += 3
      if (experienceAnswer === 'beginner' && difficulty === 'intermediate') score += 1
      if (experienceAnswer === 'intermediate' && difficulty === 'beginner') score += 1
      if (experienceAnswer === 'intermediate' && difficulty === 'advanced') score += 1

      // Match interests
      const categoryNames = courseCategories.map((c: Category) => 
        (c.metadata?.name || c.title || '').toLowerCase()
      )
      if (interestAnswer === 'web' && categoryNames.some((n: string) => n.includes('web'))) score += 3
      if (interestAnswer === 'cloud' && categoryNames.some((n: string) => n.includes('cloud'))) score += 3
      if (interestAnswer === 'mobile' && categoryNames.some((n: string) => n.includes('mobile'))) score += 3
      if (interestAnswer === 'data' && categoryNames.some((n: string) => n.includes('data'))) score += 3

      // Match time commitment
      if (timeAnswer === 'light' && hours <= 4) score += 2
      if (timeAnswer === 'moderate' && hours > 4 && hours <= 8) score += 2
      if (timeAnswer === 'intensive' && hours > 8) score += 2

      // Bonus for free courses for beginners
      if (experienceAnswer === 'beginner' && course.metadata?.is_free) score += 1

      return { course, score }
    })

    // Sort by score and take top 3
    scored.sort((a, b) => b.score - a.score)
    setRecommendedCourses(scored.slice(0, 3).map(s => s.course))
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setRecommendedCourses([])
  }

  const closeQuiz = () => {
    setIsOpen(false)
    setTimeout(resetQuiz, 300)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl animate-bounce">✨</span>
          <span>Find Your Perfect Course</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={closeQuiz}
          className="absolute top-4 right-4 p-2 text-navy-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress Bar */}
        {!showResults && (
          <div className="h-1 bg-navy-800">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        <div className="p-8">
          {!showResults ? (
            /* Question View */
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              {/* Question Header */}
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block animate-bounce">{questions[currentQuestion].emoji}</span>
                <p className="text-navy-400 text-sm mb-2">Question {currentQuestion + 1} of {questions.length}</p>
                <h3 className="text-2xl font-bold text-white">{questions[currentQuestion].question}</h3>
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {questions[currentQuestion].answers.map((answer) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    className="w-full p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-200 group hover:scale-[1.02]"
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-2xl group-hover:scale-125 transition-transform">{answer.emoji}</span>
                      <span className="text-white font-medium">{answer.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🎉</span>
                <h3 className="text-2xl font-bold text-white mb-2">Your Learning Path</h3>
                <p className="text-navy-400">Based on your answers, we recommend these courses:</p>
              </div>

              {recommendedCourses.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      onClick={closeQuiz}
                      className="block p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center">
                          <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold group-hover:text-primary-400 transition-colors truncate">
                            {course.title}
                          </h4>
                          <p className="text-navy-400 text-sm truncate">{course.metadata?.tagline}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className={`badge badge-${course.metadata?.difficulty?.key || 'beginner'}`}>
                              {course.metadata?.difficulty?.value || 'Beginner'}
                            </span>
                            {course.metadata?.is_free && (
                              <span className="badge badge-free">Free</span>
                            )}
                            {course.metadata?.estimated_hours && (
                              <span className="text-navy-500">{course.metadata.estimated_hours}h</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-8">
                  <p className="text-navy-400">No exact matches found, but check out all our courses!</p>
                </div>
              )}

              <div className="flex gap-4">
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

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  )
}