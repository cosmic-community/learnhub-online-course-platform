'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface CourseQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'welcome' | 'experience' | 'interest' | 'time' | 'result'

interface QuizAnswers {
  experience: string
  interest: string
  time: string
}

export default function CourseQuiz({ courses, categories }: CourseQuizProps) {
  const [step, setStep] = useState<QuizStep>('welcome')
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: '',
    interest: '',
    time: ''
  })
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const experienceOptions = [
    { value: 'beginner', label: 'Just starting out', emoji: '🌱', description: 'I\'m new to this field' },
    { value: 'intermediate', label: 'Some experience', emoji: '🌿', description: 'I know the basics' },
    { value: 'advanced', label: 'Experienced', emoji: '🌳', description: 'Looking to level up' }
  ]

  const interestOptions = categories.slice(0, 4).map(cat => ({
    value: cat.slug,
    label: cat.metadata?.name || cat.title,
    emoji: cat.metadata?.icon || '📚',
    description: cat.metadata?.description?.slice(0, 50) + '...' || 'Explore this topic'
  }))

  const timeOptions = [
    { value: 'quick', label: 'Quick learner', emoji: '⚡', description: 'Under 3 hours' },
    { value: 'medium', label: 'Steady pace', emoji: '🎯', description: '3-6 hours' },
    { value: 'deep', label: 'Deep dive', emoji: '🏊', description: '6+ hours of content' }
  ]

  const handleSelect = (field: keyof QuizAnswers, value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [field]: value }))
    
    setTimeout(() => {
      setIsAnimating(false)
      if (field === 'experience') setStep('interest')
      else if (field === 'interest') setStep('time')
      else if (field === 'time') calculateResult({ ...answers, time: value })
    }, 300)
  }

  const calculateResult = (finalAnswers: QuizAnswers) => {
    // Filter courses based on answers
    let filteredCourses = [...courses]

    // Filter by difficulty
    if (finalAnswers.experience === 'beginner') {
      filteredCourses = filteredCourses.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'beginner' ||
        c.metadata?.is_free
      )
    } else if (finalAnswers.experience === 'advanced') {
      filteredCourses = filteredCourses.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() !== 'beginner'
      )
    }

    // Filter by category interest
    if (finalAnswers.interest) {
      const interestedCourses = filteredCourses.filter(c =>
        c.metadata?.categories?.some(cat => cat.slug === finalAnswers.interest)
      )
      if (interestedCourses.length > 0) {
        filteredCourses = interestedCourses
      }
    }

    // Filter by time commitment
    if (finalAnswers.time === 'quick') {
      filteredCourses = filteredCourses.filter(c => (c.metadata?.estimated_hours || 0) <= 3)
    } else if (finalAnswers.time === 'deep') {
      filteredCourses = filteredCourses.filter(c => (c.metadata?.estimated_hours || 0) >= 5)
    }

    // Select random from filtered, or fallback to any course
    const finalSelection = filteredCourses.length > 0 
      ? filteredCourses[Math.floor(Math.random() * filteredCourses.length)]
      : courses[Math.floor(Math.random() * courses.length)]

    setRecommendedCourse(finalSelection)
    setStep('result')
  }

  const resetQuiz = () => {
    setStep('welcome')
    setAnswers({ experience: '', interest: '', time: '' })
    setRecommendedCourse(null)
  }

  const renderOptions = (
    options: Array<{ value: string; label: string; emoji: string; description: string }>,
    field: keyof QuizAnswers
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => handleSelect(field, option.value)}
          className="group p-6 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {option.emoji}
          </div>
          <div className="font-semibold text-white mb-1">{option.label}</div>
          <div className="text-sm text-navy-400">{option.description}</div>
        </button>
      ))}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`card p-8 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {step === 'welcome' && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce-slow">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Find Your Perfect Course
            </h2>
            <p className="text-navy-400 mb-6">
              Answer a few quick questions and we&apos;ll recommend the best course for you!
            </p>
            <button
              onClick={() => setStep('experience')}
              className="btn-primary"
            >
              Start Quiz
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}

        {step === 'experience' && (
          <div>
            <div className="text-center mb-8">
              <span className="text-sm text-primary-400 font-medium">Question 1 of 3</span>
              <h3 className="text-xl font-bold text-white mt-2">
                What&apos;s your experience level?
              </h3>
            </div>
            {renderOptions(experienceOptions, 'experience')}
          </div>
        )}

        {step === 'interest' && (
          <div>
            <div className="text-center mb-8">
              <span className="text-sm text-primary-400 font-medium">Question 2 of 3</span>
              <h3 className="text-xl font-bold text-white mt-2">
                What interests you most?
              </h3>
            </div>
            {renderOptions(interestOptions, 'interest')}
          </div>
        )}

        {step === 'time' && (
          <div>
            <div className="text-center mb-8">
              <span className="text-sm text-primary-400 font-medium">Question 3 of 3</span>
              <h3 className="text-xl font-bold text-white mt-2">
                How much time can you commit?
              </h3>
            </div>
            {renderOptions(timeOptions, 'time')}
          </div>
        )}

        {step === 'result' && recommendedCourse && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Perfect Match Found!
            </h3>
            <p className="text-navy-400 mb-6">
              Based on your answers, we recommend:
            </p>
            
            <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 mb-6 text-left">
              <div className="flex items-start gap-4">
                {recommendedCourse.metadata?.thumbnail ? (
                  <img
                    src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                    alt={recommendedCourse.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-16 bg-navy-700 rounded-lg flex items-center justify-center text-2xl">
                    📚
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {recommendedCourse.title}
                  </h4>
                  <p className="text-sm text-navy-400 line-clamp-2">
                    {recommendedCourse.metadata?.tagline}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                    {recommendedCourse.metadata?.difficulty && (
                      <span className="capitalize">
                        {recommendedCourse.metadata.difficulty.value}
                      </span>
                    )}
                    {recommendedCourse.metadata?.estimated_hours && (
                      <span>{recommendedCourse.metadata.estimated_hours}h</span>
                    )}
                    {recommendedCourse.metadata?.is_free && (
                      <span className="text-primary-400">Free</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/courses/${recommendedCourse.slug}`}
                className="btn-primary"
              >
                View Course
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={resetQuiz}
                className="btn-secondary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {step !== 'welcome' && step !== 'result' && (
          <div className="mt-8 flex justify-center gap-2">
            {['experience', 'interest', 'time'].map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  ['experience', 'interest', 'time'].indexOf(step) >= i
                    ? 'bg-primary-500'
                    : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}