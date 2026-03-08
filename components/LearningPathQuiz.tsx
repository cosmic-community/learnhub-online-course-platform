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
  question: string
  emoji: string
  options: {
    value: string
    label: string
    emoji: string
    tags: string[]
  }[]
}

const questions: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'What\'s your main learning goal?',
    emoji: '🎯',
    options: [
      { value: 'career', label: 'Start a new career', emoji: '🚀', tags: ['beginner', 'comprehensive'] },
      { value: 'skills', label: 'Level up my skills', emoji: '📈', tags: ['intermediate', 'advanced'] },
      { value: 'project', label: 'Build a specific project', emoji: '🛠️', tags: ['practical', 'project-based'] },
      { value: 'curious', label: 'Just exploring', emoji: '🔍', tags: ['beginner', 'overview'] },
    ],
  },
  {
    id: 'experience',
    question: 'How much coding experience do you have?',
    emoji: '💻',
    options: [
      { value: 'none', label: 'Brand new to coding', emoji: '🌱', tags: ['beginner'] },
      { value: 'some', label: 'I know the basics', emoji: '🌿', tags: ['beginner', 'intermediate'] },
      { value: 'comfortable', label: 'Pretty comfortable', emoji: '🌳', tags: ['intermediate'] },
      { value: 'expert', label: 'I\'m experienced', emoji: '🏔️', tags: ['advanced'] },
    ],
  },
  {
    id: 'interest',
    question: 'What excites you most?',
    emoji: '✨',
    options: [
      { value: 'frontend', label: 'Building beautiful UIs', emoji: '🎨', tags: ['web-development', 'frontend', 'vue', 'react'] },
      { value: 'backend', label: 'Server-side & APIs', emoji: '⚡', tags: ['web-development', 'backend', 'node'] },
      { value: 'cloud', label: 'Cloud & Infrastructure', emoji: '☁️', tags: ['cloud-computing', 'aws', 'devops'] },
      { value: 'mobile', label: 'Mobile apps', emoji: '📱', tags: ['mobile-development', 'ios', 'android'] },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you dedicate weekly?',
    emoji: '⏰',
    options: [
      { value: 'minimal', label: '1-3 hours', emoji: '🕐', tags: ['short', 'concise'] },
      { value: 'moderate', label: '4-7 hours', emoji: '🕓', tags: ['medium'] },
      { value: 'dedicated', label: '8-15 hours', emoji: '🕗', tags: ['comprehensive'] },
      { value: 'fulltime', label: '15+ hours', emoji: '🕛', tags: ['intensive', 'bootcamp'] },
    ],
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [matchScore, setMatchScore] = useState(0)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (value: string) => {
    setSelectedOption(value)
    setIsAnimating(true)
    
    setTimeout(() => {
      const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
      setAnswers(newAnswers)
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
        setIsAnimating(false)
      } else {
        // Calculate recommendations
        calculateRecommendations(newAnswers)
        setShowResults(true)
        setIsAnimating(false)
      }
    }, 300)
  }

  const calculateRecommendations = (finalAnswers: Record<string, string>) => {
    // Collect all tags from answers
    const userTags: string[] = []
    questions.forEach(q => {
      const answer = finalAnswers[q.id]
      const option = q.options.find(o => o.value === answer)
      if (option) {
        userTags.push(...option.tags)
      }
    })

    // Score each course based on matching criteria
    const scoredCourses = courses.map(course => {
      let score = 0
      const metadata = course.metadata

      // Check difficulty level match
      const experienceAnswer = finalAnswers['experience']
      const difficultyValue = typeof metadata?.difficulty === 'object' 
        ? metadata.difficulty.value?.toLowerCase() 
        : String(metadata?.difficulty || '').toLowerCase()
      
      if (experienceAnswer === 'none' && difficultyValue === 'beginner') score += 30
      if (experienceAnswer === 'some' && (difficultyValue === 'beginner' || difficultyValue === 'intermediate')) score += 25
      if (experienceAnswer === 'comfortable' && difficultyValue === 'intermediate') score += 30
      if (experienceAnswer === 'expert' && difficultyValue === 'advanced') score += 30

      // Check category match based on interest
      const interestAnswer = finalAnswers['interest']
      const courseCategories = metadata?.categories || []
      
      courseCategories.forEach((cat: { slug?: string; title?: string }) => {
        const catSlug = cat.slug?.toLowerCase() || ''
        const catTitle = cat.title?.toLowerCase() || ''
        
        if (interestAnswer === 'frontend' && (catSlug.includes('web') || catTitle.includes('vue') || catTitle.includes('react'))) {
          score += 25
        }
        if (interestAnswer === 'backend' && (catSlug.includes('web') || catTitle.includes('node') || catTitle.includes('backend'))) {
          score += 25
        }
        if (interestAnswer === 'cloud' && (catSlug.includes('cloud') || catTitle.includes('aws'))) {
          score += 25
        }
        if (interestAnswer === 'mobile' && (catSlug.includes('mobile') || catTitle.includes('ios') || catTitle.includes('android'))) {
          score += 25
        }
      })

      // Time commitment match
      const timeAnswer = finalAnswers['time']
      const estimatedHours = metadata?.estimated_hours || 0
      
      if (timeAnswer === 'minimal' && estimatedHours <= 5) score += 15
      if (timeAnswer === 'moderate' && estimatedHours >= 4 && estimatedHours <= 8) score += 15
      if (timeAnswer === 'dedicated' && estimatedHours >= 6 && estimatedHours <= 15) score += 15
      if (timeAnswer === 'fulltime' && estimatedHours >= 10) score += 15

      // Bonus for free courses when exploring
      if (finalAnswers['goal'] === 'curious' && metadata?.is_free) {
        score += 10
      }

      return { course, score }
    })

    // Sort by score and take top 3
    const topCourses = scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(sc => sc.course)

    const avgScore = scoredCourses.length > 0 
      ? Math.round((scoredCourses.slice(0, 3).reduce((acc, sc) => acc + sc.score, 0) / 3))
      : 0

    setRecommendedCourses(topCourses)
    setMatchScore(Math.min(avgScore, 100))
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedOption(null)
    setRecommendedCourses([])
    setMatchScore(0)
  }

  const getDifficultyBadge = (difficulty: unknown) => {
    const value = typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty
      ? String((difficulty as { value: unknown }).value).toLowerCase()
      : String(difficulty || 'beginner').toLowerCase()
    
    switch (value) {
      case 'beginner':
        return <span className="badge badge-beginner">Beginner</span>
      case 'intermediate':
        return <span className="badge badge-intermediate">Intermediate</span>
      case 'advanced':
        return <span className="badge badge-advanced">Advanced</span>
      default:
        return <span className="badge badge-beginner">Beginner</span>
    }
  }

  if (showResults) {
    return (
      <div className="card p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-full mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Your Learning Path is Ready!</h3>
          <p className="text-navy-400">
            Based on your answers, we found courses that match your goals
          </p>
          
          {/* Match Score */}
          <div className="mt-6 inline-flex items-center gap-3 bg-navy-800/50 rounded-full px-6 py-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-navy-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${matchScore * 1.26} 126`}
                  className="text-primary-500 transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {matchScore}%
              </span>
            </div>
            <span className="text-navy-300 text-sm">Match Score</span>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="space-y-4 mb-8">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-4 p-4 bg-navy-800/30 rounded-xl hover:bg-navy-800/50 transition-all group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                  {index + 1}
                </div>
                <div className="flex-shrink-0">
                  {course.metadata?.thumbnail?.imgix_url ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-[60px] h-[40px] object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-[60px] h-[40px] bg-navy-700 rounded-lg flex items-center justify-center text-2xl">
                      📚
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                    {course.metadata?.title || course.title}
                  </h4>
                  <p className="text-sm text-navy-400 truncate">
                    {course.metadata?.tagline || 'Start learning today'}
                  </p>
                </div>
                <div className="flex-shrink-0 hidden sm:flex items-center gap-2">
                  {getDifficultyBadge(course.metadata?.difficulty)}
                  {course.metadata?.is_free && (
                    <span className="badge badge-free">Free</span>
                  )}
                </div>
                <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-navy-400">
              <p>We&apos;re still building our course catalog. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="btn-secondary"
          >
            Retake Quiz
          </button>
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="card p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-navy-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">{question.emoji}</span>
          <h3 className="text-xl font-bold text-white">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              disabled={selectedOption !== null}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                selectedOption === option.value
                  ? 'border-primary-500 bg-primary-500/10 scale-[0.98]'
                  : 'border-navy-700 hover:border-navy-600 hover:bg-navy-800/50'
              } ${selectedOption !== null && selectedOption !== option.value ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skip option */}
      <div className="mt-6 text-center">
        <button
          onClick={resetQuiz}
          className="text-sm text-navy-500 hover:text-navy-300 transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  )
}