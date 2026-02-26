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
    question: "What's your main goal for learning?",
    emoji: "🎯",
    options: [
      { value: "career", label: "Start or advance my career", icon: "💼" },
      { value: "hobby", label: "Learn something new for fun", icon: "🎨" },
      { value: "project", label: "Build a specific project", icon: "🚀" },
      { value: "skills", label: "Upgrade existing skills", icon: "📈" },
    ]
  },
  {
    id: 2,
    question: "How much coding experience do you have?",
    emoji: "💻",
    options: [
      { value: "none", label: "Complete beginner", icon: "🌱" },
      { value: "some", label: "I've tried some tutorials", icon: "📚" },
      { value: "intermediate", label: "I can build basic projects", icon: "🔧" },
      { value: "advanced", label: "I'm a professional developer", icon: "⚡" },
    ]
  },
  {
    id: 3,
    question: "What area interests you most?",
    emoji: "✨",
    options: [
      { value: "web", label: "Web Development", icon: "🌐" },
      { value: "mobile", label: "Mobile Apps", icon: "📱" },
      { value: "cloud", label: "Cloud & DevOps", icon: "☁️" },
      { value: "data", label: "Data & AI", icon: "🤖" },
    ]
  },
  {
    id: 4,
    question: "How much time can you dedicate weekly?",
    emoji: "⏰",
    options: [
      { value: "little", label: "1-2 hours", icon: "🐢" },
      { value: "moderate", label: "3-5 hours", icon: "🚶" },
      { value: "dedicated", label: "6-10 hours", icon: "🏃" },
      { value: "intensive", label: "10+ hours", icon: "🚀" },
    ]
  },
  {
    id: 5,
    question: "What's your preferred learning style?",
    emoji: "📖",
    options: [
      { value: "visual", label: "Watch videos & demos", icon: "🎬" },
      { value: "hands-on", label: "Learn by coding along", icon: "⌨️" },
      { value: "theory", label: "Understand concepts first", icon: "🧠" },
      { value: "project", label: "Build real projects", icon: "🏗️" },
    ]
  },
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [recommendations, setRecommendations] = useState<Course[]>([])

  const progress = ((currentQuestion) / questions.length) * 100

  const handleAnswer = (answer: string) => {
    setIsAnimating(true)
    
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Calculate recommendations
        const recs = calculateRecommendations(newAnswers, courses)
        setRecommendations(recs)
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const calculateRecommendations = (quizAnswers: QuizAnswer[], allCourses: Course[]): Course[] => {
    // Score each course based on answers
    const scoredCourses = allCourses.map(course => {
      let score = 0
      const metadata = course.metadata

      // Experience level matching
      const experienceAnswer = quizAnswers.find(a => a.questionId === 2)?.answer
      const difficulty = metadata?.difficulty?.value?.toLowerCase() || 'beginner'
      
      if (experienceAnswer === 'none' && difficulty === 'beginner') score += 30
      if (experienceAnswer === 'some' && (difficulty === 'beginner' || difficulty === 'intermediate')) score += 25
      if (experienceAnswer === 'intermediate' && difficulty === 'intermediate') score += 30
      if (experienceAnswer === 'advanced' && difficulty === 'advanced') score += 30

      // Interest area matching
      const interestAnswer = quizAnswers.find(a => a.questionId === 3)?.answer
      const courseTitle = course.title?.toLowerCase() || ''
      const courseDesc = metadata?.description?.toLowerCase() || ''
      
      if (interestAnswer === 'web' && (courseTitle.includes('web') || courseTitle.includes('react') || courseTitle.includes('vue') || courseTitle.includes('node') || courseTitle.includes('javascript') || courseTitle.includes('typescript'))) score += 25
      if (interestAnswer === 'mobile' && (courseTitle.includes('mobile') || courseTitle.includes('ios') || courseTitle.includes('android') || courseTitle.includes('react native') || courseTitle.includes('flutter'))) score += 25
      if (interestAnswer === 'cloud' && (courseTitle.includes('aws') || courseTitle.includes('cloud') || courseTitle.includes('devops') || courseTitle.includes('docker') || courseTitle.includes('kubernetes'))) score += 25
      if (interestAnswer === 'data' && (courseTitle.includes('data') || courseTitle.includes('python') || courseTitle.includes('machine learning') || courseTitle.includes('ai'))) score += 25

      // Time commitment matching
      const timeAnswer = quizAnswers.find(a => a.questionId === 4)?.answer
      const hours = metadata?.estimated_hours || 5
      
      if (timeAnswer === 'little' && hours <= 4) score += 15
      if (timeAnswer === 'moderate' && hours <= 8) score += 15
      if (timeAnswer === 'dedicated' && hours <= 15) score += 15
      if (timeAnswer === 'intensive') score += 10

      // Goal matching - boost free courses for hobby learners
      const goalAnswer = quizAnswers.find(a => a.questionId === 1)?.answer
      if (goalAnswer === 'hobby' && metadata?.is_free) score += 10
      if (goalAnswer === 'career' && !metadata?.is_free) score += 5 // Premium courses for career focus

      return { course, score }
    })

    // Sort by score and return top 3
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(sc => sc.course)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setRecommendations([])
  }

  const getDifficultyBadgeClass = (difficulty: string | undefined): string => {
    const level = difficulty?.toLowerCase() || 'beginner'
    switch (level) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'badge-beginner'
    }
  }

  if (showResults) {
    return (
      <div className="animate-fade-in">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Personalized Learning Path
          </h1>
          <p className="text-lg text-navy-300">
            Based on your answers, here are the perfect courses for you!
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-6 mb-12">
          {recommendations.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="card block p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getDifficultyBadgeClass(course.metadata?.difficulty?.value)}`}>
                      {course.metadata?.difficulty?.value || 'Beginner'}
                    </span>
                    {course.metadata?.is_free && (
                      <span className="badge badge-free">Free</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-navy-400 text-sm line-clamp-2">
                    {course.metadata?.tagline}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-navy-500">
                    {course.metadata?.estimated_hours && (
                      <span>⏱️ {course.metadata.estimated_hours} hours</span>
                    )}
                    {course.metadata?.lessons && course.metadata.lessons.length > 0 && (
                      <span>📚 {course.metadata.lessons.length} lessons</span>
                    )}
                  </div>
                </div>
                {course.metadata?.thumbnail?.imgix_url && (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="hidden sm:block w-24 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={restartQuiz} className="btn-secondary">
            <span className="mr-2">🔄</span>
            Retake Quiz
          </button>
          <Link href="/courses" className="btn-primary">
            <span className="mr-2">📚</span>
            Browse All Courses
          </Link>
        </div>

        {/* Fun Stats */}
        <div className="mt-12 p-6 card bg-gradient-to-r from-primary-500/10 to-navy-900/50">
          <div className="text-center">
            <p className="text-navy-300 text-sm mb-2">Your Learning Profile</p>
            <div className="flex flex-wrap justify-center gap-3">
              {answers.map((answer, idx) => {
                const question = questions.find(q => q.id === answer.questionId)
                const option = question?.options.find(o => o.value === answer.answer)
                return (
                  <span key={idx} className="badge bg-navy-800 text-navy-200">
                    {option?.icon} {option?.label}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Find Your Perfect Course
        </h1>
        <p className="text-lg text-navy-300">
          Answer a few questions to get personalized recommendations
        </p>
      </div>

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
      <div className={`card p-8 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">{currentQ.emoji}</span>
          <h2 className="text-2xl font-semibold text-white">
            {currentQ.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              disabled={isAnimating}
              className="group p-5 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
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

      {/* Skip/Back Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="text-navy-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
          Skip quiz →
        </Link>
      </div>
    </div>
  )
}