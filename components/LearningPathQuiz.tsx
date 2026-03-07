'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizQuestion {
  id: string
  emoji: string
  question: string
  options: {
    text: string
    emoji: string
    tags: string[]
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'goal',
    emoji: '🎯',
    question: 'What\'s your main learning goal?',
    options: [
      { text: 'Build websites & apps', emoji: '💻', tags: ['web-development', 'frontend'] },
      { text: 'Work with data & AI', emoji: '🤖', tags: ['data-science', 'machine-learning'] },
      { text: 'Launch to the cloud', emoji: '☁️', tags: ['cloud-computing', 'devops'] },
      { text: 'Create mobile apps', emoji: '📱', tags: ['mobile-development', 'ios', 'android'] },
    ]
  },
  {
    id: 'experience',
    emoji: '📊',
    question: 'What\'s your current skill level?',
    options: [
      { text: 'Just starting out', emoji: '🌱', tags: ['beginner'] },
      { text: 'Know the basics', emoji: '🌿', tags: ['beginner', 'intermediate'] },
      { text: 'Pretty comfortable', emoji: '🌳', tags: ['intermediate'] },
      { text: 'Ready for advanced', emoji: '🚀', tags: ['advanced'] },
    ]
  },
  {
    id: 'time',
    emoji: '⏰',
    question: 'How much time can you commit weekly?',
    options: [
      { text: '2-3 hours', emoji: '🐢', tags: ['short'] },
      { text: '5-10 hours', emoji: '🐇', tags: ['medium'] },
      { text: '10+ hours', emoji: '🦅', tags: ['long'] },
      { text: 'Full-time learner', emoji: '🔥', tags: ['intensive'] },
    ]
  },
  {
    id: 'style',
    emoji: '🎨',
    question: 'How do you prefer to learn?',
    options: [
      { text: 'Hands-on projects', emoji: '🔨', tags: ['practical'] },
      { text: 'Theory first', emoji: '📚', tags: ['theory'] },
      { text: 'Mix of both', emoji: '⚖️', tags: ['balanced'] },
      { text: 'Quick tutorials', emoji: '⚡', tags: ['quick'] },
    ]
  }
]

type QuizStep = 'intro' | 'questions' | 'analyzing' | 'results'

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [step, setStep] = useState<QuizStep>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  const handleStart = () => {
    setStep('questions')
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleAnswer = (questionId: string, tags: string[]) => {
    const newAnswers = { ...answers, [questionId]: tags }
    setAnswers(newAnswers)
    
    if (currentQuestion < quizQuestions.length - 1) {
      // Animate to next question
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // Show analyzing state
      setStep('analyzing')
      
      // Calculate recommendations
      setTimeout(() => {
        const allTags = Object.values(newAnswers).flat()
        
        // Score each course based on tag matches
        const scoredCourses = courses.map(course => {
          let score = 0
          const courseCategories = course.metadata?.categories || []
          const difficulty = course.metadata?.difficulty
          const difficultyValue = typeof difficulty === 'object' ? difficulty.value : difficulty
          
          // Check category matches
          courseCategories.forEach((cat: Category) => {
            if (allTags.some(tag => cat.slug?.includes(tag) || cat.title?.toLowerCase().includes(tag))) {
              score += 3
            }
          })
          
          // Check difficulty match
          if (difficultyValue) {
            const difficultyLower = difficultyValue.toLowerCase()
            if (allTags.includes(difficultyLower)) {
              score += 2
            }
            // Bonus for beginner-friendly when user is new
            if (allTags.includes('beginner') && difficultyLower === 'beginner') {
              score += 2
            }
          }
          
          // Check course title/tagline for keyword matches
          const courseText = `${course.title} ${course.metadata?.tagline || ''}`.toLowerCase()
          allTags.forEach(tag => {
            if (courseText.includes(tag.replace('-', ' '))) {
              score += 1
            }
          })
          
          return { course, score }
        })
        
        // Sort by score and take top 3
        const topCourses = scoredCourses
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => item.course)
        
        // If no good matches, show first 3 courses
        setRecommendedCourses(topCourses.length > 0 ? topCourses : courses.slice(0, 3))
        setStep('results')
        setShowConfetti(true)
        
        setTimeout(() => setShowConfetti(false), 3000)
      }, 2000)
    }
  }

  const handleReset = () => {
    setStep('intro')
    setCurrentQuestion(0)
    setAnswers({})
    setRecommendedCourses([])
  }

  // Intro State
  if (step === 'intro') {
    return (
      <div className="card p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="text-6xl mb-6 animate-bounce">🧭</div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Find Your Perfect Learning Path
          </h3>
          <p className="text-navy-300 mb-8 max-w-md mx-auto">
            Answer 4 quick questions and we'll recommend personalized courses 
            tailored to your goals and experience level.
          </p>
          <button
            onClick={handleStart}
            className="btn-primary text-lg group"
          >
            Start Quiz
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <p className="text-navy-500 text-sm mt-4">Takes less than 30 seconds</p>
        </div>
      </div>
    )
  }

  // Questions State
  if (step === 'questions') {
    const question = quizQuestions[currentQuestion]
    
    return (
      <div className="card p-8 sm:p-12 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-navy-800">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        
        {/* Question counter */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-navy-400 text-sm">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <button 
            onClick={handleReset}
            className="text-navy-400 hover:text-navy-200 text-sm transition-colors"
          >
            Start over
          </button>
        </div>
        
        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{question.emoji}</div>
          <h3 className="text-2xl font-bold text-white">
            {question.question}
          </h3>
        </div>
        
        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, option.tags)}
              className="group p-4 sm:p-6 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </span>
                <span className="text-white font-medium group-hover:text-primary-400 transition-colors">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Analyzing State
  if (step === 'analyzing') {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Spinning rings */}
          <div className="absolute inset-0 border-4 border-navy-700 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="absolute inset-4 border-4 border-transparent border-t-primary-300 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
          
          {/* Center emoji */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">🔮</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">
          Analyzing your answers...
        </h3>
        <p className="text-navy-300">
          Finding your perfect learning path
        </p>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  // Results State
  if (step === 'results') {
    return (
      <div className="relative">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="card p-8 sm:p-12 text-center mb-8">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Your Personalized Learning Path
          </h3>
          <p className="text-navy-300 mb-2">
            Based on your answers, we've found the perfect courses for you!
          </p>
        </div>
        
        {/* Recommended Courses */}
        <div className="space-y-4 mb-8">
          {recommendedCourses.map((course, index) => {
            const difficulty = course.metadata?.difficulty
            const difficultyValue = typeof difficulty === 'object' ? difficulty.value : difficulty
            const difficultyLower = difficultyValue?.toLowerCase() || 'beginner'
            
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="block card p-6 group hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Rank badge */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : index === 1 
                      ? 'bg-gray-400/20 text-gray-300'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  
                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {course.metadata?.title || course.title}
                      </h4>
                      {index === 0 && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                          Top Match
                        </span>
                      )}
                    </div>
                    <p className="text-navy-400 text-sm line-clamp-1 mb-2">
                      {course.metadata?.tagline}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`badge badge-${difficultyLower}`}>
                        {difficultyValue || 'Beginner'}
                      </span>
                      {course.metadata?.estimated_hours && (
                        <span className="text-navy-500">
                          {course.metadata.estimated_hours} hours
                        </span>
                      )}
                      {course.metadata?.is_free && (
                        <span className="badge badge-free">Free</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex-shrink-0 text-navy-500 group-hover:text-primary-400 transition-colors">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  return null
}