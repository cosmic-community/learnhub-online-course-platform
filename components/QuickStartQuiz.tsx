'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickStartQuizProps {
  courses: Course[]
  categories: Category[]
}

type Step = 'experience' | 'interest' | 'time' | 'result'
type Experience = 'beginner' | 'intermediate' | 'advanced' | null
type TimeCommitment = 'casual' | 'dedicated' | 'intensive' | null

export default function QuickStartQuiz({ courses, categories }: QuickStartQuizProps) {
  const [step, setStep] = useState<Step>('experience')
  const [experience, setExperience] = useState<Experience>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>(null)
  const [isOpen, setIsOpen] = useState(false)

  const getRecommendedCourses = () => {
    let filtered = [...courses]
    
    // Filter by experience level
    if (experience) {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty?.value?.toLowerCase() || 
                          c.metadata?.difficulty?.key?.toLowerCase() || 
                          'beginner'
        return difficulty === experience
      })
    }
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: { slug: string }) => cat.slug === selectedCategory)
      )
    }
    
    // Filter by time commitment
    if (timeCommitment) {
      const hours = {
        casual: [0, 3],
        dedicated: [3, 6],
        intensive: [6, 100]
      }[timeCommitment]
      
      filtered = filtered.filter(c => {
        const courseHours = c.metadata?.estimated_hours || 0
        return courseHours >= hours[0] && courseHours <= hours[1]
      })
    }
    
    // If no matches, return top courses by experience level only
    if (filtered.length === 0 && experience) {
      filtered = courses.filter(c => {
        const difficulty = c.metadata?.difficulty?.value?.toLowerCase() || 
                          c.metadata?.difficulty?.key?.toLowerCase() || 
                          'beginner'
        return difficulty === experience
      })
    }
    
    // Still no matches? Return first 3 courses
    if (filtered.length === 0) {
      filtered = courses.slice(0, 3)
    }
    
    return filtered.slice(0, 3)
  }

  const resetQuiz = () => {
    setStep('experience')
    setExperience(null)
    setSelectedCategory(null)
    setTimeCommitment(null)
  }

  const experienceOptions = [
    { value: 'beginner' as const, label: 'Beginner', emoji: '🌱', desc: 'Just starting my journey' },
    { value: 'intermediate' as const, label: 'Intermediate', emoji: '🌿', desc: 'Know the basics, want more' },
    { value: 'advanced' as const, label: 'Advanced', emoji: '🌳', desc: 'Looking to master skills' },
  ]

  const timeOptions = [
    { value: 'casual' as const, label: 'Casual', emoji: '☕', desc: '1-3 hours/week' },
    { value: 'dedicated' as const, label: 'Dedicated', emoji: '📚', desc: '3-6 hours/week' },
    { value: 'intensive' as const, label: 'Intensive', emoji: '🔥', desc: '6+ hours/week' },
  ]

  const recommendedCourses = getRecommendedCourses()

  return (
    <section id="quiz" className="py-20 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">🎯</span>
          <h2 className="text-3xl font-bold text-white mb-4">Find Your Perfect Course</h2>
          <p className="text-navy-400 text-lg">
            Answer a few questions and we&apos;ll recommend the best courses for you
          </p>
        </div>

        {!isOpen ? (
          <div className="text-center">
            <button
              onClick={() => setIsOpen(true)}
              className="btn-primary text-lg group"
            >
              <span>Start Quick Quiz</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-navy-500 text-sm mt-4">Takes less than 30 seconds</p>
          </div>
        ) : (
          <div className="card p-8">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-navy-400 mb-2">
                <span>Progress</span>
                <span>
                  {step === 'experience' && '1/3'}
                  {step === 'interest' && '2/3'}
                  {step === 'time' && '3/3'}
                  {step === 'result' && 'Complete!'}
                </span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 rounded-full"
                  style={{ 
                    width: step === 'experience' ? '33%' : 
                           step === 'interest' ? '66%' : 
                           step === 'time' ? '90%' : '100%' 
                  }}
                />
              </div>
            </div>

            {/* Step 1: Experience */}
            {step === 'experience' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-white mb-6">What&apos;s your experience level?</h3>
                <div className="grid gap-4">
                  {experienceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setExperience(option.value)
                        setStep('interest')
                      }}
                      className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                        experience === option.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{option.emoji}</span>
                        <div>
                          <div className="font-medium text-white">{option.label}</div>
                          <div className="text-sm text-navy-400">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interest */}
            {step === 'interest' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-white mb-6">What interests you most?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.slug)
                        setStep('time')
                      }}
                      className={`p-4 rounded-xl border text-center transition-all hover:scale-[1.02] ${
                        selectedCategory === category.slug
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{category.metadata?.icon || '📂'}</span>
                      <span className="text-white font-medium">{category.metadata?.name || category.title}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setStep('time')
                    }}
                    className="p-4 rounded-xl border border-navy-700 bg-navy-800/50 hover:border-navy-600 text-center transition-all hover:scale-[1.02]"
                  >
                    <span className="text-3xl block mb-2">🌟</span>
                    <span className="text-white font-medium">Show me all!</span>
                  </button>
                </div>
                <button
                  onClick={() => setStep('experience')}
                  className="mt-6 text-navy-400 hover:text-white transition-colors text-sm"
                >
                  ← Go back
                </button>
              </div>
            )}

            {/* Step 3: Time */}
            {step === 'time' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-white mb-6">How much time can you commit?</h3>
                <div className="grid gap-4">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeCommitment(option.value)
                        setStep('result')
                      }}
                      className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                        timeCommitment === option.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{option.emoji}</span>
                        <div>
                          <div className="font-medium text-white">{option.label}</div>
                          <div className="text-sm text-navy-400">{option.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep('interest')}
                  className="mt-6 text-navy-400 hover:text-white transition-colors text-sm"
                >
                  ← Go back
                </button>
              </div>
            )}

            {/* Results */}
            {step === 'result' && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <span className="text-5xl block mb-4">🎉</span>
                  <h3 className="text-2xl font-bold text-white mb-2">Perfect Match Found!</h3>
                  <p className="text-navy-400">Based on your answers, we recommend these courses:</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block p-4 rounded-xl border border-navy-700 bg-navy-800/50 hover:border-primary-500/50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 font-bold text-lg">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {course.metadata?.title || course.title}
                          </div>
                          <div className="text-sm text-navy-400">
                            {course.metadata?.estimated_hours || 0} hours • {course.metadata?.difficulty?.value || 'Beginner'}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
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
        )}
      </div>
    </section>
  )
}