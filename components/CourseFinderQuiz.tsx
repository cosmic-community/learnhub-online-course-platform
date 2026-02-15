'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface CourseFinderQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'intro' | 'experience' | 'interest' | 'time' | 'result'

interface QuizAnswers {
  experience: 'beginner' | 'intermediate' | 'advanced' | null
  interest: string | null
  timePerWeek: 'casual' | 'moderate' | 'intensive' | null
}

export default function CourseFinderQuiz({ courses, categories }: CourseFinderQuizProps) {
  const [step, setStep] = useState<QuizStep>('intro')
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: null,
    interest: null,
    timePerWeek: null,
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = (nextStep: QuizStep) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(nextStep)
      setIsAnimating(false)
    }, 200)
  }

  const recommendedCourses = useMemo(() => {
    if (step !== 'result') return []
    
    let filtered = [...courses]
    
    // Filter by experience level
    if (answers.experience) {
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty?.key || course.metadata?.difficulty?.value?.toLowerCase()
        return difficulty === answers.experience
      })
    }
    
    // Filter by category interest
    if (answers.interest) {
      filtered = filtered.filter(course => {
        const courseCategories = course.metadata?.categories || []
        return courseCategories.some(cat => cat.slug === answers.interest)
      })
    }
    
    // Sort by time commitment preference
    if (answers.timePerWeek) {
      const hoursMap = { casual: 3, moderate: 6, intensive: 10 }
      const targetHours = hoursMap[answers.timePerWeek]
      filtered.sort((a, b) => {
        const hoursA = a.metadata?.estimated_hours || 0
        const hoursB = b.metadata?.estimated_hours || 0
        return Math.abs(hoursA - targetHours) - Math.abs(hoursB - targetHours)
      })
    }
    
    // If no matches, return some courses anyway
    if (filtered.length === 0) {
      return courses.slice(0, 3)
    }
    
    return filtered.slice(0, 3)
  }, [step, answers, courses])

  const resetQuiz = () => {
    setAnswers({ experience: null, interest: null, timePerWeek: null })
    handleNext('intro')
  }

  return (
    <div className="card p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className={`relative transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {/* Intro */}
        {step === 'intro' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 text-3xl mb-6">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Find Your Perfect Course</h3>
            <p className="text-navy-300 mb-6 max-w-md mx-auto">
              Answer 3 quick questions and we'll recommend the best courses matched to your goals and schedule.
            </p>
            <button
              onClick={() => handleNext('experience')}
              className="btn-primary"
            >
              Start Quiz
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-navy-500 text-sm mt-4">Takes less than 30 seconds</p>
          </div>
        )}

        {/* Experience Level */}
        {step === 'experience' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                <div className="w-8 h-1 rounded-full bg-primary-500" />
                <div className="w-8 h-1 rounded-full bg-navy-700" />
                <div className="w-8 h-1 rounded-full bg-navy-700" />
              </div>
              <span className="text-navy-400 text-sm">1 of 3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">What's your experience level?</h3>
            <p className="text-navy-400 mb-6">Select the option that best describes you</p>
            
            <div className="grid gap-3">
              {[
                { value: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'Just starting out' },
                { value: 'intermediate', emoji: '🌿', label: 'Intermediate', desc: 'Some experience' },
                { value: 'advanced', emoji: '🌳', label: 'Advanced', desc: 'Ready for deep dives' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, experience: option.value as QuizAnswers['experience'] }))
                    handleNext('interest')
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all text-left group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-sm text-navy-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interest/Category */}
        {step === 'interest' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                <div className="w-8 h-1 rounded-full bg-primary-500" />
                <div className="w-8 h-1 rounded-full bg-primary-500" />
                <div className="w-8 h-1 rounded-full bg-navy-700" />
              </div>
              <span className="text-navy-400 text-sm">2 of 3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">What interests you most?</h3>
            <p className="text-navy-400 mb-6">Pick the topic you'd like to explore</p>
            
            <div className="grid grid-cols-2 gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, interest: category.slug }))
                    handleNext('time')
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {category.metadata?.icon || '📚'}
                  </span>
                  <span className="font-medium text-white text-center text-sm">
                    {category.metadata?.name || category.title}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  setAnswers(prev => ({ ...prev, interest: null }))
                  handleNext('time')
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🌟</span>
                <span className="font-medium text-white text-center text-sm">Surprise Me!</span>
              </button>
            </div>
          </div>
        )}

        {/* Time Commitment */}
        {step === 'time' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                <div className="w-8 h-1 rounded-full bg-primary-500" />
                <div className="w-8 h-1 rounded-full bg-primary-500" />
                <div className="w-8 h-1 rounded-full bg-primary-500" />
              </div>
              <span className="text-navy-400 text-sm">3 of 3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">How much time can you dedicate?</h3>
            <p className="text-navy-400 mb-6">We'll match courses to fit your schedule</p>
            
            <div className="grid gap-3">
              {[
                { value: 'casual', emoji: '☕', label: '1-3 hours/week', desc: 'Casual learning' },
                { value: 'moderate', emoji: '📖', label: '4-6 hours/week', desc: 'Steady progress' },
                { value: 'intensive', emoji: '🔥', label: '7+ hours/week', desc: 'Fast track' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, timePerWeek: option.value as QuizAnswers['timePerWeek'] }))
                    handleNext('result')
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all text-left group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-sm text-navy-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'result' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-3xl mb-4 animate-bounce-slow">
                🎉
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Here are your perfect matches!</h3>
              <p className="text-navy-400">Based on your answers, we recommend:</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {recommendedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800/50 transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                      {course.title}
                    </div>
                    <div className="text-sm text-navy-400 truncate">
                      {course.metadata?.tagline || 'Start learning today'}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetQuiz}
                className="btn-secondary text-sm"
              >
                Retake Quiz
              </button>
              <Link href="/courses" className="btn-primary text-sm">
                View All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}