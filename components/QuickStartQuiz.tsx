'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickStartQuizProps {
  courses: Course[]
  categories: Category[]
}

type QuizStep = 'experience' | 'goal' | 'time' | 'result'
type Experience = 'beginner' | 'intermediate' | 'advanced' | null
type Goal = 'career' | 'hobby' | 'specific' | null
type TimeCommitment = 'low' | 'medium' | 'high' | null

export default function QuickStartQuiz({ courses, categories }: QuickStartQuizProps) {
  const [step, setStep] = useState<QuizStep>('experience')
  const [experience, setExperience] = useState<Experience>(null)
  const [goal, setGoal] = useState<Goal>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = (nextStep: QuizStep) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(nextStep)
      setIsAnimating(false)
    }, 200)
  }

  const getRecommendedCourses = () => {
    let filtered = [...courses]
    
    // Filter by difficulty based on experience
    if (experience === 'beginner') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value === 'Beginner' || c.metadata?.is_free
      )
    } else if (experience === 'advanced') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value === 'Advanced' || 
        c.metadata?.difficulty?.value === 'Intermediate'
      )
    }
    
    // Filter by time commitment
    if (timeCommitment === 'low') {
      filtered = filtered.filter(c => (c.metadata?.estimated_hours || 0) <= 5)
    } else if (timeCommitment === 'high') {
      filtered = filtered.filter(c => (c.metadata?.estimated_hours || 0) >= 5)
    }
    
    // Sort by relevance (free courses for beginners, higher priced for advanced)
    if (experience === 'beginner') {
      filtered.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 1 : 0
        const bFree = b.metadata?.is_free ? 1 : 0
        return bFree - aFree
      })
    }
    
    return filtered.slice(0, 3)
  }

  const resetQuiz = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep('experience')
      setExperience(null)
      setGoal(null)
      setTimeCommitment(null)
      setIsAnimating(false)
    }, 200)
  }

  const progressPercentage = 
    step === 'experience' ? 25 :
    step === 'goal' ? 50 :
    step === 'time' ? 75 : 100

  return (
    <div className="card p-8 relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-navy-800">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {step === 'experience' && (
          <div className="quiz-step">
            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block">💡</span>
              <h3 className="text-xl font-semibold text-white mb-2">What's your experience level?</h3>
              <p className="text-navy-400">This helps us find the right difficulty level</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'beginner', label: 'Beginner', icon: '🌱', desc: 'Just starting out' },
                { value: 'intermediate', label: 'Intermediate', icon: '🌿', desc: 'Some experience' },
                { value: 'advanced', label: 'Advanced', icon: '🌳', desc: 'Very experienced' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setExperience(option.value as Experience)
                    handleNext('goal')
                  }}
                  className="quiz-option group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                    {option.icon}
                  </span>
                  <span className="font-medium text-white">{option.label}</span>
                  <span className="text-sm text-navy-400">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'goal' && (
          <div className="quiz-step">
            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="text-xl font-semibold text-white mb-2">What's your learning goal?</h3>
              <p className="text-navy-400">Help us understand what you want to achieve</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'career', label: 'Career Growth', icon: '💼', desc: 'Advance professionally' },
                { value: 'hobby', label: 'Personal Interest', icon: '🎨', desc: 'Learn for fun' },
                { value: 'specific', label: 'Specific Skill', icon: '🔧', desc: 'Master one topic' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setGoal(option.value as Goal)
                    handleNext('time')
                  }}
                  className="quiz-option group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                    {option.icon}
                  </span>
                  <span className="font-medium text-white">{option.label}</span>
                  <span className="text-sm text-navy-400">{option.desc}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleNext('experience')}
              className="mt-6 text-navy-400 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 'time' && (
          <div className="quiz-step">
            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block">⏰</span>
              <h3 className="text-xl font-semibold text-white mb-2">How much time can you commit?</h3>
              <p className="text-navy-400">We'll find courses that fit your schedule</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'low', label: '1-3 hours/week', icon: '🐢', desc: 'Take it slow' },
                { value: 'medium', label: '4-7 hours/week', icon: '🚶', desc: 'Steady pace' },
                { value: 'high', label: '8+ hours/week', icon: '🏃', desc: 'Fast track' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTimeCommitment(option.value as TimeCommitment)
                    handleNext('result')
                  }}
                  className="quiz-option group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                    {option.icon}
                  </span>
                  <span className="font-medium text-white">{option.label}</span>
                  <span className="text-sm text-navy-400">{option.desc}</span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleNext('goal')}
              className="mt-6 text-navy-400 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="quiz-step">
            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block animate-bounce-slow">🎉</span>
              <h3 className="text-xl font-semibold text-white mb-2">Your Recommended Courses</h3>
              <p className="text-navy-400">Based on your preferences, here's what we suggest</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {getRecommendedCourses().map((course, index) => (
                <Link 
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="block p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-navy-700 flex items-center justify-center text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                        {course.title}
                      </h4>
                      <p className="text-sm text-navy-400 truncate">
                        {course.metadata?.tagline || 'Start learning today'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {course.metadata?.is_free ? (
                        <span className="badge badge-free">Free</span>
                      ) : (
                        <span className="text-white font-medium">${course.metadata?.price || 0}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary">
                View All Courses
              </Link>
              <button 
                onClick={resetQuiz}
                className="btn-secondary"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}