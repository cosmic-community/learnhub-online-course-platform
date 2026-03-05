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
  answer: string
}

const questions = [
  {
    id: 1,
    question: "What's your current experience level with programming?",
    emoji: "🎯",
    options: [
      { value: "beginner", label: "Complete Beginner", description: "I'm just getting started" },
      { value: "some", label: "Some Experience", description: "I've built a few small projects" },
      { value: "intermediate", label: "Intermediate", description: "I work with code regularly" },
      { value: "advanced", label: "Advanced", description: "I'm looking to master specific topics" },
    ]
  },
  {
    id: 2,
    question: "What interests you most?",
    emoji: "💡",
    options: [
      { value: "web", label: "Web Development", description: "Building websites and web apps" },
      { value: "cloud", label: "Cloud & DevOps", description: "Infrastructure and deployment" },
      { value: "mobile", label: "Mobile Apps", description: "iOS and Android development" },
      { value: "data", label: "Data & AI", description: "Analytics and machine learning" },
    ]
  },
  {
    id: 3,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { value: "casual", label: "1-3 hours", description: "Learning casually" },
      { value: "moderate", label: "4-8 hours", description: "Steady progress" },
      { value: "intensive", label: "10+ hours", description: "Intensive learning" },
    ]
  },
  {
    id: 4,
    question: "What's your learning goal?",
    emoji: "🚀",
    options: [
      { value: "career", label: "Career Change", description: "I want to become a developer" },
      { value: "upskill", label: "Skill Enhancement", description: "Adding to my existing skills" },
      { value: "hobby", label: "Personal Interest", description: "Learning for fun" },
      { value: "specific", label: "Specific Project", description: "I have a project in mind" },
    ]
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number; emoji: string }[]>([])

  const handleAnswer = (answer: string) => {
    setIsAnimating(true)
    
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResults(true)
        // Trigger confetti
        const newConfetti = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          emoji: ['🎉', '⭐', '🚀', '💡', '🎯', '✨'][Math.floor(Math.random() * 6)]
        }))
        setConfetti(newConfetti)
      }
      setIsAnimating(false)
    }, 300)
  }

  const getRecommendedCourses = (): Course[] => {
    const experienceAnswer = answers.find(a => a.questionId === 1)?.answer
    const interestAnswer = answers.find(a => a.questionId === 2)?.answer
    const timeAnswer = answers.find(a => a.questionId === 3)?.answer

    let filtered = [...courses]

    // Filter by experience/difficulty
    if (experienceAnswer === 'beginner') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        const diffValue = typeof difficulty === 'object' ? difficulty?.value : difficulty
        return diffValue === 'Beginner' || diffValue === 'beginner'
      })
    } else if (experienceAnswer === 'advanced') {
      filtered = filtered.filter(c => {
        const difficulty = c.metadata?.difficulty
        const diffValue = typeof difficulty === 'object' ? difficulty?.value : difficulty
        return diffValue === 'Advanced' || diffValue === 'advanced' || diffValue === 'Intermediate' || diffValue === 'intermediate'
      })
    }

    // Filter by interest/category
    if (interestAnswer === 'web') {
      const webCategory = categories.find(c => 
        c.slug?.includes('web') || c.metadata?.name?.toLowerCase().includes('web')
      )
      if (webCategory) {
        filtered = filtered.filter(c => 
          c.metadata?.categories?.some((cat: Category) => cat.id === webCategory.id) ||
          c.title?.toLowerCase().includes('web') ||
          c.title?.toLowerCase().includes('react') ||
          c.title?.toLowerCase().includes('vue') ||
          c.title?.toLowerCase().includes('node')
        )
      }
    } else if (interestAnswer === 'cloud') {
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes('aws') ||
        c.title?.toLowerCase().includes('cloud') ||
        c.title?.toLowerCase().includes('devops')
      )
    }

    // Consider time commitment
    if (timeAnswer === 'casual') {
      filtered = filtered.filter(c => (c.metadata?.estimated_hours || 0) <= 6)
    }

    // If no matches, return top courses
    if (filtered.length === 0) {
      filtered = courses.slice(0, 3)
    }

    return filtered.slice(0, 3)
  }

  const getPersonalityResult = () => {
    const experienceAnswer = answers.find(a => a.questionId === 1)?.answer
    const goalAnswer = answers.find(a => a.questionId === 4)?.answer

    if (experienceAnswer === 'beginner' && goalAnswer === 'career') {
      return {
        title: "The Ambitious Newcomer",
        emoji: "🌟",
        description: "You're starting fresh with big dreams! Your enthusiasm and clear goals will take you far. Focus on fundamentals and build a strong foundation.",
        tip: "Start with one language/framework and master it before moving on."
      }
    } else if (experienceAnswer === 'advanced') {
      return {
        title: "The Skill Architect",
        emoji: "🏗️",
        description: "You're ready to build something impressive! With your experience, you can tackle advanced topics and specialize in cutting-edge technologies.",
        tip: "Consider contributing to open source to level up even faster."
      }
    } else if (goalAnswer === 'hobby') {
      return {
        title: "The Curious Explorer",
        emoji: "🔭",
        description: "Learning for the joy of it! That's the best motivation. You'll find coding both creative and rewarding.",
        tip: "Build something you're personally excited about - motivation is everything!"
      }
    } else if (goalAnswer === 'specific') {
      return {
        title: "The Project Builder",
        emoji: "🛠️",
        description: "You have a vision and you're ready to make it real! Project-based learning is incredibly effective.",
        tip: "Break your project into small milestones and celebrate each win."
      }
    }
    
    return {
      title: "The Growth Mindset Developer",
      emoji: "📈",
      description: "You're on a journey of continuous improvement. With dedication and the right resources, you'll achieve your goals!",
      tip: "Consistency beats intensity. Code a little bit every day."
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setConfetti([])
  }

  const progress = ((currentQuestion + (showResults ? 1 : 0)) / questions.length) * 100

  if (showResults) {
    const recommendedCourses = getRecommendedCourses()
    const personality = getPersonalityResult()

    return (
      <div className="relative">
        {/* Confetti Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${c.left}%`,
                top: '-20px',
                animation: `fall 3s ease-in forwards`,
                animationDelay: `${c.delay}s`,
              }}
            >
              {c.emoji}
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>

        <div className="text-center mb-12">
          <div className="text-7xl mb-4">{personality.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            You're {personality.title}!
          </h1>
          <p className="text-navy-300 text-lg max-w-2xl mx-auto">
            {personality.description}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2">
            <span className="text-primary-400">💡 Pro Tip:</span>
            <span className="text-navy-200">{personality.tip}</span>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            ✨ Your Recommended Learning Path
          </h2>
          <div className="grid gap-6">
            {recommendedCourses.map((course, index) => {
              const difficulty = course.metadata?.difficulty
              const diffValue = typeof difficulty === 'object' ? difficulty?.value : difficulty
              
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="card p-6 flex items-center gap-6 group hover:scale-[1.02] transition-transform"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-400">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                      {course.metadata?.title || course.title}
                    </h3>
                    <p className="text-navy-400 text-sm truncate">
                      {course.metadata?.tagline}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`badge ${
                        diffValue?.toLowerCase() === 'beginner' ? 'badge-beginner' :
                        diffValue?.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                        'badge-advanced'
                      }`}>
                        {diffValue}
                      </span>
                      {course.metadata?.estimated_hours && (
                        <span className="text-navy-500 text-sm">
                          ~{course.metadata.estimated_hours} hours
                        </span>
                      )}
                      {course.metadata?.is_free && (
                        <span className="badge badge-free">Free</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Quiz
          </button>
          <Link href="/courses" className="btn-primary">
            Browse All Courses
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div>
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
      <div className={`card p-8 md:p-12 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{question.emoji}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {question.question}
          </h2>
        </div>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-4 md:p-6 bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-200 group hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-700 group-hover:bg-primary-500/20 flex items-center justify-center text-navy-400 group-hover:text-primary-400 font-semibold transition-colors">
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {option.label}
                  </div>
                  <div className="text-sm text-navy-400">
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skip Option */}
      {currentQuestion > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1)
              setAnswers(answers.slice(0, -1))
            }}
            className="text-navy-400 hover:text-navy-200 text-sm transition-colors"
          >
            ← Go back to previous question
          </button>
        </div>
      )}
    </div>
  )
}