'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
}

type Step = 'intro' | 'experience' | 'interest' | 'goal' | 'result'

const experiences = [
  { id: 'beginner', label: 'Just Starting Out', emoji: '🌱', description: 'New to coding' },
  { id: 'intermediate', label: 'Some Experience', emoji: '🌿', description: '1-2 years coding' },
  { id: 'advanced', label: 'Experienced Dev', emoji: '🌳', description: '3+ years coding' },
]

const interests = [
  { id: 'web', label: 'Web Development', emoji: '💻', keywords: ['web', 'javascript', 'react', 'vue', 'node', 'frontend', 'backend'] },
  { id: 'cloud', label: 'Cloud & DevOps', emoji: '☁️', keywords: ['aws', 'cloud', 'devops', 'serverless', 'lambda'] },
  { id: 'mobile', label: 'Mobile Apps', emoji: '📱', keywords: ['mobile', 'ios', 'android', 'react native', 'flutter'] },
  { id: 'data', label: 'Data & AI', emoji: '🤖', keywords: ['data', 'machine learning', 'ai', 'python', 'analytics'] },
]

const goals = [
  { id: 'career', label: 'Career Growth', emoji: '🚀', description: 'Land a new job or promotion' },
  { id: 'skills', label: 'Build Skills', emoji: '🛠️', description: 'Master new technologies' },
  { id: 'projects', label: 'Build Projects', emoji: '🎨', description: 'Create something awesome' },
  { id: 'fun', label: 'Learn for Fun', emoji: '🎮', description: 'Enjoy the journey' },
]

