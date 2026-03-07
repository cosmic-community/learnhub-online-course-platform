'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

type Step = 'welcome' | 'experience' | 'goal' | 'time' | 'results'
type Experience = 'beginner' | 'intermediate' | 'advanced'
type Goal = 'career' | 'hobby' | 'skills' | 'certification'
type TimeCommitment = 'light' | 'moderate' | 'intensive'

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [experience, setExperience] = useState<Experience | null>(null)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const animateTransition = (nextStep: Step) => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(nextStep)
      setIsAnimating(false)
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    let filtered = [...courses]
    
    // Filter by experience level
    if (experience) {
      const difficultyMap: Record<Experience, string[]> = {
        beginner: ['beginner', 'Beginner'],
        intermediate: ['intermediate', 'Intermediate'],
        advanced: ['advanced', 'Advanced', 'intermediate', 'Intermediate']
      }
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty
        if (!difficulty) return true
        const diffValue = typeof difficulty === 'object' ? difficulty.value : difficulty
        return difficultyMap[experience].some(d => 
          diffValue?.toLowerCase().includes(d.toLowerCase())
        )
      })
    }

    // Filter by time commitment (estimated hours)
    if (timeCommitment) {
      filtered = filtered.filter(course => {
        const hours = course.metadata?.estimated_hours || 5
        if (timeCommitment === 'light') return hours <= 4
        if (timeCommitment === 'moderate') return hours <= 8
        return true // intensive can handle any
      })
    }

    // Prioritize free courses for hobby learners
    if (goal === 'hobby') {
      filtered.sort((a, b) => {
        const aFree = a.metadata?.is_free ? 1 : 0
        const bFree = b.metadata?.is_free ? 1 : 0
        return bFree - aFree
      })
    }

    return filtered.slice(0, 3)
  }

  const getMotivationalMessage = () => {
    if (!goal || !experience) return ''
    
    const messages: Record<string, string> = {
      'career-beginner': "🚀 Starting a new career path is exciting! These courses will give you a solid foundation.",
      'career-intermediate': "📈 Ready to level up? These courses will help you stand out in your field.",
      'career-advanced': "🎯 You're almost there! Master these skills to reach expert level.",
      'hobby-beginner': "✨ Learning for fun? These beginner-friendly courses are perfect for exploration!",
      'hobby-intermediate': "🎨 Great choice! Dive deeper into your passion with these courses.",
      'hobby-advanced': "🏆 Impressive dedication! Take your hobby to professional levels.",
      'skills-beginner': "🔧 Building new skills? Start here and grow step by step.",
      'skills-intermediate': "💪 Let's strengthen those skills! Here's your next challenge.",
      'skills-advanced': "⚡ Ready for advanced techniques? These courses will push your limits.",
      'certification-beginner': "📜 Certification starts with strong fundamentals. Let's build them!",
      'certification-intermediate': "🎓 Great progress! These courses align with certification requirements.",
      'certification-advanced': "🏅 Almost certified! Polish your expertise with these advanced courses."
    }
    
    return messages[`${goal}-${experience}`] || "🎉 Great choices! Here are your personalized recommendations."
  }

  const resetQuiz = () => {
    setExperience(null)
    setGoal(null)
    setTimeCommitment(null)
    animateTransition('welcome')
  }

  return (
    <div className="card p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-600/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className={`relative z-10 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-3">Find Your Perfect Learning Path</h3>
            <p className="text-navy-300 mb-6 max-w-md mx-auto">
              Answer 3 quick questions and we'll recommend the best courses for your goals and experience level.
            </p>
            <button
              onClick={() => animateTransition('experience')}
              className="btn-primary text-lg group"
            >
              Start Quiz
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

        {/* Experience Step */}
        {step === 'experience' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-sm text-primary-400 font-medium">Step 1 of 3</span>
              <h3 className="text-xl font-bold text-white mt-1">What's your experience level?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'beginner' as Experience, icon: '🌱', label: 'Beginner', desc: 'Just starting out' },
                { value: 'intermediate' as Experience, icon: '🌿', label: 'Intermediate', desc: 'Some experience' },
                { value: 'advanced' as Experience, icon: '🌳', label: 'Advanced', desc: 'Quite experienced' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setExperience(option.value)
                    animateTransition('goal')
                  }}
                  className="p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.icon}</div>
                  <div className="font-semibold text-white">{option.label}</div>
                  <div className="text-sm text-navy-400">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goal Step */}
        {step === 'goal' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-sm text-primary-400 font-medium">Step 2 of 3</span>
              <h3 className="text-xl font-bold text-white mt-1">What's your main goal?</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'career' as Goal, icon: '💼', label: 'Career Growth', desc: 'Land a new job or promotion' },
                { value: 'skills' as Goal, icon: '🛠️', label: 'Build Skills', desc: 'Learn practical abilities' },
                { value: 'hobby' as Goal, icon: '🎨', label: 'Personal Interest', desc: 'Learn for fun' },
                { value: 'certification' as Goal, icon: '📜', label: 'Get Certified', desc: 'Earn credentials' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setGoal(option.value)
                    animateTransition('time')
                  }}
                  className="p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-left group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{option.icon}</div>
                  <div className="font-semibold text-white">{option.label}</div>
                  <div className="text-sm text-navy-400">{option.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => animateTransition('experience')} className="mt-4 text-navy-400 hover:text-white text-sm">
              ← Back
            </button>
          </div>
        )}

        {/* Time Commitment Step */}
        {step === 'time' && (
          <div>
            <div className="text-center mb-6">
              <span className="text-sm text-primary-400 font-medium">Step 3 of 3</span>
              <h3 className="text-xl font-bold text-white mt-1">How much time can you commit?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'light' as TimeCommitment, icon: '⏱️', label: 'Light', desc: '1-2 hours/week' },
                { value: 'moderate' as TimeCommitment, icon: '⏰', label: 'Moderate', desc: '3-5 hours/week' },
                { value: 'intensive' as TimeCommitment, icon: '🔥', label: 'Intensive', desc: '6+ hours/week' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTimeCommitment(option.value)
                    animateTransition('results')
                  }}
                  className="p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.icon}</div>
                  <div className="font-semibold text-white">{option.label}</div>
                  <div className="text-sm text-navy-400">{option.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => animateTransition('goal')} className="mt-4 text-navy-400 hover:text-white text-sm">
              ← Back
            </button>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold text-white">Your Personalized Recommendations</h3>
              <p className="text-navy-300 text-sm mt-2 max-w-lg mx-auto">
                {getMotivationalMessage()}
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              {getRecommendedCourses().map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-4 p-4 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                    {index + 1}
                  </div>
                  {course.metadata?.thumbnail?.imgix_url && (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                      {course.metadata?.title || course.title}
                    </div>
                    <div className="text-sm text-navy-400 truncate">
                      {course.metadata?.tagline || 'Start learning today'}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-navy-500 group-hover:text-primary-400 transition-colors">
                    →
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/courses" className="btn-primary">
                Browse All Courses
              </Link>
              <button onClick={resetQuiz} className="btn-secondary">
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {step !== 'welcome' && step !== 'results' && (
        <div className="flex justify-center gap-2 mt-6">
          {['experience', 'goal', 'time'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                ['experience', 'goal', 'time'].indexOf(step) >= i
                  ? 'bg-primary-500'
                  : 'bg-navy-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}