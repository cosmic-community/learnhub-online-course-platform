'use client'

import { useState, useEffect } from 'react'
import type { Course, Category } from '@/types'

interface CourseQuizProps {
  courses: Course[]
  categories: Category[]
}

type Step = 'experience' | 'interest' | 'time' | 'result'
type Experience = 'beginner' | 'intermediate' | 'advanced'
type TimeCommitment = 'quick' | 'moderate' | 'intensive'

interface Answers {
  experience?: Experience
  interest?: string
  time?: TimeCommitment
}

export default function CourseQuiz({ courses, categories }: CourseQuizProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('experience')
  const [answers, setAnswers] = useState<Answers>({})
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const experienceOptions = [
    { value: 'beginner', label: '🌱 Just Starting Out', description: 'New to coding or this field' },
    { value: 'intermediate', label: '🌿 Growing Skills', description: 'Some experience, ready for more' },
    { value: 'advanced', label: '🌳 Experienced', description: 'Looking to master advanced topics' },
  ]

  const timeOptions = [
    { value: 'quick', label: '⚡ Quick Wins', description: 'Under 4 hours', hours: 4 },
    { value: 'moderate', label: '📚 Steady Learning', description: '4-6 hours', hours: 6 },
    { value: 'intensive', label: '🚀 Deep Dive', description: '6+ hours', hours: 999 },
  ]

  const handleExperienceSelect = (experience: Experience) => {
    setAnswers({ ...answers, experience })
    setStep('interest')
  }

  const handleInterestSelect = (interest: string) => {
    setAnswers({ ...answers, interest })
    setStep('time')
  }

  const handleTimeSelect = (time: TimeCommitment) => {
    const newAnswers = { ...answers, time }
    setAnswers(newAnswers)
    calculateRecommendations(newAnswers)
    setStep('result')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const calculateRecommendations = (finalAnswers: Answers) => {
    let filtered = [...courses]

    // Filter by difficulty/experience
    if (finalAnswers.experience) {
      const difficultyMap: Record<Experience, string[]> = {
        beginner: ['beginner', 'Beginner'],
        intermediate: ['intermediate', 'Intermediate'],
        advanced: ['advanced', 'Advanced'],
      }
      const allowedDifficulties = difficultyMap[finalAnswers.experience]
      filtered = filtered.filter(course => {
        const diff = course.metadata?.difficulty?.value || course.metadata?.difficulty?.key
        return allowedDifficulties.some(d => d.toLowerCase() === String(diff).toLowerCase())
      })
    }

    // Filter by category interest
    if (finalAnswers.interest && finalAnswers.interest !== 'all') {
      filtered = filtered.filter(course => {
        const courseCategories = course.metadata?.categories || []
        return courseCategories.some(cat => cat.slug === finalAnswers.interest)
      })
    }

    // Filter by time commitment
    if (finalAnswers.time) {
      const timeFilter = timeOptions.find(t => t.value === finalAnswers.time)
      if (timeFilter) {
        filtered = filtered.filter(course => {
          const hours = course.metadata?.estimated_hours || 0
          if (finalAnswers.time === 'quick') return hours <= 4
          if (finalAnswers.time === 'moderate') return hours > 4 && hours <= 6
          return hours > 6
        })
      }
    }

    // If no matches, show all courses sorted by relevance
    if (filtered.length === 0) {
      filtered = courses.slice(0, 3)
    }

    setRecommendedCourses(filtered.slice(0, 3))
  }

  const resetQuiz = () => {
    setStep('experience')
    setAnswers({})
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
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 transform hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span>Find Your Perfect Course</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={closeQuiz}
      />
      
      {/* Quiz Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl max-w-lg w-full p-8 pointer-events-auto animate-slideUp relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 0.5}s`,
                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  }}
                />
              ))}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={closeQuiz}
            className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            {['experience', 'interest', 'time', 'result'].map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  ['experience', 'interest', 'time', 'result'].indexOf(step) >= i
                    ? 'bg-primary-500'
                    : 'bg-navy-700'
                }`}
              />
            ))}
          </div>

          {/* Step: Experience */}
          {step === 'experience' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-2">What's your experience level?</h3>
              <p className="text-navy-400 mb-6">Help us find courses that match your skills</p>
              <div className="space-y-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleExperienceSelect(option.value as Experience)}
                    className="w-full text-left p-4 rounded-xl border border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200 group"
                  >
                    <span className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                      {option.label}
                    </span>
                    <p className="text-sm text-navy-400 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Interest */}
          {step === 'interest' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-2">What interests you most?</h3>
              <p className="text-navy-400 mb-6">Select a topic you'd like to explore</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInterestSelect('all')}
                  className="text-left p-4 rounded-xl border border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200"
                >
                  <span className="text-2xl mb-2 block">🌟</span>
                  <span className="font-medium text-white">Show me all</span>
                </button>
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleInterestSelect(category.slug)}
                    className="text-left p-4 rounded-xl border border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200"
                  >
                    <span className="text-2xl mb-2 block">{category.metadata?.icon || '📚'}</span>
                    <span className="font-medium text-white">{category.metadata?.name || category.title}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('experience')}
                className="mt-4 text-navy-400 hover:text-white transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step: Time */}
          {step === 'time' && (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-2">How much time do you have?</h3>
              <p className="text-navy-400 mb-6">We'll find courses that fit your schedule</p>
              <div className="space-y-3">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeSelect(option.value as TimeCommitment)}
                    className="w-full text-left p-4 rounded-xl border border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200 group"
                  >
                    <span className="text-lg font-medium text-white group-hover:text-primary-400 transition-colors">
                      {option.label}
                    </span>
                    <p className="text-sm text-navy-400 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('interest')}
                className="mt-4 text-navy-400 hover:text-white transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Step: Results */}
          {step === 'result' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <span className="text-4xl mb-4 block">🎉</span>
                <h3 className="text-2xl font-bold text-white mb-2">Perfect matches found!</h3>
                <p className="text-navy-400">Based on your preferences, we recommend:</p>
              </div>
              <div className="space-y-3 mb-6">
                {recommendedCourses.map((course, index) => (
                  <a
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="block p-4 rounded-xl border border-navy-700 hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl font-bold text-primary-500">#{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-sm text-navy-400 mt-1 line-clamp-1">
                          {course.metadata?.tagline}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                          <span>{course.metadata?.estimated_hours}h</span>
                          <span>•</span>
                          <span className="capitalize">{course.metadata?.difficulty?.value || course.metadata?.difficulty?.key}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 py-3 px-4 rounded-lg border border-navy-700 text-navy-300 hover:text-white hover:border-navy-600 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href="/courses"
                  className="flex-1 py-3 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-center font-medium transition-colors"
                >
                  Browse All
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}