export default function LearningPathQuiz({ courses }: LearningPathQuizProps) {
  const [step, setStep] = useState<Step>('intro')
  const [experience, setExperience] = useState<string>('')
  const [interest, setInterest] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  // Generate confetti
  useEffect(() => {
    if (step === 'result' && recommendedCourse) {
      const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#f0fdfa', '#fbbf24', '#a78bfa']
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#14b8a6',
      }))
      setConfetti(particles)
    }
  }, [step, recommendedCourse])

  const findBestCourse = () => {
    setIsRevealing(true)
    
    // Find matching courses based on selections
    let matchingCourses = [...courses]
    
    // Filter by experience/difficulty
    if (experience) {
      const difficultyMap: Record<string, string[]> = {
        beginner: ['beginner'],
        intermediate: ['beginner', 'intermediate'],
        advanced: ['intermediate', 'advanced'],
      }
      const allowedDifficulties = difficultyMap[experience] || ['beginner']
      matchingCourses = matchingCourses.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
        return allowedDifficulties.some(d => difficulty.includes(d))
      })
    }
    
    // Filter by interest keywords
    if (interest) {
      const selectedInterest = interests.find(i => i.id === interest)
      if (selectedInterest) {
        const keywordMatches = matchingCourses.map(course => {
          const searchText = `${course.title} ${course.metadata?.tagline || ''} ${course.metadata?.description || ''}`.toLowerCase()
          const matchCount = selectedInterest.keywords.filter(keyword => 
            searchText.includes(keyword.toLowerCase())
          ).length
          return { course, matchCount }
        })
        
        // Sort by match count and take top matches
        keywordMatches.sort((a, b) => b.matchCount - a.matchCount)
        if (keywordMatches[0]?.matchCount && keywordMatches[0].matchCount > 0) {
          matchingCourses = keywordMatches
            .filter(m => m.matchCount > 0)
            .map(m => m.course)
        }
      }
    }
    
    // Pick the best match (or random from top matches)
    const bestCourse = matchingCourses[Math.floor(Math.random() * Math.min(3, matchingCourses.length))] || courses[0]
    
    setTimeout(() => {
      setRecommendedCourse(bestCourse ?? null)
      setIsRevealing(false)
      setStep('result')
    }, 1500)
  }

  const resetQuiz = () => {
    setStep('intro')
    setExperience('')
    setInterest('')
    setGoal('')
    setRecommendedCourse(null)
    setConfetti([])
  }

  const handleNext = () => {
    if (step === 'experience' && experience) setStep('interest')
    else if (step === 'interest' && interest) setStep('goal')
    else if (step === 'goal' && goal) findBestCourse()
  }

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="card p-8 md:p-12 relative overflow-hidden">
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-950 pointer-events-none" />
        
        {/* Confetti */}
        {step === 'result' && confetti.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-confetti pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: '-10px',
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <div className="relative z-10">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="text-center animate-fadeIn">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Find Your Perfect Course
              </h3>
              <p className="text-navy-300 mb-8 max-w-md mx-auto">
                Answer 3 quick questions and we&apos;ll recommend the ideal learning path for you!
              </p>
              <button
                onClick={() => setStep('experience')}
                className="btn-primary text-lg px-8 py-4 group"
              >
                <span>Let&apos;s Go!</span>
                <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* Experience Step */}
          {step === 'experience' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs">1</span>
                  of 3
                </div>
                <h3 className="text-2xl font-bold text-white">
                  What&apos;s your experience level?
                </h3>
              </div>
              
              <div className="grid gap-4 max-w-lg mx-auto">
                {experiences.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      experience === exp.id
                        ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                        : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{exp.emoji}</span>
                      <div>
                        <div className="font-semibold text-white">{exp.label}</div>
                        <div className="text-sm text-navy-400">{exp.description}</div>
                      </div>
                      {experience === exp.id && (
                        <svg className="w-6 h-6 text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleNext}
                  disabled={!experience}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Interest Step */}
          {step === 'interest' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs">2</span>
                  of 3
                </div>
                <h3 className="text-2xl font-bold text-white">
                  What interests you most?
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {interests.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => setInterest(int.id)}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                      interest === int.id
                        ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                        : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                    }`}
                  >
                    <span className="text-4xl block mb-2">{int.emoji}</span>
                    <div className="font-semibold text-white text-sm">{int.label}</div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setStep('experience')}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!interest}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Goal Step */}
          {step === 'goal' && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs">3</span>
                  of 3
                </div>
                <h3 className="text-2xl font-bold text-white">
                  What&apos;s your learning goal?
                </h3>
              </div>
              
              <div className="grid gap-4 max-w-lg mx-auto">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      goal === g.id
                        ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
                        : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{g.emoji}</span>
                      <div>
                        <div className="font-semibold text-white">{g.label}</div>
                        <div className="text-sm text-navy-400">{g.description}</div>
                      </div>
                      {goal === g.id && (
                        <svg className="w-6 h-6 text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setStep('interest')}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!goal}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find My Course!
                </button>
              </div>
            </div>
          )}

          {/* Loading/Revealing State */}
          {isRevealing && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block animate-bounce text-6xl mb-6">✨</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Finding your perfect match...
              </h3>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && recommendedCourse && !isRevealing && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Perfect Match Found!
                </h3>
                <p className="text-navy-300">
                  Based on your answers, we recommend:
                </p>
              </div>

              {/* Recommended Course Card */}
              <div className="max-w-md mx-auto mb-8">
                <Link 
                  href={`/courses/${recommendedCourse.slug}`}
                  className="block bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl overflow-hidden border-2 border-primary-500/50 hover:border-primary-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20"
                >
                  {recommendedCourse.metadata?.thumbnail ? (
                    <img
                      src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                      alt={recommendedCourse.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
                      <span className="text-5xl">📚</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {recommendedCourse.title}
                    </h4>
                    {recommendedCourse.metadata?.tagline && (
                      <p className="text-navy-300 text-sm mb-4">
                        {recommendedCourse.metadata.tagline}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-navy-400">
                        <span>{recommendedCourse.metadata?.lessons?.length || 0} lessons</span>
                        {recommendedCourse.metadata?.estimated_hours && (
                          <>
                            <span>•</span>
                            <span>{recommendedCourse.metadata.estimated_hours}h</span>
                          </>
                        )}
                      </div>
                      {recommendedCourse.metadata?.is_free ? (
                        <span className="badge badge-free">Free</span>
                      ) : (
                        <span className="text-white font-semibold">
                          ${recommendedCourse.metadata?.price || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                <Link
                  href={`/courses/${recommendedCourse.slug}`}
                  className="btn-primary"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}