'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
}

interface QuizStep {
  question: string
  options: {
    label: string
    emoji: string
    value: string
  }[]
}

const quizSteps: QuizStep[] = [
  {
    question: "What's your experience level?",
    options: [
      { label: 'Just getting started', emoji: '🌱', value: 'beginner' },
      { label: 'Some experience', emoji: '🌿', value: 'intermediate' },
      { label: 'Ready for advanced topics', emoji: '🌳', value: 'advanced' },
    ],
  },
  {
    question: 'What interests you most?',
    options: [
      { label: 'Frontend & UI', emoji: '🎨', value: 'frontend' },
      { label: 'Backend & APIs', emoji: '⚙️', value: 'backend' },
      { label: 'Cloud & DevOps', emoji: '☁️', value: 'cloud' },
      { label: 'Full Stack', emoji: '🚀', value: 'fullstack' },
    ],
  },
  {
    question: 'How do you learn best?',
    options: [
      { label: 'Quick, focused lessons', emoji: '⚡', value: 'quick' },
      { label: 'Deep dive tutorials', emoji: '📚', value: 'deep' },
      { label: 'Project-based learning', emoji: '🛠️', value: 'project' },
    ],
  },
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate recommendation
      const course = calculateRecommendation(newAnswers, courses)
      setRecommendedCourse(course)
    }
  }

  const calculateRecommendation = (userAnswers: string[], allCourses: Course[]): Course => {
    const [level, interest, _style] = userAnswers

    // Score each course
    const scoredCourses = allCourses.map((course) => {
      let score = 0
      const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || ''
      const title = course.title.toLowerCase()
      const description = (course.metadata?.description || '').toLowerCase()
      const tagline = (course.metadata?.tagline || '').toLowerCase()
      const content = `${title} ${description} ${tagline}`

      // Match difficulty
      if (difficulty === level) score += 30
      if (level === 'beginner' && difficulty === 'Beginner') score += 30
      if (level === 'intermediate' && difficulty === 'Intermediate') score += 30
      if (level === 'advanced' && difficulty === 'Advanced') score += 30

      // Match interest
      if (interest === 'frontend' && (content.includes('vue') || content.includes('react') || content.includes('frontend') || content.includes('css'))) {
        score += 40
      }
      if (interest === 'backend' && (content.includes('node') || content.includes('api') || content.includes('backend') || content.includes('express'))) {
        score += 40
      }
      if (interest === 'cloud' && (content.includes('aws') || content.includes('cloud') || content.includes('devops') || content.includes('lambda'))) {
        score += 40
      }
      if (interest === 'fullstack') {
        score += 20 // Give points to everything for full stack
      }

      // Bonus for courses with lessons
      const lessonsCount = course.metadata?.lessons?.length || 0
      if (lessonsCount > 0) score += 10

      return { course, score }
    })

    // Sort by score and return best match
    scoredCourses.sort((a, b) => b.score - a.score)
    return scoredCourses[0]?.course || allCourses[0]
  }

  const reset = () => {
    setCurrentStep(0)
    setAnswers([])
    setRecommendedCourse(null)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
      >
        <span className="text-xl group-hover:animate-bounce">✨</span>
        <span>Find Your Perfect Course</span>
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/90 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          setIsOpen(false)
          reset()
        }}
      />

      {/* Dialog */}
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl shadow-primary-500/10 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-lg font-semibold text-white">Learning Path Finder</h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
              className="p-2 text-navy-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 pt-4">
            <div className="flex gap-2">
              {quizSteps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    index < currentStep
                      ? 'bg-primary-500'
                      : index === currentStep && !recommendedCourse
                      ? 'bg-primary-500/50'
                      : 'bg-navy-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {recommendedCourse ? (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🎉</span>
                  <h3 className="text-xl font-bold text-white mb-2">Your Perfect Match!</h3>
                  <p className="text-navy-400">Based on your answers, we recommend:</p>
                </div>

                <Link
                  href={`/courses/${recommendedCourse.slug}`}
                  onClick={() => {
                    setIsOpen(false)
                    reset()
                  }}
                  className="block bg-navy-800/50 border border-navy-700 rounded-xl p-4 hover:border-primary-500/50 transition-colors group"
                >
                  <div className="flex gap-4">
                    {recommendedCourse.metadata?.thumbnail ? (
                      <img
                        src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                        alt={recommendedCourse.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-lg bg-navy-700 flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {recommendedCourse.title}
                      </h4>
                      <p className="text-sm text-navy-400 truncate">
                        {recommendedCourse.metadata?.tagline}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {recommendedCourse.metadata?.difficulty && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-400">
                            {recommendedCourse.metadata.difficulty.value}
                          </span>
                        )}
                        {recommendedCourse.metadata?.estimated_hours && (
                          <span className="text-xs text-navy-500">
                            {recommendedCourse.metadata.estimated_hours}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    href={`/courses/${recommendedCourse.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      reset()
                    }}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in" key={currentStep}>
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{currentStep === 0 ? '👋' : currentStep === 1 ? '💡' : '📖'}</span>
                  <h3 className="text-xl font-bold text-white">
                    {quizSteps[currentStep].question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {quizSteps[currentStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all hover:scale-[1.02]"
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-navy-500">
                  Step {currentStep + 1} of {quizSteps.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}