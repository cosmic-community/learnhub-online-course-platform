'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface FindYourPathProps {
  courses: Course[]
  categories: Category[]
}

type Step = 'intro' | 'experience' | 'goal' | 'time' | 'results'
type Experience = 'beginner' | 'intermediate' | 'advanced'
type Goal = 'career' | 'hobby' | 'skill'
type TimeCommitment = 'casual' | 'moderate' | 'intensive'

export default function FindYourPath({ courses, categories }: FindYourPathProps) {
  const [step, setStep] = useState<Step>('intro')
  const [experience, setExperience] = useState<Experience | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const getRecommendedCourses = (): Course[] => {
    let filtered = [...courses]

    // Filter by difficulty based on experience
    if (experience === 'beginner') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'beginner'
      )
    } else if (experience === 'advanced') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'advanced' ||
        c.metadata?.difficulty?.value?.toLowerCase() === 'intermediate'
      )
    }

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(c => 
        c.metadata?.categories?.some((cat: Category) => cat.slug === selectedCategory)
      )
    }

    // Filter by time commitment (estimated hours)
    if (timeCommitment === 'casual') {
      filtered = filtered.filter(c => (c.metadata?.estimated_hours || 0) <= 4)
    } else if (timeCommitment === 'intensive') {
      filtered = filtered.filter(c => (c.metadata?.estimated_hours || 0) >= 5)
    }

    // Sort by relevance (free courses first for beginners, premium for career-focused)
    if (goal === 'career') {
      filtered.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 1 : 0
        const bFree = b.metadata?.is_free ? 1 : 0
        return aFree - bFree // Premium courses first for career
      })
    } else {
      filtered.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 0 : 1
        const bFree = b.metadata?.is_free ? 0 : 1
        return aFree - bFree // Free courses first for hobby/skill
      })
    }

    return filtered.slice(0, 3)
  }

  const resetQuiz = () => {
    setStep('intro')
    setExperience(null)
    setGoal(null)
    setTimeCommitment(null)
    setSelectedCategory(null)
  }

  const progressWidth = () => {
    switch (step) {
      case 'intro': return '0%'
      case 'experience': return '25%'
      case 'goal': return '50%'
      case 'time': return '75%'
      case 'results': return '100%'
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-4">
          <span className="text-xl">🎯</span>
          <span className="text-primary-400 text-sm font-medium">Personalized Recommendations</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Find Your Learning Path</h2>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Answer a few quick questions and we&apos;ll recommend the perfect courses for you
        </p>
      </div>

      {/* Progress Bar */}
      {step !== 'intro' && (
        <div className="max-w-md mx-auto mb-8">
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
              style={{ width: progressWidth() }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-navy-500">
            <span>Start</span>
            <span>Finish</span>
          </div>
        </div>
      )}

      {/* Quiz Container */}
      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="text-center animate-fade-in">
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Let&apos;s find your perfect course!
              </h3>
              <p className="text-navy-300 mb-8">
                Take our 30-second quiz to get personalized course recommendations 
                based on your experience, goals, and available time.
              </p>
              <button
                onClick={() => setStep('experience')}
                className="btn-primary text-lg group"
              >
                Start Quiz
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Experience Step */}
          {step === 'experience' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                What&apos;s your experience level?
              </h3>
              <p className="text-navy-400 text-center mb-6">
                We&apos;ll recommend courses that match your skill level
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'New to programming or this topic' },
                  { value: 'intermediate', emoji: '🌿', label: 'Intermediate', desc: 'Some experience, looking to grow' },
                  { value: 'advanced', emoji: '🌳', label: 'Advanced', desc: 'Experienced, seeking mastery' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setExperience(option.value as Experience)
                      setStep('goal')
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary-500 hover:bg-primary-500/5 ${
                      experience === option.value 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-navy-700 bg-navy-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="text-sm text-navy-400">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goal Step */}
          {step === 'goal' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                What&apos;s your main goal?
              </h3>
              <p className="text-navy-400 text-center mb-6">
                This helps us prioritize the right type of courses
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'career', emoji: '💼', label: 'Career Growth', desc: 'Looking to advance professionally' },
                  { value: 'hobby', emoji: '🎨', label: 'Personal Interest', desc: 'Learning for fun and curiosity' },
                  { value: 'skill', emoji: '🎯', label: 'Specific Skill', desc: 'Need to learn something specific' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setGoal(option.value as Goal)
                      setStep('time')
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary-500 hover:bg-primary-500/5 ${
                      goal === option.value 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-navy-700 bg-navy-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="text-sm text-navy-400">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('experience')}
                className="mt-4 text-navy-400 hover:text-white text-sm flex items-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          )}

          {/* Time Step */}
          {step === 'time' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                How much time can you commit?
              </h3>
              <p className="text-navy-400 text-center mb-6">
                We&apos;ll suggest courses that fit your schedule
              </p>
              <div className="grid gap-4">
                {[
                  { value: 'casual', emoji: '☕', label: 'Casual', desc: '1-2 hours per week' },
                  { value: 'moderate', emoji: '📚', label: 'Moderate', desc: '3-5 hours per week' },
                  { value: 'intensive', emoji: '🚀', label: 'Intensive', desc: '6+ hours per week' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeCommitment(option.value as TimeCommitment)
                      setStep('results')
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary-500 hover:bg-primary-500/5 ${
                      timeCommitment === option.value 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-navy-700 bg-navy-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.emoji}</span>
                      <div>
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="text-sm text-navy-400">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('goal')}
                className="mt-4 text-navy-400 hover:text-white text-sm flex items-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Perfect! Here are your recommendations
                </h3>
                <p className="text-navy-400">
                  Based on your preferences, we think you&apos;ll love these courses
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.slug 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                    }`}
                  >
                    {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                  </button>
                ))}
              </div>

              {/* Recommended Courses */}
              <div className="space-y-4">
                {getRecommendedCourses().map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="block p-4 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500 transition-all group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-navy-700 overflow-hidden flex-shrink-0">
                        {course.metadata?.thumbnail?.imgix_url ? (
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                            alt={course.metadata?.title || course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📚
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                          {course.metadata?.title || course.title}
                        </h4>
                        <p className="text-sm text-navy-400 line-clamp-1">
                          {course.metadata?.tagline || 'Explore this course'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`badge ${
                            course.metadata?.difficulty?.value?.toLowerCase() === 'beginner' 
                              ? 'badge-beginner' 
                              : course.metadata?.difficulty?.value?.toLowerCase() === 'advanced'
                                ? 'badge-advanced'
                                : 'badge-intermediate'
                          }`}>
                            {course.metadata?.difficulty?.value || 'All Levels'}
                          </span>
                          {course.metadata?.is_free && (
                            <span className="badge badge-free">Free</span>
                          )}
                          {course.metadata?.estimated_hours && (
                            <span className="text-xs text-navy-500">
                              {course.metadata.estimated_hours}h
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}

                {getRecommendedCourses().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-navy-400">
                      No exact matches found. Try adjusting your filters or
                    </p>
                    <Link href="/courses" className="text-primary-400 hover:text-primary-300">
                      browse all courses
                    </Link>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-navy-700">
                <button
                  onClick={resetQuiz}
                  className="btn-secondary flex-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake Quiz
                </button>
                <Link href="/courses" className="btn-primary flex-1 justify-center">
                  View All Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}