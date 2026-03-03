'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'intro' | 'experience' | 'interest' | 'time' | 'result'
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | null
type TimeCommitment = 'casual' | 'moderate' | 'intensive' | null

interface QuizState {
  experience: ExperienceLevel
  interest: string | null
  timeCommitment: TimeCommitment
}

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [step, setStep] = useState<QuizStep>('intro')
  const [quizState, setQuizState] = useState<QuizState>({
    experience: null,
    interest: null,
    timeCommitment: null,
  })
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Calculate progress
  useEffect(() => {
    const stepProgress: Record<QuizStep, number> = {
      intro: 0,
      experience: 25,
      interest: 50,
      time: 75,
      result: 100,
    }
    setProgress(stepProgress[step])
  }, [step])

  // Get recommended courses based on quiz answers
  useEffect(() => {
    if (step === 'result') {
      const filtered = courses.filter((course) => {
        // Filter by difficulty/experience
        const difficulty = course.metadata?.difficulty
        const difficultyValue = typeof difficulty === 'object' && difficulty !== null 
          ? (difficulty as { value?: string }).value?.toLowerCase() 
          : typeof difficulty === 'string' ? difficulty.toLowerCase() : ''
        
        if (quizState.experience && difficultyValue) {
          if (quizState.experience === 'beginner' && difficultyValue !== 'beginner') {
            return false
          }
          if (quizState.experience === 'advanced' && difficultyValue === 'beginner') {
            return false
          }
        }

        // Filter by category/interest
        if (quizState.interest) {
          const courseCategories = course.metadata?.categories || []
          const hasMatchingCategory = courseCategories.some((cat) => {
            const catSlug = typeof cat === 'object' && cat !== null ? (cat as { slug?: string }).slug : ''
            return catSlug === quizState.interest
          })
          if (!hasMatchingCategory && courseCategories.length > 0) {
            return false
          }
        }

        // Filter by time commitment
        const hours = course.metadata?.estimated_hours || 0
        if (quizState.timeCommitment === 'casual' && hours > 5) {
          return false
        }
        if (quizState.timeCommitment === 'intensive' && hours < 4) {
          return false
        }

        return true
      })

      // Sort by relevance (free courses first, then by hours)
      const sorted = filtered.sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return 0
      })

      setRecommendedCourses(sorted.slice(0, 3))
    }
  }, [step, courses, quizState])

  const handleNext = (nextStep: QuizStep) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(nextStep)
      setIsAnimating(false)
    }, 300)
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep('intro')
      setQuizState({
        experience: null,
        interest: null,
        timeCommitment: null,
      })
      setRecommendedCourses([])
      setIsAnimating(false)
    }, 300)
  }

  const experienceOptions = [
    { value: 'beginner', label: 'Just Starting', emoji: '🌱', description: 'New to programming or this field' },
    { value: 'intermediate', label: 'Some Experience', emoji: '🌿', description: 'Built a few projects, know the basics' },
    { value: 'advanced', label: 'Experienced', emoji: '🌳', description: 'Professional or extensive hobby experience' },
  ]

  const timeOptions = [
    { value: 'casual', label: 'Casual Learner', emoji: '☕', description: '1-2 hours per week' },
    { value: 'moderate', label: 'Steady Pace', emoji: '📚', description: '3-5 hours per week' },
    { value: 'intensive', label: 'Deep Dive', emoji: '🚀', description: '6+ hours per week' },
  ]

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {step !== 'intro' && step !== 'result' && (
          <p className="text-navy-500 text-sm mt-2 text-center">
            Question {step === 'experience' ? 1 : step === 'interest' ? 2 : 3} of 3
          </p>
        )}
      </div>

      {/* Quiz Content */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
        
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-6 animate-bounce">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Let&apos;s Find Your Perfect Course
            </h3>
            <p className="text-navy-300 mb-8 max-w-md mx-auto">
              Answer 3 quick questions and we&apos;ll recommend the best courses tailored to your experience, interests, and schedule.
            </p>
            <button
              onClick={() => handleNext('experience')}
              className="btn-primary text-lg group"
            >
              Start Quiz
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}

        {/* Experience Step */}
        {step === 'experience' && (
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              What&apos;s your experience level?
            </h3>
            <p className="text-navy-400 mb-8 text-center">
              This helps us recommend courses at the right difficulty
            </p>
            <div className="grid gap-4">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setQuizState({ ...quizState, experience: option.value as ExperienceLevel })
                    handleNext('interest')
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:border-primary-500 hover:bg-primary-500/5 ${
                    quizState.experience === option.value 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'border-navy-700 bg-navy-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-navy-400">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interest Step */}
        {step === 'interest' && (
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              What interests you most?
            </h3>
            <p className="text-navy-400 mb-8 text-center">
              Pick a category to focus your learning
            </p>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setQuizState({ ...quizState, interest: category.slug })
                    handleNext('time')
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group hover:border-primary-500 hover:bg-primary-500/5 ${
                    quizState.interest === category.slug 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'border-navy-700 bg-navy-800/50'
                  }`}
                >
                  <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                    {category.metadata?.icon || '📚'}
                  </span>
                  <div className="font-semibold text-white text-sm">
                    {category.metadata?.name || category.title}
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  setQuizState({ ...quizState, interest: null })
                  handleNext('time')
                }}
                className="p-4 rounded-xl border-2 border-navy-700 bg-navy-800/50 transition-all duration-200 text-center group hover:border-primary-500 hover:bg-primary-500/5"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">🎲</span>
                <div className="font-semibold text-white text-sm">Surprise Me!</div>
              </button>
            </div>
            <button
              onClick={() => handleNext('experience')}
              className="mt-6 text-navy-400 hover:text-white text-sm transition-colors mx-auto block"
            >
              ← Go back
            </button>
          </div>
        )}

        {/* Time Commitment Step */}
        {step === 'time' && (
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              How much time can you commit?
            </h3>
            <p className="text-navy-400 mb-8 text-center">
              We&apos;ll recommend courses that fit your schedule
            </p>
            <div className="grid gap-4">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setQuizState({ ...quizState, timeCommitment: option.value as TimeCommitment })
                    handleNext('result')
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:border-primary-500 hover:bg-primary-500/5 ${
                    quizState.timeCommitment === option.value 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'border-navy-700 bg-navy-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                    <div>
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-navy-400">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNext('interest')}
              className="mt-6 text-navy-400 hover:text-white text-sm transition-colors mx-auto block"
            >
              ← Go back
            </button>
          </div>
        )}

        {/* Results Step */}
        {step === 'result' && (
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Personalized Recommendations
              </h3>
              <p className="text-navy-400">
                Based on your answers, here are the courses we think you&apos;ll love
              </p>
            </div>

            {recommendedCourses.length > 0 ? (
              <div className="space-y-4 mb-8">
                {recommendedCourses.map((course, index) => {
                  const difficulty = course.metadata?.difficulty
                  const difficultyValue = typeof difficulty === 'object' && difficulty !== null 
                    ? (difficulty as { value?: string }).value 
                    : typeof difficulty === 'string' ? difficulty : 'Beginner'
                  
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block p-4 rounded-xl border-2 border-navy-700 bg-navy-800/50 hover:border-primary-500 hover:bg-primary-500/5 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-sm text-navy-400 line-clamp-1">
                            {course.metadata?.tagline || 'Start your learning journey'}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              difficultyValue?.toLowerCase() === 'beginner' ? 'bg-green-500/20 text-green-400' :
                              difficultyValue?.toLowerCase() === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {difficultyValue}
                            </span>
                            {course.metadata?.is_free && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                                Free
                              </span>
                            )}
                            {course.metadata?.estimated_hours && (
                              <span className="text-xs text-navy-500">
                                {course.metadata.estimated_hours}h
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-navy-500 group-hover:text-primary-400 transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 mb-8">
                <p className="text-navy-400">
                  No exact matches found, but check out all our courses below!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Take Quiz Again
              </button>
              <Link href="/courses" className="btn-primary">
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}