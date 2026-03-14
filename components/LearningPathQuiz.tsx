'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

interface QuizAnswer {
  questionId: number
  answerId: string
}

interface Question {
  id: number
  question: string
  emoji: string
  answers: {
    id: string
    text: string
    emoji: string
    tags: string[]
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your current experience level with programming?",
    emoji: "🎯",
    answers: [
      { id: 'beginner', text: "I'm just starting out", emoji: "🌱", tags: ['beginner'] },
      { id: 'some', text: "I know the basics", emoji: "📚", tags: ['beginner', 'intermediate'] },
      { id: 'intermediate', text: "I can build simple projects", emoji: "🔧", tags: ['intermediate'] },
      { id: 'advanced', text: "I'm experienced and want to level up", emoji: "🚀", tags: ['intermediate', 'advanced'] },
    ]
  },
  {
    id: 2,
    question: "What interests you most?",
    emoji: "💡",
    answers: [
      { id: 'web', text: "Building websites & web apps", emoji: "🌐", tags: ['web-development'] },
      { id: 'mobile', text: "Creating mobile apps", emoji: "📱", tags: ['mobile-development'] },
      { id: 'cloud', text: "Cloud & infrastructure", emoji: "☁️", tags: ['cloud-computing'] },
      { id: 'data', text: "Data & analytics", emoji: "📊", tags: ['data-science'] },
    ]
  },
  {
    id: 3,
    question: "How do you prefer to learn?",
    emoji: "📖",
    answers: [
      { id: 'theory', text: "Start with fundamentals", emoji: "📐", tags: ['beginner'] },
      { id: 'practice', text: "Jump into projects", emoji: "🛠️", tags: ['intermediate'] },
      { id: 'deep', text: "Deep dive into concepts", emoji: "🔬", tags: ['advanced'] },
      { id: 'quick', text: "Quick, practical tutorials", emoji: "⚡", tags: ['intermediate'] },
    ]
  },
  {
    id: 4,
    question: "What's your main goal?",
    emoji: "🎯",
    answers: [
      { id: 'career', text: "Land a new job", emoji: "💼", tags: ['intermediate', 'advanced'] },
      { id: 'hobby', text: "Build personal projects", emoji: "🎨", tags: ['beginner', 'intermediate'] },
      { id: 'startup', text: "Launch my own product", emoji: "🚀", tags: ['intermediate', 'advanced'] },
      { id: 'skills', text: "Expand my skillset", emoji: "📈", tags: ['intermediate'] },
    ]
  },
  {
    id: 5,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    answers: [
      { id: 'little', text: "1-3 hours", emoji: "🐢", tags: ['beginner'] },
      { id: 'moderate', text: "4-7 hours", emoji: "🏃", tags: ['intermediate'] },
      { id: 'lots', text: "8+ hours", emoji: "🔥", tags: ['intermediate', 'advanced'] },
      { id: 'fulltime', text: "I'm going all in!", emoji: "💪", tags: ['advanced'] },
    ]
  }
]

function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; emoji: string }[]>([])

  const handleAnswer = (answerId: string) => {
    setIsAnimating(true)
    
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answerId }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Generate confetti
        const newConfetti = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          emoji: ['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]
        }))
        setConfetti(newConfetti)
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    // Collect all tags from answers
    const allTags: string[] = []
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      const selectedAnswer = question?.answers.find(a => a.id === answer.answerId)
      if (selectedAnswer) {
        allTags.push(...selectedAnswer.tags)
      }
    })

    // Score each course based on matching tags
    const scoredCourses = courses.map(course => {
      let score = 0
      const difficulty = getMetafieldValue(course.metadata?.difficulty).toLowerCase()
      const categoryNames = course.metadata?.categories?.map(
        (c: Category) => c.slug || c.metadata?.name?.toLowerCase().replace(/\s+/g, '-')
      ) || []

      // Match difficulty
      if (allTags.includes(difficulty)) {
        score += 3
      }

      // Match categories
      categoryNames.forEach((catName: string) => {
        if (allTags.some(tag => catName?.includes(tag) || tag.includes(catName || ''))) {
          score += 2
        }
      })

      // Bonus for free courses if beginner
      if (allTags.filter(t => t === 'beginner').length >= 2 && course.metadata?.is_free) {
        score += 1
      }

      return { course, score }
    })

    // Sort by score and return top 3
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(sc => sc.course)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setConfetti([])
  }

  const progress = ((currentQuestion + (showResults ? 1 : 0)) / questions.length) * 100

  if (showResults) {
    const recommendedCourses = getRecommendedCourses()
    
    return (
      <div className="relative">
        {/* Confetti animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confetti.map(c => (
            <div
              key={c.id}
              className="absolute text-2xl animate-fall"
              style={{
                left: `${c.x}%`,
                animationDelay: `${c.delay}s`,
                top: '-20px'
              }}
            >
              {c.emoji}
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Learning Path is Ready!
          </h1>
          <p className="text-xl text-navy-300">
            Based on your answers, here are your perfect matches
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {recommendedCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="card block p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    'bg-amber-700/20 text-amber-600'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${
                      getMetafieldValue(course.metadata?.difficulty).toLowerCase() === 'beginner' ? 'badge-beginner' :
                      getMetafieldValue(course.metadata?.difficulty).toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                      'badge-advanced'
                    }`}>
                      {getMetafieldValue(course.metadata?.difficulty) || 'All Levels'}
                    </span>
                    {course.metadata?.is_free && (
                      <span className="badge badge-free">Free</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-navy-400 line-clamp-2">
                    {course.metadata?.tagline}
                  </p>
                  {course.metadata?.estimated_hours && (
                    <p className="text-sm text-navy-500 mt-2">
                      ⏱️ {course.metadata.estimated_hours} hours • {course.metadata?.lessons?.length || 0} lessons
                    </p>
                  )}
                </div>
                {course.metadata?.thumbnail?.imgix_url && (
                  <div className="hidden sm:block flex-shrink-0">
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                      alt=""
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
          <button onClick={resetQuiz} className="btn-secondary">
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Find Your Perfect Course
        </h1>
        <p className="text-navy-300 text-lg">
          Answer {questions.length} quick questions to get personalized recommendations
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between text-sm text-navy-400 mb-2">
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

      {/* Question */}
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{question.emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            {question.question}
          </h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswer(answer.id)}
              className="card p-6 text-left hover:border-primary-500 hover:bg-navy-800/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {answer.emoji}
                </span>
                <span className="text-lg text-white font-medium">
                  {answer.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skip link */}
      <div className="text-center mt-8">
        <Link href="/courses" className="text-navy-400 hover:text-navy-300 text-sm">
          Skip quiz and browse all courses →
        </Link>
      </div>
    </div>
  )
}