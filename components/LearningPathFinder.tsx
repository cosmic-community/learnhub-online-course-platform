'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathFinderProps {
  courses: Course[]
  categories: Category[]
}

type Step = 'interest' | 'experience' | 'goal' | 'results'
type Experience = 'beginner' | 'intermediate' | 'advanced'
type Goal = 'career' | 'hobby' | 'specific'

export default function LearningPathFinder({ courses, categories }: LearningPathFinderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('interest')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [experience, setExperience] = useState<Experience | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Calculate recommendations when all selections are made
  useEffect(() => {
    if (currentStep === 'results' && selectedInterests.length > 0 && experience) {
      const filtered = courses.filter(course => {
        // Filter by category interest
        const courseCategories = course.metadata?.categories || []
        const matchesInterest = courseCategories.some(cat => 
          selectedInterests.includes(cat.id)
        )
        
        // Filter by difficulty level
        const difficulty = course.metadata?.difficulty?.key || course.metadata?.difficulty?.value?.toLowerCase()
        const matchesDifficulty = difficulty === experience || 
          (experience === 'beginner' && !difficulty) ||
          (experience === 'intermediate' && (difficulty === 'beginner' || difficulty === 'intermediate')) ||
          (experience === 'advanced')

        return matchesInterest || matchesDifficulty
      })

      // Sort by relevance (free courses first for beginners, price for others)
      const sorted = filtered.sort((a, b) => {
        if (experience === 'beginner') {
          if (a.metadata?.is_free && !b.metadata?.is_free) return -1
          if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        }
        return 0
      })

      setRecommendedCourses(sorted.slice(0, 3))
    }
  }, [currentStep, selectedInterests, experience, courses])

  const toggleInterest = (categoryId: string) => {
    setSelectedInterests(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const nextStep = () => {
    setIsAnimating(true)
    setTimeout(() => {
      if (currentStep === 'interest') setCurrentStep('experience')
      else if (currentStep === 'experience') setCurrentStep('goal')
      else if (currentStep === 'goal') setCurrentStep('results')
      setIsAnimating(false)
    }, 300)
  }

  const prevStep = () => {
    setIsAnimating(true)
    setTimeout(() => {
      if (currentStep === 'experience') setCurrentStep('interest')
      else if (currentStep === 'goal') setCurrentStep('experience')
      else if (currentStep === 'results') setCurrentStep('goal')
      setIsAnimating(false)
    }, 300)
  }

  const reset = () => {
    setCurrentStep('interest')
    setSelectedInterests([])
    setExperience(null)
    setGoal(null)
    setRecommendedCourses([])
  }

  const getProgressWidth = () => {
    switch (currentStep) {
      case 'interest': return '25%'
      case 'experience': return '50%'
      case 'goal': return '75%'
      case 'results': return '100%'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-3">
          <span className="text-2xl animate-bounce">🎯</span>
          Find Your Learning Path
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-navy-900 rounded-2xl border border-navy-700 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => { setIsOpen(false); reset(); }}
          className="absolute top-4 right-4 z-10 p-2 text-navy-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-navy-800">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
            style={{ width: getProgressWidth() }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentStep === 'interest' && '🎨 What interests you?'}
            {currentStep === 'experience' && '📊 Your experience level?'}
            {currentStep === 'goal' && '🎯 What\'s your goal?'}
            {currentStep === 'results' && '✨ Your Personalized Path'}
          </h2>
          <p className="text-navy-400">
            {currentStep === 'interest' && 'Select all topics that excite you'}
            {currentStep === 'experience' && 'Help us find the right difficulty level'}
            {currentStep === 'goal' && 'Tell us what you want to achieve'}
            {currentStep === 'results' && 'Based on your preferences, we recommend:'}
          </p>
        </div>

        {/* Content */}
        <div className={`p-6 pt-0 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {/* Step 1: Interests */}
          {currentStep === 'interest' && (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleInterest(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedInterests.includes(category.id)
                      ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                      : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{category.metadata?.icon || '📚'}</span>
                  <span className="font-medium text-white block">{category.metadata?.name || category.title}</span>
                  {selectedInterests.includes(category.id) && (
                    <span className="text-primary-400 text-sm mt-1 block">✓ Selected</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 'experience' && (
            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Just starting out, new to most topics' },
                { value: 'intermediate', label: 'Intermediate', emoji: '🌿', desc: 'Some experience, looking to grow' },
                { value: 'advanced', label: 'Advanced', emoji: '🌳', desc: 'Experienced, seeking mastery' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setExperience(option.value as Experience)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
                    experience === option.value
                      ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
                      : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <span className="font-medium text-white block">{option.label}</span>
                    <span className="text-navy-400 text-sm">{option.desc}</span>
                  </div>
                  {experience === option.value && (
                    <span className="ml-auto text-primary-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Goal */}
          {currentStep === 'goal' && (
            <div className="space-y-3">
              {[
                { value: 'career', label: 'Career Growth', emoji: '🚀', desc: 'Advance my professional skills' },
                { value: 'hobby', label: 'Personal Interest', emoji: '💡', desc: 'Learn for fun and curiosity' },
                { value: 'specific', label: 'Specific Project', emoji: '🎯', desc: 'Build something specific' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGoal(option.value as Goal)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${
                    goal === option.value
                      ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
                      : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <div>
                    <span className="font-medium text-white block">{option.label}</span>
                    <span className="text-navy-400 text-sm">{option.desc}</span>
                  </div>
                  {goal === option.value && (
                    <span className="ml-auto text-primary-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 'results' && (
            <div className="space-y-4">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 rounded-xl border border-navy-700 bg-navy-800/50 hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      {course.metadata?.thumbnail ? (
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=160&h=90&fit=crop&auto=format,compress`}
                          alt={course.title}
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📚</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                          {course.title}
                        </h3>
                        <p className="text-sm text-navy-400 truncate">{course.metadata?.tagline}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-navy-500">
                          <span>{course.metadata?.lessons?.length || 0} lessons</span>
                          {course.metadata?.is_free ? (
                            <span className="text-primary-400 font-medium">Free</span>
                          ) : (
                            <span>${course.metadata?.price || 0}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-primary-500 group-hover:translate-x-1 transition-transform self-center">
                        →
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p className="text-navy-400">No exact matches found, but explore all our courses!</p>
                  <Link
                    href="/courses"
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-4 btn-primary"
                  >
                    Browse All Courses
                  </Link>
                </div>
              )}
              
              {recommendedCourses.length > 0 && (
                <div className="text-center pt-2">
                  <Link
                    href="/courses"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-400 hover:text-primary-300 text-sm underline"
                  >
                    View all courses →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          {currentStep !== 'interest' && currentStep !== 'results' ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 text-navy-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}
          
          {currentStep !== 'results' && (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 'interest' && selectedInterests.length === 0) ||
                (currentStep === 'experience' && !experience) ||
                (currentStep === 'goal' && !goal)
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 'goal' ? 'See My Path' : 'Continue'}
              <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {currentStep === 'results' && (
            <button
              onClick={reset}
              className="btn-secondary"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  )
}