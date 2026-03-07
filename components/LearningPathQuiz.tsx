'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'start' | 'experience' | 'goal' | 'time' | 'results'
type Experience = 'beginner' | 'intermediate' | 'advanced' | null
type Goal = 'career' | 'hobby' | 'upskill' | 'specific' | null
type TimeCommitment = 'minimal' | 'moderate' | 'dedicated' | null

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [step, setStep] = useState<QuizStep>('start')
  const [experience, setExperience] = useState<Experience>(null)
  const [goal, setGoal] = useState<Goal>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const resetQuiz = () => {
    setStep('start')
    setExperience(null)
    setGoal(null)
    setTimeCommitment(null)
    setSelectedCategory(null)
  }

  const getRecommendedCourses = (): Course[] => {
    let filtered = [...courses]

    // Filter by difficulty based on experience
    if (experience) {
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
        if (experience === 'beginner') return difficulty === 'beginner'
        if (experience === 'intermediate') return difficulty === 'beginner' || difficulty === 'intermediate'
        return true // Advanced can see all
      })
    }

    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(course => {
        const courseCategories = course.metadata?.categories || []
        return courseCategories.some((cat: Category) => cat.slug === selectedCategory)
      })
    }

    // Sort by time commitment preference
    if (timeCommitment === 'minimal') {
      filtered.sort((a, b) => (a.metadata?.estimated_hours || 0) - (b.metadata?.estimated_hours || 0))
    } else if (timeCommitment === 'dedicated') {
      filtered.sort((a, b) => (b.metadata?.estimated_hours || 0) - (a.metadata?.estimated_hours || 0))
    }

    // Prioritize free courses for hobby learners
    if (goal === 'hobby') {
      filtered.sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return 0
      })
    }

    return filtered.slice(0, 3)
  }

  const getPersonalizedMessage = (): string => {
    const messages: Record<string, string> = {
      'beginner-career': "Perfect choices for launching your tech career! These courses build a solid foundation.",
      'beginner-hobby': "Great picks for exploring tech as a hobby! Start with the fundamentals and have fun.",
      'beginner-upskill': "Excellent starting points for adding new skills to your toolkit.",
      'intermediate-career': "Level up your career with these intermediate courses that employers love.",
      'intermediate-hobby': "Deepen your knowledge with these engaging intermediate-level courses.",
      'intermediate-upskill': "Perfect for professionals looking to expand their expertise.",
      'advanced-career': "Master-level courses to become an industry expert.",
      'advanced-hobby': "Challenge yourself with these advanced topics.",
      'advanced-upskill': "Cutting-edge courses for experienced professionals.",
    }
    
    const key = `${experience}-${goal}`
    return messages[key] || "Here are our top recommendations based on your preferences!"
  }

  const progressWidth = () => {
    switch (step) {
      case 'start': return '0%'
      case 'experience': return '25%'
      case 'goal': return '50%'
      case 'time': return '75%'
      case 'results': return '100%'
      default: return '0%'
    }
  }

  if (step === 'start') {
    return (
      <div className="card p-8 text-center">
        <div className="text-6xl mb-6 animate-bounce-slow">🧭</div>
        <h3 className="text-2xl font-bold text-white mb-4">Not sure where to start?</h3>
        <p className="text-navy-300 mb-8 max-w-md mx-auto">
          Take our 30-second quiz and get personalized course recommendations based on your experience and goals.
        </p>
        <button
          onClick={() => setStep('experience')}
          className="btn-primary text-lg group"
        >
          Start Quiz
          <svg className="w-5 h-5 ml-2 inline-block transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    )
  }

  if (step === 'results') {
    const recommendedCourses = getRecommendedCourses()
    
    return (
      <div className="card p-8">
        {/* Progress bar */}
        <div className="w-full bg-navy-800 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
            style={{ width: progressWidth() }}
          />
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Your Personalized Recommendations</h3>
          <p className="text-navy-300">{getPersonalizedMessage()}</p>
        </div>

        {recommendedCourses.length > 0 ? (
          <div className="space-y-4 mb-8">
            {recommendedCourses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="block p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {course.metadata?.title || course.title}
                    </h4>
                    <p className="text-sm text-navy-400 line-clamp-1 mt-1">
                      {course.metadata?.tagline}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`badge ${
                        course.metadata?.difficulty?.value?.toLowerCase() === 'beginner' ? 'badge-beginner' :
                        course.metadata?.difficulty?.value?.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                        'badge-advanced'
                      }`}>
                        {course.metadata?.difficulty?.value || 'Beginner'}
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
                  <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <p className="text-navy-400">No courses match your criteria yet. Check back soon!</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={resetQuiz} className="btn-secondary">
            Retake Quiz
          </button>
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-8">
      {/* Progress bar */}
      <div className="w-full bg-navy-800 rounded-full h-2 mb-8">
        <div 
          className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
          style={{ width: progressWidth() }}
        />
      </div>

      {step === 'experience' && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-2 text-center">What&apos;s your experience level?</h3>
          <p className="text-navy-400 text-center mb-8">This helps us recommend the right difficulty</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 'beginner' as const, emoji: '🌱', label: 'Beginner', desc: 'New to coding' },
              { value: 'intermediate' as const, emoji: '🌿', label: 'Intermediate', desc: 'Some experience' },
              { value: 'advanced' as const, emoji: '🌳', label: 'Advanced', desc: 'Very experienced' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setExperience(option.value)
                  setStep('goal')
                }}
                className="p-6 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{option.emoji}</div>
                <div className="font-semibold text-white">{option.label}</div>
                <div className="text-sm text-navy-400">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'goal' && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-2 text-center">What&apos;s your main goal?</h3>
          <p className="text-navy-400 text-center mb-8">We&apos;ll tailor recommendations to your objectives</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { value: 'career' as const, emoji: '💼', label: 'Career Change', desc: 'Land a tech job' },
              { value: 'upskill' as const, emoji: '📈', label: 'Upskill', desc: 'Advance current career' },
              { value: 'hobby' as const, emoji: '🎨', label: 'Hobby', desc: 'Learn for fun' },
              { value: 'specific' as const, emoji: '🎯', label: 'Specific Project', desc: 'Build something' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setGoal(option.value)
                  setStep('time')
                }}
                className="p-6 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all text-left group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{option.emoji}</div>
                <div className="font-semibold text-white">{option.label}</div>
                <div className="text-sm text-navy-400">{option.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('experience')}
            className="mt-6 text-navy-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {step === 'time' && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-2 text-center">How much time can you dedicate?</h3>
          <p className="text-navy-400 text-center mb-8">Weekly learning commitment</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 'minimal' as const, emoji: '⏰', label: '1-3 hours', desc: 'Casual pace' },
              { value: 'moderate' as const, emoji: '📚', label: '4-10 hours', desc: 'Steady progress' },
              { value: 'dedicated' as const, emoji: '🔥', label: '10+ hours', desc: 'Fast track' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTimeCommitment(option.value)
                  setStep('results')
                }}
                className="p-6 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{option.emoji}</div>
                <div className="font-semibold text-white">{option.label}</div>
                <div className="text-sm text-navy-400">{option.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('goal')}
            className="mt-6 text-navy-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}
    </div>
  )
}