'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathQuizProps {
  courses: Course[]
  categories: Category[]
}

interface Question {
  id: string
  question: string
  emoji: string
  options: {
    value: string
    label: string
    emoji: string
  }[]
}

const questions: Question[] = [
  {
    id: 'experience',
    question: "What's your coding experience level?",
    emoji: '🎯',
    options: [
      { value: 'beginner', label: "I'm just starting out", emoji: '🌱' },
      { value: 'intermediate', label: 'I know the basics', emoji: '🌿' },
      { value: 'advanced', label: "I'm experienced", emoji: '🌳' },
    ]
  },
  {
    id: 'interest',
    question: 'What interests you most?',
    emoji: '💡',
    options: [
      { value: 'frontend', label: 'Building user interfaces', emoji: '🎨' },
      { value: 'backend', label: 'Server-side development', emoji: '⚙️' },
      { value: 'fullstack', label: 'The complete picture', emoji: '🌐' },
      { value: 'cloud', label: 'Cloud & infrastructure', emoji: '☁️' },
    ]
  },
  {
    id: 'goal',
    question: "What's your main learning goal?",
    emoji: '🎯',
    options: [
      { value: 'career', label: 'Change or advance my career', emoji: '💼' },
      { value: 'project', label: 'Build a specific project', emoji: '🛠️' },
      { value: 'curiosity', label: 'Learn for fun', emoji: '🧠' },
      { value: 'skills', label: 'Fill skill gaps', emoji: '📈' },
    ]
  },
  {
    id: 'time',
    question: 'How much time can you dedicate weekly?',
    emoji: '⏰',
    options: [
      { value: 'minimal', label: '1-3 hours', emoji: '🕐' },
      { value: 'moderate', label: '4-7 hours', emoji: '🕓' },
      { value: 'dedicated', label: '8+ hours', emoji: '🕗' },
    ]
  }
]

export default function LearningPathQuiz({ courses, categories }: LearningPathQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    setIsAnimating(true)
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setShowResults(true)
      }
      setIsAnimating(false)
    }, 300)
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
  }

  const getRecommendedCourses = (): Course[] => {
    // Smart recommendation logic based on answers
    let filtered = [...courses]
    
    // Filter by difficulty based on experience
    if (answers.experience === 'beginner') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() === 'beginner'
      )
    } else if (answers.experience === 'advanced') {
      filtered = filtered.filter(c => 
        c.metadata?.difficulty?.value?.toLowerCase() !== 'beginner'
      )
    }

    // Sort by relevance (free courses first for beginners, etc.)
    if (answers.experience === 'beginner') {
      filtered.sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return 0
      })
    }

    // Return top 3 recommendations
    return filtered.slice(0, 3)
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  if (showResults) {
    const recommendedCourses = getRecommendedCourses()
    
    return (
      <div className="card p-8 animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 inline-block animate-bounce-slow">🎉</span>
          <h3 className="text-2xl font-bold text-white mb-2">Your Personalized Learning Path</h3>
          <p className="text-navy-400">Based on your answers, here are our top recommendations:</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {recommendedCourses.length > 0 ? (
            recommendedCourses.map((course, index) => (
              <Link 
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                    {course.title}
                  </h4>
                  <p className="text-sm text-navy-400 truncate">
                    {course.metadata?.tagline || 'Start your learning journey'}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`badge ${
                    course.metadata?.difficulty?.value?.toLowerCase() === 'beginner' 
                      ? 'badge-beginner' 
                      : course.metadata?.difficulty?.value?.toLowerCase() === 'advanced'
                        ? 'badge-advanced'
                        : 'badge-intermediate'
                  }`}>
                    {course.metadata?.difficulty?.value || 'All Levels'}
                  </span>
                </div>
                <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-navy-400">Check out all our courses to find the perfect match!</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses" className="btn-primary">
            View All Courses
          </Link>
          <button onClick={resetQuiz} className="btn-secondary">
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-navy-400 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
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
          <span className="text-4xl mb-4 inline-block">{currentQuestion.emoji}</span>
          <h3 className="text-xl font-semibold text-white">{currentQuestion.question}</h3>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
              className="w-full p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-primary-500/50 rounded-xl text-left transition-all duration-200 group flex items-center gap-4"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{option.emoji}</span>
              <span className="text-white font-medium">{option.label}</span>
              <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          className="mt-6 text-navy-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go back
        </button>
      )}
    </div>
  )
}