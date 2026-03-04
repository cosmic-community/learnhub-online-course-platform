'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'
import Confetti from './Confetti'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizAnswer {
  question: number
  answer: string
}

const questions = [
  {
    id: 1,
    emoji: '🎯',
    question: "What's your main learning goal?",
    options: [
      { value: 'career', label: 'Start a new career in tech', icon: '🚀' },
      { value: 'upskill', label: 'Level up my current skills', icon: '📈' },
      { value: 'hobby', label: 'Learn something new for fun', icon: '🎨' },
      { value: 'project', label: 'Build a specific project', icon: '🛠️' },
    ],
  },
  {
    id: 2,
    emoji: '📊',
    question: 'What\'s your experience level?',
    options: [
      { value: 'beginner', label: 'Complete beginner', icon: '🌱' },
      { value: 'some', label: 'I know the basics', icon: '🌿' },
      { value: 'intermediate', label: 'Comfortable with coding', icon: '🌳' },
      { value: 'advanced', label: 'Experienced developer', icon: '🏔️' },
    ],
  },
  {
    id: 3,
    emoji: '⏰',
    question: 'How much time can you dedicate weekly?',
    options: [
      { value: 'light', label: '2-5 hours per week', icon: '☕' },
      { value: 'moderate', label: '5-10 hours per week', icon: '💪' },
      { value: 'intensive', label: '10-20 hours per week', icon: '🔥' },
      { value: 'fulltime', label: '20+ hours per week', icon: '⚡' },
    ],
  },
  {
    id: 4,
    emoji: '💡',
    question: 'What interests you most?',
    options: [
      { value: 'frontend', label: 'Building user interfaces', icon: '🎨' },
      { value: 'backend', label: 'Server-side & databases', icon: '⚙️' },
      { value: 'fullstack', label: 'Both frontend & backend', icon: '🔗' },
      { value: 'cloud', label: 'Cloud & infrastructure', icon: '☁️' },
    ],
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = useCallback((answer: string) => {
    setIsAnimating(true)
    
    const newAnswers = [...answers, { question: currentQuestion, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      } else {
        setShowResults(true)
        setShowConfetti(true)
        setIsAnimating(false)
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }, 300)
  }, [currentQuestion, answers])

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setShowConfetti(false)
  }, [])

  const getRecommendedCourses = useCallback(() => {
    // Analyze answers to recommend courses
    const experienceAnswer = answers.find(a => a.question === 1)?.answer
    const interestAnswer = answers.find(a => a.question === 3)?.answer

    let filteredCourses = [...courses]

    // Filter by experience level
    if (experienceAnswer === 'beginner' || experienceAnswer === 'some') {
      filteredCourses = filteredCourses.filter(c => {
        const difficulty = c.metadata?.difficulty
        if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
          return (difficulty as { value: string }).value?.toLowerCase() === 'beginner'
        }
        return String(difficulty).toLowerCase() === 'beginner'
      })
    } else if (experienceAnswer === 'advanced') {
      filteredCourses = filteredCourses.filter(c => {
        const difficulty = c.metadata?.difficulty
        if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
          const val = (difficulty as { value: string }).value?.toLowerCase()
          return val === 'intermediate' || val === 'advanced'
        }
        const val = String(difficulty).toLowerCase()
        return val === 'intermediate' || val === 'advanced'
      })
    }

    // Filter by interest area
    if (interestAnswer) {
      const interestKeywords: Record<string, string[]> = {
        frontend: ['vue', 'react', 'frontend', 'ui', 'css', 'javascript'],
        backend: ['node', 'backend', 'api', 'database', 'server', 'express'],
        fullstack: ['full', 'stack', 'web development'],
        cloud: ['aws', 'cloud', 'lambda', 'serverless', 'infrastructure'],
      }
      
      const keywords = interestKeywords[interestAnswer] || []
      if (keywords.length > 0) {
        const interestFiltered = filteredCourses.filter(c => {
          const title = c.title?.toLowerCase() || ''
          const description = c.metadata?.description?.toLowerCase() || ''
          const tagline = c.metadata?.tagline?.toLowerCase() || ''
          return keywords.some(kw => 
            title.includes(kw) || description.includes(kw) || tagline.includes(kw)
          )
        })
        if (interestFiltered.length > 0) {
          filteredCourses = interestFiltered
        }
      }
    }

    // Return top 3 recommendations (or all if less than 3)
    return filteredCourses.slice(0, 3)
  }, [answers, courses])

  const getLearningPathTitle = useCallback(() => {
    const interestAnswer = answers.find(a => a.question === 3)?.answer
    const paths: Record<string, string> = {
      frontend: '🎨 Frontend Developer Path',
      backend: '⚙️ Backend Developer Path',
      fullstack: '🔗 Full-Stack Developer Path',
      cloud: '☁️ Cloud Engineer Path',
    }
    return paths[interestAnswer || ''] || '🚀 Your Personalized Learning Path'
  }, [answers])

  const getMotivationalMessage = useCallback(() => {
    const goalAnswer = answers.find(a => a.question === 0)?.answer
    const messages: Record<string, string> = {
      career: "You're about to embark on an exciting career journey!",
      upskill: "Great choice! Continuous learning is the key to success.",
      hobby: "Learning should be fun! Let's make this enjoyable.",
      project: "Let's get you building! These courses will help you ship faster.",
    }
    return messages[goalAnswer || ''] || "Let's start your learning adventure!"
  }, [answers])

  if (showResults) {
    const recommendedCourses = getRecommendedCourses()
    
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center mb-8 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getLearningPathTitle()}</h3>
            <p className="text-navy-300 mb-6">{getMotivationalMessage()}</p>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {answers.map((answer, index) => (
                <div key={index} className="text-center p-3 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl mb-1">{questions[index].emoji}</div>
                  <div className="text-xs text-navy-400">{questions[index].options.find(o => o.value === answer.answer)?.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {recommendedCourses.length > 0 ? (
            <div className="space-y-6 animate-fade-in-up">
              <h4 className="text-xl font-semibold text-white text-center">
                ✨ Recommended Courses for You
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="card p-6 hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {course.metadata?.thumbnail?.imgix_url && (
                      <img
                        src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h5 className="font-semibold text-white mb-2 line-clamp-2">
                      {course.metadata?.title || course.title}
                    </h5>
                    <p className="text-sm text-navy-400 line-clamp-2">
                      {course.metadata?.tagline}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`badge ${
                        (() => {
                          const diff = course.metadata?.difficulty
                          const val = typeof diff === 'object' && diff !== null && 'value' in diff 
                            ? (diff as { value: string }).value 
                            : String(diff)
                          return val?.toLowerCase() === 'beginner' 
                            ? 'badge-beginner' 
                            : val?.toLowerCase() === 'advanced' 
                              ? 'badge-advanced' 
                              : 'badge-intermediate'
                        })()
                      }`}>
                        {(() => {
                          const diff = course.metadata?.difficulty
                          return typeof diff === 'object' && diff !== null && 'value' in diff 
                            ? (diff as { value: string }).value 
                            : String(diff || 'Beginner')
                        })()}
                      </span>
                      {course.metadata?.is_free && (
                        <span className="badge badge-free">Free</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-navy-400 mb-4">We're working on adding more courses that match your interests!</p>
              <Link href="/courses" className="btn-primary">
                Browse All Courses
              </Link>
            </div>
          )}

          <div className="text-center mt-8">
            <button
              onClick={resetQuiz}
              className="btn-secondary"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-navy-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`card p-8 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{question.emoji}</div>
          <h3 className="text-2xl font-bold text-white">{question.question}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="group p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500 rounded-xl transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {option.icon}
                </span>
                <span className="text-white font-medium group-hover:text-primary-400 transition-colors">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation hint */}
      <p className="text-center text-navy-500 text-sm mt-6">
        Click an option to continue
      </p>
    </div>
  )
}