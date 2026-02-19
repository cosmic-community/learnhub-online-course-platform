'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathGeneratorProps {
  courses: Course[]
  categories: Category[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | null
type Goal = 'career' | 'hobby' | 'upskill' | null

export default function LearningPathGenerator({ courses, categories }: LearningPathGeneratorProps) {
  const [step, setStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(null)
  const [goal, setGoal] = useState<Goal>(null)
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('learning-path-generator')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const generateRecommendations = () => {
    let filtered = [...courses]

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(course => 
        course.metadata?.categories?.some(cat => cat.slug === selectedCategory)
      )
    }

    // Filter by skill level
    if (skillLevel) {
      const levelPriority: Record<string, number> = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3
      }
      
      filtered = filtered.filter(course => {
        const courseDifficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
        const courseLevel = levelPriority[courseDifficulty] || 1
        const userLevel = levelPriority[skillLevel] || 1
        
        // Show courses at or slightly above user's level
        return Math.abs(courseLevel - userLevel) <= 1
      })
    }

    // Sort by relevance (free courses first for beginners, then by rating/popularity)
    filtered.sort((a, b) => {
      if (skillLevel === 'beginner') {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
      }
      return 0
    })

    setRecommendations(filtered.slice(0, 3))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
    if (step === 2) {
      generateRecommendations()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const resetGenerator = () => {
    setStep(0)
    setSelectedCategory(null)
    setSkillLevel(null)
    setGoal(null)
    setRecommendations([])
  }

  const canProceed = () => {
    switch (step) {
      case 0: return selectedCategory !== null
      case 1: return skillLevel !== null
      case 2: return goal !== null
      default: return false
    }
  }

  return (
    <section 
      id="learning-path-generator" 
      className={`py-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
            <span>✨</span> Personalized for you
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Find Your Learning Path</h2>
          <p className="text-navy-400">Answer a few questions and we&apos;ll recommend the perfect courses for you</p>
        </div>

        <div className="card p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-navy-400">Step {step + 1} of 4</span>
              <span className="text-sm text-primary-400">{Math.round((step / 3) * 100)}% complete</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 0: Category Selection */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-6">What would you like to learn?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedCategory === category.slug
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{category.metadata?.icon || '📚'}</span>
                    <span className="font-medium text-white block">{category.metadata?.name || category.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Skill Level */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-6">What&apos;s your current skill level?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { level: 'beginner' as SkillLevel, icon: '🌱', title: 'Beginner', desc: 'Just getting started' },
                  { level: 'intermediate' as SkillLevel, icon: '🌿', title: 'Intermediate', desc: 'Have some experience' },
                  { level: 'advanced' as SkillLevel, icon: '🌳', title: 'Advanced', desc: 'Looking to master' },
                ].map((option) => (
                  <button
                    key={option.level}
                    onClick={() => setSkillLevel(option.level)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      skillLevel === option.level
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                    }`}
                  >
                    <span className="text-3xl mb-3 block">{option.icon}</span>
                    <span className="font-medium text-white block text-lg">{option.title}</span>
                    <span className="text-sm text-navy-400">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Learning Goal */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-6">What&apos;s your learning goal?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { goal: 'career' as Goal, icon: '💼', title: 'Career Change', desc: 'Start a new career path' },
                  { goal: 'upskill' as Goal, icon: '📈', title: 'Upskill', desc: 'Advance in current role' },
                  { goal: 'hobby' as Goal, icon: '🎨', title: 'Personal Interest', desc: 'Learn for fun' },
                ].map((option) => (
                  <button
                    key={option.goal}
                    onClick={() => setGoal(option.goal)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      goal === option.goal
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                    }`}
                  >
                    <span className="text-3xl mb-3 block">{option.icon}</span>
                    <span className="font-medium text-white block text-lg">{option.title}</span>
                    <span className="text-sm text-navy-400">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Personalized Learning Path</h3>
                <p className="text-navy-400">Based on your answers, here are our top recommendations</p>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((course, index) => (
                    <Link 
                      key={course.id} 
                      href={`/courses/${course.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 transition-all group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {course.title}
                        </h4>
                        <p className="text-sm text-navy-400 truncate">{course.metadata?.tagline}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <span className={`badge ${
                          course.metadata?.difficulty?.value === 'Beginner' ? 'badge-beginner' :
                          course.metadata?.difficulty?.value === 'Intermediate' ? 'badge-intermediate' :
                          'badge-advanced'
                        }`}>
                          {course.metadata?.difficulty?.value || 'Beginner'}
                        </span>
                        <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-navy-400">No courses found matching your criteria. Try adjusting your preferences.</p>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Link href="/courses" className="text-primary-400 hover:text-primary-300 font-medium">
                  View all courses →
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-800">
            <button
              onClick={step === 3 ? resetGenerator : handleBack}
              className={`px-4 py-2 text-navy-400 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              {step === 3 ? '← Start Over' : '← Back'}
            </button>
            
            {step < 3 && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`btn-primary ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {step === 2 ? 'Get Recommendations' : 'Continue'} →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}